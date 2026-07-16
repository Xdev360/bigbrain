(function(){
  var buyBase=(window.BIGBRAIN_CONFIG&&window.BIGBRAIN_CONFIG.buyBase)||'https://selar.com/m/xbig-brainnx1';
  var substack=(window.BIGBRAIN_CONFIG&&window.BIGBRAIN_CONFIG.substackUrl)||'https://xbigbrainnx.substack.com';

  var categories=[
    {id:'all',label:'All'},
    {id:'designers',label:'Designers'},
    {id:'developers',label:'Developers'},
    {id:'founders',label:'Founders'},
    {id:'agencies',label:'Agencies'},
    {id:'photographers',label:'Photographers'},
    {id:'product',label:'Product'}
  ];

  var templates=[
    {id:'folio-designer',cat:'designers',title:'Designer Folio',blurb:'Case-study first portfolio',price:'$49',img:'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',buy:buyBase},
    {id:'folio-dev',cat:'developers',title:'Dev Portfolio',blurb:'Projects, stack, contact',price:'$45',img:'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',buy:buyBase},
    {id:'folio-founder',cat:'founders',title:'Founder Site',blurb:'Story, traction, waitlist',price:'$59',img:'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',buy:buyBase},
    {id:'folio-agency',cat:'agencies',title:'Agency Desk',blurb:'Services + selected work',price:'$69',img:'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',buy:buyBase},
    {id:'folio-photo',cat:'photographers',title:'Lens Portfolio',blurb:'Gallery-led, light chrome',price:'$42',img:'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80',buy:buyBase},
    {id:'folio-pm',cat:'product',title:'Product Folio',blurb:'Case narratives for PMs',price:'$48',img:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',buy:buyBase}
  ];

  var equity=[
    {
      id:'wintech-slice',
      title:'Wintech Studio',
      blurb:'5% equity listing — Lagos design & product studio. Review the demo, then inquire off-site.',
      stake:'5% equity',
      img:'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
      demo:'https://xbigbrainnx.substack.com',
      buy:'mailto:ibrahimoladele9@gmail.com?subject=Equity%20inquiry%20—%20Wintech%205%25'
    }
  ];

  var writing=[
    {id:'essays',title:'Essays on Substack',blurb:'Design, shipping, Lagos',price:'Read',img:'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',buy:substack},
    {id:'ebook',title:'E-books',blurb:'Longer downloads via Substack',price:'Buy there',img:'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',buy:substack}
  ];

  var activeCat='all';
  var catsEl=document.getElementById('templateCats');
  var gridEl=document.getElementById('templateGrid');
  var equityEl=document.getElementById('equityGrid');
  var writingEl=document.getElementById('writingGrid');

  function go(url){ window.open(url,'_blank','noopener'); }

  function renderCats(){
    if(!catsEl) return;
    catsEl.innerHTML=categories.map(function(c){
      return '<button class="mp-cat'+(c.id===activeCat?' is-on':'')+'" type="button" data-cat="'+c.id+'">'+c.label+'</button>';
    }).join('');
  }

  function renderTemplates(){
    if(!gridEl) return;
    var list=templates.filter(function(t){return activeCat==='all'||t.cat===activeCat});
    if(!list.length){
      gridEl.innerHTML='<div class="mp-empty"><strong>Quiet shelf</strong><span>No templates in this category yet.</span></div>';
      return;
    }
    gridEl.innerHTML=list.map(function(t){
      return (
        '<a class="mp-product" href="'+t.buy+'" target="_blank" rel="noopener">'+
          '<div class="mp-product-media"><img src="'+t.img+'" alt=""></div>'+
          '<strong>'+t.title+'</strong>'+
          '<span>'+t.blurb+'</span>'+
          '<em>'+t.price+' · Buy →</em>'+
        '</a>'
      );
    }).join('');
  }

  function renderEquity(){
    if(!equityEl) return;
    equityEl.innerHTML=equity.map(function(e){
      return (
        '<article class="mp-equity">'+
          '<img src="'+e.img+'" alt="">'+
          '<div>'+
            '<h3>'+e.title+'</h3>'+
            '<p>'+e.blurb+'</p>'+
            '<p style="margin-top:8px;font-weight:600;color:#0a0a0a">'+e.stake+'</p>'+
          '</div>'+
          '<div class="mp-equity-actions">'+
            '<a class="mp-link" href="'+e.demo+'" target="_blank" rel="noopener">View demo</a>'+
            '<a class="mp-link primary" href="'+e.buy+'">Inquire / buy</a>'+
          '</div>'+
        '</article>'
      );
    }).join('');
  }

  function renderWriting(){
    if(!writingEl) return;
    writingEl.innerHTML=writing.map(function(w){
      return (
        '<a class="mp-product" href="'+w.buy+'" target="_blank" rel="noopener">'+
          '<div class="mp-product-media"><img src="'+w.img+'" alt=""></div>'+
          '<strong>'+w.title+'</strong>'+
          '<span>'+w.blurb+'</span>'+
          '<em>'+w.price+' · Open Substack →</em>'+
        '</a>'
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
  }

  if(catsEl){
    catsEl.addEventListener('click',function(e){
      var btn=e.target.closest('[data-cat]');
      if(!btn) return;
      activeCat=btn.getAttribute('data-cat');
      renderCats();
      renderTemplates();
    });
  }

  document.querySelectorAll('.mp-nav-item[data-view]').forEach(function(btn){
    btn.addEventListener('click',function(){setView(btn.getAttribute('data-view'))});
  });

  renderCats();
  renderTemplates();
  renderEquity();
  renderWriting();

  if(window.XBigX) window.XBigX.bindPanel(document.getElementById('mpAi'));

  var hash=(location.hash||'').replace('#','');
  if(hash && document.querySelector('.mp-panel[data-panel="'+hash+'"]')) setView(hash);
})();
