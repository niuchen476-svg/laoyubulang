/* ──────────────────────────────────────────────
   sakura.js — 数字工坊 · 粒子与动效
   ────────────────────────────────────────────── */

// 《你的名字》色盘
const KIMI_COLORS = [
  '#ff6b9d','#ff8c69','#ffb347','#ffd700','#c084fc',
  '#a78bfa','#818cf8','#60a5fa','#34d399','#fb7185',
  '#f472b6','#e879f9','#a3e635','#facc15','#f97316','#ef4444'
];

// ── 背景星空 ──────────────────────────────────
const starCanvas = document.createElement('canvas');
starCanvas.id = 'particle-canvas';
document.body.prepend(starCanvas);
const starCtx = starCanvas.getContext('2d');

let stars = [];
function resizeStars() {
  starCanvas.width  = window.innerWidth;
  starCanvas.height = window.innerHeight;
  stars = Array.from({ length: 120 }, () => ({
    x: Math.random() * starCanvas.width,
    y: Math.random() * starCanvas.height * 0.6,
    r: Math.random() * 1.5 + 0.3,
    a: Math.random(),
    da: (Math.random() * 0.008 + 0.002) * (Math.random() < 0.5 ? 1 : -1)
  }));
}
resizeStars();
window.addEventListener('resize', resizeStars);

function drawStars() {
  starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
  stars.forEach(s => {
    s.a += s.da;
    if (s.a > 1 || s.a < 0) s.da *= -1;
    starCtx.beginPath();
    starCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    starCtx.fillStyle = `rgba(255,255,255,${s.a.toFixed(2)})`;
    starCtx.fill();
  });
  requestAnimationFrame(drawStars);
}
drawStars();

// ── 彗星 ──────────────────────────────────────
const cometCanvas = document.createElement('canvas');
Object.assign(cometCanvas.style, {
  position: 'fixed', top: 0, left: 0,
  width: '100%', height: '100%',
  pointerEvents: 'none', zIndex: 0
});
document.body.appendChild(cometCanvas);
const cometCtx = cometCanvas.getContext('2d');

function resizeComet() {
  cometCanvas.width  = window.innerWidth;
  cometCanvas.height = window.innerHeight;
}
resizeComet();
window.addEventListener('resize', resizeComet);

function launchComet() {
  const startX = Math.random() * cometCanvas.width * 0.5;
  const startY = Math.random() * cometCanvas.height * 0.3;
  const angle  = Math.PI / 5 + Math.random() * 0.3;
  const speed  = 8 + Math.random() * 6;
  const len    = 120 + Math.random() * 80;
  let   dist   = 0;

  function drawComet() {
    if (dist > cometCanvas.width) return;
    cometCtx.clearRect(0, 0, cometCanvas.width, cometCanvas.height);
    const x = startX + Math.cos(angle) * dist;
    const y = startY + Math.sin(angle) * dist;
    const grad = cometCtx.createLinearGradient(
      x - Math.cos(angle) * len, y - Math.sin(angle) * len, x, y
    );
    grad.addColorStop(0, 'rgba(255,255,255,0)');
    grad.addColorStop(1, 'rgba(255,255,255,0.9)');
    cometCtx.beginPath();
    cometCtx.moveTo(x - Math.cos(angle) * len, y - Math.sin(angle) * len);
    cometCtx.lineTo(x, y);
    cometCtx.strokeStyle = grad;
    cometCtx.lineWidth   = 2;
    cometCtx.stroke();
    dist += speed;
    requestAnimationFrame(drawComet);
  }
  drawComet();
  setTimeout(launchComet, 5000 + Math.random() * 6000);
}
setTimeout(launchComet, 1500);

// ── 鼠标粒子尾迹 ──────────────────────────────
const trailCanvas = document.createElement('canvas');
Object.assign(trailCanvas.style, {
  position: 'fixed', top: 0, left: 0,
  width: '100%', height: '100%',
  pointerEvents: 'none', zIndex: 9999
});
document.body.appendChild(trailCanvas);
const trailCtx = trailCanvas.getContext('2d');

function resizeTrail() {
  trailCanvas.width  = window.innerWidth;
  trailCanvas.height = window.innerHeight;
}
resizeTrail();
window.addEventListener('resize', resizeTrail);

let trailParticles = [];
let lastMX = 0, lastMY = 0;

document.addEventListener('mousemove', e => {
  const dx = e.clientX - lastMX, dy = e.clientY - lastMY;
  if (Math.sqrt(dx*dx + dy*dy) < 6) return;
  lastMX = e.clientX; lastMY = e.clientY;
  for (let i = 0; i < 3; i++) {
    trailParticles.push({
      x: e.clientX, y: e.clientY,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      r: Math.random() * 3 + 1,
      a: 1,
      color: KIMI_COLORS[Math.floor(Math.random() * KIMI_COLORS.length)]
    });
  }
});

function animateTrail() {
  trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
  trailParticles = trailParticles.filter(p => p.a > 0.02);
  trailParticles.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.a -= 0.04;
    trailCtx.beginPath();
    trailCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    trailCtx.fillStyle = p.color + Math.round(p.a * 255).toString(16).padStart(2, '0');
    trailCtx.fill();
  });
  requestAnimationFrame(animateTrail);
}
animateTrail();

// ── 点击烟花 ──────────────────────────────────
document.addEventListener('click', e => {
  if (e.target.closest('a, button, input, select, textarea')) return;
  for (let i = 0; i < 60; i++) {
    const angle = (Math.PI * 2 / 60) * i;
    const speed = Math.random() * 5 + 2;
    trailParticles.push({
      x: e.clientX, y: e.clientY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: Math.random() * 3 + 1,
      a: 1,
      color: KIMI_COLORS[Math.floor(Math.random() * KIMI_COLORS.length)]
    });
  }
});

// ── 手机端底部导航注入 ─────────────────────────

// 计算 portal 根路径，避免子页面相对路径 404
function getPortalRoot() {
  const baseEl = document.querySelector('base');
  const src = baseEl ? baseEl.href : window.location.href;
  try {
    const url = new URL(src);
    const m = url.pathname.match(/^(.*\/portal\/)/);
    if (m) return url.origin + m[1];
  } catch (_) {}
  const m2 = window.location.pathname.match(/^(.*\/portal\/)/);
  return m2 ? window.location.origin + m2[1] : window.location.origin + '/';
}

function injectMobileNav() {
  if (document.querySelector('.mobile-bottom-nav')) return;
  const nav = document.createElement('nav');
  nav.className = 'mobile-bottom-nav';

  const root = getPortalRoot();

  const items = [
    { icon: '🏠', label: '首页',   path: '' },
    { icon: '📚', label: '课程',   path: encodeURIComponent('课程笔记') + '/' },
    { icon: '🤖', label: 'AI开发', path: encodeURIComponent('AI开发') + '/' },
    { icon: '📋', label: '日志',   path: 'changelog/' }
  ];

  items.forEach(item => {
    const a = document.createElement('a');
    a.href = root + item.path;
    a.innerHTML = `<span class="nav-icon">${item.icon}</span><span>${item.label}</span>`;
    const currentPath = window.location.pathname;
    if (item.path === '' ? (currentPath.endsWith('/portal/') || currentPath.endsWith('/portal/index.html'))
                         : currentPath.includes(decodeURIComponent(item.path.replace(/\/$/, '')))) {
      a.classList.add('active');
    }
    nav.appendChild(a);
  });

  document.body.appendChild(nav);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectMobileNav);
} else {
  injectMobileNav();
}
