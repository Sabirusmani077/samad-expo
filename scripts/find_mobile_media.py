with open('data/extracted_studio.css', 'r', encoding='utf-8') as f:
    css = f.read()

import re
matches = re.findall(r'(@media[^{]+\{[^{}]*(\{[^{}]*\}[^{}]*)*\})', css)
print("Media queries in extracted studio CSS:", len(matches))
for m, _ in matches[:10]:
    if 'mobile' in m or 'sidebar' in m or 'site-content' in m:
        print(m[:300])
