import re

with open('data/reference_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

m = re.search(r'(<aside[^>]*class="studio-sidebar".*?</aside>)', html, re.S)
if m:
    print("FOUND ASIDE:")
    print(m.group(0))
else:
    print("Searching for sidebar in HTML...")
    m2 = re.findall(r'<[^>]*sidebar[^>]*>', html)
    for tag in m2:
        print(tag)
