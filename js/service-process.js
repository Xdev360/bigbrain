(function(){
  var root=document.body.getAttribute('data-service')||'brand-identity';

  var DATA={
    'brand-identity':{
      process:{
        title:'From discovery to a new brand in 4 weeks or less.',
        sub:'Find the strongest direction fast, refine it properly, and turn it into a brand system your team can start using.',
        steps:[
          {num:'01',label:'Brand discovery',week:'Week 1',title:'Brand discovery',desc:'We get clear on the company, audience, product, market, competitors, goals, and what the brand needs to make people feel and believe.',outputs:['Brand audit','Competitor review','Brand mood and feeling','Brand sprint priorities'],tones:['#1a1a1a','#2d2d2d','#3a3a3a','#4a4a4a','#555','#666']},
          {num:'02',label:'Style explorations',week:'Week 1–2',title:'Style explorations',desc:'Creative territory, references, tone, and principles are defined before the identity system begins — so every mark has a reason behind it.',outputs:['Mood references','Tone principles','Creative territory','Direction shortlist'],tones:['#222','#333','#444','#555','#666','#777']},
          {num:'03',label:'Brand explorations',week:'Week 2',title:'Brand explorations',desc:'Logo directions, type pairings, and color systems are tested against real use cases — favicon, social, slide cover, and hero section.',outputs:['Logo directions','Type pairings','Color systems','Use-case tests'],tones:['#181818','#282828','#383838','#484848','#585858','#686868']},
          {num:'04',label:'Brand system',week:'Week 2–3',title:'Brand system',desc:'Once the direction is approved, we build the real system: logo, type, colors, icons, graphic language, rules, examples, and practical usage.',outputs:['Logo system','Visual identity','Brand guidelines','Practical usage'],tones:['#111','#222','#333','#444','#555','#666']},
          {num:'05',label:'Brand handoff',week:'Week 3–4',title:'Brand handoff',desc:'Source files, exports, and documentation your team can run with after launch — not a deck that sits unused.',outputs:['Source files','Export packages','Guidelines doc','Handoff notes'],tones:['#1c1c1c','#2c2c2c','#3c3c3c','#4c4c4c','#5c5c5c','#6c6c6c']}
        ]
      },
      includes:{
        title:'A brand is more than a logo that pops.',
        sub:'Identity systems your team can use across your entire digital and physical products.',
        steps:[
          {num:'01',label:'Brand direction',week:'Scope',title:'Brand direction',desc:'Creative direction, references, tone, and principles before the identity system begins.',outputs:['Creative territory','Tone principles','Reference boards','Direction alignment'],tones:['#f4f4f5','#ececee','#e4e4e7','#dcdcdf','#d4d4d8','#cacace']},
          {num:'02',label:'Visual identity',week:'Scope',title:'Visual identity',desc:'Logo usage, typography, colors, layouts, graphic language, and visual rules.',outputs:['Logo suite','Typography','Color palette','Layout rules'],tones:['#efefef','#e8e8e8','#e0e0e0','#d8d8d8','#d0d0d0','#c8c8c8']},
          {num:'03',label:'Brand system',week:'Scope',title:'Brand system',desc:'Reusable rules, examples, and templates so every touchpoint feels consistent.',outputs:['Component rules','Usage examples','Template files','System docs'],tones:['#f2f2f2','#eaeaea','#e2e2e2','#dadada','#d2d2d2','#cacaca']},
          {num:'04',label:'Website application',week:'Scope',title:'Website application',desc:'How the brand shows up across hero sections, product visuals, CTAs, and proof.',outputs:['Hero layouts','Product visuals','CTA styling','Proof sections'],tones:['#f0f0f0','#e8e8ea','#e0e0e4','#d8d8de','#d0d0d8','#c8c8d2']},
          {num:'05',label:'Pitch assets',week:'Scope',title:'Pitch & sales assets',desc:'Decks, one-pagers, investor materials, sales slides, and launch collateral.',outputs:['Pitch decks','One-pagers','Sales slides','Launch collateral'],tones:['#eee','#e6e6e6','#dedede','#d6d6d6','#cecece','#c6c6c6']},
          {num:'06',label:'Social templates',week:'Scope',title:'Social & launch templates',desc:'Reusable assets for announcements, content, hiring, campaigns, and updates.',outputs:['Social templates','Launch assets','Campaign kits','Hiring graphics'],tones:['#f3f3f3','#ebebeb','#e3e3e3','#dbdbdb','#d3d3d3','#cbcbcb']}
        ]
      }
    },
    'website':{
      process:{
        title:'From brief to live site in weeks, not quarters.',
        sub:'Structure the story, design the pages, and ship something your team can update and grow with.',
        steps:[
          {num:'01',label:'Discovery',week:'Week 1',title:'Discovery',desc:'Goals, audience, offer, proof, and the one action the site needs to drive — mapped before any design starts.',outputs:['Goal mapping','Audience notes','Offer clarity','Success metrics'],tones:['#1a1a1a','#2d2d2d','#3a3a3a','#4a4a4a','#555','#666']},
          {num:'02',label:'Structure',week:'Week 1',title:'Structure',desc:'Sitemap, page flow, section order, and messaging hierarchy — every section earns its place.',outputs:['Sitemap','Wireframes','Content plan','Section order'],tones:['#222','#333','#444','#555','#666','#777']},
          {num:'03',label:'Design',week:'Week 2',title:'Design',desc:'Visual direction, responsive layouts, and a component system that holds up on mobile.',outputs:['Visual direction','Page designs','Components','Responsive layouts'],tones:['#181818','#282828','#383838','#484848','#585858','#686868']},
          {num:'04',label:'Build',week:'Week 2–3',title:'Build',desc:'Framer or custom code — whichever ships faster. Implementation matches the design with performance in mind.',outputs:['Front-end build','CMS wiring','Interactions','Content pass'],tones:['#111','#222','#333','#444','#555','#666']},
          {num:'05',label:'Launch',week:'Week 3–4',title:'Launch',desc:'QA across devices, performance pass, deploy, and handoff notes so your team can update after go-live.',outputs:['Cross-device QA','Performance pass','Deployment','Handoff docs'],tones:['#1c1c1c','#2c2c2c','#3c3c3c','#4c4c4c','#5c5c5c','#6c6c6c']}
        ]
      },
      includes:{
        title:'A website is more than a pretty homepage.',
        sub:'Pages, systems, and structure that support business goals — not just aesthetics.',
        steps:[
          {num:'01',label:'Architecture',week:'Scope',title:'Information architecture',desc:'Clear page structure so visitors understand the offer without hunting.',outputs:['Sitemap','Page goals','User paths','Content hierarchy'],tones:['#f4f4f5','#ececee','#e4e4e7','#dcdcdf','#d4d4d8','#cacace']},
          {num:'02',label:'Visual design',week:'Scope',title:'Visual design',desc:'Layout, typography, imagery direction, and responsive page systems.',outputs:['Layout system','Typography','Imagery direction','Responsive pages'],tones:['#efefef','#e8e8e8','#e0e0e0','#d8d8d8','#d0d0d0','#c8c8c8']},
          {num:'03',label:'Conversion',week:'Scope',title:'Conversion structure',desc:'Hero, proof, features, FAQ, and CTA sections that move people forward.',outputs:['Hero sections','Proof blocks','CTA paths','FAQ structure'],tones:['#f2f2f2','#eaeaea','#e2e2e2','#dadada','#d2d2d2','#cacaca']},
          {num:'04',label:'Framer builds',week:'Scope',title:'Framer builds',desc:'Marketing sites in Framer with motion and easy content updates.',outputs:['Framer pages','CMS setup','Motion passes','Publish config'],tones:['#f0f0f0','#e8e8ea','#e0e0e4','#d8d8de','#d0d0d8','#c8c8d2']},
          {num:'05',label:'Custom code',week:'Scope',title:'Custom development',desc:'HTML, CSS, and JS builds when you need full control and performance.',outputs:['Clean markup','Performance','Interactions','Deployment'],tones:['#eee','#e6e6e6','#dedede','#d6d6d6','#cecece','#c6c6c6']},
          {num:'06',label:'Launch support',week:'Scope',title:'Launch support',desc:'Deployment, QA, and handoff so the site goes live cleanly.',outputs:['QA pass','Deploy','Handoff','Update docs'],tones:['#f3f3f3','#ebebeb','#e3e3e3','#dbdbdb','#d3d3d3','#cbcbcb']}
        ]
      }
    },
    'product-design':{
      process:{
        title:'From problem to shipped screens.',
        sub:'Understand the user, map the flows, design the interface, and hand off something engineering can build.',
        steps:[
          {num:'01',label:'Research',week:'Week 1',title:'Research',desc:'Users, jobs-to-be-done, friction points, and success metrics — defined before screens are polished.',outputs:['User interviews','Journey maps','Friction audit','Success metrics'],tones:['#1a1a1a','#2d2d2d','#3a3a3a','#4a4a4a','#555','#666']},
          {num:'02',label:'Flows',week:'Week 1–2',title:'Flows',desc:'User journeys, wireframes, and information hierarchy — the happy path made obvious.',outputs:['User flows','Wireframes','Edge cases','Flow priorities'],tones:['#222','#333','#444','#555','#666','#777']},
          {num:'03',label:'UI design',week:'Week 2',title:'UI design',desc:'Visual system, components, states, and responsive layouts designed with implementation in mind.',outputs:['Screen designs','Components','States','Responsive layouts'],tones:['#181818','#282828','#383838','#484848','#585858','#686868']},
          {num:'04',label:'Prototype',week:'Week 2–3',title:'Prototype',desc:'Interactive flows for testing and stakeholder alignment before development starts.',outputs:['Clickable flows','Test scripts','Stakeholder review','Iteration rounds'],tones:['#111','#222','#333','#444','#555','#666']},
          {num:'05',label:'Handoff',week:'Week 3–4',title:'Handoff',desc:'Organized Figma files, specs, and assets — engineering gets clarity, not guesswork.',outputs:['Figma files','Component library','Specs','Dev support'],tones:['#1c1c1c','#2c2c2c','#3c3c3c','#4c4c4c','#5c5c5c','#6c6c6c']}
        ]
      },
      includes:{
        title:'Product design is more than polished screens.',
        sub:'Research, flows, and systems that reduce friction and help people finish what they started.',
        steps:[
          {num:'01',label:'UX research',week:'Scope',title:'UX research',desc:'Understanding users, context, and the jobs the product needs to do.',outputs:['User research','Context notes','Job mapping','Insights'],tones:['#f4f4f5','#ececee','#e4e4e7','#dcdcdf','#d4d4d8','#cacace']},
          {num:'02',label:'Wireframing',week:'Scope',title:'Wireframing',desc:'Structure and flow before visual polish — get the logic right first.',outputs:['Low-fi flows','Structure maps','Priority screens','Logic checks'],tones:['#efefef','#e8e8e8','#e0e0e0','#d8d8d8','#d0d0d0','#c8c8c8']},
          {num:'03',label:'UI design',week:'Scope',title:'UI design',desc:'Visual language, components, spacing, and interaction patterns.',outputs:['Visual system','Components','Spacing rules','Patterns'],tones:['#f2f2f2','#eaeaea','#e2e2e2','#dadada','#d2d2d2','#cacaca']},
          {num:'04',label:'Prototyping',week:'Scope',title:'Prototyping',desc:'Clickable flows for testing ideas before development starts.',outputs:['Interactive flows','Test plans','Feedback loops','Iterations'],tones:['#f0f0f0','#e8e8ea','#e0e0e4','#d8d8de','#d0d0d8','#c8c8d2']},
          {num:'05',label:'Design systems',week:'Scope',title:'Design systems',desc:'Reusable components so the product stays consistent as it grows.',outputs:['Component library','Usage rules','Documentation','Scale plan'],tones:['#eee','#e6e6e6','#dedede','#d6d6d6','#cecece','#c6c6c6']},
          {num:'06',label:'Dev handoff',week:'Scope',title:'Dev handoff',desc:'Organized Figma files, specs, and support during implementation.',outputs:['Figma handoff','Specs','Asset exports','Build support'],tones:['#f3f3f3','#ebebeb','#e3e3e3','#dbdbdb','#d3d3d3','#cbcbcb']}
        ]
      }
    },
    'development':{
      process:{
        title:'From designs to production in focused sprints.',
        sub:'Scope the build, write clean code, test across devices, and deploy without drama.',
        steps:[
          {num:'01',label:'Scoping',week:'Week 1',title:'Scoping',desc:'Stack, timeline, integrations, and what done looks like — aligned before code is written.',outputs:['Stack plan','Timeline','Integrations','Done criteria'],tones:['#1a1a1a','#2d2d2d','#3a3a3a','#4a4a4a','#555','#666']},
          {num:'02',label:'Setup',week:'Week 1',title:'Setup',desc:'Repo, environment, deployment path, and component structure ready for build.',outputs:['Repo setup','Environment','Deploy path','Structure'],tones:['#222','#333','#444','#555','#666','#777']},
          {num:'03',label:'Build',week:'Week 2',title:'Build',desc:'Responsive implementation, interactions, and CMS wiring where needed.',outputs:['Front-end build','Interactions','CMS wiring','Content pass'],tones:['#181818','#282828','#383838','#484848','#585858','#686868']},
          {num:'04',label:'QA',week:'Week 2–3',title:'QA',desc:'Cross-browser, mobile, performance, and content pass before launch.',outputs:['Browser testing','Mobile QA','Performance','Content review'],tones:['#111','#222','#333','#444','#555','#666']},
          {num:'05',label:'Launch',week:'Week 3',title:'Launch',desc:'Deploy, monitor, and hand off docs so your team can maintain after go-live.',outputs:['Deployment','Monitoring','Handoff docs','Update guide'],tones:['#1c1c1c','#2c2c2c','#3c3c3c','#4c4c4c','#5c5c5c','#6c6c6c']}
        ]
      },
      includes:{
        title:'Development is more than writing code.',
        sub:'Builds that match the design, perform well, and stay maintainable after launch.',
        steps:[
          {num:'01',label:'Front-end',week:'Scope',title:'Front-end builds',desc:'HTML, CSS, and JS — responsive, accessible, and performance-aware.',outputs:['Semantic markup','Responsive CSS','Interactions','Accessibility'],tones:['#f4f4f5','#ececee','#e4e4e7','#dcdcdf','#d4d4d8','#cacace']},
          {num:'02',label:'Framer',week:'Scope',title:'Framer development',desc:'Marketing sites with CMS, motion, and easy updates for your team.',outputs:['Framer build','CMS setup','Motion','Publishing'],tones:['#efefef','#e8e8e8','#e0e0e0','#d8d8d8','#d0d0d0','#c8c8c8']},
          {num:'03',label:'Responsive',week:'Scope',title:'Responsive implementation',desc:'Layouts that hold hierarchy from desktop to mobile.',outputs:['Breakpoints','Mobile layouts','Touch targets','Hierarchy'],tones:['#f2f2f2','#eaeaea','#e2e2e2','#dadada','#d2d2d2','#cacaca']},
          {num:'04',label:'Performance',week:'Scope',title:'Performance',desc:'Fast loads, clean markup, and sensible asset handling.',outputs:['Asset optimization','Load speed','Clean markup','Core metrics'],tones:['#f0f0f0','#e8e8ea','#e0e0e4','#d8d8de','#d0d0d8','#c8c8d2']},
          {num:'05',label:'Deployment',week:'Scope',title:'Deployment',desc:'Vercel, Netlify, Framer publish — whatever fits the project.',outputs:['Deploy config','Domain setup','SSL','Go-live'],tones:['#eee','#e6e6e6','#dedede','#d6d6d6','#cecece','#c6c6c6']},
          {num:'06',label:'Handoff',week:'Scope',title:'Handoff & docs',desc:'So your team knows how to update and maintain after launch.',outputs:['Documentation','Update guide','File structure','Support'],tones:['#f3f3f3','#ebebeb','#e3e3e3','#dbdbdb','#d3d3d3','#cbcbcb']}
        ]
      }
    }
  };

  function buildCover(container,tone,dark){
    if(!container) return;
    container.innerHTML='';
    container.classList.toggle('is-dark',!!dark);
    var cover=document.createElement('div');
    cover.className='sp-panel-cover';
    cover.style.setProperty('--tone',tone||'#333');
    container.appendChild(cover);
  }

  function buildOutputs(list,outputs){
    if(!list) return;
    list.innerHTML='';
    (outputs||[]).forEach(function(item,i){
      var li=document.createElement('li');
      li.innerHTML='<span>'+String(i+1).padStart(2,'0')+'</span>'+item;
      list.appendChild(li);
    });
  }

  function initPanel(panelKey,dark){
    var cfg=DATA[root]&&DATA[root][panelKey];
    if(!cfg) return;

    var wrap=document.querySelector('[data-panel="'+panelKey+'"]');
    if(!wrap) return;

    var tabs=wrap.querySelector('.sp-tablist');
    var week=wrap.querySelector('.sp-panel-week');
    var title=wrap.querySelector('.sp-panel-title');
    var desc=wrap.querySelector('.sp-panel-desc');
    var outputs=wrap.querySelector('.sp-panel-outputs');
    var mosaic=wrap.querySelector('.sp-panel-mosaic');
    var idx=0;

    function render(i){
      var step=cfg.steps[i];
      if(!step) return;
      idx=i;
      if(week) week.textContent=step.week;
      if(title) title.textContent=step.title;
      if(desc) desc.textContent=step.desc;
      buildOutputs(outputs,step.outputs);
      buildCover(mosaic,(step.tones&&step.tones[0])||'#333',dark);
      tabs.querySelectorAll('.sp-tab').forEach(function(tab,j){
        var on=j===i;
        tab.classList.toggle('is-active',on);
        tab.setAttribute('aria-selected',on?'true':'false');
      });
    }

    tabs.innerHTML='';
    cfg.steps.forEach(function(step,i){
      var btn=document.createElement('button');
      btn.type='button';
      btn.className='sp-tab'+(i===0?' is-active':'');
      btn.setAttribute('role','tab');
      btn.setAttribute('aria-selected',i===0?'true':'false');
      btn.innerHTML='<span class="sp-tab-num">'+step.num+'</span><span class="sp-tab-label">'+step.label+'</span>';
      btn.addEventListener('click',function(){render(i);});
      tabs.appendChild(btn);
    });

    render(0);
  }

  initPanel('process',true);
  initPanel('includes',false);
})();
