/* Project folder page — larger cards, straight image rows, pinned context, locked projects */
(function(){
  var root = document.getElementById('projectRoot');
  var id = document.body.getAttribute('data-project');
  if(!root || !id || !window.BB_getProject) return;

  var p = window.BB_getProject(id);
  if(!p){
    root.innerHTML = '<p class="wrap" style="padding:80px 24px">Project not found.</p>';
    return;
  }

  var assetRoot = document.body.getAttribute('data-asset-root') || '../';
  var all = window.BB_PROJECTS || [];
  var nextProj = window.BB_getProject(p.next);
  var portrait = assetRoot + 'assets/portrait.jpg';
  var idx = Math.max(0, all.findIndex(function(x){ return x.id === id; }));
  var isMobile = function(){ return window.matchMedia('(max-width:900px)').matches; };
  var unlockKey = 'bb-unlock-' + id;
  var isUnlocked = !p.locked || sessionStorage.getItem(unlockKey) === '1';

  function esc(s){
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
  }
  function mediaUrl(src){
    if(!src) return '';
    if(/^https?:\/\//i.test(src)) return src;
    return assetRoot + src.replace(/^\.\//,'');
  }

  function folderColors(theme){
    return {
      primary: (theme && (theme.primary || theme.accent)) || '#2F80ED',
      secondary: (theme && (theme.secondary || theme.accentSoft)) || '#7EC8F0'
    };
  }

  function folderMark(theme, logoSrc){
    var c = folderColors(theme);
    var tid = esc((theme && theme.id) || 'x');
    var logo = logoSrc
      ? '<span class="folder-logo-slot is-on"><img src="'+esc(mediaUrl(logoSrc))+'" alt=""></span>'
      : '<span class="folder-logo-slot"></span>';
    return ''+
      '<span class="os-folder" aria-hidden="true">'+
        '<svg class="os-folder-svg" viewBox="0 0 200 158" xmlns="http://www.w3.org/2000/svg">'+
          '<defs>'+
            '<linearGradient id="ff'+tid+'" x1="100" y1="50" x2="100" y2="148" gradientUnits="userSpaceOnUse">'+
              '<stop offset="0%" stop-color="'+c.secondary+'"/>'+
              '<stop offset="100%" stop-color="'+c.secondary+'" stop-opacity=".9"/>'+
            '</linearGradient>'+
            '<linearGradient id="fb'+tid+'" x1="100" y1="22" x2="100" y2="120" gradientUnits="userSpaceOnUse">'+
              '<stop offset="0%" stop-color="'+c.primary+'" stop-opacity=".95"/>'+
              '<stop offset="100%" stop-color="'+c.primary+'"/>'+
            '</linearGradient>'+
            '<filter id="fd'+tid+'" x="-18%" y="-12%" width="136%" height="140%">'+
              '<feDropShadow dx="0" dy="10" stdDeviation="7" flood-color="#000" flood-opacity=".16"/>'+
            '</filter>'+
          '</defs>'+
          '<g filter="url(#fd'+tid+')">'+
            '<path fill="url(#fb'+tid+')" d="M28 38c0-9 7-16 16-16h36c5.2 0 10 2.4 13.2 6.4l8.4 10.4c2.2 2.7 5.5 4.2 9 4.2H156c9 0 16 7 16 16v62c0 9-7 16-16 16H44c-9 0-16-7-16-16V38z"/>'+
            '<path fill="'+c.primary+'" opacity=".4" d="M24 52h152v16H24z"/>'+
            '<path fill="url(#ff'+tid+')" d="M20 56c0-8.5 6.5-15 15-15h130c8.5 0 15 6.5 15 15v70c0 8.5-6.5 15-15 15H35c-8.5 0-15-6.5-15-15V56z"/>'+
            '<path d="M38 118h124" stroke="rgba(0,0,0,.1)" stroke-width="2.2" stroke-linecap="round" fill="none"/>'+
            '<path d="M38 126h124" stroke="rgba(0,0,0,.07)" stroke-width="2" stroke-linecap="round" fill="none"/>'+
          '</g>'+
        '</svg>'+
        logo+
      '</span>';
  }

  function folderCard(proj, isActive){
    var theme = proj.theme || {};
    var locked = !!proj.locked;
    return ''+
      '<article class="folder-card'+(isActive?' is-active':'')+(locked?' is-locked':'')+'" data-folder-id="'+esc(proj.id)+'"'+(isActive?' aria-current="page"':'')+'>'+
        '<button type="button" class="folder-hit" data-go="'+esc(proj.id)+'" aria-label="Open '+esc(proj.name)+(locked?' (locked)':'')+'">'+
          folderMark(theme, proj.logo)+
          (locked ? '<span class="folder-lock-badge" aria-hidden="true">Locked</span>' : '')+
          '<h2 class="folder-title">'+esc(proj.name)+'</h2>'+
        '</button>'+
      '</article>';
  }

  function frameClass(kind){
    if(kind === 'phone') return 'frame-phone';
    if(kind === 'ig') return 'frame-ig';
    if(kind === 'brand') return 'frame-brand';
    if(kind === 'web') return 'frame-web';
    return 'frame-brand';
  }

  function shotThumb(s){
    var src = mediaUrl(s.src);
    var note = s.note || s.t || '';
    var kind = s.kind || 'brand';
    var ph = '<div class="shot-ph"><span>'+esc(s.k)+'</span><strong>'+esc(s.t)+'</strong></div>';
    var img = src
      ? '<img class="shot-img media-fade" src="'+esc(src)+'" alt="'+esc(s.t)+'" loading="lazy" decoding="async" onload="this.classList.add(\'is-loaded\')" onerror="this.classList.add(\'is-loaded\');this.remove();var ph=this.parentNode.querySelector(\'.shot-ph\');if(ph)ph.hidden=false">'+
        '<div class="shot-ph" hidden><span>'+esc(s.k)+'</span><strong>'+esc(s.t)+'</strong></div>'
      : ph;
    return ''+
      '<button type="button" class="shot-tile" data-shot-src="'+esc(src)+'" data-shot-title="'+esc(s.t)+'" data-shot-note="'+esc(note)+'" data-shot-kind="'+esc(kind)+'" aria-label="Open '+esc(s.t)+'">'+
        '<div class="shot-frame '+frameClass(kind)+'">'+img+'</div>'+
      '</button>';
  }

  /* Horizontal image row — scroll drives it right → left (parallax) */
  function phaseRow(shots, phaseId){
    var list = shots || [];
    var tiles = list.map(shotThumb).join('');
    var rowClass = 'phase-row';
    if(phaseId === 'app-design') rowClass += ' phase-row-phones';
    if(phaseId === 'graphic-design') rowClass += ' phase-row-ig';
    if(phaseId === 'brand-identity') rowClass += ' phase-row-brand';
    if(phaseId === 'web-design') rowClass += ' phase-row-web';
    return ''+
      '<div class="phase-row-clip wrap" data-phase-clip>'+
        '<div class="'+rowClass+'" data-phase-row>'+tiles+'</div>'+
      '</div>';
  }

  function viewLiveHtml(){
    var url = (p.liveUrl || '').trim();
    if(url){
      return '<a class="view-live is-live" href="'+esc(url)+'" target="_blank" rel="noopener">View Live</a>';
    }
    return '<span class="view-live is-off" aria-disabled="true">View Live</span>';
  }

  function contextBlock(){
    var cover = mediaUrl(p.cover || p.image || '');
    var about = p.about || p.tagline || '';
    var problem = p.problem || '';
    var solution = p.solution || '';
    var img = cover
      ? '<img src="'+esc(cover)+'" alt="'+esc(p.name)+'" loading="eager" onerror="this.remove();this.parentNode.classList.add(\'is-empty\')">'
      : '';
    return ''+
      '<section class="context-sec" id="context" data-guide="'+esc(p.name)+' — what we were solving." data-guide-pitch="'+esc(about)+'">'+
        '<div class="context-pin wrap" data-context-pin>'+
          '<div class="context-media" data-context-media>'+
            '<div class="context-frame'+(cover?'':' is-empty')+'">'+
              img+
              '<div class="shot-ph"><span>Preview</span><strong>'+esc(p.name)+'</strong></div>'+
            '</div>'+
          '</div>'+
          '<div class="context-copy" data-context-copy>'+
            '<p class="eyebrow">Context</p>'+
            '<h2>About the project</h2>'+
            '<p class="phase-body">'+esc(about)+'</p>'+
            '<div class="context-block">'+
              '<h3>The problem</h3>'+
              '<p>'+esc(problem)+'</p>'+
            '</div>'+
            (solution ? '<div class="context-block"><h3>The solution</h3><p>'+esc(solution)+'</p></div>' : '')+
            '<div class="meta-rows">'+
              '<div class="meta-row"><div class="k">'+(p.role ? 'Role' : 'Product')+'</div><div class="v">'+esc(p.role || p.productType)+'</div></div>'+
              '<div class="meta-row"><div class="k">'+(p.client ? 'Client' : 'Industry')+'</div><div class="v">'+esc(p.client || p.industry)+'</div></div>'+
              '<div class="meta-row"><div class="k">Year</div><div class="v">'+esc(p.year)+'</div></div>'+
              '<div class="meta-row"><div class="k">Live</div><div class="v">'+viewLiveHtml()+'</div></div>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</section>';
  }

  var foldersHtml = all.map(function(proj, i){
    return folderCard(proj, i === idx);
  }).join('');

  var phasesHtml = (p.phases || []).map(function(ph, i){
    return ''+
      '<section class="phase-sec" id="'+esc(ph.id)+'" data-guide="'+esc(ph.guide)+'" data-guide-pitch="'+esc(ph.pitch)+'">'+
        '<div class="phase-pin" data-hscroll>'+
          '<div class="phase-pin-sticky" data-phase-sticky>'+
            '<div class="phase-in wrap">'+
              '<p class="eyebrow">0'+(i+1)+' · '+esc(ph.label)+'</p>'+
              '<h2>'+esc(ph.title)+'</h2>'+
              '<p class="phase-body">'+esc(ph.body)+'</p>'+
            '</div>'+
            phaseRow(ph.shots, ph.id)+
          '</div>'+
        '</div>'+
      '</section>';
  }).join('');

  var metricsHtml = ((p.outcome && p.outcome.metrics) || []).map(function(m){
    return '<div class="outcome-metric reveal"><strong>'+esc(m.value)+'</strong><span>'+esc(m.label)+'</span></div>';
  }).join('');

  var nextHtml = nextProj ? (
    '<section class="next-project">'+
      '<div class="next-project-in">'+
        '<a class="next-project-btn reveal" href="'+esc(nextProj.id)+'.html">Next project <span aria-hidden="true">→</span></a>'+
      '</div>'+
    '</section>'
  ) : '';

  var stickyCtaHtml = (id !== 'spotlight')
    ? '<a class="case-sticky-cta" href="'+assetRoot+'index.html#custom">Start a project</a>'
    : '';

  var soloSpotlight = id === 'spotlight' && (/(?:^\?|&)solo=1(?:&|$)/.test(location.search) || location.hash === '#solo');
  if(soloSpotlight) document.body.classList.add('spotlight-solo');

  var hasPass = !!(p.unlockPassword && String(p.unlockPassword).trim());
  var lockedGateHtml = ''+
    '<section class="phase-sec phase-locked" id="locked">'+
      '<div class="wrap locked-panel">'+
        '<p class="eyebrow">'+(hasPass ? 'Private project' : 'Coming soon')+'</p>'+
        '<h2>'+(hasPass ? 'This project is locked' : esc(p.name)+' is reserved')+'</h2>'+
        '<p class="phase-body">'+esc(p.about || (p.name+' is not open yet.'))+'</p>'+
        (hasPass
          ? '<p class="locked-note">If you were invited, enter the password below. If you need access, request it from BigBrain.</p>'+
            '<form class="locked-form" id="lockedForm">'+
              '<label class="sr-only" for="lockedPass">Password</label>'+
              '<input id="lockedPass" type="password" autocomplete="current-password" placeholder="Enter password" required>'+
              '<button type="submit" class="btn">Unlock project</button>'+
            '</form>'+
            '<p class="locked-err" id="lockedErr" hidden>Wrong password. Request access if you don’t have it.</p>'+
            '<a class="locked-request" href="'+assetRoot+'index.html#custom">Request the password →</a>'
          : '<p class="locked-note">The full case study lands when the brief is ready. Watch this folder.</p>'+
            '<a class="locked-request" href="'+assetRoot+'index.html#custom">Ask about '+esc(p.name)+' →</a>')+
      '</div>'+
    '</section>';

  var spotlightInside = id === 'spotlight'
    ? '<div id="spotlightRoot" class="spotlight-mount"></div>'
    : '';

  var insideHtml = !isUnlocked
    ? (lockedGateHtml + nextHtml)
    : (id === 'spotlight'
      ? spotlightInside
      : (contextBlock() + phasesHtml +
        '<section class="phase-sec phase-outcome" id="outcome" data-guide="'+esc((p.outcome&&p.outcome.guide)||(p.name+' — the punchline.'))+'" data-guide-pitch="'+esc((p.outcome&&p.outcome.pitch)||(p.outcome&&p.outcome.body)||p.about||p.tagline||'')+'">'+
          '<div class="phase-in wrap">'+
            '<p class="eyebrow">Impact</p>'+
            '<h2>'+esc((p.outcome&&p.outcome.title)||'Outcome')+'</h2>'+
            '<p class="phase-body">'+esc((p.outcome&&p.outcome.body)||'')+'</p>'+
            '<div class="outcome-grid">'+metricsHtml+'</div>'+
          '</div>'+
        '</section>' + nextHtml + stickyCtaHtml));

  var foldersOpen = !soloSpotlight && sessionStorage.getItem('bb-folders-open') === '1';

  var folderBlock = soloSpotlight ? '' : (
    '<div class="folder-dock">'+
      '<div class="folder-toggle-row">'+
        '<button type="button" class="folder-toggle" id="folderToggle" aria-expanded="'+(foldersOpen?'true':'false')+'" aria-controls="folderTop" aria-label="'+(foldersOpen?'Collapse folders':'Expand folders')+'">'+
          '<span class="folder-toggle-arrow" aria-hidden="true"></span>'+
        '</button>'+
      '</div>'+
      '<section class="folder-hero" id="folderTop" data-guide="'+esc(p.name)+' is open." data-guide-pitch="'+esc(p.about||p.tagline||'')+'">'+
        '<div class="folder-stage">'+
          '<div class="folder-viewport" id="folderViewport">'+
            '<div class="folder-strip-track" id="folderTrack">'+foldersHtml+'</div>'+
          '</div>'+
        '</div>'+
        '<p class="folder-strip-hint" id="folderHint">Swipe</p>'+
      '</section>'+
    '</div>'
  );

  var topChrome = soloSpotlight
    ? (
      '<nav class="nav nav-spotlight" id="nav">'+
        '<div class="wrap nav-in">'+
          '<a href="'+assetRoot+'index.html" class="mark">BigBrain<sup>®</sup></a>'+
          '<div class="nav-links" id="navLinks">'+
            '<a href="'+assetRoot+'about.html">About</a>'+
            '<a href="'+assetRoot+'index.html#work">Work</a>'+
            '<a href="'+assetRoot+'works/spotlight.html?solo=1" class="is-active" aria-current="page">Spotlight</a>'+
            '<a href="'+assetRoot+'index.html#services">Services</a>'+
            '<a href="'+assetRoot+'index.html#contact">Contact</a>'+
          '</div>'+
          '<button type="button" class="nav-burger" id="navBurger" aria-label="Open menu" aria-expanded="false" aria-controls="navLinks">'+
            '<span></span><span></span><span></span>'+
          '</button>'+
        '</div>'+
      '</nav>'+
      '<div class="nav-dim" id="navDim" aria-hidden="true"></div>'
    )
    : (
      '<header class="case-bar" id="caseBar">'+
        '<div class="case-bar-in">'+
          '<a href="'+assetRoot+'index.html" class="mark">BigBrain<sup>®</sup></a>'+
          '<a class="case-back" href="'+assetRoot+'index.html#work">← Back to work</a>'+
        '</div>'+
      '</header>'
    );

  root.innerHTML = ''+
    topChrome+

    folderBlock+

    '<div class="folder-inside">'+
      insideHtml+
      (soloSpotlight ? '' : (
      '<section class="contact case-contact" id="contact">'+
        '<div class="wrap">'+
          '<p class="eyebrow reveal">Next</p>'+
          '<h2 class="reveal" style="margin-top:16px">Got something to build? <span class="fade">Send it over.</span></h2>'+
          '<div class="contact-actions reveal">'+
            '<a class="btn" href="'+assetRoot+'index.html#custom">Start a project</a>'+
            '<a class="btn btn-outline" href="'+assetRoot+'index.html#work">See all work</a>'+
          '</div>'+
        '</div>'+
      '</section>'
      ))+
    '</div>'+

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

  /* unlock sticky: never make html/body a scroll container on project pages */
  document.documentElement.classList.add('folder-page');
  document.documentElement.style.overflowX = '';
  document.documentElement.style.overflowY = '';
  document.body.style.overflowX = '';
  document.body.style.overflowY = '';
  document.body.classList.add('folder-open');
  document.body.classList.add('is-ready');
  document.body.classList.remove('lb-open');
  if(!soloSpotlight && !foldersOpen) document.body.classList.add('folders-collapsed');
  if(p.theme){
    document.body.setAttribute('data-project-theme', p.theme.id || '');
    document.documentElement.style.setProperty('--project-accent', p.theme.primary || p.theme.accent || '#111');
  }

  function hapticSnap(){
    try{ if(navigator.vibrate) navigator.vibrate([16, 24, 32]); }catch(e){}
  }
  function hapticSoft(){
    try{ if(navigator.vibrate) navigator.vibrate(10); }catch(e){}
  }

  /* ---------- Folder strip: peek neighbors, drag/swipe snap, vibrate only ---------- */
  var track = document.getElementById('folderTrack');
  var viewport = document.getElementById('folderViewport');
  var hint = document.getElementById('folderHint');
  var navigating = false;
  var baseX = 0;
  var dragX = 0;

  function cardStep(){
    var card = track && track.querySelector('.folder-card');
    if(!card) return 240;
    var gap = parseFloat(getComputedStyle(track).gap) || 32;
    return card.offsetWidth + gap;
  }

  function alignX(i){
    var step = cardStep();
    var vw = viewport ? viewport.clientWidth : 0;
    var card = track.querySelector('.folder-card');
    var cw = card ? card.offsetWidth : 220;
    /* center the active folder so left + right peeks stay visible */
    return (vw * 0.5) - (cw * 0.5) - (i * step);
  }

  function paintFolder(animate){
    if(!track) return;
    var cards = track.querySelectorAll('.folder-card');
    cards.forEach(function(card, i){
      var dist = Math.abs(i - idx);
      card.classList.toggle('is-active', i === idx);
      card.classList.toggle('is-near', dist === 1);
      if(i === idx) card.setAttribute('aria-current', 'page');
      else card.removeAttribute('aria-current');
    });
    baseX = alignX(idx);
    dragX = 0;
    if(animate === false) track.style.transition = 'none';
    track.style.transform = 'translate3d('+baseX+'px,0,0)';
    if(animate === false){
      void track.offsetWidth;
      track.style.transition = '';
    }
    if(hint){
      hint.hidden = false;
      hint.textContent = 'Swipe';
    }
  }

  function goProject(i, fromSwipe){
    i = ((i % all.length) + all.length) % all.length;
    if(navigating) return;
    var target = all[i];
    if(!target) return;

    if(target.id === id){
      idx = i;
      paintFolder(true);
      if(fromSwipe) hapticSoft();
      return;
    }

    /* snap the strip first, vibrate, then navigate — only the strip moves */
    idx = i;
    paintFolder(true);
    hapticSnap();
    navigating = true;
    try{ sessionStorage.setItem('bb-folders-open', '1'); }catch(err){}
    setTimeout(function(){
      location.href = target.id + '.html';
    }, 280);
  }

  paintFolder(false);
  window.addEventListener('resize', function(){ paintFolder(false); }, {passive:true});

  if(track){
    track.querySelectorAll('[data-go]').forEach(function(btn){
      btn.addEventListener('click', function(e){
        /* only ignore click if this gesture was a real swipe */
        if(swipedAway){ e.preventDefault(); e.stopPropagation(); return; }
        var go = btn.getAttribute('data-go');
        var i = all.findIndex(function(x){ return x.id === go; });
        if(i < 0) return;
        goProject(i, false);
      });
    });
  }

  /* pointer drag — desktop + mobile, only transforms #folderTrack */
  var dragging = false;
  var startPX = 0;
  var startPY = 0;
  var axis = null; /* 'x' | 'y' */
  var swipedAway = false; /* true only after a real snap swipe */
  var SWIPE_MIN = 42;
  var pointerId = null;

  function onPointerDown(e){
    if(!track || !viewport || navigating || e.button === 2) return;
    /* allow normal clicks on the hit button — only start drag tracking */
    dragging = true;
    swipedAway = false;
    axis = null;
    pointerId = e.pointerId;
    startPX = e.clientX;
    startPY = e.clientY;
    dragX = 0;
  }

  function onPointerMove(e){
    if(!track || !viewport || !dragging || (pointerId !== null && e.pointerId !== pointerId)) return;
    var dx = e.clientX - startPX;
    var dy = e.clientY - startPY;

    if(!axis){
      if(Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      axis = Math.abs(dx) > Math.abs(dy) * 1.15 ? 'x' : 'y';
      if(axis === 'y'){
        dragging = false;
        track.style.transform = 'translate3d('+baseX+'px,0,0)';
        return;
      }
      /* committed horizontal drag — capture so we keep getting moves */
      viewport.classList.add('is-dragging');
      try{ viewport.setPointerCapture(e.pointerId); }catch(err){}
    }
    if(axis !== 'x') return;

    e.preventDefault();
    dragX = dx;
    track.style.transform = 'translate3d('+(baseX + dragX)+'px,0,0)';
  }

  function onPointerUp(e){
    if(!viewport || (pointerId !== null && e.pointerId !== pointerId)) return;
    var dx = dragX;
    var wasX = axis === 'x';
    dragging = false;
    viewport.classList.remove('is-dragging');
    pointerId = null;
    axis = null;
    dragX = 0;

    if(!wasX){
      /* pure click / vertical scroll — leave click handlers alone */
      swipedAway = false;
      return;
    }

    if(Math.abs(dx) < SWIPE_MIN){
      /* small jitter — spring back, still allow the click */
      paintFolder(true);
      swipedAway = false;
      return;
    }

    /* real swipe: snap + navigate, suppress the synthetic click */
    swipedAway = true;
    if(dx < 0) goProject(idx + 1, true);
    else goProject(idx - 1, true);
    setTimeout(function(){ swipedAway = false; }, 120);
  }

  if(viewport && track){
    viewport.addEventListener('pointerdown', onPointerDown);
    viewport.addEventListener('pointermove', onPointerMove, {passive:false});
    viewport.addEventListener('pointerup', onPointerUp);
    viewport.addEventListener('pointercancel', onPointerUp);
  }

  /* ---------- Folder strip collapse / expand ---------- */
  (function(){
    var toggle = document.getElementById('folderToggle');
    var hero = document.getElementById('folderTop');
    if(!toggle || !hero) return;
    toggle.addEventListener('click', function(){
      var closed = document.body.classList.toggle('folders-collapsed');
      toggle.setAttribute('aria-expanded', closed ? 'false' : 'true');
      toggle.setAttribute('aria-label', closed ? 'Expand folders' : 'Collapse folders');
      try{ sessionStorage.setItem('bb-folders-open', closed ? '0' : '1'); }catch(err){}
      if(!closed){
        requestAnimationFrame(function(){ paintFolder(false); });
      }
    });
  })();

  /* ---------- Spotlight solo: homepage-style mobile nav ---------- */
  (function(){
    if(!soloSpotlight) return;
    var burger = document.getElementById('navBurger');
    var links = document.getElementById('navLinks');
    var dim = document.getElementById('navDim');
    if(!burger || !links) return;
    function setOpen(on){
      links.classList.toggle('is-open', on);
      burger.classList.toggle('is-open', on);
      burger.setAttribute('aria-expanded', on ? 'true' : 'false');
      if(dim){
        dim.classList.toggle('is-on', on);
        dim.setAttribute('aria-hidden', on ? 'false' : 'true');
      }
      document.body.classList.toggle('nav-open', on);
    }
    burger.addEventListener('click', function(){ setOpen(!links.classList.contains('is-open')); });
    if(dim) dim.addEventListener('click', function(){ setOpen(false); });
    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ setOpen(false); });
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') setOpen(false);
    });
  })();

  /* ---------- case polish: scroll progress + sticky CTA + media fade ---------- */
  (function(){
    if(document.getElementById('scrollProgress')) return;
    var bar = document.createElement('div');
    bar.id = 'scrollProgress';
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    function update(){
      var doc = document.documentElement;
      var max = Math.max(1, doc.scrollHeight - window.innerHeight);
      var p = Math.min(1, Math.max(0, window.scrollY / max));
      bar.style.transform = 'scaleX(' + p + ')';
      var cta = document.querySelector('.case-sticky-cta');
      if(cta) cta.classList.toggle('is-on', window.scrollY > 420);
    }
    update();
    window.addEventListener('scroll', update, {passive:true});
    window.addEventListener('resize', update, {passive:true});
  })();

  (function(){
    function mark(img){
      if(!img || img.dataset.fadeBound) return;
      img.dataset.fadeBound = '1';
      img.classList.add('media-fade');
      if(img.complete && img.naturalWidth) img.classList.add('is-loaded');
      else{
        img.addEventListener('load', function(){ img.classList.add('is-loaded'); }, {once:true});
        img.addEventListener('error', function(){ img.classList.add('is-loaded'); }, {once:true});
      }
    }
    document.querySelectorAll('img').forEach(mark);
    if('MutationObserver' in window){
      var mo = new MutationObserver(function(list){
        list.forEach(function(m){
          m.addedNodes.forEach(function(n){
            if(n.nodeType !== 1) return;
            if(n.tagName === 'IMG') mark(n);
            else if(n.querySelectorAll) n.querySelectorAll('img').forEach(mark);
          });
        });
      });
      mo.observe(document.documentElement, {childList:true, subtree:true});
    }
  })();

  /* ---------- Locked form ---------- */
  var lockedForm = document.getElementById('lockedForm');
  if(lockedForm){
    lockedForm.addEventListener('submit', function(e){
      e.preventDefault();
      var input = document.getElementById('lockedPass');
      var err = document.getElementById('lockedErr');
      var val = (input && input.value || '').trim();
      var pass = (p.unlockPassword || '').trim();
      if(pass && val.toLowerCase() === pass.toLowerCase()){
        sessionStorage.setItem(unlockKey, '1');
        hapticSnap();
        location.reload();
        return;
      }
      if(err) err.hidden = false;
      try{ if(navigator.vibrate) navigator.vibrate([20,40,20]); }catch(err2){}
    });
  }

  /* ---------- Context: left image sticks, right copy scrolls to its end ---------- */
  (function(){
    var pin = document.querySelector('[data-context-pin]');
    var media = document.querySelector('[data-context-media]');
    var copy = document.querySelector('[data-context-copy]');
    if(!pin || !media || !copy) return;

    function sync(){
      if(isMobile()){
        pin.classList.remove('is-tall');
        return;
      }
      /* pin only when copy is taller than the image */
      pin.classList.toggle('is-tall', copy.offsetHeight > media.offsetHeight + 24);
    }
    window.addEventListener('resize', sync, {passive:true});
    if(window.ResizeObserver){
      var ro = new ResizeObserver(sync);
      ro.observe(copy);
      ro.observe(media);
    }
    sync();
  })();

  /* ---------- Phase rows: desktop scroll parallax; mobile = manual horizontal swipe ---------- */
  (function(){
    var pins = Array.prototype.slice.call(document.querySelectorAll('[data-hscroll]'));
    if(!pins.length) return;

    function setup(pin){
      var sticky = pin.querySelector('[data-phase-sticky]');
      var clip = pin.querySelector('[data-phase-clip]');
      var row = pin.querySelector('[data-phase-row]');
      if(!sticky || !clip || !row) return;
      var metrics = { travel: 0, overflow: 0, stickTop: 88, mobile: false };

      function measure(){
        pin.style.height = '';
        pin.classList.remove('is-scrub');
        if(isMobile()){
          /* native overflow-x swipe — do not drive with page scroll */
          row.style.transform = '';
          metrics = { travel: 0, overflow: 0, stickTop: 88, mobile: true };
          return;
        }
        row.style.transform = 'translate3d(0,0,0)';
        var cs = getComputedStyle(clip);
        var pad = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
        var viewW = Math.max(0, clip.clientWidth - pad);
        var overflow = Math.max(0, row.scrollWidth - viewW);
        var barH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bar-h')) || 68;
        var stickTop = barH + 20;
        var travel = overflow > 8 ? overflow : 0;
        /* fill the viewport while scrubbing so the next section can't scroll in early */
        if(travel > 0){
          pin.classList.add('is-scrub');
          pin.style.height = (sticky.offsetHeight + travel) + 'px';
        }
        metrics = { travel: travel, overflow: overflow, stickTop: stickTop, mobile: false };
      }

      function onScroll(){
        if(metrics.mobile) return;
        if(metrics.overflow <= 8 || metrics.travel <= 0){
          row.style.transform = 'translate3d(0,0,0)';
          return;
        }
        var top = pin.getBoundingClientRect().top;
        var pp = Math.max(0, Math.min(1, (metrics.stickTop - top) / metrics.travel));
        row.style.transform = 'translate3d('+(-pp * metrics.overflow)+'px,0,0)';
      }

      measure();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', function(){ measure(); onScroll(); }, { passive: true });
      if(window.ResizeObserver){
        var ro = new ResizeObserver(function(){ measure(); onScroll(); });
        ro.observe(row);
      }
      onScroll();
    }

    pins.forEach(setup);
  })();

  /* ---------- sticky bar / reveals ---------- */
  var bar = document.getElementById('caseBar');
  if(bar){
    var onBar = function(){ bar.classList.toggle('stuck', window.scrollY > 8); };
    onBar();
    window.addEventListener('scroll', onBar, {passive:true});
  }

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if('IntersectionObserver' in window && !reduced){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    },{threshold:.12, rootMargin:'0px 0px -24px 0px'});
    document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  }else{
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
  }

  /* ---------- lightbox: same image + same frame type, zoomed large ---------- */
  var lb = document.getElementById('shotLightbox');
  var lbMedia = document.getElementById('shotLbMedia');
  var lbImg = document.getElementById('shotLbImg');
  var lbTitle = document.getElementById('shotLbTitle');
  var lbNote = document.getElementById('shotLbNote');
  function openLightbox(btn){
    var src = btn.getAttribute('data-shot-src') || '';
    var title = btn.getAttribute('data-shot-title') || '';
    var note = btn.getAttribute('data-shot-note') || '';
    var kind = btn.getAttribute('data-shot-kind') || 'brand';
    if(kind !== 'web' && kind !== 'ig' && kind !== 'phone' && kind !== 'brand') kind = 'brand';
    lbMedia.className = 'shot-lb-media lb-frame-' + kind;
    if(src){
      lbImg.style.display = '';
      lbImg.src = src;
      lbImg.alt = title;
    }else{
      lbImg.removeAttribute('src');
      lbImg.style.display = 'none';
    }
    lbTitle.textContent = title;
    lbNote.textContent = note;
    lb.classList.add('is-on');
    lb.setAttribute('aria-hidden','false');
    document.body.classList.add('lb-open');
  }
  function closeLightbox(){
    lb.classList.remove('is-on');
    lb.setAttribute('aria-hidden','true');
    document.body.classList.remove('lb-open');
  }
  document.querySelectorAll('.shot-tile').forEach(function(btn){
    btn.addEventListener('click', function(){ openLightbox(btn); });
  });
  document.getElementById('shotLbClose').addEventListener('click', closeLightbox);
  document.getElementById('shotLbCloseBg').addEventListener('click', closeLightbox);
  document.addEventListener('keydown', function(e){
    if(e.key==='Escape' && lb.classList.contains('is-on')) closeLightbox();
  });
})();
