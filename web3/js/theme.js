/* theme.js — light / dark switch. Saved choice wins; otherwise follow the system. */
(function () {
  var root = document.documentElement;
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  function current() { return root.getAttribute('data-theme') || (media.matches ? 'dark' : 'light'); }
  function apply(t, save) {
    root.setAttribute('data-theme', t);
    if (save) { try { localStorage.setItem('theme', t); } catch (e) {} }
    document.querySelectorAll('.sq.theme').forEach(function (b) {
      b.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      b.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
    });
    var meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.setAttribute('content', t === 'dark' ? '#0c0c0e' : '#f5f4f2');
  }
  apply(current(), false);
  media.addEventListener('change', function () { try { if (!localStorage.getItem('theme')) apply(media.matches ? 'dark' : 'light', false); } catch (e) {} });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.sq.theme'); if (!b) return;
    apply(current() === 'dark' ? 'light' : 'dark', true);
  });
})();
