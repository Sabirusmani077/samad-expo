import re

with open('data/reference_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's see the tags inside <body>
body_m = re.search(r'<body[^>]*>(.*?)</body>', html, re.S)
if body_m:
    body_content = body_m.group(1)
    # find direct child tags
    print("Body length:", len(body_content))
    top_tags = re.findall(r'<([a-zA-Z0-9_-]+)[^>]*class="([^"]*)"[^>]*>', body_content[:3000])
    for tag, cls in top_tags[:15]:
        print(f"<{tag} class='{cls}'>")
