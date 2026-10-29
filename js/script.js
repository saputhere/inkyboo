(function () {
  const $ = id => document.getElementById(id);
  const WA_NUMBER = '94778375505';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isPhone = () => innerWidth <= 760;

  // ---------- Basic protection (deters casual copying; not a true lock) ----------
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    const devtools =
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) ||
      (e.metaKey && e.altKey && ['i', 'j', 'c'].includes(k)) ||
      (e.ctrlKey && ['u', 's'].includes(k)) ||
      (e.metaKey && ['u', 's'].includes(k));
    if (devtools) { e.preventDefault(); e.stopPropagation(); }
  }, true);

  // ---------- WhatsApp links ----------
  function waLink(text) { return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`; }
  const GENERAL = `Hi InkyBoo, I'm looking for a print product or better. Can you help me?`;
  document.querySelectorAll('[data-wa]').forEach(a => a.href = waLink(GENERAL));

  // ---------- Ask InkyBoo ----------
  const askForm = $('askForm'), askInput = $('askInput');
  if (askForm) {
    askForm.addEventListener('submit', e => {
      e.preventDefault();
      const q = askInput.value.trim();
      if (q) window.open(waLink(`Hi InkyBoo, ${q}`), '_blank', 'noopener');
    });
  }
  document.querySelectorAll('.suggest button').forEach(b => b.addEventListener('click', () => {
    askInput.value = b.dataset.q; askInput.focus();
  }));

  // ---------- Journey: rail fills as you scroll (horizontal on desktop, vertical on phones) ----------
  const jtimeline = $('jtimeline'), jfill = $('jfill');
  const jnodes = [...document.querySelectorAll('.jnode')];
  function updateJourney() {
    if (!jtimeline) return;
    const r = jtimeline.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35)));
    if (isPhone()) { jfill.style.height = `${p * 100}%`; jfill.style.width = '2px'; }
    else { jfill.style.width = `${p * 100}%`; jfill.style.height = '100%'; }
    jnodes.forEach((n, i) => n.classList.toggle('on', p >= (i + 0.2) / jnodes.length));
  }
  addEventListener('scroll', () => requestAnimationFrame(updateJourney), { passive: true });
  addEventListener('resize', updateJourney);
  updateJourney();

  // ---------- 3D logo: rotates with scroll direction and follows the cursor ----------
  const logo = $('logo3d');
  const scaleFor = () => (isPhone() ? 0.8 : 1.3);
  let lastY = scrollY, targetAngle = 0, angle = 0;
  let px = 0.5, py = 0.5, lx = 0.5, ly = 0.5;
  addEventListener('scroll', () => {
    const dy = scrollY - lastY; lastY = scrollY;
    targetAngle += dy * 0.35;
  }, { passive: true });
  addEventListener('pointermove', e => { px = e.clientX / innerWidth; py = e.clientY / innerHeight; }, { passive: true });
  function animateLogo() {
    angle += (targetAngle - angle) * 0.08;
    lx += (px - lx) * 0.06; ly += (py - ly) * 0.06;
    const tilt = -14 + Math.sin(scrollY * 0.004) * 8 - (ly - 0.5) * 30;
    const spin = angle + (lx - 0.5) * 40;
    if (logo) logo.style.transform = `scale(${scaleFor()}) rotateX(${tilt}deg) rotateY(${spin}deg)`;
    if (!reduce) requestAnimationFrame(animateLogo);
  }
  animateLogo();

  // ---------- Cursor highlight ----------
  const cur = $('cur');
  let tx = innerWidth / 2, ty = innerHeight / 2, cx = tx, cy = ty;
  addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; if (cur) cur.style.opacity = '1'; }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { if (cur) cur.style.opacity = '0'; });
  const sections = [...document.querySelectorAll('section, header')];
  function curTheme() {
    const y = ty + scrollY;
    const hit = sections.find(s => y >= s.offsetTop && y < s.offsetTop + s.offsetHeight);
    if (cur) cur.classList.toggle('light', !!hit && hit.classList.contains('theme-light'));
  }
  function followCursor() {
    cx += (tx - cx) * 0.07; cy += (ty - cy) * 0.07;
    if (cur) cur.style.transform = `translate(${cx}px, ${cy}px)`;
    curTheme();
    if (!reduce) requestAnimationFrame(followCursor);
  }
  followCursor();

  // ---------- Gold dust near the heading: fine round specks with a soft glow, like noise ----------
  (function () {
    const canvas = $('goldDust');
    if (!canvas || reduce) return;
    const hero = canvas.parentElement;
    const heading = hero.querySelector('h1');
    const ctx = canvas.getContext('2d');

    // Soft halo sprite: bright centre fading smoothly to nothing at the edge
    const halo = document.createElement('canvas');
    halo.width = halo.height = 64;
    const hctx = halo.getContext('2d');
    const hg = hctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    hg.addColorStop(0.0, 'rgba(255, 226, 150, 0.9)');
    hg.addColorStop(0.2, 'rgba(255, 205, 100, 0.45)');
    hg.addColorStop(0.55, 'rgba(232, 165, 0, 0.12)');
    hg.addColorStop(1.0, 'rgba(232, 165, 0, 0)');
    hctx.fillStyle = hg;
    hctx.fillRect(0, 0, 64, 64);

    let W = 0, H = 0, dpr = 1, parts = [];
    let gather = 1, target = 1, lastDustY = scrollY, t = 0;
    let anchor = { x: 0, y: 0, w: 0, h: 0 };

    function readAnchor() {
      const r = heading.getBoundingClientRect();
      const hr = hero.getBoundingClientRect();
      anchor = { x: r.left - hr.left + r.width / 2, y: r.top - hr.top + r.height / 2, w: r.width, h: r.height };
    }

    // Each speck is placed in a tight cloud close to the heading
    function newPart() {
      const ang = Math.random() * Math.PI * 2;
      const drift = Math.pow(Math.random(), 1.5);
      return {
        hx: anchor.x + (Math.random() + Math.random() - 1) * anchor.w * 0.6,
        hy: anchor.y + (Math.random() + Math.random() - 1) * anchor.h * 0.9,
        ox: Math.cos(ang) * drift * 70,
        oy: Math.sin(ang) * drift * 45 - 20,
        core: 0.11 + Math.random() * 0.2,        // tiny round core, never square
        halo: 3 + Math.random() * 3,            // soft glow size
        sp: 0.2 + Math.random() * 0.5,
        ph: Math.random() * 6.28,
        a: 0.35 + Math.random() * 0.65
      };
    }

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = hero.clientWidth; H = hero.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      readAnchor();
      const count = innerWidth <= 760 ? 700 : 1200;
      parts = Array.from({ length: count }, newPart);
    }

    addEventListener('scroll', () => {
      const dy = scrollY - lastDustY;
      lastDustY = scrollY;
      if (scrollY < 8) target = 1;
      else if (dy > 0) target = 0;   // scroll down: dust drifts away
      else if (dy < 0) target = 1;   // scroll up: dust gathers back
    }, { passive: true });

    function draw() {
      t += 0.016;
      gather += (target - gather) * 0.035;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      const away = 1 - gather;

      for (const p of parts) {
        const x = p.hx + Math.sin(t * p.sp + p.ph) * 3 + p.ox * away;
        const y = p.hy + Math.cos(t * p.sp * 0.8 + p.ph) * 2 + p.oy * away;
        const twinkle = 0.65 + 0.35 * Math.sin(t * 1.4 + p.ph * 2);
        const alpha = Math.max(0, Math.min(1, p.a * twinkle * (0.1 + 0.9 * gather)));

        // soft halo
        ctx.globalAlpha = alpha * 0.6;
        ctx.drawImage(halo, x - p.halo / 2, y - p.halo / 2, p.halo, p.halo);

        // tiny round core
        ctx.globalAlpha = alpha;
        ctx.fillStyle = 'rgb(255, 236, 170)';
        ctx.beginPath();
        ctx.arc(x, y, p.core, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(draw);
    }

    addEventListener('resize', size);
    size();
    draw();
  })();

  // ---------- Mobile menu ----------
  const menu = $('menu'), links = $('links');
  const ICON_MENU = '<svg class="ic" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
  const ICON_CLOSE = '<svg class="ic" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  function setMenuIcon(open) { if (menu) menu.innerHTML = open ? ICON_CLOSE : ICON_MENU; }
  setMenuIcon(false);
  if (menu) {
    menu.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
      setMenuIcon(open);
    });
  }
  links && links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); setMenuIcon(false);
  }));

  // ---------- Footer year and scroll reveal ----------
  const year = $('year');
  if (year) year.textContent = new Date().getFullYear();

  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();