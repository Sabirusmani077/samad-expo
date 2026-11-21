const fs = require('fs');
const path = require('path');
const root = path.join(process.cwd(), 'data', 'hosted-sites', 'usr_admin_01');
const defaults = [
  { slug: 'mdk-chrono-age-calculator', title: 'MDK Chrono Age Calculator', targetUrl: 'https://sabirusmani077.github.io/Age-calculator/' },
  { slug: 'mdk-convertor', title: 'MDK Unit & Media Convertor', targetUrl: 'https://sabirusmani077.github.io/MDK-Convertor/' },
  { slug: 'sabir-usmani-portfolio', title: 'Sabir Usmani Portfolio', targetUrl: 'https://sabirusmani077.github.io/Self-Portfolio-/' }
];
defaults.forEach(d => {
  const dir = path.join(root, d.slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const idx = path.join(dir, 'index.html');
  if (!fs.existsSync(idx)) {
    fs.writeFileSync(idx, `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${d.title}</title><style>body,html{margin:0;padding:0;height:100%;overflow:hidden;background:#000;}iframe{width:100%;height:100%;border:none;}</style></head><body><iframe src="${d.targetUrl}" title="${d.title}"></iframe></body></html>`);
    console.log('Created mirror for:', d.slug);
  } else {
    console.log('Already exists:', d.slug);
  }
});
