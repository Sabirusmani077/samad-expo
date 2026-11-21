import re

with open('data/reference_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

print("=" * 60)
print("1. MOBILE HEADER & NAVIGATION")
print("=" * 60)
m_header = re.search(r'<header class="mobile-header".*?</header>', html, re.S)
if m_header:
    print(m_header.group(0))

nav_m = re.search(r'<nav id="studio-nav".*?</nav>', html, re.S)
if nav_m:
    print(nav_m.group(0))

print("\n" + "=" * 60)
print("2. HERO SECTION")
print("=" * 60)
hero_m = re.search(r'<section id="top" class="hero".*?</section>', html, re.S)
if hero_m:
    print(hero_m.group(0)[:2500])

print("\n" + "=" * 60)
print("3. STUDIO INTRO SECTION")
print("=" * 60)
intro_m = re.search(r'<section class="studio-intro".*?</section>', html, re.S)
if intro_m:
    print(intro_m.group(0)[:2000])

print("\n" + "=" * 60)
print("4. SELECTED WORK SECTION")
print("=" * 60)
work_m = re.search(r'<section id="work" class="section selected-work".*?</section>', html, re.S)
if work_m:
    print(work_m.group(0)[:3000])

print("\n" + "=" * 60)
print("5. BRAND STRIP SECTION")
print("=" * 60)
brand_m = re.search(r'<section class="brand-strip".*?</section>', html, re.S)
if brand_m:
    print(brand_m.group(0)[:2000])

print("\n" + "=" * 60)
print("6. CREW / STUDIO SECTION")
print("=" * 60)
crew_m = re.search(r'<section id="crew" class="section crew-section".*?</section>', html, re.S)
if crew_m:
    print(crew_m.group(0)[:3000])

print("\n" + "=" * 60)
print("7. SERVICES SECTION")
print("=" * 60)
services_m = re.search(r'<section id="services" class="section services-section".*?</section>', html, re.S)
if services_m:
    print(services_m.group(0)[:3000])

print("\n" + "=" * 60)
print("8. CONTACT SECTION")
print("=" * 60)
contact_m = re.search(r'<section id="contact" class="section contact-section".*?</section>', html, re.S)
if contact_m:
    print(contact_m.group(0)[:3000])

print("\n" + "=" * 60)
print("9. FOOTER")
print("=" * 60)
footer_m = re.search(r'<footer class="site-footer".*?</footer>', html, re.S)
if footer_m:
    print(footer_m.group(0)[:2500])
