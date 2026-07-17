(function(){
  var params=new URLSearchParams(window.location.search);
  var service=params.get('from')||'brand-identity';
  var num=parseInt(params.get('n'),10)||1;
  if(num<1||num>2) num=1;

  var services={
    'brand-identity':{title:'Brand identity',file:'brand-identity.html'},
    'website':{title:'Website design',file:'website.html'},
    'product-design':{title:'Product design',file:'product-design.html'},
    'development':{title:'Development',file:'development.html'}
  };

  var tones=['#f4f4f5','#ececee','#e8eaef','#e4e4e7'];

  var projects={
    'brand-identity':[
      {
        title:'Northline Demo',sub:'Demo brand system for a B2B SaaS launch',
        role:'Brand designer',timeline:'Jan – Mar 2026 · demo',tools:['Figma','Illustrator','Brand guidelines'],
        tone:'#eef0f4',coverType:'brand',coverMark:'N',
        problem:'The client looked credible in meetings but fragmented everywhere else — deck, site, and product felt like three different companies.',
        solution:'A restrained identity system: one mark, one type pairing, one palette rule-set applied across every touchpoint.',
        study:[
          {num:'01',title:'Discovery & audit',type:'wireframe',noteTone:'warm',desc:'Mapped competitors, audience, and touchpoints before any marks were drawn.',why:'You cannot design a credible system until everyone agrees what the brand must signal — this demo workshop aligned stakeholders first.'},
          {num:'02',title:'Logo explorations',type:'brand',noteTone:'rose',desc:'Three directions tested on favicon, slide cover, social avatar, and product chrome.',why:'Marks that look good on a moodboard often fail at 16px — we tested real constraints, not just large hero views.'},
          {num:'03',title:'Guidelines build',type:'desktop',noteTone:'sky',desc:'Turned the approved direction into logo rules, type pairings, color logic, and usage examples.',why:'A PDF nobody opens is not a system — demo guidelines were built for the team\'s actual weekly tasks.'}
        ],
        metrics:[
          {value:'3',label:'Directions explored (demo)'},
          {value:'1',label:'Final system'},
          {value:'12',label:'Guideline pages'},
          {value:'4 wks',label:'Sprint length'}
        ],
        screenMode:'brand',
        screens:[
          {tone:'#f0f0f0',tor:'Primary mark lockup with clear-space rules — built to work on light headers and dark product UI without a second logo.'},
          {tone:'#ececee',tor:'Color and type scale demo — primary, secondary, and neutral ramps with display + body pairing for web and deck.'},
          {tone:'#e4e4e7',tor:'Application frame — how the identity lands on a pitch cover and social launch template from the same system.'}
        ]
      },
      {
        title:'Hearth Demo',sub:'Demo identity for a consumer product launch',
        role:'Lead designer',timeline:'Apr – Jun 2026 · demo',tools:['Figma','Photoshop','Print specs'],
        tone:'#f6f1ea',coverType:'brand',coverMark:'H',
        problem:'Warmth and trust needed to come through instantly — the old mark felt generic and forgettable.',
        solution:'Approachable palette, soft geometry, and a mark that reads at small sizes without losing character.',
        study:[
          {num:'01',title:'Audience mapping',type:'wireframe',noteTone:'rose',desc:'Demo personas and emotional targets for first-time buyers.',why:'Demo personas and emotional targets for first-time buyers — that constraint shaped this step in the demo sprint.'},
          {num:'02',title:'Visual territory',type:'brand',noteTone:'warm',desc:'Mood boards balancing local feel with premium cues.',why:'Mood boards balancing local feel with premium cues — that constraint shaped this step in the demo sprint.'},
          {num:'03',title:'Launch kit',type:'desktop',noteTone:'sky',desc:'Packaging, social, and hero mockups for go-live.',why:'Packaging, social, and hero mockups for go-live — that constraint shaped this step in the demo sprint.'}
        ],
        metrics:[
          {value:'2',label:'Workshop rounds'},
          {value:'5',label:'Color swatches'},
          {value:'8',label:'Launch assets'},
          {value:'3 wks',label:'Fast sprint'}
        ],
        screenMode:'brand',
        screens:[
          {tone:'#f6f1ea',tor:'Works on light + dark fields. · App store ready.'},
          {tone:'#ece5da',tor:'CMYK specs included. · Hierarchy for shelf scan.'},
          {tone:'#e8dfd3',tor:'Story + feed formats. · Friendly, not childish.'}
        ]
      }
    ],
    'website':[
      {
        title:'Launchpad Demo',sub:'Demo marketing site for a product waitlist',
        role:'Web designer',timeline:'Feb 2026 · demo',tools:['Figma','Framer','Analytics'],
        tone:'#f4f4f5',coverType:'desktop',coverMark:'',
        problem:'Traffic arrived from ads but bounced — visitors could not tell what the product did or why to join the waitlist.',
        solution:'Single-scroll story: problem, proof, offer, FAQ, one CTA repeated with intent.',
        study:[
          {num:'01',title:'Message hierarchy',type:'wireframe',noteTone:'warm',desc:'Demo sitemap — every section tied to one conversion goal.',why:'Demo sitemap — every section tied to one conversion goal — that constraint shaped this step in the demo sprint.'},
          {num:'02',title:'Wireframe pass',type:'desktop',noteTone:'sky',desc:'Desktop-first layout with mobile collapse plan.',why:'Desktop-first layout with mobile collapse plan — that constraint shaped this step in the demo sprint.'},
          {num:'03',title:'Visual design',type:'desktop',noteTone:'rose',desc:'Type, spacing, and CTA styling for trust.',why:'Type, spacing, and CTA styling for trust — that constraint shaped this step in the demo sprint.'}
        ],
        metrics:[
          {value:'1',label:'Primary CTA path'},
          {value:'5',label:'Sections shipped'},
          {value:'1.2s',label:'Load target (demo)'},
          {value:'+28%',label:'Sign-ups (demo)'}
        ],
        screenMode:'desktop',
        screens:[
          {tone:'#f4f4f5',tor:'Offer + social proof in first view. · High contrast, single action.'},
          {tone:'#ececee',tor:'3-up feature blocks. · Benefit-led, not feature-led.'},
          {tone:'#e4e4e7',tor:'FAQ before final CTA. · Legal + secondary links.'}
        ]
      },
      {
        title:'Studio Desk Demo',sub:'Demo agency site with services + work index',
        role:'Web designer',timeline:'Mar 2026 · demo',tools:['Figma','HTML/CSS','CMS'],
        tone:'#f0f0f0',coverType:'desktop',coverMark:'',
        problem:'The old site listed services but never showed outcomes — prospects left without booking a call.',
        solution:'Case-led homepage, clear service lanes, and a contact path visible on every page.',
        study:[
          {num:'01',title:'Content audit',type:'wireframe',noteTone:'rose',desc:'Demo content map — cut pages that duplicated the homepage.',why:'Demo content map — cut pages that duplicated the homepage — that constraint shaped this step in the demo sprint.'},
          {num:'02',title:'Layout system',type:'desktop',noteTone:'warm',desc:'Reusable sections for work, services, and proof.',why:'Reusable sections for work, services, and proof — that constraint shaped this step in the demo sprint.'},
          {num:'03',title:'Responsive build',type:'desktop',noteTone:'sky',desc:'Breakpoints tested on real devices.',why:'Breakpoints tested on real devices — that constraint shaped this step in the demo sprint.'}
        ],
        metrics:[
          {value:'4',label:'Core pages'},
          {value:'6',label:'Reusable sections'},
          {value:'3',label:'CTA placements'},
          {value:'2 wks',label:'Build sprint'}
        ],
        screenMode:'desktop',
        screens:[
          {tone:'#f0f0f0',tor:'Featured cases up front. · Accordion-style lanes.'},
          {tone:'#e8e8e8',tor:'Problem → outcome format. · Wide image slots.'},
          {tone:'#dedede',tor:'Short fields, fast submit. · Response time promise.'}
        ]
      }
    ],
    'product-design':[
      {
        title:'Flow Demo',sub:'Demo mobile app onboarding redesign',
        role:'Product designer',timeline:'Jan 2026 · demo',tools:['Figma','Maze','Prototyping'],
        tone:'#f4f4f5',coverType:'mobile',coverMark:'',
        problem:'68% of demo users abandoned signup before verifying their account — too many fields upfront.',
        solution:'Progressive onboarding: collect email first, verify later, show value before asking for data.',
        study:[
          {num:'01',title:'Drop-off audit',type:'wireframe',noteTone:'rose',desc:'Demo funnel map — where users actually stopped.',why:'Demo funnel map — where users actually stopped — that constraint shaped this step in the demo sprint.'},
          {num:'02',title:'Flow redesign',type:'mobile',noteTone:'warm',desc:'Cut steps from 12 to 4 with clearer progress.',why:'Cut steps from 12 to 4 with clearer progress — that constraint shaped this step in the demo sprint.'},
          {num:'03',title:'UI polish',type:'mobile',noteTone:'sky',desc:'Loading states for slow connections.',why:'Loading states for slow connections — that constraint shaped this step in the demo sprint.'}
        ],
        metrics:[
          {value:'+64%',label:'Sign-up rate (demo)'},
          {value:'12→4',label:'Onboarding steps'},
          {value:'78%',label:'Weekly active (demo)'},
          {value:'3.1m',label:'Avg session (demo)'}
        ],
        screenMode:'mobile',
        screens:[
          {tone:'#f4f4f5',tor:'Email only — no password yet. · Visible step indicator.'},
          {tone:'#ececee',tor:'Guides first action. · 3 tabs max.'},
          {tone:'#e4e4e7',tor:'Price before pay button. · Security badge placement.'}
        ]
      },
      {
        title:'Wallet Demo',sub:'Demo fintech wallet for first-time users',
        role:'Product designer',timeline:'Feb 2026 · demo',tools:['Figma','Research','Design system'],
        tone:'#eef2ff',coverType:'mobile',coverMark:'',
        problem:'Balances and transactions were accurate but unreadable — non-crypto users felt lost immediately.',
        solution:'Plain-language labels, larger type for balances, and transaction cards that scan in under 2 seconds.',
        study:[
          {num:'01',title:'User interviews',type:'wireframe',noteTone:'warm',desc:'Demo research — 6 users, same confusion points.',why:'Demo research — 6 users, same confusion points — that constraint shaped this step in the demo sprint.'},
          {num:'02',title:'Information design',type:'mobile',noteTone:'sky',desc:'Hierarchy: balance → recent → actions.',why:'Hierarchy: balance → recent → actions — that constraint shaped this step in the demo sprint.'},
          {num:'03',title:'Component system',type:'mobile',noteTone:'rose',desc:'Reusable cards for dev handoff.',why:'Reusable cards for dev handoff — that constraint shaped this step in the demo sprint.'}
        ],
        metrics:[
          {value:'-42%',label:'Support tickets (demo)'},
          {value:'2s',label:'Scan time target'},
          {value:'5',label:'Core screens'},
          {value:'1',label:'Design system'}
        ],
        screenMode:'mobile',
        screens:[
          {tone:'#eef2ff',tor:'Large type, plain label. · Send / receive primary.'},
          {tone:'#e0e7ff',tor:'Status + amount aligned. · Plain-language fees.'},
          {tone:'#d4dcff',tor:'Numeric keypad first. · Review before submit.'}
        ]
      }
    ],
    'development':[
      {
        title:'Ship Demo',sub:'Demo conversion landing — HTML/CSS/JS',
        role:'Front-end developer',timeline:'Jan 2026 · demo',tools:['HTML/CSS/JS','Vercel','Lighthouse'],
        tone:'#f4f4f5',coverType:'desktop',coverMark:'',
        problem:'Designs were approved but sat in Figma for weeks — no one owned the build.',
        solution:'Scoped one-week sprint: semantic markup, responsive CSS, deploy to Vercel with performance pass.',
        study:[
          {num:'01',title:'Build scope',type:'wireframe',noteTone:'warm',desc:'Demo ticket list — pages, states, and done criteria.',why:'Demo ticket list — pages, states, and done criteria — that constraint shaped this step in the demo sprint.'},
          {num:'02',title:'Component build',type:'desktop',noteTone:'sky',desc:'Reusable sections matching Figma spacing.',why:'Reusable sections matching Figma spacing — that constraint shaped this step in the demo sprint.'},
          {num:'03',title:'Performance QA',type:'desktop',noteTone:'rose',desc:'Image optimization + lazy load pass.',why:'Image optimization + lazy load pass — that constraint shaped this step in the demo sprint.'}
        ],
        metrics:[
          {value:'1 wk',label:'Build sprint'},
          {value:'96',label:'Lighthouse (demo)'},
          {value:'1',label:'Production deploy'},
          {value:'0',label:'Layout shift target'}
        ],
        screenMode:'desktop',
        screens:[
          {tone:'#f4f4f5',tor:'Proper heading order. · Mobile-first CSS.'},
          {tone:'#ececee',tor:'Hover + focus states. · Accessible labels.'},
          {tone:'#e4e4e7',tor:'Preview + production. · Optimized WebP.'}
        ]
      },
      {
        title:'Framer Demo',sub:'Demo marketing site in Framer CMS',
        role:'Framer developer',timeline:'Feb 2026 · demo',tools:['Framer','CMS','Analytics'],
        tone:'#f0f0f0',coverType:'desktop',coverMark:'',
        problem:'Marketing team could not update the site without a developer — every copy change was a ticket.',
        solution:'Framer CMS collections for blog, team, and case studies with a component library they could edit safely.',
        study:[
          {num:'01',title:'CMS structure',type:'wireframe',noteTone:'sky',desc:'Demo collection schema — fields the team actually needs.',why:'Demo collection schema — fields the team actually needs — that constraint shaped this step in the demo sprint.'},
          {num:'02',title:'Page build',type:'desktop',noteTone:'warm',desc:'Responsive breakpoints + motion pass.',why:'Responsive breakpoints + motion pass — that constraint shaped this step in the demo sprint.'},
          {num:'03',title:'Handoff',type:'desktop',noteTone:'rose',desc:'Loom walkthrough + edit guide for marketing.',why:'Loom walkthrough + edit guide for marketing — that constraint shaped this step in the demo sprint.'}
        ],
        metrics:[
          {value:'3',label:'CMS collections'},
          {value:'8',label:'Page templates'},
          {value:'0',label:'Dev tickets / mo (demo)'},
          {value:'2 wks',label:'Timeline'}
        ],
        screenMode:'desktop',
        screens:[
          {tone:'#f0f0f0',tor:'Editable from Framer. · Scroll reveal pass.'},
          {tone:'#e8e8e8',tor:'Auto-populated cards. · Category tags.'},
          {tone:'#dedede',tor:'Repeatable layout. · Meta fields built in.'}
        ]
      }
    ]
  };

  function studyImage(tone){
    return '<div class="pj-study-img" style="--tone:'+(tone||'#ececee')+';background:'+(tone||'#ececee')+'"></div>';
  }

  function coverImage(tone){
    return '<div class="pj-cover-img" style="--tone:'+(tone||'#ececee')+';background:'+(tone||'#ececee')+'"></div>';
  }

  function tourPitch(text){
    if(!text) return '';
    var t=String(text).replace(/\s+/g,' ').trim();
    var first=t.match(/^[^.!?]+[.!?]/);
    if(first&&first[0].length<=120) return first[0];
    if(t.length<=100) return t;
    var cut=t.slice(0,97);
    var sp=cut.lastIndexOf(' ');
    if(sp>60) cut=cut.slice(0,sp);
    return cut+'…';
  }

  function demoVisual(type,opts){
    opts=opts||{};
    var mark=opts.mark||'';
    if(type==='brand'){
      return '<div class="pj-demo" style="--tone:'+(opts.tone||'#efefef')+'">'+
        '<div class="pj-demo-brand-grid">'+
        '<div class="pj-demo-mark">'+(mark||'Demo')+'</div>'+
        '<div class="pj-demo-swatch" style="background:#111"></div>'+
        '<div class="pj-demo-swatch" style="background:#555"></div>'+
        '<div class="pj-demo-swatch" style="background:#ddd"></div>'+
        '<div class="pj-demo-swatch" style="background:#fafafa"></div>'+
        '</div><span class="pj-demo-label">Demo brand board</span></div>';
    }
    if(type==='mobile'){
      return '<div class="pj-demo" style="--tone:'+(opts.tone||'#efefef')+'">'+
        '<div class="pj-demo-phone"><div class="pj-demo-notch"></div>'+
        '<div class="pj-demo-body"><span class="pj-demo-chip">Demo screen</span>'+
        '<div class="pj-demo-block mid"></div><div class="pj-demo-block tall"></div>'+
        '<div class="pj-demo-block short"></div></div></div>'+
        '<span class="pj-demo-label">Demo mobile UI</span></div>';
    }
    if(type==='wireframe'){
      return '<div class="pj-demo is-sketch" style="--tone:'+(opts.tone||'#fffbeb')+'">'+
        '<div class="pj-demo-body" style="padding:14px">'+
        '<span class="pj-demo-chip">Demo sketch</span>'+
        '<div class="pj-sketch-line"></div><div class="pj-sketch-line w80"></div>'+
        '<div class="pj-sketch-box"></div>'+
        '<div class="pj-sketch-line w60"></div><div class="pj-sketch-line w40"></div>'+
        '</div><span class="pj-demo-label">Wireframe · demo</span></div>';
    }
    return '<div class="pj-demo" style="--tone:'+(opts.tone||'#efefef')+'">'+
      '<div class="pj-demo-bar"><i></i><i></i><i></i></div>'+
      '<div class="pj-demo-body"><span class="pj-demo-chip">Demo desktop</span>'+
      '<div class="pj-demo-block mid"></div><div class="pj-demo-block tall"></div>'+
      '<div class="pj-demo-block short"></div></div>'+
      '<span class="pj-demo-label">Demo browser frame</span></div>';
  }

  function screenFrame(mode,tone,inner){
    var cls='pj-screen-frame is-'+(mode||'desktop');
    return '<div class="'+cls+'" style="--tone:'+tone+'">'+inner+'</div>';
  }

  function screenInner(mode){
    if(mode==='mobile') return demoVisual('mobile',{});
    if(mode==='brand') return demoVisual('brand',{mark:'Demo'});
    return demoVisual('desktop',{});
  }

  var meta=services[service]||services['brand-identity'];
  var list=projects[service]||projects['brand-identity'];
  var p=list[(num-1)%list.length];

  var serviceTags={
    'brand-identity':'Brand identity',
    'website':'Website design',
    'product-design':'Product design',
    'development':'Development'
  };

  p.processIntro=p.processIntro||'Sketches, wireframes, and iterations — hover any step with Tour on and I\'ll explain the reasoning behind each decision.';

  window.__pjProject=p;

  document.title=p.title+' — '+meta.title+' — Oladele Ibraheem';

  var back=document.getElementById('projectBack');
  if(back) back.href=meta.file;
  var serviceLink=document.getElementById('projectServiceLink');
  if(serviceLink) serviceLink.href=meta.file;

  var setText=function(id,val){var el=document.getElementById(id);if(el) el.textContent=val;};
  setText('pjServiceTag',serviceTags[service]||meta.title);
  setText('pjTitle',p.title);
  setText('pjSub',p.sub);
  setText('pjRole',p.role);
  setText('pjTimeline',p.timeline);
  setText('pjProblem',p.problem);
  setText('pjSolution',p.solution);
  setText('pjProcessLead',p.processIntro);

  var cover=document.getElementById('pjCover');
  if(cover){
    cover.style.setProperty('--tone',p.tone);
    cover.innerHTML=coverImage(p.tone);
  }

  function syncHeroHeight(){
    var copy=document.querySelector('.pj-header-copy');
    var heroCover=document.getElementById('pjCover');
    if(!copy||!heroCover||window.innerWidth<=900) return;
    heroCover.style.height=copy.offsetHeight+'px';
  }
  syncHeroHeight();
  window.addEventListener('resize',syncHeroHeight);

  var problemSec=document.querySelector('[data-pj-tour-key="problem"]');
  if(problemSec) problemSec.setAttribute('data-pj-tour-pitch',tourPitch(p.problem));
  var solutionSec=document.querySelector('[data-pj-tour-key="solution"]');
  if(solutionSec) solutionSec.setAttribute('data-pj-tour-pitch',tourPitch(p.solution));
  var impactSec=document.querySelector('[data-pj-tour-key="impact"]');
  if(impactSec){
    impactSec.setAttribute('data-pj-tour-pitch',tourPitch(p.impactPitch||p.metrics.map(function(m){return m.value+' '+m.label;}).join('. ')));
  }

  var tools=document.getElementById('pjTools');
  if(tools){
    tools.innerHTML='';
    p.tools.forEach(function(t){
      var s=document.createElement('span');s.textContent=t;tools.appendChild(s);
    });
  }

  var process=document.getElementById('pjProcess');
  if(process){
    process.innerHTML='';
    p.study.forEach(function(item,i){
      var desc=item.desc||item.note||'Demo process step — replace with your workflow detail.';
      var why=item.why||('Demo rationale for '+item.title.toLowerCase()+'.');
      var card=document.createElement('article');
      card.className='pj-study-card reveal'+(i?' d'+i:'');
      card.setAttribute('data-pj-tour','');
      card.setAttribute('data-pj-tour-key','step-'+i);
      card.setAttribute('data-pj-tour-pitch',tourPitch(why));
      card.innerHTML=
        '<div class="pj-study-head">'+
          '<span class="pj-study-num is-'+item.noteTone+'">'+item.num+'</span>'+
          '<h3 data-pj-tour-anchor>'+item.title+'</h3>'+
          '<p class="pj-study-desc">'+desc+'</p>'+
        '</div>'+
        '<div class="pj-study-visual">'+studyImage(tones[i%4])+'</div>'+
        '<div class="pj-study-why is-'+item.noteTone+'"><em>Why this choice</em><p>'+why+'</p></div>';
      process.appendChild(card);
    });
  }

  var metrics=document.getElementById('pjMetrics');
  if(metrics){
    metrics.innerHTML='';
    p.metrics.forEach(function(m,i){
      var card=document.createElement('div');
      card.className='pj-metric';
      card.setAttribute('data-pj-tour','');
      card.setAttribute('data-pj-tour-key','metric-'+i);
      card.setAttribute('data-pj-tour-pitch',tourPitch(m.value+' '+m.label+' — measurable outcome from this sprint.'));
      card.innerHTML='<strong>'+m.value+'</strong><span>'+m.label+'</span>';
      metrics.appendChild(card);
    });
  }

  var screens=document.getElementById('pjScreens');
  if(screens){
    screens.innerHTML='';
    var mode=p.screenMode||'desktop';
    p.screens.forEach(function(sc,i){
      sc._mode=mode;
      sc._inner=screenInner(mode);
      sc._tor=sc.tor;
      if(!sc._tor&&sc.callouts){
        sc._tor=sc.callouts.map(function(c){return c.b;}).join(' ');
      }
      if(!sc._tor){
        sc._tor='Tor demo: key screen '+(i+1)+' for '+p.title+'. Point out what matters — layout, type, color, or interaction.';
      }
      var btn=document.createElement('button');
      btn.type='button';
      btn.className='pj-screen-btn reveal'+(i?' d'+i:'');
      btn.setAttribute('data-pj-screen',String(i));
      btn.setAttribute('data-pj-tour','');
      btn.setAttribute('data-pj-tour-key','screen-'+i);
      btn.setAttribute('data-pj-tour-pitch',tourPitch(sc._tor));
      btn.innerHTML=screenFrame(mode,sc.tone,sc._inner)+'<span class="pj-screen-expand">Click to expand</span>';
      screens.appendChild(btn);
    });
  }

  if(window.__pjBindScreens) window.__pjBindScreens();
  document.dispatchEvent(new CustomEvent('pj:ready'));
  requestAnimationFrame(function(){
    document.querySelectorAll('.reveal:not(.in)').forEach(function(el){ el.classList.add('in'); });
    syncHeroHeight();
  });
})();
