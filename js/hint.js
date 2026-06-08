(function () {

  let hint = null;
  let showTimer = null;
  let hideTimer = null;
  let scrollTimer = null;
  let active = false;
  let initialized = false;
  let isScrolling = false;

  // Se ve poco tiempo
  const VISIBLE_TIME = 1600;

  // Se mantiene oculta bastante tiempo
  const HIDDEN_TIME = 20000;

  // Espera después de que el usuario deja de scrollear
  const AFTER_SCROLL_PAUSE = 16500;

  function init() {
    if (initialized) return;

    hint = document.getElementById('scroll-hint');

    if (!hint) {
      setTimeout(init, 100);
      return;
    }

    initialized = true;
  }

  function clearAllTimers() {
    clearTimeout(showTimer);
    clearTimeout(hideTimer);
    clearTimeout(scrollTimer);
  }

  function showHint() {
    if (!active || !hint || isScrolling) return;

    hint.classList.add('visible');

    hideTimer = setTimeout(() => {
      hideHint();
    }, VISIBLE_TIME);
  }

  function hideHint() {
    if (!active || !hint) return;

    hint.classList.remove('visible');

    showTimer = setTimeout(() => {
      showHint();
    }, HIDDEN_TIME);
  }

  function start() {
    if (!hint) init();
    if (!hint) return;

    active = true;
    isScrolling = false;

    // Modo global: siempre centrada
    hint.classList.add('is-global');
    hint.classList.remove('position-left');
    hint.classList.remove('visible');

    clearAllTimers();

    showTimer = setTimeout(() => {
      showHint();
    }, HIDDEN_TIME);
  }

  function stop() {
    active = false;
    isScrolling = false;

    clearAllTimers();

    if (hint) {
      hint.classList.remove('visible');
      hint.classList.remove('position-left');
      hint.classList.remove('is-global');
    }
  }

  window.addEventListener('scroll', () => {
    if (!active || !hint) return;

    isScrolling = true;
    hint.classList.remove('visible');

    clearAllTimers();

    scrollTimer = setTimeout(() => {
      isScrolling = false;

      if (!active) return;

      showTimer = setTimeout(() => {
        showHint();
      }, AFTER_SCROLL_PAUSE);
    }, 300);
  }, { passive: true });

  window.HintGlobal = {
    start,
    stop
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();