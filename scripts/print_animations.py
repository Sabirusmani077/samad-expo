with open('data/reference_style.css', 'r', encoding='utf-8') as f:
    css = f.read()

import re
keyframes = re.findall(r'@keyframes\s+[^{]+\{[^}]+\}', css)
print("Keyframes count:", len(keyframes))
for k in keyframes[:5]:
    print(k[:150])

reveals = re.findall(r'\.reveal[^{]*\{[^}]*\}', css)
print("Reveal rules:", len(reveals))
for r in reveals[:5]:
    print(r)
