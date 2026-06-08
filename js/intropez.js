document.addEventListener('DOMContentLoaded', function () {
  gsap.registerPlugin(ScrollTrigger);

  const section = document.getElementById('intropez');
  if (!section) return;

  const titleParts = section.querySelectorAll('.intropez__title-text');
  const actionsWrap = section.querySelector('.intropez__actions');
  const actions = gsap.utils.toArray(section.querySelectorAll('.intropez__action'));
  const engine = section.querySelector('.intropez__engine');
  const output = section.querySelector('.intropez__output');
  const outputRollTexts = gsap.utils.toArray(section.querySelectorAll('.intropez__output-roll-text'));
  const closing = section.querySelector('.intropez__closing');

  let signalLoop = null;
  let hasStarted = false;

  // ─────────────────────────────────────────
  // TÍTULO — preparar letras para blur reveal
  // ─────────────────────────────────────────
function splitTitle() {
  titleParts.forEach((part) => {
    const text = part.dataset.text || part.textContent;
    const words = text.split(' ');

    part.innerHTML = '';

    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'intropez__word';

      [...word].forEach((char) => {
        const letter = document.createElement('span');
        letter.className = 'intropez__letter';
        letter.textContent = char;
        wordSpan.appendChild(letter);
      });

      part.appendChild(wordSpan);

      if (wordIndex < words.length - 1) {
        const space = document.createElement('span');
        space.className = 'intropez__space';
        space.innerHTML = '&nbsp;';
        part.appendChild(space);
      }
    });
  });
}

  splitTitle();

  const letters = gsap.utils.toArray(section.querySelectorAll('.intropez__letter'));

  // ─────────────────────────────────────────
  // ESTADO INICIAL
  // Lo setea JS, no dependemos solo del CSS.
  // ─────────────────────────────────────────
  if (letters.length) {
    gsap.set(letters, {
      opacity: 0,
      filter: 'blur(12px)',
      y: '0.22em'
    });
  }

  if (actionsWrap) {
    gsap.set(actionsWrap, {
      opacity: 0,
      filter: 'blur(8px)'
    });
  }

  if (engine) {
    gsap.set(engine, {
      opacity: 0,
      filter: 'blur(8px)',
      y: 14
    });
  }

  if (output) {
    gsap.set(output, {
      opacity: 0,
      filter: 'blur(8px)',
      y: 14
    });
  }

  if (outputRollTexts.length) {
    gsap.set(outputRollTexts, {
      y: '110%'
    });
  }

  if (closing) {
    gsap.set(closing, {
      opacity: 0,
      filter: 'blur(8px)',
      y: 12
    });
  }

  // ─────────────────────────────────────────
  // PIN DE LA SECCIÓN
  // Mantiene IntroPEZ fija para lectura.
  // ─────────────────────────────────────────
  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: '+=1400',
    pin: true,
    pinSpacing: true,
    anticipatePin: 1
  });

  // ─────────────────────────────────────────
  // LOOP DE ACCIONES
  // Solo cambia cuál acción está activa.
  // El output no vuelve a animarse.
  // ─────────────────────────────────────────
  function setActiveAction(index) {
    actions.forEach((action, i) => {
      action.classList.toggle('is-active', i === index);
    });

    // Micro respuesta sutil del módulo PEZ
    if (engine) {
      gsap.fromTo(engine,
        { opacity: 1 },
        {
          opacity: 0.86,
          duration: 0.18,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1
        }
      );
    }
  }

  function startSignalLoop() {
    if (signalLoop || !actions.length) return;

    let currentIndex = 0;

    setActiveAction(currentIndex);

    signalLoop = setInterval(() => {
      currentIndex = (currentIndex + 1) % actions.length;
      setActiveAction(currentIndex);
    }, 2200);
  }

  function stopSignalLoop() {
    if (!signalLoop) return;

    clearInterval(signalLoop);
    signalLoop = null;
  }

  // ─────────────────────────────────────────
  // ENTRADA DE LA SECCIÓN
  // ─────────────────────────────────────────
  function playIntroPez() {
    if (hasStarted) return;

    hasStarted = true;

    const tl = gsap.timeline({
      defaults: {
        ease: 'power3.out'
      },
      onComplete: () => {
        startSignalLoop();
      }
    });

    // Título: letra por letra, blur reveal
    if (letters.length) {
      tl.to(letters, {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 1.05,
        stagger: 0.032
      }, 0);
    }

    // Acciones: fade in lento
    if (actionsWrap) {
      tl.to(actionsWrap, {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 2.3
      }, 0.35);
    }

    // Motor PEZ
    if (engine) {
      tl.to(engine, {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 0.9
      }, 0.75);
    }

    // Output aparece como bloque
    if (output) {
      tl.to(output, {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 0.9
      }, 0.95);
    }

    // Output: rolling words una sola vez
    if (outputRollTexts.length) {
      tl.to(outputRollTexts, {
        y: '0%',
        duration: 0.75,
        stagger: 0.12,
        ease: 'power3.out'
      }, 1.15);
    }

    // Texto editorial izquierdo
    if (closing) {
      tl.to(closing, {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 1
      }, 1.25);
    }
  }

  // ─────────────────────────────────────────
  // TRIGGER DE ENTRADA
  // ─────────────────────────────────────────
  ScrollTrigger.create({
    trigger: section,
    start: 'top 65%',

    onEnter: () => {
      playIntroPez();
    },

    onEnterBack: () => {
      if (hasStarted) startSignalLoop();
    },

    onLeave: () => {
      stopSignalLoop();
    },

    onLeaveBack: () => {
      stopSignalLoop();
    }
  });

  // Recalcula posiciones después de armar letras y pin.
  ScrollTrigger.refresh();
});