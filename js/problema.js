document.addEventListener('DOMContentLoaded', function () {
  gsap.registerPlugin(ScrollTrigger);

  const section = document.getElementById('problema');
  if (!section) return;

  const titleParts = section.querySelectorAll('.problema__title-text');
  const intro = section.querySelector('.problema__intro');
  const pezNote = section.querySelector('.problema__pez-note');
  const list = section.querySelector('.problema__list');
  const items = gsap.utils.toArray(section.querySelectorAll('.problema__item'));

  const isMobile = window.innerWidth <= 767;

  let hasPlayed = false;

  // ─────────────────────────────────────────
  // PIN DE LA SECCIÓN
  // ─────────────────────────────────────────

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: isMobile ? '+=2800' : '+=1400',
    pin: true,
    pinSpacing: true,
    anticipatePin: 1
  });

  // ─────────────────────────────────────────
  // TÍTULO — split por palabras
  // ─────────────────────────────────────────

  function splitTitle() {
    titleParts.forEach((part) => {
      const text = part.dataset.text || part.textContent;
      const words = text.split(' ');

      part.innerHTML = '';

      words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'problema__word';

        [...word].forEach((char) => {
          const letter = document.createElement('span');
          letter.className = 'problema__letter';
          letter.textContent = char;
          wordSpan.appendChild(letter);
        });

        part.appendChild(wordSpan);

        if (wordIndex < words.length - 1) {
          const space = document.createElement('span');
          space.className = 'problema__space';
          space.innerHTML = '&nbsp;';
          part.appendChild(space);
        }
      });
    });
  }

  splitTitle();

  const letters = gsap.utils.toArray(section.querySelectorAll('.problema__letter'));

  // ─────────────────────────────────────────
  // ESTADO INICIAL
  // ─────────────────────────────────────────

  gsap.set(letters, {
    opacity: 0,
    filter: 'blur(12px)',
    y: '0.22em'
  });

  if (intro) {
    gsap.set(intro, {
      opacity: 0,
      y: 16,
      filter: 'blur(8px)'
    });
  }

  if (pezNote) {
    gsap.set(pezNote, {
      opacity: 0,
      y: 14,
      filter: 'blur(6px)'
    });
  }

  items.forEach((item) => {
    const num = item.querySelector('.problema__num');
    const content = item.querySelector('.problema__item-content');

    gsap.set(item, {
      opacity: 1
    });

    if (num) {
      gsap.set(num, {
        opacity: 0,
        y: 10
      });
    }

    if (content) {
      gsap.set(content, {
        opacity: 0,
        y: 12,
        filter: 'blur(6px)'
      });
    }
  });

  if (isMobile && list) {
    gsap.set(list, {
      x: 0
    });
  }

  // ─────────────────────────────────────────
  // ANIMACIÓN PRINCIPAL
  // ─────────────────────────────────────────

  function playProblema() {
    if (hasPlayed) return;
    hasPlayed = true;

    const tl = gsap.timeline({
      defaults: {
        ease: 'power3.out'
      }
    });

    tl.to(letters, {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      duration: 0.9,
      stagger: 0.018
    }, 0);

    if (intro) {
      tl.to(intro, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.7
      }, 0.65);
    }

    if (pezNote) {
      tl.to(pezNote, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.65
      }, 0.95);
    }

    items.forEach((item, index) => {
      const num = item.querySelector('.problema__num');
      const content = item.querySelector('.problema__item-content');

      const start = 1.05 + index * 0.16;

      if (num) {
        tl.to(num, {
          opacity: 1,
          y: 0,
          duration: 0.45
        }, start);
      }

      if (content) {
        tl.to(content, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.55
        }, start + 0.1);
      }
    });

    if (isMobile && items.length) {
      items[0].classList.add('is-mobile-active');
    }
  }

  ScrollTrigger.create({
    trigger: section,
    start: 'top 60%',
    onEnter: playProblema
  });

  // ─────────────────────────────────────────
  // MOBILE — CARRUSEL HORIZONTAL POR SCROLL
  // ─────────────────────────────────────────

  function setupMobileHorizontalCarousel() {
    if (!isMobile || !list || !items.length) return;

    let currentIndex = -1;

    // Pausa inicial antes de que el carrusel empiece a moverse.
    // 0.32 = 32% del recorrido pinneado queda reservado para leer la card 1.
    const PAUSE_PROGRESS = 0.32;

    function activateItem(index) {
      if (index === currentIndex) return;

      currentIndex = index;

      items.forEach((item, i) => {
        item.classList.toggle('is-mobile-active', i === index);
      });
    }

    function getMaxTranslate() {
      const listWidth = list.scrollWidth;
      const viewportWidth = section.clientWidth;
      const sidePadding = window.innerWidth * 0.05;

      return Math.max(0, listWidth - viewportWidth + sidePadding);
    }

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=2800',
      scrub: 0.8,

      onUpdate: (self) => {
        const rawProgress = self.progress;

        const progress = gsap.utils.clamp(
          0,
          1,
          (rawProgress - PAUSE_PROGRESS) / (1 - PAUSE_PROGRESS)
        );

        const maxTranslate = getMaxTranslate();

        gsap.set(list, {
          x: -maxTranslate * progress
        });

        const activeIndex = Math.min(
          items.length - 1,
          Math.round(progress * (items.length - 1))
        );

        activateItem(activeIndex);
      },

      onEnter: () => {
        gsap.set(list, { x: 0 });
        activateItem(0);
      },

      onEnterBack: () => {
        activateItem(items.length - 1);
      },

      onLeaveBack: () => {
        gsap.set(list, { x: 0 });
        activateItem(0);
      }
    });
  }

  setupMobileHorizontalCarousel();

  // ─────────────────────────────────────────
  // RECÁLCULO FINAL
  // ─────────────────────────────────────────

  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

  ScrollTrigger.refresh();
});