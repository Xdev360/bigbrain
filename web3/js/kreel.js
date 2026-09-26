/* kreel.js — slideshow modelled on Framer's Slideshow as used on kati.framer.website.
   Centre slide full size; neighbours scale 0.76 and tilt 2deg toward it (perspective 834px).
   Moves every ~1.1s with an ease-out-quart settle. Drag, arrows and keys step it.
   data-kreel="x": slides move left.  data-kreel="y": new slides come down from the top. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-kreel]').forEach(function (root) {
    var axis = root.getAttribute('data-kreel');
    var dir = axis === 'y' ? -1 : 1;               /* y: advance brings the slide from above */
    var slides = Array.prototype.slice.call(root.querySelectorAll('.kslide'));
    var n = slides.length, cur = 0, last = {}, visible = true, hover = false, idleUntil = 0;
    var dragPx = 0, stagePx = 1;
    function measure() { var st = root.querySelector('.kstage').getBoundingClientRect(); stagePx = axis === 'y' ? st.height : st.width; }
    function layout() {
      slides.forEach(function (el, i) {
        var o = (i - cur) * dir;
        if (o > n / 2) o -= n; if (o < -n / 2) o += n;
        var a = Math.abs(o);
        if (last[i] !== undefined && Math.abs(o - last[i]) > 1) el.classList.add('jump'); else el.classList.remove('jump');
        el.style.setProperty('--o', o);
        el.style.setProperty('--sc', o === 0 ? 1 : .76);
        el.style.setProperty('--rot', (o === 0 ? 0 : (o < 0 ? 2 : -2) * (axis === 'y' ? 1 : -1)) + 'deg');
        el.style.setProperty('--org', axis === 'y' ? (o < 0 ? '50% 100%' : o > 0 ? '50% 0%' : '50% 50%') : (o < 0 ? '100% 50%' : o > 0 ? '0% 50%' : '50% 50%'));
        el.style.visibility = a > 1 ? 'hidden' : 'visible';
        el.style.zIndex = 10 - a;
        el.setAttribute('aria-hidden', o === 0 ? 'false' : 'true');
        last[i] = o;
      });
      root.style.setProperty('--drag', dragPx + 'px');
    }
    function go(step, user) { cur = (cur + step + n) % n; dragPx = 0; layout(); if (user) idleUntil = Date.now() + 3000; }
    measure(); layout();
    window.addEventListener('resize', measure);
    root.querySelector('[data-kprev]').addEventListener('click', function () { go(-1, true); });
    root.querySelector('[data-knext]').addEventListener('click', function () { go(1, true); });
    root.addEventListener('keydown', function (e) {
      var next = axis === 'y' ? 'ArrowDown' : 'ArrowRight', prev = axis === 'y' ? 'ArrowUp' : 'ArrowLeft';
      if (e.key === next) { e.preventDefault(); go(1, true); } if (e.key === prev) { e.preventDefault(); go(-1, true); }
    });
    var start = null;
    root.addEventListener('pointerdown', function (e) {
      if (e.target.closest('button')) return;
      start = axis === 'y' ? e.clientY : e.clientX; root.classList.add('dragging'); root.setPointerCapture(e.pointerId);
    });
    root.addEventListener('pointermove', function (e) {
      if (start === null) return; dragPx = (axis === 'y' ? e.clientY : e.clientX) - start; layout();
    });
    function end() {
      if (start === null) return; start = null; root.classList.remove('dragging');
      var t = stagePx * .18, d = dragPx; dragPx = 0;
      if (axis === 'y') { if (d > t) go(1, true); else if (d < -t) go(-1, true); else layout(); }
      else { if (d < -t) go(1, true); else if (d > t) go(-1, true); else layout(); }
    }
    root.addEventListener('pointerup', end); root.addEventListener('pointercancel', end);
    root.addEventListener('pointerenter', function () { hover = true; });
    root.addEventListener('pointerleave', function () { hover = false; end(); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: .2 }).observe(root);
    if (!reduce) setInterval(function () {
      if (visible && !hover && start === null && !document.hidden && Date.now() > idleUntil) go(1, false);
    }, 1100);
  });
})();
