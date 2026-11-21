import re

with open('data/reference_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

def show_section(name, pattern):
    print("=" * 60)
    print(name)
    print("=" * 60)
    m = re.search(pattern, html, re.S)
    if m:
        print(m.group(0))
    else:
        print("NOT FOUND")

show_section("STUDIO INTRO", r'<section class="studio-intro".*?</section>')
show_section("SELECTED WORK", r'<section id="work".*?</section>')
show_section("BRAND STRIP", r'<section class="brand-strip".*?</section>')
show_section("CREW SECTION", r'<section id="crew".*?</section>')
show_section("SERVICES SECTION", r'<section id="services".*?</section>')
show_section("CONTACT SECTION", r'<section id="contact".*?</section>')
