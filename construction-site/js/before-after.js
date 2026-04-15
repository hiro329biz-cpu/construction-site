/* ============================================================
   before-after.js — Drag/touch split slider
   ============================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ── Init all BA wrappers ── */
  document.querySelectorAll('.ba-wrapper').forEach(initSlider);

  /* ── BA case switcher (index page) ── */
  const baNavBtns = document.querySelectorAll('.ba-nav__btn');
  const baCases   = document.querySelectorAll('.ba-case');

  if (baNavBtns.length && baCases.length) {
    baNavBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.case;
        baNavBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        baCases.forEach(c => {
          const show = c.dataset.case === target;
          c.style.display = show ? '' : 'none';
          if (show) {
            // Re-init slider inside the revealed case
            const wrapper = c.querySelector('.ba-wrapper');
            if (wrapper) initSlider(wrapper);
          }
        });
      });
    });
    // Show first case
    if (baNavBtns[0]) baNavBtns[0].click();
  }

  /* ── Dot navigation ── */
  document.querySelectorAll('.ba-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = dot.dataset.idx;
      const btn = document.querySelector(`.ba-nav__btn[data-case="${idx}"]`);
      if (btn) btn.click();
    });
  });
});

/* ── Single slider initializer ── */
function initSlider(wrapper) {
  const afterEl = wrapper.querySelector('.ba-after');
  const handle  = wrapper.querySelector('.ba-handle');
  if (!afterEl || !handle) return;

  let isDragging = false;
  let position = 50; // percent

  function setPosition(pct) {
    position = Math.max(2, Math.min(98, pct));
    afterEl.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
    handle.style.left = position + '%';
  }

  function getPercent(clientX) {
    const rect = wrapper.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }

  // Mouse events
  handle.addEventListener('mousedown', e => {
    isDragging = true;
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    setPosition(getPercent(e.clientX));
  });
  document.addEventListener('mouseup', () => { isDragging = false; });

  // Touch events
  handle.addEventListener('touchstart', e => {
    isDragging = true;
    e.preventDefault();
  }, { passive: false });
  wrapper.addEventListener('touchmove', e => {
    if (!isDragging) return;
    setPosition(getPercent(e.touches[0].clientX));
    e.preventDefault();
  }, { passive: false });
  document.addEventListener('touchend', () => { isDragging = false; });

  // Click on wrapper
  wrapper.addEventListener('click', e => {
    if (e.target === handle || handle.contains(e.target)) return;
    setPosition(getPercent(e.clientX));
  });

  // Keyboard accessibility on handle
  handle.setAttribute('tabindex', '0');
  handle.setAttribute('role', 'slider');
  handle.setAttribute('aria-valuemin', '0');
  handle.setAttribute('aria-valuemax', '100');
  handle.setAttribute('aria-valuenow', '50');
  handle.setAttribute('aria-label', 'ビフォーアフタースライダー');
  handle.addEventListener('keydown', e => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === 'ArrowLeft')  setPosition(position - step);
    if (e.key === 'ArrowRight') setPosition(position + step);
    handle.setAttribute('aria-valuenow', Math.round(position));
  });

  // Init at 50%
  setPosition(50);
}
