/* folders.js — theme switch, entrance motion, archive filters and lightbox. */
(function () {
  var root = document.documentElement;
  /* theme (same key as /web3, so the choice carries between them) */
  function setTheme(t, save) {
    root.setAttribute('data-theme', t);
    if (save) { try { localStorage.setItem('theme', t); } catch (e) {} }
    document.querySelectorAll('.sq.theme').forEach(function (b) {
      b.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      b.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
    });
    var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', t === 'dark' ? '#0c0c0e' : '#f5f4f2');
  }
  setTheme(root.getAttribute('data-theme') || 'light', false);
  document.addEventListener('click', function (e) {
    if (e.target.closest('.sq.theme')) setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
  });

  /* entrance */
  document.querySelectorAll('[data-in]').forEach(function (el, i) { setTimeout(function () { el.classList.add('is-in'); }, 80 + i * 110); });

  /* archive */
  var grid = document.getElementById('agrid'); if (!grid) return;
  var items = Array.prototype.slice.call(grid.querySelectorAll('.aitem'));
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en, k) { if (en.isIntersecting) { var el = en.target; setTimeout(function () { el.classList.add('is-in'); }, (k % 6) * 60); io.unobserve(el); } });
    }, { rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else items.forEach(function (el) { el.classList.add('is-in'); });

  var chips = document.querySelectorAll('[data-filter]');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.dataset.filter;
      chips.forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
      items.forEach(function (el) {
        var on = f === 'All' || el.dataset.cat === f;
        el.classList.toggle('is-out', !on);
        if (on) { el.classList.remove('is-in'); setTimeout(function () { el.classList.add('is-in'); }, 20); }
      });
    });
  });

  var lb = document.getElementById('lb'), img = lb.querySelector('img'), cap = lb.querySelector('figcaption'), cur = 0, opener = null;
  function shown() { return items.filter(function (el) { return !el.classList.contains('is-out'); }); }
  function show(el) {
    var b = el.querySelector('button'), t = el.querySelector('img');
    img.src = t.src; img.alt = t.alt;                       /* thumbnail first, full size swaps in */
    var full = new Image(); full.onload = function () { if (img.dataset.for === b.dataset.full) img.src = full.src; }; img.dataset.for = b.dataset.full; full.src = b.dataset.full;
    cap.innerHTML = el.querySelector('figcaption').innerHTML;
    img.style.animation = 'none'; img.offsetHeight; img.style.animation = '';
  }
  function open(el) { opener = el.querySelector('button'); var s = shown(); cur = s.indexOf(el); show(el); lb.hidden = false; document.body.style.overflow = 'hidden'; lb.querySelector('[data-lb-close]').focus(); }
  function close() { lb.hidden = true; document.body.style.overflow = ''; if (opener) opener.focus(); }
  function step(d) { var s = shown(); cur = (cur + d + s.length) % s.length; show(s[cur]); }
  items.forEach(function (el) { el.querySelector('button').addEventListener('click', function () { open(el); }); });
  lb.querySelector('[data-lb-close]').addEventListener('click', close);
  lb.querySelector('[data-lb-prev]').addEventListener('click', function () { step(-1); });
  lb.querySelector('[data-lb-next]').addEventListener('click', function () { step(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1);
  });
  var sx = null;
  lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); sx = null; });
})();
