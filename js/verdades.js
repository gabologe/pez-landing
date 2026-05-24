document.addEventListener('DOMContentLoaded', function () {

  gsap.registerPlugin(ScrollTrigger);

  const items = [
    {
      num: '01',
      titulo: 'Publicás sin dirección.',
      sub: 'El contenido existe pero no acumula intención.'
    },
    {
      num: '02',
      titulo: 'Medís lo que no importa.',
      sub: 'Likes y alcance no predicen conversión.'
    },
    {
      num: '03',
      titulo: 'Tu CAC sube sin explicación.',
      sub: 'La decisión ya no ocurre donde invertís.'
    },
    {
      num: null,
      titulo: 'PEZ detecta en qué momento de compra está tu audiencia. Y activa el contenido correcto para moverla a la siguiente etapa.',
      sub: '',
      esRespuesta: true
    }
  ];

  const archivo      = document.getElementById('verdades-archivo');
  const activaWrap   = document.getElementById('verdad-activa');
  const activaNum    = document.getElementById('verdad-num');
  const activaTitulo = document.getElementById('verdad-titulo');
  const activaSub    = document.getElementById('verdad-sub');

  let currentIdx = -1;

  function setActiva(idx) {
    if (idx === currentIdx) return;
    currentIdx = idx;

    const item = items[idx];

    // Actualizar contenido activo
    activaWrap.classList.remove('visible', 'es-respuesta');
    void activaWrap.offsetWidth; // reflow para reiniciar transición

    activaNum.textContent    = item.num    || '';
    activaTitulo.textContent = item.titulo || '';
    activaSub.textContent    = item.sub    || '';

    if (item.esRespuesta) activaWrap.classList.add('es-respuesta');

    requestAnimationFrame(() => {
      activaWrap.classList.add('visible');
    });

    // Actualizar archivo
    archivo.innerHTML = '';
    for (let i = 0; i < idx; i++) {
      const div = document.createElement('div');
      div.className = 'archivo-item';
      div.innerHTML = `
        <span class="archivo-num">${items[i].num}</span>
        <span class="archivo-title">${items[i].titulo}</span>
      `;
      archivo.appendChild(div);
      requestAnimationFrame(() => div.classList.add('visible'));
    }
  }

  // Cada ítem ocupa 25% del scroll space
  // 4 ítems = 100% del verdades-scroll-space
  ScrollTrigger.create({
    trigger: '#verdades',
    start: 'top top',
    end: 'bottom bottom',
    scrub: false,
    onUpdate: (self) => {
      const idx = Math.min(
        items.length - 1,
        Math.floor(self.progress * items.length)
      );
      setActiva(idx);
    }
  });

  // Inicializar con el primer ítem
  setActiva(0);

});