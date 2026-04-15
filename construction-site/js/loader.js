(function () {
  var loaderHTML = [
    '<div id="loader">',
      '<div class="ldr__panel ldr__panel--l"></div>',
      '<div class="ldr__panel ldr__panel--r"></div>',
      '<div class="ldr__grid" aria-hidden="true"></div>',
      '<div class="ldr__inner">',

        /* ── Building SVG ── */
        '<svg class="ldr__svg" viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">',
          /* outer shell */
          '<rect class="ld-s ld-s1" x="38" y="30" width="124" height="200" stroke="#c9a84c" stroke-width="1.2"/>',
          /* floor lines */
          '<line class="ld-s ld-s2" x1="38" y1="72"  x2="162" y2="72"  stroke="#c9a84c" stroke-width=".7"/>',
          '<line class="ld-s ld-s2" x1="38" y1="114" x2="162" y2="114" stroke="#c9a84c" stroke-width=".7"/>',
          '<line class="ld-s ld-s2" x1="38" y1="156" x2="162" y2="156" stroke="#c9a84c" stroke-width=".7"/>',
          /* centre axis */
          '<line class="ld-s ld-s2" x1="100" y1="30" x2="100" y2="230" stroke="#c9a84c" stroke-width=".4" stroke-dasharray="4 4"/>',
          /* windows – floor 1 */
          '<rect class="ld-s ld-s3" x="50"  y="42"  width="22" height="16" stroke="#c9a84c" stroke-width=".8"/>',
          '<rect class="ld-s ld-s3" x="128" y="42"  width="22" height="16" stroke="#c9a84c" stroke-width=".8"/>',
          /* windows – floor 2 */
          '<rect class="ld-s ld-s4" x="50"  y="84"  width="22" height="16" stroke="#c9a84c" stroke-width=".8"/>',
          '<rect class="ld-s ld-s4" x="128" y="84"  width="22" height="16" stroke="#c9a84c" stroke-width=".8"/>',
          /* windows – floor 3 */
          '<rect class="ld-s ld-s4" x="50"  y="126" width="22" height="16" stroke="#c9a84c" stroke-width=".8"/>',
          '<rect class="ld-s ld-s4" x="128" y="126" width="22" height="16" stroke="#c9a84c" stroke-width=".8"/>',
          /* entrance */
          '<rect class="ld-s ld-s5" x="79"  y="186" width="42" height="44"  stroke="#c9a84c" stroke-width="1"/>',
          /* rooftop accent */
          '<line class="ld-s ld-s1" x1="60"  y1="30" x2="60"  y2="18" stroke="#c9a84c" stroke-width=".8"/>',
          '<line class="ld-s ld-s1" x1="140" y1="30" x2="140" y2="18" stroke="#c9a84c" stroke-width=".8"/>',
          '<line class="ld-s ld-s1" x1="56"  y1="18" x2="144" y2="18" stroke="#c9a84c" stroke-width=".8"/>',
          /* dimension ticks */
          '<line class="ld-s ld-s5" x1="20" y1="30"  x2="20" y2="230" stroke="#c9a84c" stroke-width=".5"/>',
          '<line class="ld-s ld-s5" x1="17" y1="30"  x2="23" y2="30"  stroke="#c9a84c" stroke-width=".5"/>',
          '<line class="ld-s ld-s5" x1="17" y1="230" x2="23" y2="230" stroke="#c9a84c" stroke-width=".5"/>',
        '</svg>',

        /* ── Brand ── */
        '<div class="ldr__brand">',
          '<p class="ldr__brand-ja">匠建設株式会社</p>',
          '<p class="ldr__brand-en">TAKUMI CONSTRUCTION CO., LTD.</p>',
        '</div>',

        /* ── Progress bar ── */
        '<div class="ldr__bar-wrap"><div class="ldr__bar"></div></div>',

      '</div>',/* .ldr__inner */
    '</div>'  /* #loader */
  ].join('');

  function init() {
    document.body.insertAdjacentHTML('afterbegin', loaderHTML);
    document.body.classList.add('is-loading');

    var loader = document.getElementById('loader');

    /* exit after 2.9 s */
    setTimeout(function () {
      loader.classList.add('ldr--exit');
      document.body.classList.remove('is-loading');
    }, 2900);

    /* remove from DOM after exit animation (0.9 s) */
    setTimeout(function () {
      if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
    }, 3850);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
