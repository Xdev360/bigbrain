/* Service page — shows this phase across all 5 projects */
(function(){
  var root = document.getElementById('serviceRoot');
  var id = document.body.getAttribute('data-service');
  if(!root || !id || !window.BB_getService) return;

  var svc = window.BB_getService(id);
  var items = window.BB_projectsForService(id) || [];
  var assetRoot = document.body.getAttribute('data-asset-root') || '../';

  function esc(s){
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
  }

  if(!svc){
    root.innerHTML = '<p class="wrap" style="padding:80px 24px">Service not found.</p>';
    return;
  }

  var cards = items.map(function(item, i){
    var p = item.project;
    var ph = item.phase;
    var href = assetRoot + p.href + '#' + ph.id;
    return ''+
      '<article class="svc-phase-card reveal in" data-guide="'+esc(p.name)+' — '+esc(ph.label)+'." data-guide-pitch="'+esc(ph.pitch)+'">'+
        '<p class="eyebrow">0'+(i+1)+' · '+esc(p.year)+'</p>'+
        '<h3>'+esc(p.name)+'</h3>'+
        '<p class="svc-phase-title">'+esc(ph.title)+'</p>'+
        '<p class="svc-phase-body">'+esc(ph.body)+'</p>'+
        '<a class="svc-phase-link" href="'+esc(href)+'">Open in project folder →</a>'+
      '</article>';
  }).join('');

  var otherServices = (window.BB_SERVICES||[]).filter(function(s){ return s.id !== id; }).map(function(s){
    return '<a href="'+esc(s.id)+'.html">'+esc(s.label)+'</a>';
  }).join('');

  root.innerHTML = ''+
    '<header class="case-bar" id="caseBar">'+
      '<div class="case-bar-in">'+
        '<a href="'+assetRoot+'index.html" class="mark">BigBrain<sup>®</sup></a>'+
        '<a class="case-back" href="'+assetRoot+'index.html#services">← Back to services</a>'+
      '</div>'+
    '</header>'+

    '<section class="svc-page-hero" id="svcHero" data-guide="'+esc(svc.guide)+'" data-guide-pitch="'+esc(svc.pitch)+'">'+
      '<div class="wrap">'+
        '<p class="eyebrow">Service</p>'+
        '<h1>'+esc(svc.label)+'</h1>'+
        '<p class="sub">'+esc(svc.body)+'</p>'+
        '<p class="svc-page-note">Across all five projects — open any card to jump into that phase inside the project folder.</p>'+
      '</div>'+
    '</section>'+

    '<section class="svc-phase-list" id="svcList" data-guide="Every project where this phase shipped." data-guide-pitch="Pick a project — the folder opens on this exact section.">'+
      '<div class="wrap svc-phase-grid">'+cards+'</div>'+
    '</section>'+

    '<section class="svc-other wrap" data-guide="Other services I take on." data-guide-pitch="Same five projects, different lens.">'+
      '<p class="eyebrow">Also look at</p>'+
      '<div class="svc-other-links">'+otherServices+'</div>'+
    '</section>'+

    '<section class="contact case-contact" id="contact" data-guide="Ready to start? Send the brief." data-guide-pitch="If this is the lane you need, let’s talk scope.">'+
      '<div class="wrap">'+
        '<p class="eyebrow reveal">Next</p>'+
        '<h2 class="reveal" style="margin-top:16px">Need this for your product?</h2>'+
        '<div class="contact-actions reveal">'+
          '<a class="btn" href="'+assetRoot+'index.html#custom">Start a project</a>'+
          '<a class="btn btn-outline" href="'+assetRoot+'index.html#work">View all projects</a>'+
        '</div>'+
      '</div>'+
    '</section>';

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
    },{threshold:.12});
    document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  }else{
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
  }

  if(window.BB_rebuildGuide) window.BB_rebuildGuide();
})();
