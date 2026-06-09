document.addEventListener('DOMContentLoaded', function () {
  gsap.registerPlugin(ScrollTrigger);

  const section = document.getElementById('problema');
  if (!section) return;

  const titleParts = section.querySelectorAll('.problema__title-text');
  const intro = section.querySelector('.problema__intro');
  const pezNote = section.querySelector('.problema__pez-note');
  const mediaFrame = section.querySelector('.problema__media-frame');
  const glitchImages = Array.from(section.querySelectorAll('.problema__glitch-img'));
  const accordionItems = Array.from(section.querySelectorAll('.problema__acc-item'));
  const accordionTriggers = Array.from(section.querySelectorAll('.problema__acc-trigger'));

  let hasPlayed = false;
  let glitchIndex = 0;
  let glitchTimer = null;

  // ─────────────────────────────────────────
  // PIN DE LA SECCIÓN
  // ─────────────────────────────────────────

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: '+=1200',
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
      const words = text.trim().split(' ');

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

  if (mediaFrame) {
    gsap.set(mediaFrame, {
      opacity: 0,
      y: 18,
      filter: 'blur(8px)'
    });
  }

  gsap.set(accordionItems, {
    opacity: 0,
    y: 18,
    filter: 'blur(6px)'
  });

  // Todos cerrados al inicio
  accordionItems.forEach((item) => {
    const trigger = item.querySelector('.problema__acc-trigger');

    item.classList.remove('is-open');

    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
    }
  });

  // ─────────────────────────────────────────
  // GLITCH IMAGE LOOP
  // ─────────────────────────────────────────

  function activateGlitchImage(index) {
  if (!glitchImages.length) return;

  if (mediaFrame) {
    mediaFrame.classList.add('is-transitioning');

    setTimeout(() => {
      mediaFrame.classList.remove('is-transitioning');
    }, 950);
  }

  glitchImages.forEach((img, i) => {
    img.classList.toggle('is-active', i === index);
  });
}

  function startGlitchLoop() {
    if (!glitchImages.length || glitchTimer) return;

    glitchTimer = setInterval(() => {
      glitchIndex = (glitchIndex + 1) % glitchImages.length;
      activateGlitchImage(glitchIndex);
    }, 1300);
  }

  function stopGlitchLoop() {
    if (!glitchTimer) return;

    clearInterval(glitchTimer);
    glitchTimer = null;
  }

  // ─────────────────────────────────────────
  // ACCORDION CLICK
  // ─────────────────────────────────────────

  function openAccordionItem(targetItem) {
    const isAlreadyOpen = targetItem.classList.contains('is-open');

    accordionItems.forEach((item) => {
      const trigger = item.querySelector('.problema__acc-trigger');

      item.classList.remove('is-open');

      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    if (!isAlreadyOpen) {
      const targetTrigger = targetItem.querySelector('.problema__acc-trigger');

      targetItem.classList.add('is-open');

      if (targetTrigger) {
        targetTrigger.setAttribute('aria-expanded', 'true');
      }
    }

    ScrollTrigger.refresh();
  }

  accordionTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.problema__acc-item');
      if (!item) return;

      openAccordionItem(item);
    });
  });

  // ─────────────────────────────────────────
  // ANIMACIÓN PRINCIPAL
  // ─────────────────────────────────────────

  function playProblema() {
    if (hasPlayed) return;
    hasPlayed = true;

    const tl = gsap.timeline({
      defaults: {
        ease: 'power3.out'
      },
      onComplete: () => {
        startGlitchLoop();
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
      }, 0.8);
    }

    if (mediaFrame) {
      tl.to(mediaFrame, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.75
      }, 1);
    }

    tl.to(accordionItems, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.65,
      stagger: 0.1
    }, 1.08);
  }

  ScrollTrigger.create({
    trigger: section,
    start: 'top 60%',
    onEnter: playProblema,
    onEnterBack: startGlitchLoop,
    onLeave: stopGlitchLoop,
    onLeaveBack: stopGlitchLoop
  });

  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

  ScrollTrigger.refresh();
});