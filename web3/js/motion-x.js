/* motion-x.js — hover/feedback layer on top of motion.js (which owns scroll motion).
   - data-flip        label flips up on hover, duplicate slides in from below (kati-style)
   - cursor glow      .btn / .card / .pill track the pointer with --mx/--my (CSS paints it)
   - form states      idle → sending → sent / error, posting to /api/inquiry (the main site relay)
   All off when the visitor prefers reduced motion. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;

  /* text flip: wrap the label text in two stacked spans */
  document.querySelectorAll('[data-flip]').forEach(function (el) {
    var text = el.querySelector('[data-flip-text]');
    var node = text || el;
    var label = node.textContent.trim(); if (!label) return;
    node.textContent = '';
    var wrap = document.createElement('span'); wrap.className = 'flip';
    var a = document.createElement('span'); a.className = 'flip-a'; a.textContent = label;
    var b = document.createElement('span'); b.className = 'flip-b'; b.textContent = label; b.setAttribute('aria-hidden', 'true');
    wrap.appendChild(a); wrap.appendChild(b); node.appendChild(wrap);
  });

  /* cursor-follow highlight */
  if (fine && !reduce) {
    document.querySelectorAll('.btn, .card, .pill, .tabs button, .sq').forEach(function (el) {
      el.classList.add('glow');
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      });
    });
  }

  /* contact form: state change */
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    var btn = form.querySelector('[data-send]');
    var status = form.querySelector('[data-status]');
    var setState = function (s, msg) {
      form.dataset.state = s;
      btn.disabled = (s === 'sending' || s === 'sent');
      btn.querySelector('.st-idle').hidden = s !== 'idle' && s !== 'error';
      btn.querySelector('.st-sending').hidden = s !== 'sending';
      btn.querySelector('.st-sent').hidden = s !== 'sent';
      if (status) { status.textContent = msg || ''; status.hidden = !msg; status.classList.toggle('is-err', s === 'error'); }
    };
    setState('idle');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var name = (d.get('name') || '').trim(), email = (d.get('email') || '').trim(), msg = (d.get('message') || '').trim(), company = (d.get('company') || '').trim();
      if (!name || !email || !msg) { setState('error', 'Name, email and a message, please.'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setState('error', 'That email doesn’t look right.'); return; }
      setState('sending');
      var text = 'New message from web3.xbigbrainnx.xyz\n\nName: ' + name + (company ? '\nCompany: ' + company : '') + '\nEmail: ' + email + '\n\n' + msg;
      fetch('/api/inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: text, email: email }) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok && j.ok, status: r.status }; }); })
        .then(function (res) {
          if (res.ok) { setState('sent', 'Got it. I reply within a day.'); form.reset(); form.querySelectorAll('input,textarea').forEach(function (i) { i.disabled = true; }); }
          else if (res.status === 503) setState('error', 'The form isn’t connected yet — email xbigbrainnx@gmail.com instead.');
          else setState('error', 'Couldn’t send just now. Try again, or email xbigbrainnx@gmail.com.');
        })
        .catch(function () { setState('error', 'Couldn’t send just now. Try again, or email xbigbrainnx@gmail.com.'); });
    });
  }
})();
