import re

with open('data/reference_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.find('</footer>')
print(html[idx:idx+1500])
