with open('data/reference_style.css', 'r', encoding='utf-8') as f:
    css = f.read()

idx_sidebar = css.find('.studio-sidebar')
pre_css = css[:idx_sidebar]

with open('data/reference_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
classes = set()
for m in re.finditer(r'class="([^"]+)"', html):
    for c in m.group(1).split():
        if not c.startswith('lucide'):
            classes.add(c)

with open('data/extracted_studio.css', 'r', encoding='utf-8') as f:
    ext_css = f.read()

missing_in_ext = []
for c in sorted(classes):
    if f'.{c}' not in ext_css:
        missing_in_ext.append(c)

print("Classes missing in extracted_studio.css:", len(missing_in_ext))
for c in missing_in_ext:
    # search in pre_css
    m = re.findall(rf'([^{{}}]*?\.{c}[^{{}}]*?\{{[^}}]*\}})', pre_css)
    print(f"  .{c}: found {len(m)} in pre_css")
    for rule in m:
        print("    ", rule)
