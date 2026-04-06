from flask import Flask, request, jsonify, send_from_directory
import json
from generate import generate_case_study

app = Flask(__name__)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/generate', methods=['POST'])
def generate_route():
    raw = request.form.get('text', '')
    use_default = request.form.get('use_default', 'true') == 'true'
    template = None
    if not use_default and 'template' in request.files:
        template = json.load(request.files['template'].stream)
    try:
        result, slug = generate_case_study(raw, template)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    return jsonify({
        'filename': f'case-study-{slug}_GOOD_FILE.json',
        'content': json.dumps(result, ensure_ascii=False, indent=2)
    })

if __name__ == '__main__':
    app.run()
