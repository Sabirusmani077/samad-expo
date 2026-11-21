const fs = require('fs');
const c = fs.readFileSync('src/components/ReelhouseCorporateHome.tsx', 'utf8');
const lines = c.split('\n');
console.log('Total lines in ReelhouseCorporateHome:', lines.length);
lines.forEach((l, i) => {
  if (l.includes('<h1') || l.includes('<h2') || l.includes('<h3') || l.includes('className="hero') || l.includes('premium-home-nav')) {
    console.log((i+1) + ': ' + l.trim());
  }
});
