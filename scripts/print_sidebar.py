import re

with open('data/reference_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

m = re.search(r'<aside class="studio-sidebar\s*".*?</aside>', html, re.S)
if m:
    print(m.group(0))
else:
    # search where studio-sidebar is
    idx = html.find('studio-sidebar')
    print(html[idx-50:idx+2000])
