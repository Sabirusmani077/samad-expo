const fs = require('fs');

let css = fs.readFileSync('src/app/globals.css', 'utf8');

// Replace heading rules (around lines 50-60)
const oldHeadingsRuleRegex = /h1,\s*h2,\s*h3,\s*h4,\s*h5,\s*h6,\s*\.font-serif,\s*\.font-display\s*\{[^}]+\}/;
const newHeadingsRule = `/* ==========================================================================
   PRIMARY HEADING TYPOGRAPHY SYSTEM (MANROPE)
   ========================================================================== */
h1, h2, h3, h4, h5, h6, .font-heading, .font-display, .font-serif {
  font-family: var(--font-heading);
  text-wrap: balance;
}

h1 {
  font-family: var(--font-heading);
  font-weight: 800; /* Manrope ExtraBold */
  font-size: clamp(36px, 4.8vw, 60px);
  line-height: 1.15;
  letter-spacing: -0.025em;
}

h2 {
  font-family: var(--font-heading);
  font-weight: 700; /* Manrope Bold */
  font-size: clamp(26px, 3.2vw, 36px);
  line-height: 1.25;
  letter-spacing: -0.02em;
}

h3 {
  font-family: var(--font-heading);
  font-weight: 600; /* Manrope SemiBold */
  font-size: clamp(19px, 2.2vw, 24px);
  line-height: 1.3;
  letter-spacing: -0.015em;
}

h4 {
  font-family: var(--font-heading);
  font-weight: 600; /* Manrope SemiBold */
  font-size: clamp(16px, 1.8vw, 20px);
  line-height: 1.35;
  letter-spacing: -0.01em;
}

h5 {
  font-family: var(--font-heading);
  font-weight: 500; /* Manrope Medium */
  font-size: 16px;
  line-height: 1.4;
  letter-spacing: -0.005em;
}

h6 {
  font-family: var(--font-heading);
  font-weight: 500; /* Manrope Medium */
  font-size: 14px;
  line-height: 1.4;
  letter-spacing: 0;
}

/* ==========================================================================
   PRIMARY BODY TYPOGRAPHY SYSTEM (INTER)
   ========================================================================== */
p, .body-text {
  font-family: var(--font-body);
  font-weight: 400; /* Inter Regular */
  font-size: clamp(15px, 1.1vw, 16.5px);
  line-height: 1.68;
  letter-spacing: -0.005em;
}

nav a, .nav-link, .site-primary-nav a {
  font-family: var(--font-body);
  font-weight: 500; /* Inter Medium */
  font-size: 15px;
  letter-spacing: -0.005em;
}

button, .btn {
  font-family: var(--font-body);
  font-weight: 600; /* Inter SemiBold */
  letter-spacing: -0.01em;
  line-height: 1.25;
}

label, .form-label {
  font-family: var(--font-body);
  font-weight: 500; /* Inter Medium */
  font-size: 13px;
  letter-spacing: 0.01em;
}

input, textarea, select {
  font-family: var(--font-body);
  font-weight: 400; /* Inter Regular */
  letter-spacing: -0.005em;
}`;

css = css.replace(oldHeadingsRuleRegex, newHeadingsRule);

// Update premium-home-links navigation
css = css.replace(
  /\.premium-home-links a,\s*\.premium-home-mobile-nav a\s*\{[^}]+font-weight:\s*750;[^}]+\}/,
  `.premium-home-links a, .premium-home-mobile-nav a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #334155;
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 500; /* Inter Medium */
  letter-spacing: -0.005em;
  text-decoration: none;
  transition: color 180ms ease, transform 180ms ease;
}`
);

// Update home-store-link
css = css.replace(
  /\.home-store-link\s*\{[^}]+\}/,
  `.home-store-link { color: #334155; font-family: var(--font-body); font-size: 15px; font-weight: 500; letter-spacing: -0.005em; text-decoration: none; }`
);

// Update home-nav-cta, .blue-button
css = css.replace(
  /\.home-nav-cta,\s*\.blue-button\s*\{[^}]+font-size:\s*12px;[^}]+font-weight:\s*850;[^}]+\}/,
  `.home-nav-cta, .blue-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid #000000;
  border-radius: 999px;
  padding: 12px 20px;
  background: #FFF33D;
  color: #000000;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600; /* Inter SemiBold */
  line-height: 1.25;
  letter-spacing: -0.01em;
  text-decoration: none;
  box-shadow: 0 10px 24px rgba(0, 0, 0, .12);
  transition: transform 200ms ease, box-shadow 200ms ease, filter 200ms ease, background-color 200ms ease, color 200ms ease;
}`
);

// Update premium-hero h1
css = css.replace(
  /\.premium-hero h1\s*\{[^}]+font-size:\s*clamp\([^)]+\);[^}]+\}/,
  `.premium-hero h1 {
  max-width: 820px;
  margin: 18px 0 0;
  color: #000000;
  font-family: var(--font-heading);
  font-size: clamp(38px, 5.2vw, 64px);
  font-weight: 800; /* Manrope ExtraBold */
  line-height: 1.16;
  letter-spacing: -0.025em;
}`
);

css = css.replace(
  /\.premium-hero h1 em\s*\{[^}]+\}/,
  `.premium-hero h1 em {
  font-family: var(--font-heading);
  color: #000000;
  text-decoration: underline;
  text-decoration-color: #FFF33D;
  font-style: normal;
  font-weight: 800;
}`
);

// Update premium-hero hero-description
css = css.replace(
  /\.premium-hero \.hero-description\s*\{[^}]+font-size:\s*clamp\([^)]+\);[^}]+\}/,
  `.premium-hero .hero-description {
  max-width: 580px;
  margin: 24px 0 0;
  color: #52525B;
  font-family: var(--font-body);
  font-weight: 400; /* Inter Regular */
  font-size: clamp(15px, 1.2vw, 17px);
  line-height: 1.7;
  letter-spacing: -0.005em;
}`
);

// Update mobile media query clamp
css = css.replace(
  /\.premium-hero h1\s*\{\s*font-size:\s*clamp\(3rem,\s*12vw,\s*5rem\);\s*\}/,
  `.premium-hero h1 { font-size: clamp(32px, 8.5vw, 48px); line-height: 1.18; letter-spacing: -0.02em; }`
);

fs.writeFileSync('src/app/globals.css', css, 'utf8');
console.log('src/app/globals.css typography completely updated.');
