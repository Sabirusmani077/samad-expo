with open('data/reference_style.css', 'r', encoding='utf-8') as f:
    css = f.read()

import re

# Let's inspect rules for .studio-sidebar, .site-content, .hero, etc.
keywords = [
    r'\.studio-sidebar',
    r'\.site-content',
    r'\.mobile-header',
    r'\.hero',
    r'\.studio-intro',
    r'\.work-grid',
    r'\.work-media',
    r'\.brand-strip',
    r'\.crew-layout',
    r'\.services-section',
    r'\.service-row',
    r'\.contact-section',
    r'\.project-form',
    r'\.site-footer'
]

for kw in keywords:
    print(f"\n==================== {kw} ====================")
    matches = re.findall(rf'([^{{}}]*?{kw}[^{{}}]*?\{{[^}}]*\}})', css)
    for m in matches[:4]:
        print(m[:200])
