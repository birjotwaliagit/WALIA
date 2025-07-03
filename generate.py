import json
import re
import sys
import os
from slugify import slugify

try:
    import openai
except ImportError:
    openai = None

def sanitize(text: str) -> str:
    text = text.replace('\r', '')
    text = text.replace('\u2018', "'").replace('\u2019', "'")
    text = text.replace('\u201c', '"').replace('\u201d', '"')
    text = text.strip()
    return text

def parse_raw(text: str) -> dict:
    sections = {}
    lines = [l.strip() for l in text.split('\n')]
    key_value_pattern = re.compile(r'^(.*?):\s*(.*)$')
    current_key = None
    buffer = []
    for line in lines + ['']:
        m = key_value_pattern.match(line)
        if m:
            if current_key:
                sections[current_key] = sanitize('\n'.join(buffer))
                buffer = []
            key, value = m.groups()
            if value:
                sections[key.lower()] = sanitize(value)
                current_key = None
            else:
                current_key = key.lower()
        elif line == '' and current_key:
            sections[current_key] = sanitize('\n'.join(buffer))
            current_key = None
            buffer = []
        else:
            if current_key is None and line:
                current_key = line.lower()
                buffer = []
            elif current_key:
                buffer.append(line)
    # combine timeline entries
    timeline_items = []
    for k in list(sections.keys()):
        if re.match(r'week \d+', k) or k.startswith('days') or k == 'ongoing':
            timeline_items.append(f"{k.title()}: {sections.pop(k)}")
    if timeline_items:
        sections['timeline'] = '\n'.join(timeline_items)

    # normalize common keys
    key_map = {
        'the challenge': 'challenge',
        'pixelbee\u2019s approach': 'approach',
        'key achievements': 'highlights',
    }
    for old, new in key_map.items():
        if old in sections and new not in sections:
            sections[new] = sections.pop(old)

    if 'client testimonial' in sections:
        text = sections['client testimonial']
        if '\n' in text:
            quote, attrib = text.split('\n', 1)
            sections['testimonial_text'] = quote.strip('"')
            if '—' in attrib:
                name, role = attrib.split('—', 1)[-1].split(',', 1)
                sections['testimonial_name'] = name.strip()
                sections['testimonial_role'] = role.strip()
    return sections

def call_gpt(prompt: str) -> dict:
    if not openai:
        raise RuntimeError("openai package not installed")
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        raise RuntimeError('OPENAI_API_KEY not set')
    openai.api_key = api_key
    messages = [
        {"role": "system", "content": "You are a content editor and JSON helper for Elementor. Your job is to fix grammar, expand short bullet points, and fill missing sections when needed. Keep output professional and precise."},
        {"role": "user", "content": prompt}
    ]
    response = openai.ChatCompletion.create(model="gpt-4o", messages=messages)
    content = response.choices[0].message.content
    return json.loads(content)

def fill_template(template: dict, data: dict) -> dict:
    pattern = re.compile(r'{{(.*?)}}')
    def replace(value: str) -> str:
        for match in pattern.findall(value):
            key = match.lower()
            simple_key = key.replace('_html', '').replace('_text', '')
            replacement = data.get(key, data.get(simple_key, ''))
            value = value.replace('{{' + match + '}}', replacement)
        return value
    def walk(node):
        if isinstance(node, dict):
            return {k: walk(v) for k, v in node.items()}
        elif isinstance(node, list):
            return [walk(x) for x in node]
        elif isinstance(node, str):
            return replace(node)
        else:
            return node
    return walk(template)

def check_placeholders(obj: dict):
    text = json.dumps(obj)
    leftovers = re.findall(r'{{.*?}}', text)
    if leftovers:
        raise ValueError(f'Unreplaced placeholders found: {set(leftovers)}')

def main():
    if len(sys.argv) < 2:
        print('Usage: python3 generate.py INPUT.txt')
        sys.exit(1)
    with open(sys.argv[1], 'r', encoding='utf-8') as f:
        raw = f.read()
    parsed = parse_raw(raw)

    prompt = f"Here is the raw data:\n\n{raw}\n\nPlease return JSON with cleaned sections." 
    try:
        enhanced = call_gpt(prompt)
        for k, v in enhanced.items():
            parsed[k.lower()] = v
    except Exception as e:
        print('GPT call failed:', e, file=sys.stderr)

    with open('template.json', 'r', encoding='utf-8') as f:
        template = json.load(f)

    result = fill_template(template, parsed)
    check_placeholders(result)

    client = parsed.get('client', 'case-study')
    slug = slugify(client)
    filename = f'case-study-{slug}_GOOD_FILE.json'
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print('Generated', filename)

if __name__ == '__main__':
    main()
