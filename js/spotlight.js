/* Spotlight reel — mounts into #spotlightRoot (folder page or solo) */
(function(){
  var root = document.getElementById('spotlightRoot');
  if(!root) return;

  function slots(name, notes){
    return notes.map(function(note, i){
      return {
        src: '',
        title: name + ' — ' + (i + 1),
        note: note
      };
    });
  }

  var projects = [
    {
      id: 'google-movie',
      name: 'Google Movie',
      productType: 'Product design / streaming UI',
      industry: 'Entertainment',
      date: '2024',
      stage: 'Completed',
      body: 'Google Movie is a streaming product experience focused on discovery, watchlists, and a clean path from browse to play. The work covers product screens, motion cues, and a visual system that stays quiet while the titles do the talking.',
      images: slots('Google Movie', [
        'Hero and browse — titles lead, chrome stays quiet.',
        'Watchlist — save without breaking the flow.',
        'Detail screen — cast, synopsis, and play in one beat.',
        'Player chrome — controls when you need them.',
        'Search — find a title without noise.',
        'Profile picks — continue watching, made personal.'
      ])
    },
    {
      id: 'rest-jam',
      name: 'Rest Jam',
      productType: 'Brand + product design',
      industry: 'Lifestyle / wellness',
      date: '2024',
      stage: 'Completed',
      body: 'Rest Jam is a calm product and brand system for slowing down without losing clarity. Screens and graphics share one paced rhythm so rest feels intentional, not empty.',
      images: slots('Rest Jam', [
        'Brand mark — rest without looking sleepy.',
        'Home — today’s pace at a glance.',
        'Session start — one clear next step.',
        'Timer — calm motion, no guilt.',
        'Journal — short notes after the jam.',
        'Share kit — graphics that match the product.'
      ])
    },
    {
      id: 'youd-mates',
      name: "You'd Mates",
      productType: 'Social product design',
      industry: 'Social / community',
      date: '2025',
      stage: 'Completed',
      body: "You'd Mates is a social product built around real groups, not endless feeds. The interface keeps hangouts, plans, and shared moments close while cutting the noise that usually kills follow-through.",
      images: slots("You'd Mates", [
        'Group home — who’s in, what’s next.',
        'Plan a hang — date, place, done.',
        'Chat — talk without the feed sprawl.',
        'Moments — shared photos in the group.',
        'Invites — bring people in cleanly.',
        'Settings — privacy without a maze.'
      ])
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

  function esc(s){
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
  }
  function url(src){
    if(!src) return '';
    if(/^https?:\/\//i.test(src)) return src;
    return assetRoot + src.replace(/^\.\//,'');
  }

  function ensureLightbox(){
    if(document.getElementById('shotLightbox')) return;
    var wrap = document.createElement('div');
    wrap.innerHTML = ''+
      '<div class="shot-lightbox" id="shotLightbox" aria-hidden="true">'+
        '<button type="button" class="shot-lb-backdrop" id="shotLbCloseBg" aria-label="Close"></button>'+
        '<div class="shot-lb-panel" role="dialog" aria-modal="true" aria-labelledby="shotLbTitle">'+
          '<button type="button" class="shot-lb-x" id="shotLbClose" aria-label="Close">×</button>'+
          '<div class="shot-lb-media lb-frame-brand" id="shotLbMedia"><img id="shotLbImg" alt=""></div>'+
          '<div class="shot-lb-guide">'+
            '<img class="shot-lb-pfp" src="'+esc(portrait)+'" alt="" width="48" height="48">'+
            '<div class="shot-lb-bubble">'+
              '<p class="shot-lb-name">BigBrain</p>'+
              '<p id="shotLbTitle" class="shot-lb-title"></p>'+
              '<p id="shotLbNote" class="shot-lb-note"></p>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>';
    document.body.appendChild(wrap.firstChild);
  }

  function openLightbox(item){
    ensureLightbox();
    var lb = document.getElementById('shotLightbox');
    var lbMedia = document.getElementById('shotLbMedia');
    var lbImg = document.getElementById('shotLbImg');
    var lbTitle = document.getElementById('shotLbTitle');
    var lbNote = document.getElementById('shotLbNote');
    if(!lb || !lbMedia) return;
    lbMedia.className = 'shot-lb-media lb-frame-brand';
    var src = url(item && item.src);
    if(src){
      lbImg.style.display = '';
      lbImg.src = src;
      lbImg.alt = (item && item.title) || '';
    }else{
      lbImg.removeAttribute('src');
      lbImg.style.display = 'none';
      lbMedia.classList.add('is-empty');
    }
    lbTitle.textContent = (item && item.title) || projects[idx].name;
    lbNote.textContent = (item && item.note) || 'Swipe the strip for more shots from this project.';
    lb.classList.add('is-on');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lb-open');
  }

  function closeLightbox(){
    var lb = document.getElementById('shotLightbox');
    if(!lb) return;
    lb.classList.remove('is-on');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lb-open');
    var lbMedia = document.getElementById('shotLbMedia');
    if(lbMedia) lbMedia.classList.remove('is-empty');
  }

  function bindLightboxChrome(){
    ensureLightbox();
    var closeBtn = document.getElementById('shotLbClose');
    var bg = document.getElementById('shotLbCloseBg');
    if(closeBtn && !closeBtn._spBound){
      closeBtn.addEventListener('click', closeLightbox);
      closeBtn._spBound = true;
    }
    if(bg && !bg._spBound){
      bg.addEventListener('click', closeLightbox);
      bg._spBound = true;
    }
    if(!window._spLbEsc){
      window._spLbEsc = true;
      document.addEventListener('keydown', function(e){
        if(e.key === 'Escape') closeLightbox();
      });
    }
  }

  function renderShell(){
    root.innerHTML = ''+
      '<div class="sp-reel'+(solo?' is-solo':'')+'">'+
        (solo
          ? '<div class="sp-solo-head"><h1 class="sp-solo-title">Spotlight</h1></div>'
          : '')+
        '<p class="sp-intro">Selected projects from our portfolio</p>'+
        '<div class="sp-nav-wrap">'+
          '<div class="sp-nav" id="spNav" role="tablist" aria-label="Spotlight projects"></div>'+
        '</div>'+
        '<div class="sp-stage">'+
          '<div class="sp-frame" id="spFrame" role="region" aria-roledescription="carousel" aria-label="Project screens">'+
            '<div class="sp-track" id="spTrack"></div>'+
          '</div>'+
          '<div class="sp-dots" id="spDots" data-count="0"></div>'+
        '</div>'+
        '<div class="sp-info wrap">'+
          '<dl class="sp-meta" id="spMeta"></dl>'+
          '<p class="sp-body" id="spBody"></p>'+
        '</div>'+
      '</div>';
    track = document.getElementById('spTrack');
    frame = document.getElementById('spFrame');
    bindSwipe();
    bindLightboxChrome();
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
        scrollNavIntoView();
      });
    });
  }

  function scrollNavIntoView(){
    var nav = document.getElementById('spNav');
    var active = nav && nav.querySelector('.sp-nav-btn.is-active');
    if(active && active.scrollIntoView){
      active.scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'});
    }
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

  function currentImages(){
    var p = projects[idx];
    return (p.images && p.images.length) ? p.images : [{ src:'', title:p.name, note:'Screen images coming soon.' }];
  }

  function renderShots(animate){
    var p = projects[idx];
    var imgs = currentImages();
    track.innerHTML = imgs.map(function(item, i){
      var src = url(item.src);
      if(src){
        return '<button type="button" class="sp-slide" data-shot="'+i+'" aria-label="Open '+esc(item.title || p.name)+'">'+
          '<img src="'+esc(src)+'" alt="'+esc(item.title || p.name)+'" draggable="false">'+
        '</button>';
      }
      return '<button type="button" class="sp-slide" data-shot="'+i+'" aria-label="Open '+esc(item.title || p.name)+'">'+
        '<div class="sp-ph"><strong>'+esc(p.name)+'</strong><span>Shot '+(i+1)+' · tap to open</span></div>'+
      '</button>';
    }).join('');

    track.querySelectorAll('.sp-slide').forEach(function(btn){
      btn.addEventListener('click', function(e){
        if(didSwipe){ e.preventDefault(); return; }
        var i = Number(btn.getAttribute('data-shot'));
        openLightbox(imgs[i] || imgs[0]);
      });
    });

    var dots = document.getElementById('spDots');
    var count = imgs.length;
    dots.setAttribute('data-count', String(count));
    dots.innerHTML = imgs.map(function(_, i){
      return '<button type="button" class="sp-dot'+(i===shot?' is-on':'')+'" aria-label="Shot '+(i+1)+'" data-s="'+i+'"></button>';
    }).join('');
    dots.querySelectorAll('.sp-dot').forEach(function(d){
      d.addEventListener('click', function(){
        goShot(Number(d.getAttribute('data-s')));
      });
    });

    if(!animate) track.classList.add('is-dragging');
    applyTransform(0);
    if(!animate){
      requestAnimationFrame(function(){ track.classList.remove('is-dragging'); });
    }
    frame.setAttribute('aria-label', p.name + ' screens');
  }

  function applyTransform(extra){
    var x = (-shot * 100) + (extra || 0);
    track.style.transform = 'translate3d('+x+'%,0,0)';
  }

  function goShot(n){
    var max = Math.max(0, currentImages().length - 1);
    shot = Math.max(0, Math.min(max, n));
    applyTransform(0);
    var dots = document.getElementById('spDots');
    dots.querySelectorAll('.sp-dot').forEach(function(d, i){
      d.classList.toggle('is-on', i === shot);
    });
  }

  function bindSwipe(){
    var threshold = 48;

    function onStart(clientX){
      dragging = true;
      didSwipe = false;
      startX = clientX;
      dragX = 0;
      track.classList.add('is-dragging');
    }
    function onMove(clientX){
      if(!dragging || !frame) return;
      dragX = clientX - startX;
      if(Math.abs(dragX) > 10) didSwipe = true;
      var pct = (dragX / frame.offsetWidth) * 100;
      applyTransform(pct);
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
      } else {
        applyTransform(0);
      }
      dragX = 0;
      setTimeout(function(){ didSwipe = false; }, 40);
    }

    frame.addEventListener('pointerdown', function(e){
      if(e.pointerType === 'mouse' && e.button !== 0) return;
      frame.setPointerCapture(e.pointerId);
      onStart(e.clientX);
    });
    frame.addEventListener('pointermove', function(e){
      onMove(e.clientX);
    });
    frame.addEventListener('pointerup', onEnd);
    frame.addEventListener('pointercancel', onEnd);

    window.addEventListener('keydown', function(e){
      if(document.body.classList.contains('lb-open')) return;
      if(e.key === 'ArrowRight') goShot(shot + 1);
      if(e.key === 'ArrowLeft') goShot(shot - 1);
    });
  }

  renderShell();
  renderNav();
  renderShots(false);
  renderInfo();
})();
