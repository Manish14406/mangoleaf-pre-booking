import re

with open('c:\\MangoleafFinalDraft\\mangoleaf-pre-booking\\src\\index.css', 'r') as f:
    css = f.read()

# Replace fonts
css = css.replace(
    "@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');",
    "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');"
)
css = css.replace("--font-sans: 'Outfit', sans-serif;", "--font-sans: 'Inter', sans-serif;")

# Replace root variables
old_root = """  /* Clean White Theme */
  --primary: #059669;       /* Elegant Emerald */
  --accent: #10b981;        /* Lighter Emerald */
  --bg-dark: #f8fafc;       /* Light Gray/Off-white background */
  --bg-card: #ffffff;       /* Pure white cards */
  --text-primary: #0f172a;  /* Dark Slate for high contrast text */
  --text-secondary: #64748b; /* Slate gray for secondary text */
  --border-color: rgba(0, 0, 0, 0.08); /* Subtle border */"""

new_root = """  /* Warm Pub Theme */
  --primary: #d97706;       /* Amber */
  --accent: #f59e0b;        /* Lighter Amber */
  --bg-dark: #111827;       /* Dark background */
  --bg-card: #1f2937;       /* Darker cards */
  --text-primary: #f9fafb;  /* White text */
  --text-secondary: #9ca3af; /* Light gray text */
  --border-color: rgba(255, 255, 255, 0.1); /* Subtle border */"""
css = css.replace(old_root, new_root)

# Replace body background gradients
old_bg = """  background-image: 
    radial-gradient(at 0% 0%, rgba(5, 150, 105, 0.03) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(16, 185, 129, 0.02) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(5, 150, 105, 0.03) 0px, transparent 50%);"""

new_bg = """  background-image: 
    radial-gradient(at 0% 0%, rgba(217, 119, 6, 0.05) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(245, 158, 11, 0.03) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(217, 119, 6, 0.05) 0px, transparent 50%);"""
css = css.replace(old_bg, new_bg)

# Replace specific colors
css = css.replace('rgba(5, 150, 105', 'rgba(217, 119, 6')
css = css.replace('rgba(16, 185, 129', 'rgba(245, 158, 11')

css = css.replace('#059669', '#d97706')
css = css.replace('#10b981', '#f59e0b')
css = css.replace('#047857', '#b45309')

# Replace white to dark in buttons/text
css = css.replace('color: #ffffff;\n  font-weight: 600;', 'color: #111827;\n  font-weight: 600;') # btn-primary text
css = css.replace('color: #ffffff;\n  padding: 16px 24px;', 'color: #111827;\n  padding: 16px 24px;') # whatsapp btn text
css = css.replace('color: #ffffff;\n}', 'color: #111827;\n}') # completed step text and tab active

# Replace remaining white backgrounds with var(--bg-card)
css = css.replace('background: #ffffff;', 'background: var(--bg-card);')
css = css.replace('background-color: #ffffff;', 'background-color: var(--bg-card);')

# Replace border colors and secondary backgrounds
css = css.replace('#e2e8f0', 'var(--border-color)')
css = css.replace('#cbd5e1', 'rgba(255, 255, 255, 0.2)')
css = css.replace('#f1f5f9', 'rgba(255, 255, 255, 0.05)')
css = css.replace('#f8fafc', 'var(--bg-dark)')
css = css.replace('#94a3b8', '#6b7280')

# Semi-transparent backgrounds for sticky bar and hero
css = css.replace('rgba(255, 255, 255, 0.95)', 'rgba(31, 41, 55, 0.95)')
css = css.replace('rgba(255, 255, 255, 0.9)', 'rgba(31, 41, 55, 0.9)')

# Specific adjustments
css = css.replace('box-shadow: 0 0 0 4px #ffffff', 'box-shadow: 0 0 0 4px var(--bg-dark)')
css = css.replace("url('/cover.png')", "url('/pub_cover.png')")

# Fix svg fill
css = css.replace("fill='%2364748b'", "fill='%239ca3af'")

with open('c:\\MangoleafFinalDraft\\mangoleaf-pre-booking\\src\\index.css', 'w') as f:
    f.write(css)

print("Done")
