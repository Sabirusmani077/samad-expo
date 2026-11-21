import re

with open('data/reference_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.find('</aside>')
print(html[idx:idx+800])
