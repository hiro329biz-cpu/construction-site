/* ============================================================
   main.js — Header, Hero slideshow, Nav, Reveal, Count-up
   ============================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ── Sticky header ── */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () =>
      header.classList.toggle('scrolled', window.scrollY > 40), { passive: true });
  }

  /* ── Mobile nav ── */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav  = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }));
    document.addEventListener('click', e => {
      if (header && !header.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Hero slideshow ── */
  initSlideshow();

  /* ── Scroll reveal ── */
  const revealEls = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
  if (revealEls.length) {
    const ro = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });
    revealEls.forEach(el => ro.observe(el));
  }

  /* ── Image wipe reveal ── */
  const wipeEls = document.querySelectorAll('.img-wipe');
  if (wipeEls.length) {
    const wo = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); wo.unobserve(e.target); }
      });
    }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });
    wipeEls.forEach(el => wo.observe(el));
  }

  /* ── Count-up ── */
  const countEls = document.querySelectorAll('[data-count]');
  if (countEls.length) {
    const ease = t => 1 - Math.pow(1 - t, 3);
    const run  = el => {
      const target   = parseFloat(el.dataset.count);
      const suffix   = el.dataset.suffix || '';
      const isFloat  = String(target).includes('.');
      const dur      = 1600;
      let start = null;
      requestAnimationFrame(function step(ts) {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        const v = ease(p) * target;
        el.textContent = (isFloat ? v.toFixed(1) : Math.floor(v)) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = (isFloat ? target.toFixed(1) : target) + suffix;
      });
    };
    const co = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { run(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.5 });
    countEls.forEach(el => co.observe(el));
  }

  /* ── Smooth anchor ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const hh = header ? header.offsetHeight : 0;
      window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - hh, behavior: 'smooth' });
    });
  });

  /* ── Works carousel ── */
  initWorksCarousel();

  /* ── News tabs ── */
  initNewsTabs();

  /* ── Active nav ── */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.gnav__item').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
});

/* ── Slideshow (7ura style: right panel, counter nav) ── */
function initSlideshow() {
  const slides  = document.querySelectorAll('.hero__slide');
  const countEl = document.getElementById('heroCount');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function updateCount() {
    if (countEl) countEl.textContent = `${current + 1}/${slides.length}`;
  }

  function goTo(idx) {
    slides[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    updateCount();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  goTo(0);
  timer = setInterval(next, 5000);

  if (nextBtn) nextBtn.addEventListener('click', () => { clearInterval(timer); next(); timer = setInterval(next, 5000); });
  if (prevBtn) prevBtn.addEventListener('click', () => { clearInterval(timer); prev(); timer = setInterval(next, 5000); });
}

/* ── Works carousel (horizontal slider, right-offset peek) ── */
function initWorksCarousel() {
  const row  = document.getElementById('worksRow');
  const prev = document.getElementById('worksPrev');
  const next = document.getElementById('worksNext');
  if (!row || !prev || !next) return;

  const thumbs = Array.from(row.querySelectorAll('.works__thumb'));
  if (!thumbs.length) return;

  let current = 0;

  function getStep() {
    // card width + gap (20px)
    return thumbs[0].offsetWidth + 20;
  }

  function getVisible() {
    const outer = row.parentElement;
    return Math.floor(outer.offsetWidth / getStep()) || 1;
  }

  function update() {
    const max = Math.max(0, thumbs.length - getVisible());
    current = Math.max(0, Math.min(current, max));
    row.style.transform = `translateX(${-current * getStep()}px)`;
    prev.disabled = current === 0;
    next.disabled = current >= max;
  }

  prev.addEventListener('click', () => { current--; update(); });
  next.addEventListener('click', () => { current++; update(); });
  window.addEventListener('resize', update);
  update();
}

/* ── News tabs ── */
function initNewsTabs() {
  const tabs  = document.querySelectorAll('[data-news-tab]');
  const items = document.querySelectorAll('.news__item[data-category]');
  if (!tabs.length) return;

  function filter(cat) {
    items.forEach(item => {
      const show = cat === 'all' || item.dataset.category === cat;
      item.style.display = show ? '' : 'none';
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filter(tab.dataset.newsTab);
    });
  });

  // 初期表示: アクティブタブで絞り込み
  const activeTab = document.querySelector('[data-news-tab].active');
  if (activeTab) filter(activeTab.dataset.newsTab);
}
