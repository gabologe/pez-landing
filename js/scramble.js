document.addEventListener('DOMContentLoaded', function () {

  const CHARS = '!@#$%&*<>[]?~';

  class Scramble {
    constructor(el) {
      this.el       = el;
      this.target   = el.querySelector('.cta-text');
      this.original = this.target.textContent.trim();
      this._int     = null;
    }

    run() {
      clearInterval(this._int);
      let frame = 0;
      const total   = this.original.length * 1.2;
      const len     = this.original.length;

      this._int = setInterval(() => {
        const resolved = Math.floor((frame / total) * len);

        // longitud SIEMPRE fija = original.length
        let out = '';
        for (let i = 0; i < len; i++) {
          if (this.original[i] === ' ') {
            out += ' ';
          } else if (i < resolved) {
            out += this.original[i];
          } else {
            out += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }

        this.target.textContent = out;

        if (++frame >= total) {
          clearInterval(this._int);
          this.target.textContent = this.original;
        }
      }, 80);
    }

    stop() {
      clearInterval(this._int);
      this.target.textContent = this.original;
    }
  }

  const isMobile = window.matchMedia(
    '(hover: none) and (pointer: coarse)'
  ).matches;

  document.querySelectorAll('.cta-scramble').forEach(btn => {
    const s = new Scramble(btn);
    if (isMobile) {
      btn.addEventListener('click', () => s.run());
    } else {
      btn.addEventListener('mouseenter', () => s.run());
    }
  });

});