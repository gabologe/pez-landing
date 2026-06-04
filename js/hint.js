(function () {

  let hint   = null;
  let cycle  = null;
  let hideT  = null;
  let active = false;

  function show() {
    if (!active || !hint) return;
    hint.classList.add('visible');
    hideT = setTimeout(() => {
      hint.classList.remove('visible');
      if (active) cycle = setTimeout(show, 2500);
    }, 5000);
  }

  function start() {
    if (active || !hint) return;
    active = true;
    hint.classList.remove('position-left');
    clearTimeout(cycle);
    clearTimeout(hideT);
    cycle = setTimeout(show, 1200);
  }

  function stop() {
    active = false;
    clearTimeout(cycle);
    clearTimeout(hideT);
    if (hint) hint.classList.remove('visible');
  }

  let scrollPause = null;
  window.addEventListener('scroll', () => {
    if (!active || !hint) return;
    hint.classList.remove('visible');
    clearTimeout(cycle);
    clearTimeout(hideT);
    clearTimeout(scrollPause);
    scrollPause = setTimeout(() => {
      if (active) cycle = setTimeout(show, 2000);
    }, 800);
  }, { passive: true });

  window.HintGlobal = { start, stop };

  // Init con retry por si ScrollTrigger no está listo
  function init() {
    hint = document.getElementById('scroll-hint');
    if (!hint) return;

    if (typeof ScrollTrigger === 'undefined') {
      setTimeout(init, 100);
      return;
    }

    ScrollTrigger.create({
      trigger: '#hero-scroll-space',
      start: 'bottom 95%',
      onEnter:     () => start(),
      onLeaveBack: () => stop(),
    });
  }

  init();

})();