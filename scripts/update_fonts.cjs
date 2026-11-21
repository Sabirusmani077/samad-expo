const fs = require('fs');

// 1. Update studio.css
let studio = fs.readFileSync('src/app/studio.css', 'utf8');
studio = studio.replace(
  /--display-font:\s*["']Manrope["'],\s*Arial,\s*sans-serif;/g,
  '--display-font: var(--font-heading, "Manrope", sans-serif);'
);
studio = studio.replace(
  /--body-font:\s*["']Manrope["'],\s*Arial,\s*sans-serif;/g,
  '--body-font: var(--font-body, "Inter", sans-serif);'
);
fs.writeFileSync('src/app/studio.css', studio, 'utf8');
console.log('1. studio.css updated successfully.');

// 2. Update globals.css
let globals = fs.readFileSync('src/app/globals.css', 'utf8');

// Replace @theme block
const oldThemeBlockRegex = /@theme\s*\{[^}]+\}/;
const newThemeBlock = `@theme {
  --font-sans: var(--font-inter), "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-heading: var(--font-manrope), "Manrope", sans-serif;
  --font-body: var(--font-inter), "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-display: var(--font-manrope), "Manrope", sans-serif;
  --font-mono: "IBM Plex Mono", monospace;
}`;
globals = globals.replace(oldThemeBlockRegex, newThemeBlock);

// Replace :root font variables
globals = globals.replace(
  /--md-brand-font-family:\s*["']Manrope["'],\s*Arial,\s*sans-serif;/g,
  '--font-heading: var(--font-manrope), "Manrope", sans-serif;\n  --font-body: var(--font-inter), "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n  --display-font: var(--font-heading);\n  --body-font: var(--font-body);\n  --md-brand-font-family: var(--font-body);'
);

// Replace hardcoded "Plus Jakarta Sans" occurrences
globals = globals.replace(/font-family:\s*["']Plus Jakarta Sans["'],\s*["']Manrope["'],\s*sans-serif;/g, 'font-family: var(--font-body);');

fs.writeFileSync('src/app/globals.css', globals, 'utf8');
console.log('2. globals.css updated successfully.');
