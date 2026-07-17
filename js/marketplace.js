(function(){
  var PRICE='₦35,000';

  /* Portfolio templates — personal sites for people who sell their skill */
  var portfolioCategories=[
    {id:'all',label:'All'},
    {id:'social-media-manager',label:'Social media manager'},
    {id:'content-creator',label:'Content creator / influencer'},
    {id:'graphic-designer',label:'Graphic designer'},
    {id:'frontend-developer',label:'Front-end developer'},
    {id:'ui-designer',label:'UI designer'},
    {id:'copywriter',label:'Copywriter'}
  ];
  var portfolioTemplates=[
    {id:'smm-folio',cat:'social-media-manager',title:'Social Media Manager Portfolio',blurb:'Results-first pages — campaigns, growth numbers, and a booking CTA.',img:'https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&w=800&q=80'},
    {id:'creator-folio',cat:'content-creator',title:'Content Creator / Influencer Portfolio',blurb:'Media kit, audience stats, and brand collab inquiries in one link.',img:'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80'},
    {id:'graphic-folio',cat:'graphic-designer',title:'Graphic Designer Portfolio',blurb:'Gallery-led case studies that let the visuals close the client.',img:'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80'},
    {id:'frontend-folio',cat:'frontend-developer',title:'Front-end Developer Portfolio',blurb:'Projects, stack, live demos, and a hire-me contact flow.',img:'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80'},
    {id:'ui-folio',cat:'ui-designer',title:'UI Designer Portfolio',blurb:'Screen-first case narratives with before/after and process notes.',img:'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80'},
    {id:'copy-folio',cat:'copywriter',title:'Copywriter Portfolio',blurb:'Writing samples, niches, and retainers — built to read fast.',img:'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80'}
  ];

  /* Services templates — storefronts and service pages for businesses */
  var servicesCategories=[
    {id:'all',label:'All'},
    {id:'freelancer',label:'Freelancer service page'},
    {id:'shop',label:'Product seller shop'},
    {id:'restaurant',label:'Restaurant & food vendor'},
    {id:'photography',label:'Photography'},
    {id:'beauty',label:'Barber & beauty studio'},
    {id:'fitness',label:'Fitness coach'},
    {id:'events',label:'Event planner'}
  ];
  var servicesTemplates=[
    {id:'freelancer-svc',cat:'freelancer',title:'General Freelancer Service Page',blurb:'One clean page: what you do, packages, proof, and payment.',img:'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=80'},
    {id:'shop-svc',cat:'shop',title:'Product Seller Shop',blurb:'Product grid, cart-ready listings, and WhatsApp order flow.',img:'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80'},
    {id:'restaurant-svc',cat:'restaurant',title:'Restaurant & Food Vendor',blurb:'Menu, gallery, delivery links, and daily specials made simple.',img:'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'},
    {id:'photo-svc',cat:'photography',title:'Photography Studio',blurb:'Full-bleed galleries, session packages, and booking inquiries.',img:'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80'},
    {id:'beauty-svc',cat:'beauty',title:'Barber & Beauty Studio',blurb:'Services, price list, before/after gallery, and bookings.',img:'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80'},
    {id:'fitness-svc',cat:'fitness',title:'Fitness Coach',blurb:'Programs, transformations, and plan sign-ups that convert.',img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80'},
    {id:'events-svc',cat:'events',title:'Event Planner',blurb:'Portfolio of events, service tiers, and date-availability inquiries.',img:'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80'}
  ];

  var tiers=[
    {name:'Code Only',price:'₦35,000',cadence:'one-time',blurb:'The full template files, yours forever. You host it, you edit it.',feats:['Complete source code','Editable forever','Same-day delivery','Free updates to the template']},
    {name:'Hosted + CRM',price:'₦65,000',cadence:'one-time + ₦4,500/mo',blurb:'We host it and you edit everything from a simple dashboard — no code.',feats:['Free yourname.bigbrain.com subdomain','Live visual editor — text, colors, images','Section management & social links','Mobile preview before publish'],hot:true},
    {name:'Premium',price:'₦9,500',cadence:'per month',blurb:'Everything in Hosted, plus a serious brand presence.',feats:['Custom domain mapping','BigBrain watermark removed','Dark mode toggle','Visitor & click analytics']},
    {name:'Ultra Premium',price:'₦18,000',cadence:'per month',blurb:'Sell products directly from your site.',feats:['Product listings & inventory','Order CRM tracking','Direct bank payouts via Paystack','Everything in Premium']}
  ];

  var allTemplates=portfolioTemplates.concat(servicesTemplates);

  var state={portfolio:'all',services:'all'};

  var els={
    portfolioCats:document.getElementById('portfolioCats'),
    portfolioGrid:document.getElementById('portfolioGrid'),
    servicesCats:document.getElementById('servicesCats'),
    servicesGrid:document.getElementById('servicesGrid'),
    tiers:document.getElementById('mpTiers'),
    app:document.getElementById('mpApp'),
    side:document.getElementById('mpSide'),
    collapse:document.getElementById('mpCollapse'),
    sideUser:document.getElementById('mpSideUser'),
    ai:document.getElementById('mpAi'),
    aiToggle:document.getElementById('mpAskToggle'),
    aiClose:document.getElementById('mpAiClose'),
    preview:document.getElementById('mpPreview'),
    previewClose:document.getElementById('mpPreviewClose'),
    previewImg:document.getElementById('mpPreviewImg'),
    previewTitle:document.getElementById('mpPreviewTitle'),
    previewBlurb:document.getElementById('mpPreviewBlurb'),
    previewPrice:document.getElementById('mpPreviewPrice'),
    previewBuy:document.getElementById('mpPreviewBuy')
  };

  function signupUrl(templateId){
    return 'signup.html'+(templateId?'?template='+encodeURIComponent(templateId):'');
  }

  function renderCats(host, cats, group){
    if(!host) return;
    host.innerHTML=cats.map(function(c){
      return '<button class="mp-cat'+(c.id===state[group]?' is-on':'')+'" type="button" data-cat="'+c.id+'">'+c.label+'</button>';
    }).join('');
  }

  function cardHtml(t){
    return (
      '<article class="mp-product" data-template="'+t.id+'">'+
        '<div class="mp-product-media"><img src="'+t.img+'" alt="" loading="lazy"></div>'+
        '<strong>'+t.title+'</strong>'+
        '<span>'+t.blurb+'</span>'+
        '<div class="mp-product-foot">'+
          '<em>'+PRICE+'</em>'+
          '<div class="mp-product-btns">'+
            '<button class="mp-mini-btn" type="button" data-preview="'+t.id+'">Live preview</button>'+
            '<a class="mp-mini-btn primary" href="'+signupUrl(t.id)+'">Buy</a>'+
          '</div>'+
        '</div>'+
      '</article>'
    );
  }

  function renderGrid(host, list, group){
    if(!host) return;
    var active=state[group];
    var filtered=list.filter(function(t){return active==='all'||t.cat===active});
    if(!filtered.length){
      host.innerHTML='<div class="mp-empty"><strong>Quiet shelf</strong><span>No templates in this category yet.</span></div>';
      return;
    }
    host.innerHTML=filtered.map(cardHtml).join('');
  }

  function renderTiers(){
    if(!els.tiers) return;
    els.tiers.innerHTML=tiers.map(function(t){
      return (
        '<article class="mp-tier'+(t.hot?' is-hot':'')+'">'+
          (t.hot?'<span class="mp-tier-flag">Most popular</span>':'')+
          '<h3>'+t.name+'</h3>'+
          '<p class="mp-tier-price">'+t.price+'<span> '+t.cadence+'</span></p>'+
          '<p class="mp-tier-blurb">'+t.blurb+'</p>'+
          '<ul>'+t.feats.map(function(f){return '<li>'+f+'</li>'}).join('')+'</ul>'+
          '<a class="mp-link'+(t.hot?' primary':'')+'" href="'+signupUrl('')+'">Get started</a>'+
        '</article>'
      );
    }).join('');
  }

  function setView(name){
    document.querySelectorAll('.mp-nav-item[data-view]').forEach(function(b){
      b.classList.toggle('is-active',b.getAttribute('data-view')===name);
    });
    document.querySelectorAll('.mp-panel').forEach(function(p){
      p.hidden=p.getAttribute('data-panel')!==name;
    });
    var main=document.getElementById('mpMain');
    if(main) main.scrollTop=0;
  }

  /* ----- preview modal ----- */
  function openPreview(id){
    var t=allTemplates.find(function(x){return x.id===id});
    if(!t||!els.preview) return;
    els.previewImg.src=t.img;
    els.previewTitle.textContent=t.title;
    els.previewBlurb.textContent=t.blurb+' This is the demo — the full template ships with every section editable.';
    els.previewPrice.textContent=PRICE+' one-time · Code Only';
    els.previewBuy.setAttribute('href',signupUrl(t.id));
    els.preview.classList.add('is-on');
    els.preview.setAttribute('aria-hidden','false');
  }
  function closePreview(){
    if(!els.preview) return;
    els.preview.classList.remove('is-on');
    els.preview.setAttribute('aria-hidden','true');
  }
  if(els.previewClose) els.previewClose.addEventListener('click',closePreview);
  if(els.preview) els.preview.addEventListener('click',function(e){
    if(e.target===els.preview) closePreview();
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){ closePreview(); closeAsk(); }
  });

  /* ----- sidebar collapse ----- */
  var COLLAPSE_KEY='bigbrain-mp-collapsed';
  function setCollapsed(on){
    if(!els.app) return;
    els.app.classList.toggle('is-collapsed',on);
    if(els.collapse){
      els.collapse.setAttribute('aria-label',on?'Expand sidebar':'Collapse sidebar');
      els.collapse.setAttribute('title',on?'Expand sidebar':'Collapse sidebar');
    }
    try{ localStorage.setItem(COLLAPSE_KEY,on?'1':'0'); }catch(e){}
  }
  if(els.collapse){
    els.collapse.addEventListener('click',function(){
      setCollapsed(!els.app.classList.contains('is-collapsed'));
    });
  }
  try{ if(localStorage.getItem(COLLAPSE_KEY)==='1') setCollapsed(true); }catch(e){}

  /* ----- Ask drawer (signed-in only) ----- */
  function signedIn(){
    return !!(window.MPAuth&&window.MPAuth.getUser());
  }
  function openAsk(){
    if(!els.ai) return;
    els.ai.classList.add('is-open');
    els.ai.setAttribute('aria-hidden','false');
    if(els.app) els.app.classList.add('ask-open');
  }
  function closeAsk(){
    if(!els.ai) return;
    els.ai.classList.remove('is-open');
    els.ai.setAttribute('aria-hidden','true');
    if(els.app) els.app.classList.remove('ask-open');
  }
  if(els.aiToggle){
    els.aiToggle.addEventListener('click',function(){
      if(!signedIn()){ location.href=signupUrl(''); return; }
      if(els.ai.classList.contains('is-open')) closeAsk();
      else openAsk();
    });
  }
  if(els.aiClose) els.aiClose.addEventListener('click',closeAsk);

  /* ----- sidebar user area (Serena-style, bottom-left) ----- */
  function renderSideUser(){
    if(!els.sideUser) return;
    var user=window.MPAuth?window.MPAuth.getUser():null;
    if(user){
      els.sideUser.innerHTML=
        '<a class="mp-user" href="account.html" title="My account">'+
          '<span class="mp-user-avatar">'+window.MPAuth.initials(user.name)+'</span>'+
          '<span class="mp-user-meta mp-side-label">'+
            '<strong>'+user.name+'</strong>'+
            '<span>'+user.email+'</span>'+
          '</span>'+
        '</a>';
    }else{
      els.sideUser.innerHTML=
        '<a class="mp-user is-guest" href="signup.html" title="Sign up">'+
          '<span class="mp-user-avatar">'+
            '<svg viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="3.5" fill="none" stroke="currentColor" stroke-width="1.75"/><path d="M5 19.5c1.6-3 4-4.5 7-4.5s5.4 1.5 7 4.5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>'+
          '</span>'+
          '<span class="mp-user-meta mp-side-label">'+
            '<strong>Sign up</strong>'+
            '<span>Create your account</span>'+
          '</span>'+
        '</a>';
    }
  }

  /* ----- events ----- */
  [['portfolioCats','portfolio',portfolioCategories,portfolioTemplates,'portfolioGrid'],
   ['servicesCats','services',servicesCategories,servicesTemplates,'servicesGrid']]
  .forEach(function(cfg){
    var host=els[cfg[0]];
    if(!host) return;
    host.addEventListener('click',function(e){
      var btn=e.target.closest('[data-cat]');
      if(!btn) return;
      state[cfg[1]]=btn.getAttribute('data-cat');
      renderCats(host,cfg[2],cfg[1]);
      renderGrid(els[cfg[4]],cfg[3],cfg[1]);
    });
  });

  document.addEventListener('click',function(e){
    var pv=e.target.closest('[data-preview]');
    if(pv) openPreview(pv.getAttribute('data-preview'));
  });

  document.querySelectorAll('.mp-nav-item[data-view]').forEach(function(btn){
    btn.addEventListener('click',function(){setView(btn.getAttribute('data-view'))});
  });

  renderCats(els.portfolioCats,portfolioCategories,'portfolio');
  renderGrid(els.portfolioGrid,portfolioTemplates,'portfolio');
  renderCats(els.servicesCats,servicesCategories,'services');
  renderGrid(els.servicesGrid,servicesTemplates,'services');
  renderTiers();
  renderSideUser();

  if(window.XBigX) window.XBigX.bindPanel(els.ai);

  var hash=(location.hash||'').replace('#','');
  if(hash==='templates') hash='portfolio';
  if(hash && document.querySelector('.mp-panel[data-panel="'+hash+'"]')) setView(hash);
})();
