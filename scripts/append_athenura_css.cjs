const fs = require('fs');

const cssToAppend = `
/* ============================================================
   ATHENURA-INSPIRED HIGH-END DESIGN SYSTEM & ANIMATIONS
   ============================================================ */

@keyframes athenuraPulse {
  0% { box-shadow: 0 0 0 0 rgba(40, 163, 185, 0.45); }
  70% { box-shadow: 0 0 0 16px rgba(40, 163, 185, 0); }
  100% { box-shadow: 0 0 0 0 rgba(40, 163, 185, 0); }
}

@keyframes athenuraMarquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}

@keyframes athenuraFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

@keyframes athenuraGlow {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.08); }
}

.animate-athenura-marquee {
  display: flex;
  width: max-content;
  animation: athenuraMarquee 30s linear infinite;
}

.animate-athenura-marquee:hover {
  animation-play-state: paused;
}

.animate-athenura-pulse {
  animation: athenuraPulse 2.4s infinite cubic-bezier(0.4, 0, 0.6, 1);
}

.animate-athenura-float {
  animation: athenuraFloat 6s ease-in-out infinite;
}

.animate-athenura-glow {
  animation: athenuraGlow 8s ease-in-out infinite;
}

/* Dual tone gradient text */
.text-gradient-teal {
  background: linear-gradient(135deg, #1E7A86 0%, #28A3B9 50%, #35B4C7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-gradient-cyan {
  background: linear-gradient(135deg, #2093AB 0%, #2DD4BF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-gradient-gold {
  background: linear-gradient(135deg, #FFF33D 0%, #F59E0B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Glassmorphism surfaces */
.athenura-glass-dark {
  background: rgba(10, 18, 22, 0.85);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.athenura-glass-light {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

/* Card hover lift & glow */
.athenura-card {
  background: #FFFFFF;
  border-radius: 28px;
  border: 1px solid rgba(226, 232, 240, 0.85);
  box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.04);
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.athenura-card:hover {
  transform: translateY(-6px);
  border-color: rgba(40, 163, 185, 0.35);
  box-shadow: 0 24px 50px -12px rgba(30, 122, 134, 0.14);
}
`;

const globalsPath = 'src/app/globals.css';
const existing = fs.readFileSync(globalsPath, 'utf-8');
if (!existing.includes('ATHENURA-INSPIRED')) {
  fs.appendFileSync(globalsPath, cssToAppend);
  console.log('Appended successfully');
} else {
  console.log('Already contains Athenura CSS');
}
