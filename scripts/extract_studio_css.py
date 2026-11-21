with open('data/reference_style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Let's extract the custom studio styles cleanly
# Where does .studio-sidebar begin?
idx_sidebar = css.find('.studio-sidebar')
print(".studio-sidebar index:", idx_sidebar)

# Where does the custom block end? Let's check where Radix or shadcn tooltip or chart begins after .studio-sidebar
import re
chart_idx = css.find('[data-slot=tooltip-content]')
print("chart_idx:", chart_idx)

# Let's see rules between idx_sidebar and chart_idx
studio_css = css[idx_sidebar:chart_idx]
print("studio_css length:", len(studio_css))
with open('data/extracted_studio.css', 'w', encoding='utf-8') as f_out:
    f_out.write(studio_css)
print("Saved data/extracted_studio.css")
