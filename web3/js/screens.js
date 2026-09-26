/* screens.js — the interactive product demos inside case studies.
   Each block only runs if its elements exist on the page. */
(function () {
  function ico(id, cls) { return '<svg class="ico' + (cls ? ' ' + cls : '') + '"><use href="#i-' + id + '"/></svg>'; }
  function tabs(sel, attr, fn) {
    var btns = document.querySelectorAll(sel);
    btns.forEach(function (b) { b.addEventListener('click', function () {
      btns.forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
      fn(b.getAttribute(attr));
    }); });
  }
  function fmt(n, d) { return n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }); }

  /* ================= Readable signing ================= */
  if (document.getElementById('baPair')) {
    tabs('[data-ba]', 'data-ba', function (v) {
      document.querySelectorAll('#baPair .pl').forEach(function (p) { p.hidden = p.dataset.side !== v; });
    });
    var limFlag = document.getElementById('limFlag'), apprBtn = document.getElementById('apprBtn');
    document.querySelectorAll('[data-lim]').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('[data-lim]').forEach(function (x) { x.classList.toggle('on', x === b); });
        var v = b.dataset.lim;
        if (v === 'unl') {
          limFlag.className = 'flag red';
          limFlag.innerHTML = ico('alert') + '<span><b>You chose unlimited.</b> Uniswap can move all your USDC, now and in future, until you revoke this.</span>';
          apprBtn.textContent = 'Approve unlimited USDC'; apprBtn.className = 'b dang';
        } else if (v === 'custom') {
          limFlag.className = 'flag grn';
          limFlag.innerHTML = ico('shield') + '<span><b>Custom limit: 1,000 USDC.</b> Enough for a few swaps without re-approving each time.</span>';
          apprBtn.textContent = 'Approve 1,000 USDC'; apprBtn.className = 'b pri';
        } else {
          limFlag.className = 'flag grn';
          limFlag.innerHTML = ico('shield') + '<span><b>Limited to this swap.</b> Uniswap can move at most 500 USDC. You\'ll approve again next time.</span>';
          apprBtn.textContent = 'Approve 500 USDC'; apprBtn.className = 'b pri';
        }
      });
    });
    document.querySelector('[data-lim="500"]').click();

    var RISK = {
      safe: '<div class="top"><span class="site"><span class="fav">U</span>app.uniswap.org</span><span class="pill">' + ico('shield') + 'Verified site</span></div><div class="body"><h5>Allow Uniswap to spend 500 USDC</h5><div class="flag grn">' + ico('shield') + '<span><b>Known, verified contract.</b> Uniswap Permit2, published source code, widely used.</span></div><div class="card"><div class="row"><span class="k">Spender</span><span class="v">Uniswap Permit2</span></div><div class="row"><span class="k">Verified source</span><span class="v">Yes</span></div></div></div><div class="acts"><button class="b sec">Reject</button><button class="b pri">Approve</button></div>',
      unv: '<div class="top"><span class="site"><span class="fav" style="background:#8a8d96">?</span>swap-fast.xyz</span><span class="pill amb">' + ico('alert') + 'Unknown site</span></div><div class="body"><h5>Allow an unknown contract to spend 500 USDC</h5><div class="flag amb">' + ico('alert') + '<span><b>We can\'t verify this contract.</b> Its code isn\'t published, and this site is new. Only continue if you trust where you found it.</span></div><div class="card"><div class="row"><span class="k">Spender</span><span class="v addr">0x9f3A…c21E</span></div><div class="row"><span class="k">Contract age</span><span class="v">2 days</span></div></div></div><div class="acts"><button class="b pri">Go back</button><button class="b sec">Continue anyway</button></div>',
      bad: '<div class="top"><span class="site"><span class="fav" style="background:#d2381c">!</span>uniswap-claim.io</span><span class="pill red">' + ico('octagon') + 'Blocked</span></div><div class="body"><h5>This site is trying to take your tokens</h5><div class="flag red">' + ico('octagon') + '<span><b>Known drainer contract.</b> It has been reported for stealing funds. The site imitates Uniswap. We\'ve stopped this request.</span></div><div class="card"><div class="row"><span class="k">Requested</span><span class="v">All tokens (setApprovalForAll)</span></div><div class="row"><span class="k">Reports</span><span class="v">Flagged by security partners</span></div></div></div><div class="acts" style="grid-template-columns:1fr"><button class="b pri">Close this site</button></div><div style="text-align:center;padding:0 16px 14px;font-size:12px;color:#9a9ca3">Advanced: proceed at your own risk</div>'
    };
    var riskScr = document.getElementById('riskScr');
    tabs('[data-risk]', 'data-risk', function (k) { riskScr.innerHTML = RISK[k]; }); riskScr.innerHTML = RISK.safe;

    var STATES = {
      wait: '<div class="center"><div class="ring" style="background:#f4f4f6">' + ico('wallet') + '</div><h5>Confirm in your wallet</h5><p class="muted">Check that it says <b style="color:#101114">500 USDC</b> and <b style="color:#101114">Uniswap Permit2</b>, then approve.</p></div><div class="acts" style="grid-template-columns:1fr"><button class="b sec">Cancel</button></div>',
      pend: '<div class="center"><div class="ring" style="background:#eef2fd;color:#2759e8">' + ico('loader', 'spin') + '</div><h5>Approving 500 USDC</h5><p class="muted">Usually about 15 seconds on Ethereum. You can leave this screen. We\'ll let you know.</p><div class="steps"><div class="st done"><span class="dt"></span><span>Signed</span><span class="tm">14:02:11</span></div><div class="st now"><span class="dt"></span><span>Waiting for network</span><span class="tm">~15s</span></div><div class="st todo"><span class="dt"></span><span>Ready to swap</span><span class="tm"></span></div></div></div><div class="acts"><button class="b sec">Speed up</button><button class="b sec">View on Etherscan</button></div>',
      ok: '<div class="center"><div class="ring" style="background:#eaf6ef;color:#1d7a4a">' + ico('check') + '</div><h5>USDC approved</h5><p class="muted">Uniswap can now use up to 500 USDC. You can revoke this any time in Approvals.</p></div><div class="acts"><button class="b sec">View receipt</button><button class="b pri">Continue swap</button></div>',
      rej: '<div class="center"><div class="ring" style="background:#f4f4f6;color:#5b5e66">' + ico('x') + '</div><h5>Approval cancelled</h5><p class="muted">You rejected it in your wallet. Nothing was sent and no fee was charged.</p></div><div class="acts"><button class="b sec">Back</button><button class="b pri">Try again</button></div>',
      fail: '<div class="center"><div class="ring" style="background:#fdf0ed;color:#d2381c">' + ico('alert') + '</div><h5>Approval didn\'t go through</h5><p class="muted">The network was busy and the fee you set was too low. <b style="color:#101114">Your USDC is safe.</b> The network fee ($0.21) isn\'t refundable.</p></div><div class="acts"><button class="b sec">Details</button><button class="b pri">Retry with higher fee</button></div>'
    };
    var stateScr = document.getElementById('stateScr');
    tabs('[data-st]', 'data-st', function (k) { stateScr.innerHTML = STATES[k]; }); stateScr.innerHTML = STATES.wait;
  }

  /* ================= Trading terminal ================= */
  if (document.getElementById('term')) {
    var MK = [
      { s: 'BTC', p: 64210.40, o: 63062.00, d: 2 }, { s: 'ETH', p: 3118.05, o: 3131.80, d: 2 },
      { s: 'SOL', p: 148.72, o: 144.25, d: 2 }, { s: 'BNB', p: 582.30, o: 579.10, d: 2 }, { s: 'XRP', p: 0.5821, o: 0.5902, d: 4 }
    ];
    MK.forEach(function (m) { m.hist = []; var v = m.o; for (var i = 0; i < 80; i++) { v = v * (1 + (Math.random() - .48) * 0.004); m.hist.push(v); } m.hist.push(m.p); });
    var sel = 0, mkts = document.getElementById('mkts');
    function renderMk() {
      mkts.innerHTML = MK.map(function (m, i) {
        var ch = (m.p / m.o - 1) * 100;
        return '<div class="mk' + (i === sel ? ' on' : '') + '" data-i="' + i + '" role="button" tabindex="0"><span class="s">' + m.s + '</span><span class="p" id="mp' + i + '">' + fmt(m.p, m.d) + '</span><span class="' + (ch >= 0 ? 'up' : 'dn') + '">' + (ch >= 0 ? '+' : '−') + Math.abs(ch).toFixed(2) + '%</span></div>';
      }).join('');
    }
    mkts.addEventListener('click', function (e) { var r = e.target.closest('.mk'); if (!r) return; sel = +r.dataset.i; renderMk(); drawHead(); draw(); });
    mkts.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { var r = e.target.closest('.mk'); if (r) { e.preventDefault(); r.click(); } } });
    var cv = document.getElementById('cv'), cx = cv.getContext('2d');
    function css(v) { return getComputedStyle(document.getElementById('term')).getPropertyValue(v).trim(); }
    function drawHead() {
      var m = MK[sel], ch = (m.p / m.o - 1) * 100;
      document.getElementById('tSym').textContent = m.s + '/USDT';
      document.getElementById('tPx').textContent = fmt(m.p, m.d);
      var c = document.getElementById('tCh'); c.className = ch >= 0 ? 'up' : 'dn'; c.textContent = (ch >= 0 ? '+' : '−') + Math.abs(ch).toFixed(2) + '% · 24h';
    }
    function draw() {
      var m = MK[sel], h = m.hist, W = cv.width, H = cv.height, pad = 16;
      var mn = Math.min.apply(null, h), mx = Math.max.apply(null, h);
      cx.clearRect(0, 0, W, H);
      cx.strokeStyle = css('--t-ln'); cx.lineWidth = 1;
      for (var g = 1; g < 4; g++) { var y = pad + (H - 2 * pad) * g / 4; cx.beginPath(); cx.moveTo(0, y); cx.lineTo(W, y); cx.stroke(); }
      var up = m.p >= m.o, col = up ? css('--t-up') : css('--t-dn');
      cx.beginPath();
      h.forEach(function (v, i) { var x = i / (h.length - 1) * W, y = pad + (1 - (v - mn) / (mx - mn || 1)) * (H - 2 * pad); i ? cx.lineTo(x, y) : cx.moveTo(x, y); });
      cx.strokeStyle = col; cx.lineWidth = 3; cx.stroke();
      cx.lineTo(W, H); cx.lineTo(0, H); cx.closePath();
      var gr = cx.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, up ? 'rgba(47,191,113,.22)' : 'rgba(240,83,61,.22)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = gr; cx.fill();
      var ly = pad + (1 - (h[h.length - 1] - mn) / (mx - mn || 1)) * (H - 2 * pad);
      cx.beginPath(); cx.arc(W - 4, ly, 6, 0, Math.PI * 2); cx.fillStyle = col; cx.fill();
    }
    function tick() {
      MK.forEach(function (m, i) {
        var old = m.p; m.p = m.p * (1 + (Math.random() - .495) * 0.0016); m.hist.push(m.p); if (m.hist.length > 90) m.hist.shift();
        var el = document.getElementById('mp' + i);
        if (el) { el.textContent = fmt(m.p, m.d); el.style.color = m.p > old ? css('--t-up') : css('--t-dn'); setTimeout(function () { el.style.color = ''; }, 450); }
      });
      drawHead(); draw();
    }
    var DEP = [
      { t: 'Amount set', s: '$500.00 via bank transfer' }, { t: 'Transfer sent', s: 'You uploaded proof of payment' },
      { t: 'Under review', s: 'Waiting on us · usually under 1 hour' }, { t: 'Credited', s: 'Added to your balance' }
    ];
    var depAt = 2;
    function renderDep() {
      document.getElementById('dep').innerHTML = DEP.map(function (d, i) {
        var cls = i < depAt ? 'done' : (i === depAt ? 'now' : '');
        return '<div class="dstep ' + cls + '"><span class="c">' + (i < depAt ? '✓' : (i + 1)) + '</span><div><div class="t">' + d.t + '</div><div class="s2">' + d.s + '</div></div></div>';
      }).join('');
      document.getElementById('tBal').textContent = depAt >= 4 ? '$4,750.00' : '$4,250.00';
      document.getElementById('depBtn').textContent = depAt >= 4 ? 'Start over' : 'Advance step';
    }
    document.getElementById('depBtn').addEventListener('click', function () { depAt = depAt >= 4 ? 0 : depAt + 1; renderDep(); });
    renderMk(); drawHead(); draw(); renderDep();
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(tick, 1400);
  }

  /* ================= Corridor ================= */
  if (document.getElementById('cAmt')) {
    var RATES = { NGN: { r: 1519.80, mid: 1528.40, eta: '~15 minutes', cur: 'NGN' }, KES: { r: 128.90, mid: 129.55, eta: '~2 minutes', cur: 'KES' }, GHS: { r: 15.12, mid: 15.21, eta: '~30 minutes', cur: 'GHS' } };
    var cAmt = document.getElementById('cAmt'), cTo = document.getElementById('cTo'), secs = 30, qt = null, expired = false;
    function amt() { var n = parseFloat(cAmt.value.replace(/[^0-9.]/g, '')); return isNaN(n) ? 0 : n; }
    function calc() {
      var R = RATES[cTo.value], a = amt(), fee = a * 0.005, net = a - fee, gets = net * R.r, spread = (1 - R.r / R.mid) * 100;
      document.getElementById('cRate').textContent = '1 USD = ' + fmt(R.r, 2) + ' ' + R.cur;
      document.getElementById('cFee').textContent = '$' + fmt(fee, 2);
      document.getElementById('cSpread').textContent = spread.toFixed(2) + '% below';
      document.getElementById('cGets').textContent = R.cur + ' ' + fmt(Math.round(gets), 0);
      document.getElementById('cEta').textContent = R.eta;
      document.getElementById('sAmt').textContent = '$' + fmt(a, 2);
    }
    function renderTimer() { document.getElementById('cTimer').textContent = 'Locked · 0:' + (secs < 10 ? '0' : '') + secs; }
    function expire() {
      expired = true;
      document.getElementById('cQuote').classList.add('exp');
      document.getElementById('cTimer').innerHTML = '<button type="button" id="cRef">Refresh rate</button>';
      document.getElementById('cRef').addEventListener('click', function () {
        var R = RATES[cTo.value]; R.r = +(R.r * (1 + (Math.random() - .5) * 0.004)).toFixed(2); calc(); startQuote();
      });
      var b = document.getElementById('cSend'); b.disabled = true; b.style.opacity = .45;
    }
    function startQuote() {
      secs = 30; expired = false; if (qt) clearInterval(qt);
      document.getElementById('cQuote').classList.remove('exp');
      var b = document.getElementById('cSend'); b.disabled = false; b.style.opacity = 1;
      renderTimer();
      qt = setInterval(function () { secs--; if (secs <= 0) { clearInterval(qt); expire(); } else renderTimer(); }, 1000);
    }
    cAmt.addEventListener('input', calc);
    cAmt.addEventListener('blur', function () { var a = amt(); cAmt.value = a ? fmt(a, a % 1 ? 2 : 0) : ''; calc(); });
    cTo.addEventListener('change', function () { calc(); startQuote(); renderS(); });
    document.getElementById('cSend').addEventListener('click', function () { if (!expired) { sAt = 1; renderS(); } });

    var ST = [['Payment created', '14:02'], ['Dollars reserved', '14:02'], ['Converted to NGN', '14:04'], ['Sent to supplier\'s bank', '14:06'], ['Delivered', '—']];
    var sAt = 2;
    function renderS() {
      var cur = RATES[cTo.value].cur;
      document.getElementById('sSteps').innerHTML = ST.map(function (s, i) {
        var cls = i < sAt ? 'done' : (i === sAt ? 'now' : 'todo');
        return '<div class="st ' + cls + '"><span class="dt"></span><span>' + s[0].replace('NGN', cur) + '</span><span class="tm">' + (i < sAt ? s[1] : (i === sAt ? 'now' : '')) + '</span></div>';
      }).join('');
      var p = document.getElementById('sPill');
      if (sAt >= ST.length) { p.className = 'pill'; p.innerHTML = ico('check') + 'Delivered'; document.getElementById('sAdv').textContent = 'Start over'; }
      else { p.className = 'pill amb'; p.textContent = 'In progress'; document.getElementById('sAdv').textContent = 'Simulate next step'; }
    }
    document.getElementById('sAdv').addEventListener('click', function () { sAt = sAt >= ST.length ? 1 : sAt + 1; renderS(); });
    calc(); startQuote(); renderS();
  }
})();
