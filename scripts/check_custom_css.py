with open('data/reference_style.css', 'r', encoding='utf-8') as f:
    css = f.read()

idx_sidebar = css.find('.studio-sidebar')
custom_css = css[idx_sidebar:]
print("Length of custom CSS:", len(custom_css))
print("Last 500 chars:\n", custom_css[-500:])
