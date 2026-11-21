with open('data/reference_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
classes = set()
for m in re.finditer(r'class="([^"]+)"', html):
    for c in m.group(1).split():
        classes.add(c)

print("Unique classes in reference HTML:", len(classes))
print("Sorted classes:")
studio_classes = [c for c in sorted(classes) if not c.startswith('lucide')]
print(studio_classes)
