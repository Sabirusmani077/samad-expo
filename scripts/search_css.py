import re

with open('data/reference_style.css', 'r', encoding='utf-8') as f:
    css = f.read()

terms = ['nav', 'sidebar', 'mobile-header', 'wordmark', 'menu-toggle', 'topline']
for t in terms:
    m = re.findall(rf'([^{{}}]*?{t}[^{{}}]*?\{{[^}}]*\}})', css)
    print(f'=== {t}: {len(m)} ===')
    for item in m[:3]:
        print(' ', item[:120])
