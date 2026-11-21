with open('data/reference_style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Let's find where custom styles start
# Look for --studio-black or .studio-sidebar
idx = css.find('--studio-black')
print("Index of --studio-black:", idx)
# print snippet
print(css[idx-100:idx+400])

idx_sidebar = css.find('.studio-sidebar')
print("Index of .studio-sidebar:", idx_sidebar)
print(css[idx_sidebar:idx_sidebar+400])
