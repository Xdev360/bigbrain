/* shell.js — top-bar clock (Lagos time) and the Case studies / Spotlight tabs. */
(function () {
  var el = document.querySelector('[data-clock]');
  if (el) {
    var fmt = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Africa/Lagos' });
    var tick = function () { el.textContent = fmt.format(new Date()).toUpperCase() + ' · LAGOS'; };
    tick(); setInterval(tick, 30000);
  }
  var tabs = document.querySelectorAll('.tabs [role="tab"]');
  if (!tabs.length) return;
  function show(key) {
    tabs.forEach(function (t) {
      var on = t.dataset.tab === key;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      var p = document.getElementById(t.getAttribute('aria-controls'));
      if (p) { p.classList.toggle('is-on', on); p.hidden = !on; }
    });
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  tabs.forEach(function (t) { t.addEventListener('click', function () { show(t.dataset.tab); history.replaceState(null, '', ({product:'#product',web:'#websites',gfx:'#graphics'})[t.dataset.tab] || ' '); }); });
  var h={'#product':'product','#websites':'web','#graphics':'gfx','#spotlight':'product','#web-design':'web','#graphic-design':'gfx'}[location.hash]; if (h) show(h);
})();
