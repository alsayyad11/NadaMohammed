(() => {
  'use strict';

  const doc = document;
  const html = doc.documentElement;

  /* ---------- Loader ---------- */
  window.addEventListener('load', () => {
    const loader = doc.getElementById('loader');
    setTimeout(() => loader.classList.add('is-done'), 550);
    setTimeout(() => loader.remove(), 1600);
  });

  /* ---------- Theme toggle (persisted) ---------- */
  const themeToggle = doc.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('nm-theme');
  if (savedTheme === 'light') html.setAttribute('data-theme', 'light');

  themeToggle.addEventListener('click', () => {
    const isLight = html.getAttribute('data-theme') === 'light';
    if (isLight) {
      html.removeAttribute('data-theme');
      localStorage.setItem('nm-theme', 'dark');
    } else {
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('nm-theme', 'light');
    }
  });

  /* ---------- Nav scroll state + mobile burger ---------- */
  const nav = doc.getElementById('nav');
  const navLinks = doc.getElementById('navLinks');
  const navBurger = doc.getElementById('navBurger');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }, { passive: true });

  navBurger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    navBurger.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
  }));

  /* Active nav link highlight */
  const sections = ['about', 'work', 'contact'].map(id => doc.getElementById(id));
  const navAnchors = Array.from(doc.querySelectorAll('[data-nav]'));
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  sections.forEach(s => s && navObserver.observe(s));

  /* ---------- Scroll progress bar ---------- */
  const progressBar = doc.getElementById('progressBar');
  window.addEventListener('scroll', () => {
    const h = doc.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = scrolled + '%';
  }, { passive: true });

  /* ---------- Back to top ---------- */
  doc.getElementById('toTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Footer year ---------- */
  doc.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Scroll reveal ---------- */
  const revealEls = doc.querySelectorAll('.reveal-up, .reveal-line');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animated stat counters ---------- */
  const stats = doc.querySelectorAll('.stat-num');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      statObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  stats.forEach(el => statObserver.observe(el));

  /* ---------- Custom cursor ---------- */
  const cursorDot = doc.getElementById('cursorDot');
  const cursorRing = doc.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (hasFinePointer) {
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursorDot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });
    function ringLoop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      cursorRing.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(ringLoop);
    }
    ringLoop();

    doc.querySelectorAll('a, button, .project').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('is-active'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-active'));
    });

    /* Magnetic buttons */
    doc.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const relX = e.clientX - r.left - r.width / 2;
        const relY = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${relX * 0.25}px, ${relY * 0.35}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- Hero parallax on scroll ---------- */
  const heroOrb = doc.querySelector('.hero-orb');
  const heroRing = doc.querySelector('.hero-noise-ring');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (heroOrb) heroOrb.style.transform = `translateY(${y * 0.18}px)`;
    if (heroRing) heroRing.style.transform = `translateY(${y * 0.1}px)`;
  }, { passive: true });

})();
