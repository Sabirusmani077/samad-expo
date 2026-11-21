with open('data/extracted_studio.css', 'r', encoding='utf-8') as f:
    css = f.read()

print("CSS length:", len(css))
# Check if there are any syntax errors or unmatched braces
open_braces = css.count('{')
close_braces = css.count('}')
print(f"Open braces: {open_braces}, Close braces: {close_braces}")
