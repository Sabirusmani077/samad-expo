with open('data/reference_style.css', 'r', encoding='utf-8') as f:
    css = f.read()

import re

items = ['body', r'\.eyebrow', r'\.red-square', r'\.red-button', r'\.text-link', r'\.section-index', r'\.section-heading', r'\.reveal', r'\.skip-link']
for item in items:
    m = re.findall(rf'([^{{}}]*?{item}[^{{}}]*?\{{[^}}]*\}})', css)
    print(f"=== {item} ({len(m)}) ===")
    for rule in m[:3]:
        print("  ", rule)
