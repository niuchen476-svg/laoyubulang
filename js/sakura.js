/* sakura.js — 鼠标粒子轨迹 + 点击烟花 */
(function () {
  /* ---------- 画布初始化 ---------- */
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initStars();
  });

  /* ---------- 调色盘（取自《你的名字》黄昏色调） ---------- */
  const palette = [
    '#f4a26a', '#e8856a', '#d4607a', '#c45080',
    '#9b5ea0', '#7a4db0', '#5a6abf', '#4a85c8',
    '#ffd6a0', '#ffb07a', '#f9e0c0', '#e0c0f0',
    '#c77dff', '#ffecd2', '#ffb347', '#b5c0e8'
  ];
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  /* ---------- 背景星星 ---------- */
  let stars = [];
  function initStars() {
    stars = [];
    const n = Math.floor(W * H / 4000);
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H * 0.55,
        r: Math.random() * 1.2 + 0.2,
        a: 0.2 + Math.random() * 0.8,
        da: (Math.random() - 0.5) * 0.006
      });
    }
  }
  initStars();

  function drawStars() {
    for (const s of stars) {
      s.a += s.da;
      if (s.a > 1 || s.a < 0.15) s.da *= -1;
      ctx.save();
      ctx.globalAlpha = s.a;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.shadowColor = '#e0d0ff';
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.restore();
    }
  }

  /* ---------- 彗星 ---------- */
  let comet = { x: -80, y: 80, vx: 4, vy: 1.2, tail: [], active: true };
  function resetComet() {
    comet.x = -80;
    comet.y = Math.random() * H * 0.4 + 20;
    comet.vx = 3.5 + Math.random() * 2;
    comet.vy = 0.5 + Math.random() * 1.3;
    comet.tail = [];
    comet.active = true;
  }
  resetComet();

  function drawComet() {
    if (!comet.active) return;
    comet.tail.push({ x: comet.x, y: comet.y });
    if (comet.tail.length > 50) comet.tail.shift();
    for (let i = 0; i < comet.tail.length; i++) {
      const t = comet.tail[i];
      const p = i / comet.tail.length;
      ctx.save();
      ctx.globalAlpha = p * 0.6;
      ctx.beginPath();
      ctx.arc(t.x, t.y, p * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffd6a0';
      ctx.shadowColor = '#f4a060';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();
    }
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(comet.x, comet.y, 2.8, 0, Math.PI * 2);
    ctx.fillStyle = '#fff8e8';
    ctx.shadowColor = '#f7c59f';
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.restore();
    comet.x += comet.vx;
    comet.y += comet.vy;
    if (comet.x > W + 80) {
      comet.active = false;
      setTimeout(resetComet, 5000 + Math.random() * 6000);
    }
  }

  /* ---------- 组紐丝带 ---------- */
  let ribbonT = 0;
  function drawRibbon() {
    ribbonT += 0.007;
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    const baseY = H * 0.5;
    const amp = H * 0.07;
    for (let x = 0; x <= W; x += 3) {
      const y = baseY
        + Math.sin((x / W) * Math.PI * 3.5 + ribbonT) * amp
        + Math.cos((x / W) * Math.PI * 1.8 + ribbonT * 0.6) * amp * 0.4;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    const rg = ctx.createLinearGradient(0, 0, W, 0);
    rg.addColorStop(0, 'transparent');
    rg.addColorStop(0.15, '#f4a26a');
    rg.addColorStop(0.45, '#c77dff');
    rg.addColorStop(0.75, '#5a6abf');
    rg.addColorStop(1, 'transparent');
    ctx.strokeStyle = rg;
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.restore();
  }

  /* ---------- 鼠标粒子轨迹 ---------- */
  let particles = [];

  class Particle {
    constructor(x, y) {
      this.x = x; this.y = y;
      this.vx = (Math.random() - 0.5) * 2.5;
      this.vy = (Math.random() - 0.5) * 2.5 - 0.9;
      this.life = 1;
      this.decay = 0.022 + Math.random() * 0.02;
      this.r = Math.random() * 3 + 0.8;
      this.color = pick(palette);
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.05;
      this.life -= this.decay;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.life) * 0.88;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    }
  }

  /* ---------- 烟花 ---------- */
  let fireworks = [];

  class Firework {
    constructor(x, y) {
      this.sparks = [];
      const n = 60 + Math.floor(Math.random() * 40);
      const base = pick(palette);
      for (let i = 0; i < n; i++) {
        const angle = (Math.PI * 2 / n) * i + Math.random() * 0.25;
        const speed = 1.8 + Math.random() * 4;
        this.sparks.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.012 + Math.random() * 0.016,
          r: Math.random() * 2.8 + 0.6,
          color: Math.random() > 0.35 ? base : pick(palette)
        });
      }
      this.done = false;
    }
    update() {
      let alive = false;
      for (const s of this.sparks) {
        s.x += s.vx; s.y += s.vy;
        s.vx *= 0.96; s.vy *= 0.96;
        s.vy += 0.07;
        s.life -= s.decay;
        if (s.life > 0) alive = true;
      }
      if (!alive) this.done = true;
    }
    draw() {
      for (const s of this.sparks) {
        if (s.life <= 0) continue;
        ctx.save();
        ctx.globalAlpha = Math.max(0, s.life) * 0.92;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      }
    }
  }

  /* ---------- 事件监听 ---------- */
  let lx = -999, ly = -999;
  document.addEventListener('mousemove', e => {
    if (Math.hypot(e.clientX - lx, e.clientY - ly) > 5) {
      for (let i = 0; i < 3; i++) particles.push(new Particle(e.clientX, e.clientY));
      lx = e.clientX; ly = e.clientY;
    }
  });

  document.addEventListener('click', e => {
    // 仅点击空白区域触发烟花（避免点链接时干扰）
    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
    fireworks.push(new Firework(e.clientX, e.clientY));
  });

  /* ---------- 主循环 ---------- */
  function loop() {
    ctx.clearRect(0, 0, W, H);

    drawStars();
    drawComet();
    drawRibbon();

    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => { p.update(); p.draw(); });

    fireworks = fireworks.filter(f => !f.done);
    fireworks.forEach(f => { f.update(); f.draw(); });

    requestAnimationFrame(loop);
  }
  loop();
})();
