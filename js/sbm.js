(function () {
  const section = document.querySelector('#sbm');
  if (!section) return;

  const isMobile = () => window.innerWidth <= 768;

  /* ── Split chars ── */
  function splitChars(el) {
    const text = el.textContent;
    el.textContent = '';
    el.setAttribute('aria-label', text);
    text.split('').forEach((ch) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      el.appendChild(span);
    });
    return el.querySelectorAll('.char');
  }

  const subtitle   = section.querySelector('.sbm__subtitle');
  const chars      = splitChars(subtitle);
  const titleEl    = section.querySelector('.sbm__title');
  const lineInners = titleEl.querySelectorAll('.line-inner');

  gsap.set(lineInners, { y: '110%' });

  /* ── Entrada ── */
  const entryTl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  });

  entryTl.to(chars, {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    duration: 0.5,
    ease: 'power2.out',
    stagger: 0.022,
  });

  entryTl.to(lineInners, {
    y: '0%',
    duration: 0.75,
    ease: 'power4.out',
    stagger: 0.1,
  }, '-=0.35');

  /* ── Cards desktop ── */
  function setupDesktop() {
    const cards     = section.querySelectorAll('.sbm__card');
    const pinWrap   = section.querySelector('.sbm__pin-wrap');
    const baseImg   = section.querySelector('.sbm__card-img--base');
    const glitchImg = section.querySelector('.sbm__card-img--glitch');
    const nCards    = cards.length;
    let currentIndex   = -1;
    let glitchInterval = null;

    /* ── Glitch — siempre activo ── */
    function startGlitch() {
      if (!glitchImg || glitchInterval) return;
      function fire() {
        glitchImg.style.opacity = '1';
        setTimeout(() => {
          glitchImg.style.opacity = '0';
          glitchInterval = setTimeout(fire, Math.random() * 5400 + 2700);
        }, Math.random() * 1440 + 720);
      }
      glitchInterval = setTimeout(fire, Math.random() * 1000 + 500);
    }

    function stopGlitch() {
      if (glitchInterval) {
        clearTimeout(glitchInterval);
        glitchInterval = null;
      }
      if (glitchImg) glitchImg.style.opacity = '0';
    }

    /* ── Activate ── */
    function activateCard(index, pre = false) {
      if (index === currentIndex && !pre) return;

      cards.forEach((card, i) => {
        card.classList.remove('is-active', 'is-done', 'is-pre');

        if (i === index) {
          if (pre) {
            card.classList.add('is-pre');
          } else {
            card.classList.add('is-active');
          }
        } else if (i < index) {
          card.classList.add('is-done');
        }
      });

      if (!pre) currentIndex = index;
    }

    activateCard(0);

    // Glitch arranca siempre
    startGlitch();

    /* ── Parallax imagen ── */
    if (baseImg) {
      gsap.fromTo(baseImg,
        { scale: 1.15, transformOrigin: 'center center' },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }

    if (glitchImg) {
      gsap.fromTo(glitchImg,
        { scale: 1.15, transformOrigin: 'center center' },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }

    /* ── Pin + scroll cards ── */
    // Cada card tiene dos fases:
    // - PRE: primer 30% del segmento — número crece, flecha rota
    // - ACTIVE: último 70% del segmento — card se expande
    const PRE_THRESHOLD = 0.15;

    ScrollTrigger.create({
      trigger: pinWrap,
      start: 'top 60px',
      end: '+=' + (nCards * window.innerHeight),
      pin: true,
      pinSpacing: true,
      scrub: 100,
      onUpdate(self) {
        const progress = self.progress;
        const segment  = 1 / nCards;

        // Encontrar en qué segmento estamos
        const rawIndex  = progress * nCards;
        const cardIndex = Math.min(Math.floor(rawIndex), nCards - 1);
        const localP    = rawIndex - Math.floor(rawIndex); // 0→1 dentro del segmento

        if (localP < PRE_THRESHOLD && cardIndex > 0) {
          // Fase pre: mostrar pre en cardIndex, activa en cardIndex-1
          activateCard(cardIndex - 1);
          cards[cardIndex].classList.add('is-pre');
        } else {
          activateCard(cardIndex);
        }
      },
      onEnter()     { activateCard(0); },
      onLeaveBack() {
        cards.forEach((c) => c.classList.remove('is-active', 'is-done', 'is-pre'));
        activateCard(0);
      },
    });
  }

  /* ── Mobile ── */
function setupMobile() {
  const cards   = section.querySelectorAll('.sbm__card');
  const pinWrap = section.querySelector('.sbm__pin-wrap');
  const nCards  = cards.length;
  let currentIndex = -1;

  function activateCard(index) {
    if (index === currentIndex) return;
    cards.forEach((card, i) => {
      card.classList.remove('is-active', 'is-done', 'is-pre');
      if (i === index) card.classList.add('is-active');
      else if (i < index) card.classList.add('is-done');
    });
    currentIndex = index;
  }

  activateCard(0);

  ScrollTrigger.create({
    trigger: pinWrap,
    start: 'top top',
    end: '+=' + (nCards * window.innerHeight),
    pin: true,
    pinSpacing: true,
    scrub: 100,
    onUpdate(self) {
      const index = Math.min(
        Math.floor(self.progress * nCards),
        nCards - 1
      );
      activateCard(index);
    },
    onEnter()     { activateCard(0); },
    onLeaveBack() {
      cards.forEach((c) => c.classList.remove('is-active', 'is-done', 'is-pre'));
      activateCard(0);
    },
  });
}

  /* ── Init ── */
  if (isMobile()) {
    setupMobile();
  } else {
    setupDesktop();
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger?.closest?.('#sbm')) st.kill();
      });
      isMobile() ? setupMobile() : setupDesktop();
    }, 300);
  });
})();