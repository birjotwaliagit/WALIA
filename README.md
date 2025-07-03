# Elementor JSON Generator

This tool converts raw case study text into an Elementor-ready JSON file. It uses OpenAI's GPT model to clean and complete the content before injecting it into a JSON template.

## Requirements
- Python 3.11+
- Install dependencies:
  ```bash
  pip install -r requirements.txt
  ```
- Set the environment variable `OPENAI_API_KEY` with your OpenAI key.

## CLI Usage
Provide your raw case study text as an input file:

```bash
python3 generate.py INPUT.txt
```

The script will parse the text, request corrections from GPT-4o, fill the placeholders in `template.json`, and output a file named like `case-study-client-name_GOOD_FILE.json` ready for import into Elementor.

## Web Interface
Run the small Flask server and open your browser to `http://localhost:5000`:

```bash
python3 app.py
```

The page lets you upload a template (or use the default), paste your raw case study text, and download the generated JSON. A preview panel displays the content so you can inspect it before saving.
