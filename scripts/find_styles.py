import re

with open('data/reference_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

links = re.findall(r'<link[^>]+rel=[\'"]stylesheet[\'"][^>]*>', html)
for l in links:
    print('CSS LINK:', l)

styles = re.findall(r'<style[^>]*>(.*?)</style>', html, re.S)
print('STYLE TAGS COUNT:', len(styles))
for i, s in enumerate(styles):
    print(f'Style tag {i} length:', len(s))
    if 'studio-nav' in s:
        print('  Found studio-nav in style tag', i)
    if 'mobile-header' in s:
        print('  Found mobile-header in style tag', i)

if 'studio-nav' in html:
    print('studio-nav exists in html')
