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

  /* ---------- front page: spotlight ---------- */
  var reduceMo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;
  var spot = document.querySelector('[data-spot]');
  if (spot) {
    var media = Array.prototype.slice.call(spot.querySelectorAll('.sp-media'));
    var copies = Array.prototype.slice.call(spot.querySelectorAll('.sp-copy'));
    var segs = Array.prototype.slice.call(spot.querySelectorAll('.sp-seg'));
    var now = spot.querySelector('[data-sp-now]');
    var n = media.length, cur = 0, DUR = 5000, timer = null, left = DUR, started = 0, paused = false, inView = true;
    spot.style.setProperty('--dur', DUR + 'ms');
    function go(i) {
      i = (i + n) % n; if (i === cur) return;
      var prev = cur; cur = i;
      media[prev].classList.remove('is-on'); media[prev].classList.add('is-out'); media[prev].setAttribute('aria-hidden', 'true');
      setTimeout(function () { media[prev].classList.remove('is-out'); }, 900);
      media[cur].classList.add('is-on'); media[cur].setAttribute('aria-hidden', 'false');
      copies[prev].classList.remove('is-on'); copies[prev].hidden = true;
      copies[cur].hidden = false; copies[cur].classList.add('is-on');
      segs.forEach(function (s, k) {
        s.classList.toggle('is-done', k < cur); s.classList.remove('is-on');
      });
      void segs[cur].offsetWidth; segs[cur].classList.add('is-on');
      if (now) now.textContent = (cur < 9 ? '0' : '') + (cur + 1);
      var img = media[cur].querySelector('img[loading="lazy"]'); if (img) img.loading = 'eager';
      var nxt = media[(cur + 1) % n].querySelector('img[loading="lazy"]'); if (nxt) nxt.loading = 'eager';
      restart();
    }
    function restart() { clearTimeout(timer); left = DUR; started = Date.now(); if (!paused && !reduceMo && inView) timer = setTimeout(function () { go(cur + 1); }, left); }
    function pause() { if (paused) return; paused = true; spot.classList.add('is-paused'); clearTimeout(timer); left = Math.max(400, left - (Date.now() - started)); }
    function resume() { if (!paused) return; paused = false; spot.classList.remove('is-paused'); started = Date.now(); if (!reduceMo && inView) timer = setTimeout(function () { go(cur + 1); }, left); }
    segs.forEach(function (s) { s.addEventListener('click', function () { go(+s.dataset.go); }); });
    spot.querySelector('[data-sp-prev]').addEventListener('click', function () { go(cur - 1); });
    spot.querySelector('[data-sp-next]').addEventListener('click', function () { go(cur + 1); });
    spot.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') pause(); });
    spot.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') resume(); });
    spot.addEventListener('focusin', pause); spot.addEventListener('focusout', function () { if (!spot.matches(':hover')) resume(); });
    spot.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') go(cur + 1); if (e.key === 'ArrowLeft') go(cur - 1); });
    var sx = null;
    spot.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    spot.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 45) go(cur + (dx < 0 ? 1 : -1)); sx = null; });
    document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); else if (!spot.matches(':hover')) resume(); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { inView = es[0].isIntersecting; if (inView) { if (!paused) restart(); } else clearTimeout(timer); }, { threshold: .25 }).observe(spot);
    restart();

    /* 3D tilt of the stage + cursor light over the panel */
    var stage = spot.querySelector('[data-tilt]');
    if (fine && !reduceMo) {
      spot.addEventListener('pointermove', function (e) {
        var r = spot.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        spot.style.setProperty('--mx', (x * 100).toFixed(1) + '%'); spot.style.setProperty('--my', (y * 100).toFixed(1) + '%');
        stage.style.setProperty('--ry', ((x - .5) * 7).toFixed(2) + 'deg'); stage.style.setProperty('--rx', ((.5 - y) * 5).toFixed(2) + 'deg');
      });
      spot.addEventListener('pointerleave', function () { stage.style.setProperty('--rx', '0deg'); stage.style.setProperty('--ry', '0deg'); });
    }
  }

  /* ---------- glass folders: tilt + cursor light ---------- */
  if (fine && !reduceMo) {
    document.querySelectorAll('.folder').forEach(function (f) {
      f.addEventListener('pointermove', function (e) {
        var r = f.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        f.style.setProperty('--mx', (x * 100).toFixed(1) + '%'); f.style.setProperty('--my', (y * 100).toFixed(1) + '%');
        f.style.setProperty('--ry', ((x - .5) * 10).toFixed(2) + 'deg'); f.style.setProperty('--rx', ((.5 - y) * 8).toFixed(2) + 'deg');
      });
      f.addEventListener('pointerleave', function () { f.style.setProperty('--rx', '0deg'); f.style.setProperty('--ry', '0deg'); });
    });
  }

  /* mobile folder row: dots follow the swipe */
  var row = document.querySelector('.folders'), dots = document.querySelectorAll('.fdots i');
  if (row && dots.length) {
    var tick = null;
    row.addEventListener('scroll', function () {
      if (tick) return;
      tick = setTimeout(function () {
        tick = null;
        var max = row.scrollWidth - row.clientWidth, k = max > 0 ? Math.round(row.scrollLeft / max * (dots.length - 1)) : 0;
        dots.forEach(function (d, j) { d.classList.toggle('is-on', j === k); });
      }, 60);
    }, { passive: true });
  }

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
