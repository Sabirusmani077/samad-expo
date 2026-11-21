const fs = require('fs');
const content = fs.readFileSync('src/components/ReelhouseCorporateHome.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('<section') || l.includes('homeNavLinks =') || l.includes('id=')) {
    if (l.length < 120) console.log((i+1) + ': ' + l.trim());
  }
});
