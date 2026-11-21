import re

with open('data/extracted_studio.css', 'r', encoding='utf-8') as f:
    extracted = f.read()

header_css = """/* ==========================================================================
   REELHOUSE STUDIO DESIGN SYSTEM FOR MD ENTERPRISES
   Ultra-Premium Cinematic Dark Visual Language
   ========================================================================== */

:root {
  --studio-black: #0B0B0B;
  --studio-red: #E63946;
  --studio-grey: #BDB6AC;
  --studio-white: #FFFFFF;
  --studio-panel: #121212;
  --studio-line: #2A2826;
  --studio-dim: #8A857F;
  --sidebar-width: 224px;
  --display-font: "Cormorant Garamond", Georgia, serif;
  --body-font: "Manrope", Arial, sans-serif;
  --technical-font: "IBM Plex Mono", monospace;

  --background: 0 0% 4.3%;
  --foreground: 0 0% 100%;
  --card: 0 0% 7%;
  --card-foreground: 0 0% 100%;
  --popover: 0 0% 7%;
  --popover-foreground: 0 0% 100%;
  --primary: 355 78% 56%;
  --primary-foreground: 0 0% 100%;
  --secondary: 0 0% 11%;
  --secondary-foreground: 0 0% 100%;
  --muted: 0 0% 13%;
  --muted-foreground: 35 11% 71%;
  --accent: 355 78% 56%;
  --accent-foreground: 0 0% 100%;
  --destructive: 355 78% 56%;
  --destructive-foreground: 0 0% 100%;
  --border: 0 0% 18%;
  --input: 0 0% 22%;
  --ring: 355 78% 56%;
  --radius: 0.125rem;
}

html {
  background-color: #0B0B0B;
  color: #FFFFFF;
  font-family: var(--body-font);
  scroll-behavior: smooth;
  scroll-padding-top: 0px;
}

body {
  margin: 0;
  background: var(--studio-black);
  color: var(--studio-white);
  font-family: var(--body-font);
  font-size: 14px;
  line-height: 1.6;
  overflow-x: clip;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

*, *::before, *::after {
  box-sizing: border-box;
}

/* Base Utility Classes from Reference */
.site-content {
  margin-left: var(--sidebar-width);
  min-height: 100vh;
  background: var(--studio-black);
  position: relative;
}

.red-square {
  width: 6px;
  height: 6px;
  display: inline-block;
  flex: 0 0 auto;
  background: var(--studio-red);
}

.skip-link {
  position: fixed;
  top: 10px;
  left: 10px;
  transform: translateY(-160%);
  z-index: 100;
  padding: 14px 20px;
  background: var(--studio-red);
  color: var(--studio-white);
  text-decoration: none;
  font-family: var(--technical-font);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: transform 0.2s ease-out;
}
.skip-link:focus {
  transform: translateY(0);
}

.reveal.is-revealed {
  animation: section-enter 0.65s ease-out both;
  animation-delay: var(--reveal-delay, 0ms);
}

@keyframes section-enter {
  0% {
    opacity: 0.35;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

"""

full_studio_css = header_css + extracted

with open('src/app/studio.css', 'w', encoding='utf-8') as f:
    f.write(full_studio_css)

print("Created src/app/studio.css with length:", len(full_studio_css))
