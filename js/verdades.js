document.addEventListener('DOMContentLoaded', function () {

  gsap.registerPlugin(ScrollTrigger);

  const frase = document.getElementById('proposito-frase');
  if (!frase) return;

  const verdes = ['señales', 'contenido', 'decisión'];
  const texto = frase.dataset.texto;
  const tokens = texto.split(' ');

  frase.innerHTML = tokens.map((token, i) => {
    const limpio = token.replace(/[^a-záéíóúñü]/gi, '').toLowerCase();
    const esVerde = verdes.includes(limpio);
    const espacio = i < tokens.length - 1 ? ' ' : '';
    return `<span class="palabra${esVerde ? ' verde' : ''}">${token}</span>${espacio}`;
  }).join('');

  const palabras = frase.querySelectorAll('.palabra');
  const total = palabras.length;
  const iconoItems = document.querySelectorAll('.icono-item');

  function animarIcono(item, p) {
    const fill   = item.querySelector('.icono-circulo-fill');
    const svg    = item.querySelector('.icono-circulo-wrap svg');
const titulos = item.querySelectorAll('.icono-titulo-inner');
    const texto  = item.querySelector('.icono-texto');
    const base   = item.querySelector('.icono-circulo-base');

    // Border gris → verde
    base.style.borderColor = `rgba(173, 255, 0, ${p})`;

    // Fill de arriba a abajo
    const fillPct = Math.max(0, Math.min(100, p * 100));
    fill.style.clipPath = `inset(0% 0% ${100 - fillPct}% 0%)`;

    // SVG aparece desde p > 0.5
    svg.style.opacity = Math.max(0, (p - 0.5) * 2);

    // Título revela desde abajo
    const tY = Math.max(0, (1 - Math.max(0, (p - 0.3) / 0.7)) * 100);
    titulos.forEach(t => {
  t.style.transform = `translateY(${tY}%)`;
});

    // Subtexto fade in
    texto.style.opacity = Math.max(0, (p - 0.5) * 2);
    texto.style.transform = `translateY(${Math.max(0, (1 - Math.max(0, (p - 0.5) / 0.5)) * 8)}px)`;
  }

  ScrollTrigger.create({
    trigger: '.proposito-scroll-space',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 3,
    onUpdate: (self) => {

      // Frase: 0% → 55% del scroll
      const progresoFrase = Math.max(0, Math.min(1, self.progress / 0.55));
      const iluminadas = Math.round(progresoFrase * total);
      palabras.forEach((p, i) => {
        if (i < iluminadas) {
          p.classList.add('iluminada');
        } else {
          p.classList.remove('iluminada');
        }
      });

      // Íconos: 55% → 100% del scroll, en secuencia
      const progresoIconos = Math.max(0, (self.progress - 0.55) / 0.45);
      iconoItems.forEach((item, i) => {
        const inicio = i / 3;
        const fin = (i + 1) / 3;
        const p = Math.max(0, Math.min(1, (progresoIconos - inicio) / (fin - inicio)));
        animarIcono(item, p);
      });

    }
  });

});