# Elementor JSON Generator

This tool converts raw case study text into an Elementor-ready JSON file. It uses OpenAI's GPT model to clean and complete the content before injecting it into a JSON template.

## Requirements
- Python 3.11+
- Install dependencies:
  ```bash
  pip install -r requirements.txt
  ```
- Set the environment variable `OPENAI_API_KEY` with your OpenAI key.

## Usage
Provide your raw case study text as an input file:

```bash
python3 generate.py INPUT.txt
```

The script will parse the text, request corrections from GPT-4o, fill the placeholders in `template.json`, and output a file named like `case-study-client-name_GOOD_FILE.json` ready for import into Elementor.
