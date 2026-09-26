/* ============================================================
   motion.js — every motion on the site, in one place.
   Requires GSAP + ScrollTrigger (loaded from CDN in each page).
   Falls back to "everything visible, no motion" if GSAP is missing
   or the visitor prefers reduced motion.

   Vocabulary (data attributes you can put on any element):
     data-reveal            fade + lift when it scrolls into view
     data-clip              clip-path reveal from the bottom
     data-stagger           children reveal one after another
     data-split             hero text: each line slides up from a mask
     data-parallax="0.2"    moves at a fraction of scroll speed
     data-scrub             property tweens tied to scroll position
     data-pin               pins a stage while its content transforms
     data-magnet            magnetic CTA (pulls toward the cursor)
     .thumb .zoom           image zoom on hover (CSS) + subtle scroll scale
   ============================================================ */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  /* ---------- nav: stuck state, burger, active link ---------- */
  var nav = document.querySelector('.nav');
  var burger = document.querySelector('.nav-burger');
  var links = document.querySelector('.nav-links');
  function onScroll() { if (nav) nav.classList.toggle('stuck', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('is-open'); burger.classList.remove('is-open'); });
    });
  }
  var here = location.pathname.replace(/index\.html$/, '');
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    var path = href.replace(/index\.html$/, '');
    var isWork = a.dataset.nav === 'work' && /\/work\//.test(here);
    if (isWork || (path && here.endsWith(path) && path !== '/')) a.classList.add('is-active');
    if (a.dataset.nav === 'work' && (here === '/' || here === '' || /\/web3\/?$/.test(here))) a.classList.add('is-active');
  });

  /* ---------- split hero text into masked lines ---------- */
  document.querySelectorAll('[data-split]').forEach(function (el) {
    var html = el.innerHTML.trim();
    var lines = html.split(/<br\s*\/?>/i);
    el.innerHTML = lines.map(function (l) { return '<span class="split-line"><span>' + l.trim() + '</span></span>'; }).join('');
  });

  /* ---------- copy buttons ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]'); if (!b) return;
    var t = b.getAttribute('data-copy');
    function done() { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy'; }, 1500); }
    try { navigator.clipboard.writeText(t).then(done, done); } catch (err) { done(); }
  });

  /* ---------- fallback: no GSAP or reduced motion ---------- */
  function showAll() {
    document.querySelectorAll('[data-reveal],[data-clip],[data-stagger],[data-split]').forEach(function (el) {
      el.classList.add('is-in');
      el.querySelectorAll('[data-reveal],[data-clip]').forEach(function (c) { c.classList.add('is-in'); });
    });
    document.querySelectorAll('[data-stagger] > *').forEach(function (c) { c.style.opacity = 1; c.style.transform = 'none'; });
  }
  if (!hasGsap || reduce) { showAll(); return; }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- fade + lift, clip reveal (class-driven; CSS does the tween) ---------- */
  document.querySelectorAll('[data-reveal],[data-clip],[data-split]').forEach(function (el) {
    ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: function () { el.classList.add('is-in'); } });
  });

  /* ---------- stagger: children in sequence ---------- */
  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    var kids = Array.prototype.slice.call(group.children);
    gsap.set(kids, { opacity: 0, y: 24 });
    ScrollTrigger.create({
      trigger: group, start: 'top 85%', once: true,
      onEnter: function () { gsap.to(kids, { opacity: 1, y: 0, duration: .8, ease: 'power3.out', stagger: .09 }); }
    });
  });

  /* ---------- parallax ---------- */
  document.querySelectorAll('[data-parallax]').forEach(function (el) {
    var f = parseFloat(el.getAttribute('data-parallax')) || .15;
    gsap.to(el, { yPercent: -f * 100, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* ---------- scrub: image zoom-out as it enters, tied to scroll ---------- */
  document.querySelectorAll('[data-scrub]').forEach(function (el) {
    gsap.fromTo(el, { scale: 1.08 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 35%', scrub: .6 } });
  });

  /* ---------- pin + transform: case-study stage holds while the screen settles ---------- */
  document.querySelectorAll('[data-pin]').forEach(function (stage) {
    var inner = stage.querySelector('[data-pin-inner]') || stage.firstElementChild;
    if (!inner || window.innerWidth < 900) return;
    gsap.fromTo(inner, { y: 40, scale: .96, opacity: .6 }, {
      y: 0, scale: 1, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: stage, start: 'top 80%', end: 'top 20%', scrub: .8 }
    });
  });

  /* ---------- magnetic CTA ---------- */
  var fine = window.matchMedia('(pointer: fine)').matches;
  if (fine) {
    document.querySelectorAll('[data-magnet]').forEach(function (btn) {
      var strength = 18;
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        var y = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        gsap.to(btn, { x: x * strength, y: y * strength, duration: .4, ease: 'power3.out' });
      });
      btn.addEventListener('mouseleave', function () { gsap.to(btn, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1, .45)' }); });
    });
  }

  /* ---------- text shift: hero eyebrow / big words drift slightly on scroll ---------- */
  document.querySelectorAll('[data-shift]').forEach(function (el) {
    gsap.to(el, { xPercent: 4, ease: 'none', scrollTrigger: { trigger: el, start: 'top 70%', end: 'bottom top', scrub: true } });
  });

  /* ---------- active section links on case pages ---------- */
  var sideLinks = document.querySelectorAll('.cbody .side a');
  if (sideLinks.length) {
    sideLinks.forEach(function (a) {
      var id = a.getAttribute('href').slice(1); var sec = document.getElementById(id); if (!sec) return;
      ScrollTrigger.create({
        trigger: sec, start: 'top 40%', end: 'bottom 40%',
        onToggle: function (s) { if (s.isActive) { sideLinks.forEach(function (x) { x.classList.remove('is-active'); }); a.classList.add('is-active'); } }
      });
    });
  }

  /* ---------- page enter ---------- */
  gsap.from('.nav', { y: -12, opacity: 0, duration: .6, ease: 'power3.out' });
  var hero = document.querySelector('.hero, .chead, .about, .contact');
  if (hero) hero.querySelectorAll('[data-reveal],[data-split]').forEach(function (el, i) {
    setTimeout(function () { el.classList.add('is-in'); }, 120 + i * 90);
  });
})();
