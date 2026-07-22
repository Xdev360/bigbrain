/* Spotlight reel — cover / framed shots, compare sliders, lightbox */
(function(){
  var root = document.getElementById('spotlightRoot');
  if(!root) return;

  var projects = [
    {
      id: 'google-movie',
      name: 'Google Movie',
      productType: 'Product design / streaming UI',
      industry: 'Entertainment',
      date: '2024',
      stage: 'Completed',
      body: 'Google Movie is a streaming product experience focused on discovery, watchlists, and a clean path from browse to play. The work covers product screens, motion cues, and a visual system that stays quiet while the titles do the talking.',
      images: [
        {
          type: 'cover',
          src: 'assets/projects/spotlight/google-movie/cover.jpg',
          title: 'Google Movie — cover',
          note: 'Hero cover for the Google Movie redesign.'
        },
        {
          type: 'frame',
          src: 'assets/projects/spotlight/google-movie/page.jpg',
          title: 'Google Movie — homepage',
          note: 'Full homepage — scroll in the lightbox to walk the page.'
        },
        {
          type: 'frame',
          src: 'assets/projects/spotlight/google-movie/shot-01.jpg',
          title: 'Player + Smart Lens',
          note: 'Playback chrome with Smart Lens on the Spider-Verse frame.'
        },
        {
          type: 'frame',
          src: 'assets/projects/spotlight/google-movie/shot-02.jpg',
          title: 'Browse + Today’s Pick',
          note: 'Home browse with category pills and today’s pick row.'
        },
        {
          type: 'frame',
          src: 'assets/projects/spotlight/google-movie/shot-03.jpg',
          title: 'Continue watching',
          note: 'Progress cards that make return visits obvious.'
        },
        {
          type: 'frame',
          src: 'assets/projects/spotlight/google-movie/shot-04.jpg',
          title: 'Discovery',
          note: 'Discovery layouts for the next watch.'
        },
        {
          type: 'frame',
          src: 'assets/projects/spotlight/google-movie/shot-05.jpg',
          title: 'Library',
          note: 'Library and lists in the same quiet system.'
        },
        {
          type: 'frame',
          src: 'assets/projects/spotlight/google-movie/shot-06.jpg',
          title: 'Watch Party Hub',
          note: 'Live rooms and upcoming parties in one hub.'
        },
        {
          type: 'frame',
          src: 'assets/projects/spotlight/google-movie/shot-07.jpg',
          title: 'Host a Watch Party',
          note: 'Schedule, invite, and pick an interactive feature.'
        }
      ]
    },
    {
      id: 'rest-jam',
      name: 'RESJAM',
      productType: 'Brand + product design',
      industry: 'Lifestyle / wellness',
      date: '2024',
      stage: 'Completed',
      body: 'RESJAM is a calm product and brand system for slowing down without losing clarity. Screens and graphics share one paced rhythm so rest feels intentional, not empty.',
      images: [
        {
          type: 'cover',
          src: 'assets/projects/spotlight/rest-jam/cover.jpg',
          title: 'RESJAM — cover',
          note: 'Hero cover for the RESJAM redesign.'
        },
        {
          type: 'compare-y',
          old: 'assets/projects/spotlight/rest-jam/old.jpg',
          new: 'assets/projects/spotlight/rest-jam/new.jpg',
          title: 'RESJAM — site transform',
          note: 'Tap Old or New to animate fully between the two sites — or drag the line.'
        }
      ]
    },
    {
      id: 'youd-mates',
      name: 'Yeild Mates',
      productType: 'Social product design',
      industry: 'Social / community',
      date: '2025',
      stage: 'Completed',
      body: 'Yeild Mates is a social product built around real groups, not endless feeds. The interface keeps hangouts, plans, and shared moments close while cutting the noise that usually kills follow-through.',
      images: []
    }
  ];

  var assetRoot = document.body.getAttribute('data-asset-root') || '../';
  var portrait = assetRoot + 'assets/portrait.jpg';
  var solo = document.body.classList.contains('spotlight-solo');
  var idx = 0;
  var shot = 0;
  var dragX = 0;
  var startX = 0;
  var dragging = false;
  var didSwipe = false;
  var track = null;
  var frame = null;
  var compareUnlocked = {};
  var comparePos = {};

  function esc(s){
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
  }
  function url(src){
    if(!src) return '';
    if(/^https?:\/\//i.test(src)) return src;
    return assetRoot + src.replace(/^\.\//,'');
  }
  function keyFor(i, s){ return i + ':' + s; }

  function currentImages(){
    var p = projects[idx];
    if(p.images && p.images.length) return p.images;
    return [{ type:'ph', title:p.name, note:'Screen images coming soon.' }];
  }

  function ensureLightbox(){
    if(document.getElementById('spLightbox')) return;
    var el = document.createElement('div');
    el.id = 'spLightbox';
    el.className = 'sp-lb';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = ''+
      '<button type="button" class="sp-lb-backdrop" id="spLbCloseBg" aria-label="Close"></button>'+
      '<div class="sp-lb-panel" role="dialog" aria-modal="true" aria-labelledby="spLbTitle">'+
        '<button type="button" class="sp-lb-x" id="spLbClose" aria-label="Close">×</button>'+
        '<div class="sp-lb-stage" id="spLbStage"></div>'+
        '<div class="sp-lb-guide">'+
          '<img class="sp-lb-pfp" src="'+esc(portrait)+'" alt="" width="48" height="48">'+
          '<div class="sp-lb-bubble">'+
            '<p class="sp-lb-name">BigBrain</p>'+
            '<p id="spLbTitle" class="sp-lb-title"></p>'+
            '<p id="spLbNote" class="sp-lb-note"></p>'+
          '</div>'+
        '</div>'+
      '</div>';
    document.body.appendChild(el);
    document.getElementById('spLbClose').addEventListener('click', closeLightbox);
    document.getElementById('spLbCloseBg').addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closeLightbox();
    });
  }

  function closeLightbox(){
    var lb = document.getElementById('spLightbox');
    if(!lb) return;
    lb.classList.remove('is-on');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lb-open');
    var stage = document.getElementById('spLbStage');
    if(stage) stage.innerHTML = '';
  }

  function openLightbox(item){
    ensureLightbox();
    var lb = document.getElementById('spLightbox');
    var stage = document.getElementById('spLbStage');
    var title = document.getElementById('spLbTitle');
    var note = document.getElementById('spLbNote');
    title.textContent = item.title || projects[idx].name;
    note.textContent = item.note || '';
    stage.innerHTML = '';
    stage.className = 'sp-lb-stage';

    if(item.type === 'compare-x' || item.type === 'compare-y'){
      stage.classList.add('is-compare');
      stage.appendChild(buildCompare(item, true));
    } else {
      var scroll = document.createElement('div');
      scroll.className = 'sp-lb-scroll';
      var img = document.createElement('img');
      img.src = url(item.src);
      img.alt = item.title || '';
      img.draggable = false;
      scroll.appendChild(img);
      stage.appendChild(scroll);
    }

    lb.classList.add('is-on');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lb-open');
  }

  function buildCompare(item, inLightbox){
    var axis = item.type === 'compare-y' ? 'y' : 'x';
    var wrap = document.createElement('div');
    wrap.className = 'sp-compare sp-compare-' + axis + (inLightbox ? ' is-lb' : '');
    wrap.dataset.axis = axis;

    var oldSrc = url(item.old);
    var newSrc = url(item.new);
    var k0 = keyFor(idx, shot);
    var unlocked = !!compareUnlocked[k0] || inLightbox;
    var saved = typeof comparePos[k0] === 'number' ? comparePos[k0] : 50;
    var oldStyle = axis === 'x' ? ('width:'+saved+'%') : ('height:'+saved+'%');
    var handleStyle = axis === 'x' ? ('left:'+saved+'%') : ('top:'+saved+'%');

    wrap.innerHTML = ''+
      '<div class="sp-compare-view'+(unlocked?' is-unlocked':'')+'" data-compare-view>'+
        '<div class="sp-compare-layer sp-compare-new">'+
          '<img src="'+esc(newSrc)+'" alt="New" draggable="false">'+
        '</div>'+
        '<div class="sp-compare-layer sp-compare-old" data-old-layer style="'+oldStyle+'">'+
          '<img src="'+esc(oldSrc)+'" alt="Old" draggable="false">'+
        '</div>'+
        '<div class="sp-compare-handle'+(axis==='y' && saved===50?' is-nudge':'')+'" data-handle style="'+handleStyle+'">'+
          '<span class="sp-compare-line" aria-hidden="true"></span>'+
          '<span class="sp-compare-knob" aria-hidden="true">'+
            (axis==='x'
              ? '<span class="sp-compare-chev">‹</span><span class="sp-compare-chev">›</span>'
              : '<span class="sp-compare-chev is-v">‹</span><span class="sp-compare-chev is-v">›</span>')+
          '</span>'+
        '</div>'+
        '<div class="sp-compare-labels">'+
          '<button type="button" class="sp-compare-label is-old" data-go-old>Old</button>'+
          '<button type="button" class="sp-compare-label is-new" data-go-new>New</button>'+
        '</div>'+
        (unlocked ? '' : '<button type="button" class="sp-compare-unlock" data-unlock>Tap to unlock compare</button>')+
      '</div>';

    bindCompare(wrap, item, inLightbox);
    return wrap;
  }

  function bindCompare(wrap, item, inLightbox){
    var axis = wrap.dataset.axis;
    var view = wrap.querySelector('[data-compare-view]');
    var oldLayer = wrap.querySelector('[data-old-layer]');
    var oldImg = oldLayer.querySelector('img');
    var newImg = wrap.querySelector('.sp-compare-new img');
    var handle = wrap.querySelector('[data-handle]');
    var unlockBtn = wrap.querySelector('[data-unlock]');
    var goOldBtn = wrap.querySelector('[data-go-old]');
    var goNewBtn = wrap.querySelector('[data-go-new]');
    var k = keyFor(idx, shot);
    var pos = typeof comparePos[k] === 'number' ? comparePos[k] : 50;
    var active = false;
    var animating = false;
    var moved = false;

    function syncImgSize(){
      if(inLightbox) return;
      var w = view.clientWidth;
      var h = view.clientHeight;
      if(axis === 'x'){
        oldImg.style.width = w + 'px';
        oldImg.style.height = h + 'px';
        oldImg.style.objectFit = 'cover';
        oldImg.style.objectPosition = 'top left';
        newImg.style.width = w + 'px';
        newImg.style.height = h + 'px';
        newImg.style.objectFit = 'cover';
        newImg.style.objectPosition = 'top left';
      } else {
        oldImg.style.width = w + 'px';
        oldImg.style.height = 'auto';
        oldImg.style.minHeight = h + 'px';
        oldImg.style.objectFit = 'cover';
        oldImg.style.objectPosition = 'top center';
        newImg.style.width = w + 'px';
        newImg.style.height = 'auto';
        newImg.style.minHeight = h + 'px';
        newImg.style.objectFit = 'cover';
        newImg.style.objectPosition = 'top center';
      }
    }

    function syncLabels(){
      if(goOldBtn) goOldBtn.classList.toggle('is-on', pos >= 92);
      if(goNewBtn) goNewBtn.classList.toggle('is-on', pos <= 8);
    }

    function setPos(pct, allowFull){
      var min = allowFull ? 0 : 4;
      var max = allowFull ? 100 : 96;
      pos = Math.max(min, Math.min(max, pct));
      comparePos[k] = pos;
      if(axis === 'x'){
        oldLayer.style.width = pos + '%';
        oldLayer.style.height = '100%';
        handle.style.left = pos + '%';
        handle.style.top = '';
      } else {
        oldLayer.style.height = pos + '%';
        oldLayer.style.width = '100%';
        handle.style.top = pos + '%';
        handle.style.left = '';
      }
      syncLabels();
    }

    function animateTo(to){
      unlock();
      animating = true;
      var from = pos;
      var t0 = performance.now();
      function tick(now){
        var t = Math.min(1, (now - t0) / 560);
        var eased = 1 - Math.pow(1 - t, 3);
        setPos(from + (to - from) * eased, true);
        if(t < 1) requestAnimationFrame(tick);
        else animating = false;
      }
      requestAnimationFrame(tick);
    }

    function unlock(){
      compareUnlocked[k] = true;
      view.classList.add('is-unlocked');
      handle.classList.remove('is-nudge');
      if(unlockBtn){
        unlockBtn.remove();
        unlockBtn = null;
      }
      try{ if(navigator.vibrate) navigator.vibrate(12); }catch(e){}
    }

    if(unlockBtn){
      unlockBtn.addEventListener('click', function(e){
        e.stopPropagation();
        unlock();
      });
    }
    if(goOldBtn){
      goOldBtn.addEventListener('click', function(e){
        e.stopPropagation();
        animateTo(100);
      });
    }
    if(goNewBtn){
      goNewBtn.addEventListener('click', function(e){
        e.stopPropagation();
        animateTo(0);
      });
    }

    function pointerPos(e){
      var r = view.getBoundingClientRect();
      if(axis === 'x') return ((e.clientX - r.left) / r.width) * 100;
      return ((e.clientY - r.top) / r.height) * 100;
    }

    /* Only the handle moves the line — scrolling the image/page must not snap it */
    function onHandleDown(e){
      if(e.pointerType === 'mouse' && e.button !== 0) return;
      if(animating) return;
      if(!compareUnlocked[k]) unlock();
      active = true;
      moved = false;
      didSwipe = true;
      view.classList.add('is-dragging');
      handle.classList.remove('is-nudge');
      try{ handle.setPointerCapture(e.pointerId); }catch(err){}
      e.preventDefault();
      e.stopPropagation();
    }
    function onHandleMove(e){
      if(!active) return;
      moved = true;
      setPos(pointerPos(e), true);
    }
    function onHandleUp(){
      if(!active) return;
      active = false;
      view.classList.remove('is-dragging');
      setTimeout(function(){ didSwipe = false; }, 50);
    }

    handle.addEventListener('pointerdown', onHandleDown);
    handle.addEventListener('pointermove', onHandleMove);
    handle.addEventListener('pointerup', onHandleUp);
    handle.addEventListener('pointercancel', onHandleUp);

    /* Unlock on empty tap of the view, but never start a drag from the layers */
    view.addEventListener('pointerdown', function(e){
      if(e.target.closest('[data-handle],[data-unlock],[data-go-old],[data-go-new],.sp-compare-expand')) return;
      if(!compareUnlocked[k] && !inLightbox){
        unlock();
      }
    });

    if(inLightbox){
      var layers = wrap.querySelectorAll('.sp-compare-layer');
      layers.forEach(function(layer){
        layer.addEventListener('scroll', function(){
          var y = layer.scrollTop;
          layers.forEach(function(other){
            if(other !== layer) other.scrollTop = y;
          });
        }, {passive:true});
      });
    }

    setPos(pos, true);
    syncImgSize();
    window.addEventListener('resize', syncImgSize, {passive:true});
    oldImg.addEventListener('load', syncImgSize);
    newImg.addEventListener('load', syncImgSize);
  }

  function slideHtml(item, i){
    var type = item.type || 'frame';
    if(type === 'ph'){
      return '<button type="button" class="sp-slide" data-shot="'+i+'"><div class="sp-ph"><strong>'+esc(item.title||'')+'</strong><span>Coming soon</span></div></button>';
    }
    if(type === 'cover'){
      return '<button type="button" class="sp-slide sp-slide-cover" data-shot="'+i+'" aria-label="Open '+esc(item.title||'')+'">'+
        '<img class="sp-cover-img" src="'+esc(url(item.src))+'" alt="'+esc(item.title||'')+'" draggable="false">'+
      '</button>';
    }
    if(type === 'compare-x' || type === 'compare-y'){
      return '<div class="sp-slide sp-slide-compare" data-shot="'+i+'" data-compare="1"></div>';
    }
    return '<button type="button" class="sp-slide sp-slide-frame" data-shot="'+i+'" aria-label="Open '+esc(item.title||'')+'">'+
      '<div class="sp-frame-card">'+
        '<img src="'+esc(url(item.src))+'" alt="'+esc(item.title||'')+'" draggable="false">'+
      '</div>'+
    '</button>';
  }

  function renderShell(){
    root.innerHTML = ''+
      '<div class="sp-reel'+(solo?' is-solo':'')+'">'+
        (solo ? '<div class="sp-solo-head"><h1 class="sp-solo-title">Spotlight</h1></div>' : '')+
        '<p class="sp-intro">Selected projects from our portfolio</p>'+
        '<div class="sp-nav-wrap"><div class="sp-nav" id="spNav" role="tablist" aria-label="Spotlight projects"></div></div>'+
        '<div class="sp-stage">'+
          '<div class="sp-frame" id="spFrame" role="region" aria-roledescription="carousel" aria-label="Project screens">'+
            '<div class="sp-track" id="spTrack"></div>'+
          '</div>'+
          '<div class="sp-dots" id="spDots"></div>'+
        '</div>'+
        '<div class="sp-info wrap">'+
          '<dl class="sp-meta" id="spMeta"></dl>'+
          '<p class="sp-body" id="spBody"></p>'+
        '</div>'+
      '</div>';
    track = document.getElementById('spTrack');
    frame = document.getElementById('spFrame');
    bindSwipe();
  }

  function renderNav(){
    var nav = document.getElementById('spNav');
    nav.innerHTML = projects.map(function(p, i){
      return '<button type="button" class="sp-nav-btn'+(i===idx?' is-active':'')+'" role="tab" aria-selected="'+(i===idx?'true':'false')+'" data-i="'+i+'">'+esc(p.name)+'</button>';
    }).join('');
    nav.querySelectorAll('.sp-nav-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        var next = Number(btn.getAttribute('data-i'));
        if(next === idx) return;
        idx = next;
        shot = 0;
        renderNav();
        renderShots(true);
        renderInfo();
        var active = nav.querySelector('.sp-nav-btn.is-active');
        if(active && active.scrollIntoView) active.scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'});
      });
    });
  }

  function renderInfo(){
    var p = projects[idx];
    var rows = [
      ['Product type', p.productType],
      ['Industry', p.industry],
      ['Date of work', p.date],
      ['Stage of project', p.stage]
    ];
    document.getElementById('spMeta').innerHTML = rows.map(function(r){
      return '<div class="sp-meta-row"><dt>'+esc(r[0])+'</dt><dd>'+esc(r[1])+'</dd></div>';
    }).join('');
    document.getElementById('spBody').textContent = p.body || '';
  }

  function renderShots(animate){
    var imgs = currentImages();
    track.innerHTML = imgs.map(slideHtml).join('');

    /* mount compare widgets */
    track.querySelectorAll('[data-compare]').forEach(function(slot){
      var i = Number(slot.getAttribute('data-shot'));
      var item = imgs[i];
      slot.innerHTML = '';
      slot.appendChild(buildCompare(item, false));
      /* open lightbox on double intent: long press not needed — button under */
      var openLb = document.createElement('button');
      openLb.type = 'button';
      openLb.className = 'sp-compare-expand';
      openLb.textContent = 'Open full view';
      openLb.addEventListener('click', function(e){
        e.stopPropagation();
        openLightbox(item);
      });
      slot.appendChild(openLb);
    });

    track.querySelectorAll('.sp-slide[data-shot]').forEach(function(btn){
      if(btn.hasAttribute('data-compare')) return;
      btn.addEventListener('click', function(e){
        if(didSwipe){ e.preventDefault(); return; }
        var i = Number(btn.getAttribute('data-shot'));
        openLightbox(imgs[i]);
      });
    });

    var dots = document.getElementById('spDots');
    dots.innerHTML = imgs.map(function(_, i){
      return '<button type="button" class="sp-dot'+(i===shot?' is-on':'')+'" aria-label="Shot '+(i+1)+'" data-s="'+i+'"></button>';
    }).join('');
    dots.querySelectorAll('.sp-dot').forEach(function(d){
      d.addEventListener('click', function(){ goShot(Number(d.getAttribute('data-s'))); });
    });

    if(!animate) track.classList.add('is-dragging');
    applyTransform(0);
    if(!animate) requestAnimationFrame(function(){ track.classList.remove('is-dragging'); });
    frame.setAttribute('aria-label', projects[idx].name + ' screens');
  }

  function applyTransform(extra){
    track.style.transform = 'translate3d('+((-shot * 100) + (extra || 0))+'%,0,0)';
  }

  function goShot(n){
    var max = Math.max(0, currentImages().length - 1);
    shot = Math.max(0, Math.min(max, n));
    applyTransform(0);
    document.querySelectorAll('#spDots .sp-dot').forEach(function(d, i){
      d.classList.toggle('is-on', i === shot);
    });
  }

  function bindSwipe(){
    var threshold = 48;
    function onStart(x){
      dragging = true;
      didSwipe = false;
      startX = x;
      dragX = 0;
      track.classList.add('is-dragging');
    }
    function onMove(x){
      if(!dragging || !frame) return;
      /* don't hijack compare drags */
      if(document.querySelector('.sp-compare-view.is-dragging')) return;
      dragX = x - startX;
      if(Math.abs(dragX) > 12) didSwipe = true;
      applyTransform((dragX / frame.offsetWidth) * 100);
    }
    function onEnd(){
      if(!dragging) return;
      dragging = false;
      track.classList.remove('is-dragging');
      var max = Math.max(0, currentImages().length - 1);
      if(Math.abs(dragX) > threshold){
        didSwipe = true;
        if(dragX < 0 && shot < max) goShot(shot + 1);
        else if(dragX > 0 && shot > 0) goShot(shot - 1);
        else applyTransform(0);
      } else applyTransform(0);
      dragX = 0;
      setTimeout(function(){ didSwipe = false; }, 40);
    }

    frame.addEventListener('pointerdown', function(e){
      if(e.pointerType === 'mouse' && e.button !== 0) return;
      if(e.target.closest('.sp-compare, .sp-compare-expand')) return;
      frame.setPointerCapture(e.pointerId);
      onStart(e.clientX);
    });
    frame.addEventListener('pointermove', function(e){ onMove(e.clientX); });
    frame.addEventListener('pointerup', onEnd);
    frame.addEventListener('pointercancel', onEnd);

    window.addEventListener('keydown', function(e){
      if(document.body.classList.contains('lb-open')) return;
      if(e.key === 'ArrowRight') goShot(shot + 1);
      if(e.key === 'ArrowLeft') goShot(shot - 1);
    });
  }

  /* If google-movie/old.jpg is missing, keep compare but fall back image via onerror */
  renderShell();
  renderNav();
  renderShots(false);
  renderInfo();
})();
