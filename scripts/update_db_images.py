import json

with open('data/mdk-store.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

img_map = {
    'MDK Direct Retail Store': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
    'MD Central Management Console': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
    'MD Creator & Vendor Hub': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop',
    'MD Cloud API & Integration Hub': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop',
    'MD Academy & Learning Gateway': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
    'MD NextGen SaaS Suite': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
}

for w in db.get('websiteListings', []):
    if w.get('name') in img_map and not w.get('thumbnail'):
        w['thumbnail'] = img_map[w['name']]

div_img_map = {
    'MD E-Commerce & Retail Ventures': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
    'MD Digital Labs & Platform Engineering': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
    'MD Media & Publishing Group': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop',
}

for d in db.get('businessDivisions', []):
    if d.get('name') in div_img_map and not d.get('image'):
        d['image'] = div_img_map[d['name']]

if 'companyProfile' in db:
    if not db['companyProfile'].get('founderPhoto'):
        db['companyProfile']['founderPhoto'] = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop'

with open('data/mdk-store.json', 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2)

print("Updated data/mdk-store.json successfully.")
