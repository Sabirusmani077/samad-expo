with open('data/reference_style.css', 'r', encoding='utf-8') as f:
    css = f.read()

idx_root = css.find(':root')
idx_sidebar = css.find('.studio-sidebar')

print("Between :root and .studio-sidebar length:", idx_sidebar - idx_root)
pre_css = css[idx_root:idx_sidebar]

# Look for standard base tags like body, html, h1, h2, etc.
import re
base_rules = re.findall(r'(html|body|h[1-6]|p|a|button|input|textarea|select|\.eyebrow|\.red-square|\.red-button|\.text-link)[^{]*\{[^}]*\}', pre_css)
print("Base rules found:", len(base_rules))
for r in base_rules[:15]:
    print(r[:100])
