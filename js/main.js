/* ---------- Serena-style page preloader ---------- */
(function(){
  try{ if('scrollRestoration' in history) history.scrollRestoration='manual'; }catch(e){}
  window.scrollTo(0,0);

  var el=document.getElementById('preload');
  if(!el) return;
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var done=false;
  function finish(){
    if(done) return;
    done=true;
    el.classList.add('is-done');
    document.body.classList.remove('is-loading');
    window.scrollTo(0,0);
    window.setTimeout(function(){
      if(el.parentNode) el.parentNode.removeChild(el);
      window.scrollTo(0,0);
    },450);
  }
  var wait=reduced ? 200 : 2400;
  var start=performance.now();
  function maybeFinish(){
    var left=wait-(performance.now()-start);
    if(left<=0) finish();
    else window.setTimeout(finish,left);
  }
  if(document.readyState==='complete') maybeFinish();
  else window.addEventListener('load',maybeFinish);
  window.setTimeout(finish,reduced ? 600 : 4000);
  window.addEventListener('pageshow',function(e){
    if(e.persisted) window.scrollTo(0,0);
  });
})();

(function(){
  var nav=document.getElementById('nav');
  var onScroll=function(){nav.classList.toggle('stuck',window.scrollY>10)};
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if('IntersectionObserver' in window && !reduced){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}});
    },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});
  }else{
    document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in')});
  }
})();

/* ---------- mobile nav: burger → X, floating link pills from the right ---------- */
(function(){
  var burger=document.getElementById('navBurger');
  var links=document.getElementById('navLinks');
  var dim=document.getElementById('navDim');
  if(!burger || !links) return;

  function setOpen(on){
    burger.classList.toggle('is-open', on);
    links.classList.toggle('is-open', on);
    links.setAttribute('aria-hidden', on?'false':'true');
    if(on) links.removeAttribute('inert');
    else links.setAttribute('inert','');
    if(dim){
      if(on){
        dim.classList.add('is-on');
        dim.setAttribute('aria-hidden','false');
      }else{
        dim.classList.remove('is-on');
        dim.setAttribute('aria-hidden','true');
      }
    }
    burger.setAttribute('aria-expanded', on?'true':'false');
    burger.setAttribute('aria-label', on?'Close menu':'Open menu');
    document.body.style.overflow=on?'hidden':'';
  }

  function close(){ setOpen(false); }

  /* Start closed — no ghost taps on invisible links */
  setOpen(false);

  burger.addEventListener('click',function(){
    setOpen(!burger.classList.contains('is-open'));
  });
  if(dim) dim.addEventListener('click', close);
  links.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click',function(e){
      if(!links.classList.contains('is-open')){
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      close();
    });
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape') close();
  });
  window.addEventListener('resize',function(){
    if(window.innerWidth>900) close();
  });
})();

/* ---------- hover grid ---------- */
(function(){
  var el=document.getElementById('gridLens');
  if(!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if(!window.matchMedia('(hover: hover)').matches) return;
  var x=0,y=0,queued=false;
  function apply(){
    queued=false;
    el.style.setProperty('--gx',x+'px');
    el.style.setProperty('--gy',y+'px');
  }
  window.addEventListener('pointermove',function(e){
    x=e.clientX;y=e.clientY;
    if(!el.classList.contains('on')) el.classList.add('on');
    if(!queued){queued=true;requestAnimationFrame(apply);}
  },{passive:true});
  document.addEventListener('pointerleave',function(){el.classList.remove('on');});
  window.addEventListener('blur',function(){el.classList.remove('on');});
})();

/* ---------- dither art ---------- */
(function(){
  var COLS=84, ROWS=74;
  var KEY="0123456789abcdefghijklmnopqrstuv";
  var DATA="0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000133444321000000000000000000000000000000000000000000000000000000000000000000000000013468888874310000000000000000000000000000000000000000000000000000000000000000000000136aabbabbcba4100000000000000000000000000000000000000000000000000000000000000000111135cdcejijhebfe41000000000000000000000000000000000000000000000000000000000000001344444bfgnprqqppplle311100000000000000000000000000000000000000000000000000000000001368aa9bighonoopqpqonk8444420000000000000000000000000000000000000000000000000000000148bcdefejhikkkkklmppppcabcb7310000000000000000000000000000000000000000000000000000038cefghjklhegijkjjiijnmfegggfb4100000000000000000000000000000000000000000000000000026cefgikmmgimooppoonnljhiikkjjhc30000000000000000000000000000000000000000000000000014cefgiklohkoqtuuuutsqomlklllllkja2000000000000000000000000000000000000000000000000016egghkmnmjpsvvvvvvvvvuollnllmnmlj400000000000000000000000000000000000000000000000002aghhilnqjosvvvvvvvvvvvunlloklnoond20000000000000000000000000000000000000000000000002bhihjlprlpuvvvvvvvvvvvvtlknnlopqpk300000000000000000000000000000000000000000000000026hkjjlqmoqvvvvvvvvvvvvuvrlkpnpqrrl300000000000000000000000000000000000000000000000014akklnhmruuuvvvvvvvvvvvuvojnrpqrrh3000000000000000000000000000000000000000000000000038ilmliruvuuuvvvvvvvvvvvvtkmsrsto5200000000000000000000000000000000000000000000000024cfhijlsvustuuuttvustuvvuukmronnj720000000000000000000000000000000000000000000000027efgiljosvrnqttnlournotvvuvknskkji92000000000000000000000000000000000000000000000015efghkniptva7lrokltuomnquuuulprjlmmlg30000000000000000000000000000000000000000000002bfggiloiqut22frkkottompntuuumrojknoonf2000000000000000000000000000000000000000000003eghhiloiqun12frjkntsompnttuulpnjknoppn4000000000000000000000000000000000000000000004fghhjlojruqmggrklntromnptttumlpjknppqpb100000000000000000000000000000000000000000014ghhhjlnjruukojsrqrurqmpsttuunkrlkmpqqpg200000000000000000000000000000000000000000015ghhhjmnjruuloptuuuuttrsuttqsnlsnknpqqpj200000000000000000000000000000000000000000015giihjlokruunntuuvvvvuuuuttoplmsnknpqrqj200000000000000000000000000000000000000000004giiijmpjruuqkruuvvvvvvvutsqrkntmlopqrqi200000000000000000000000000000000000000000003fiijknojquvtomqtuvvvvvuuspsqkotlmopqrpc100000000000000000000000000000000000000000002bjjklnojquvssploqsttutsrpruokqtmnpqqqn40000000000000000000000000000000000000000000014gkllnnkptvtkoronooopppprtullrtopqqqn9200000000000000000000000000000000000000000000138kmnoqlosvvmjkorrrqqrrqpusjotsstsrog3000000000000000000000000000000000000000000000248knoooklruvtkjjklnoonnnsvnkqqoqrssm7310000000000000000000000000000000000000000000138afjjkklkptvvsljllmnnnnrusjnslmoqrrpi63000000000000000000000000000000000000000000134dfhiiijlmnrvvvuqmmnonptvullqqkmopqrrqlb200000000000000000000000000000000000000002486ghhihijmplorvvvvvuuuuvvunjpsmlmopqrrqof321000000000000000000000000000000000000014didgijjjjknpnloquvvvvvvvvtnjorqmnnpqqrrqpkfb410000000000000000000000000000000000003bgiljjkkkklnpqmmnorsuvvusokkortnnnoprrrrqrqnng20000000000000000000000000000000000116iihlmklmmmmooqpnmnnnnmmlnlnpssprqpprrrrrrtrqqp90000000000000000000000000000000013458jliioklmnmopqrnpqonnnlmnqprsqnpssrstttttutsrrse200000000000000000000000000000027dfgiknjimoooppqpomjlqrrrqpqrttqnmmpqstqsrqrtussstnb4320000000000000000000000000003bfghijlmlijmlmnnlkkkjknpqqqoqpromlkmoqqsprpqrutsqspmkihc410000000000000000000000002bgghhikkmmhijljmknlkjijlnnnommlplkklmopqrqporttsrqrnllllljb2000000000000000000000018ghhhijklmmiiijkjkkkjiijlmmmnkllpkklmnoppqqppsttsrrqnmlmmnnmc10000000000000000000003fhhiijkmlnnjiijmjjiiiiiklmmmmkllqlllmnoppqrqrttsrrrpnnnnoooon9100000000000000000000ahijjjlmopnnkiijlmkjjijjkllmmmkllqmmmnoopqrrrttsrrrspoooopppppm300000000000000000001fijkjjmnpqopkjiijmmllkkkllmmmmkmlqnmnoopqrrsturqqrrsqpqqroopqqpe0000000000000000000275bfhiknrqpnlkjiijnmlmllllmmmmkmmqnnoopqrrrttrpqqrstrrqpnoprsrqm100000000000000000025cfghikknppomlkiiijmlmmmmmmmmmmnnqonoppqrsttpppqrsttsqoonllloqro3000000000000000003adfghhijllmnpomljiijjnmmmmmmmmmlmmqoooqqrstroooqrsstutpmljjjiigac300000000000000002ggiiiiijlmknmppnmljjjjkoonnnmmmnlnnroopqqstqnnopqrsturnllkkjjjjjia300000000000000008gihhijjjnknonopqnmljjkkmqonnmmmnlnnrppqqstqnmnoqrsttsnllkkkkkkklllg4000000000000003fhhhiiimlokpmqoprqnmlkkklorooonnomnnrqqrrttmnnoprstttomlkkkllkllmmnni300000000000008ghghiijnjokpmrnprsqonmlklornmkklmmnopqppppoonopqsttupmlkkkklllnmooooog2000000000002efgghjkmokmnnoonqqstqonmmmopomklnmlmomponomptopqstturmlkkklmnlmnnpnnnoo7000000000003egimnnnonnlomqlqpqrtuqponoppojjkpkkmplpplpnlurrsttuuolklnnnnokmonnnoponl100000000004hjlmooppnomooooqoqqrtplnppppmiikqjloompqloplttttuuvrmllnnnnnonqrrssrrrql300000000004ieghilmooppqpnpopoqstoommnpomjjlqjmollopmoomtuuuuttollmmmnomnnnmmljlorro4000000000047dghlkjllnopoonppprrolmnoommnlmnoknollooonmquvvutrrollnnnnmlkkljjkkkkjlpb00000000014cghhjijjjkmnooooorrqkkllnmmmlmnoplprmnppoqstuuutrqqplmnmmllkkkkjjkkkkjf640000000014cgghihjijjkklnmnnsttmjjkkmlllkkknnoqplqpnnststtsrppqqonmmllkkkkkjkklklllj7100000003cfgggiiijjklkmnnooptpkjjjkkklllljkmnnonmlmqssstsqpopqqromlllkkkjjkklkllmnnl91000001afgghhhiijkljlmonoopqsmjiijjkklmlkkllmmmmnprrrtsqppppqqrpmllkkkkkjkllllmnnool7000004efggghhijjlklmmoonppqsrkjiijjjkkklkkmmnnopprrqsspppppqrsolllkkkkkkklllmmnooook30001bfgggghhjjkllmmnoooqqrstnjjjjjjkkkllmnnooooprrqrsppppqqrrmllkkjjlklkllmnnnooppnc0002dfgghhijkkllmnnnoppqqrstpkjjjjjklllmmnoooopqrporspppqqrrqmlkkkjklmkkllnnooooppok2004egghiijjkklmmnoopppqrrstsmkkkkkkmlmmlnnoppppponrspqqqqrspmlklklllmklnmmnoooppppn4008fghiiikjklmnoppppqqqrstttomlllllnnlllnnnoppppprssqrqsqrtpnlllllllllmmmnnoopppppoc00bfhhhiijlmoqqqrssrrqrrsttuqnmmmmmlqnnmopqqrqpospqsqrqsqrtonmloonnnnnnnnnnoopppppnh01cfhhjkmopppmkklnprrrrsttuuronnnnnlppmnpponnmmrqmstqrrtrstpnmorqqqrrrrqqqqqqpppppol11cfiklmmllkjjjjjkmnoprtuuuvtqooooommpomnonmmnqrmqttqrrsstuqnnponnnmllmnooppqppponol10cfjjijjjiiiiijkllnnooqsuvvurqpooonnnpnnnmnppqoqstsrrtstuutommlllkkkkkklllnpqqpnnnl10cfihhhhhhiiijjkllmnooppsvvvtrrrqpppqqonnpsqqrrrsttttuuuuvtnmlllkkkkkkllmllnnoqqplk008egegghhhiijjkllnnnppqprtvuronnooqpqrrrqsttttttuuuuutttttpnmlkkkkkkklllmmmnnonpole003bdfgghhiiijklmmpnpqrrqttuutrpppoooooopqrttssssstssstrsssnmllkkjkkkllmnnnoopppomm30";

  var cv=document.getElementById('dither');
  var real=document.getElementById('real');
  var ctx=cv.getContext('2d');
  var n=COLS*ROWS;
  var val=new Float32Array(n), rnd=new Float32Array(n), stagger=new Float32Array(n);
  for(var i=0;i<n;i++){
    val[i]=KEY.indexOf(DATA.charAt(i))/31;
    rnd[i]=Math.random();
    stagger[i]=0;
  }

  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CYCLE=6400, SIGMA=ROWS*0.15, REVEAL_DUR=3000, FLIP_SLICE=0.038;
  var cell=1, dpr=1, t0=0, visible=true;
  var inner=document.getElementById('artInner');
  var revealT=0, revealGoal=0, revealFrom=0, revealStart=null;
  var locked=false, originPxX=0, originPxY=0;
  var portrait=new Image(), portraitReady=false;
  if(real){
    portrait.onload=function(){ portraitReady=true; };
    portrait.src=real.currentSrc||real.src;
    if(portrait.complete && portrait.naturalWidth) portraitReady=true;
  }

  function ease(t){ return t<0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2; }
  function smooth(t){ return t*t*(3-2*t); }
  function clamp(v,a,b){ return v<a?a:v>b?b:v; }

  function setOriginFromEvent(e){
    var r=inner.getBoundingClientRect();
    originPxX=e.clientX-r.left;
    originPxY=e.clientY-r.top;
    var ox=(originPxX/r.width)*COLS;
    var oy=(originPxY/r.height)*ROWS;
    var maxD=0;
    for(var i=0;i<n;i++){
      var x=i%COLS,y=(i/COLS)|0;
      var d=Math.hypot(x-ox,y-oy);
      if(d>maxD) maxD=d;
    }
    for(var i=0;i<n;i++){
      var x=i%COLS,y=(i/COLS)|0;
      stagger[i]=(Math.hypot(x-ox,y-oy)/maxD)*(1-FLIP_SLICE);
    }
  }

  function clearRealMask(){
    if(!real) return;
    real.style.opacity='';
    real.style.maskImage='';
    real.style.webkitMaskImage='';
  }

  function setRevealGoal(goal){
    revealFrom=revealT;
    revealGoal=goal;
    revealStart=performance.now();
    inner.classList.toggle('locked-reveal',locked);
    inner.classList.remove('lens');
    if(goal<0.5) inner.classList.remove('full-reveal');
    clearRealMask();
  }

  function updateReveal(now){
    if(revealStart===null) return;
    var p=clamp((now-revealStart)/REVEAL_DUR,0,1);
    revealT=revealFrom+(revealGoal-revealFrom)*ease(p);
    if(p>=1){
      revealT=revealGoal;
      revealStart=null;
    }
  }

  function cellProgress(i){
    if(revealT<=0) return 0;
    if(revealT>=1) return 1;
    return smooth(clamp((revealT-stagger[i])/FLIP_SLICE,0,1));
  }

  function drawImageTile(x,y){
    if(!portraitReady) return;
    var iw=portrait.width, ih=portrait.height;
    ctx.globalAlpha=1;
    ctx.drawImage(
      portrait,
      x*iw/COLS, y*ih/ROWS, iw/COLS, ih/ROWS,
      x*cell, y*cell, cell, cell
    );
  }

  function drawSquare(x,y,v,infl,r,ox,oy,boost){
    var vv=v;
    if(infl>0.004) vv=v*(1-infl*(0.18+0.9*r));
    if(boost>0) vv=Math.min(1.35,vv*(1+boost*0.55));
    if(vv<0.04) return;
    var s=Math.pow(vv,0.82)*cell*0.94*(1+(boost||0)*0.35);
    ctx.globalAlpha=Math.min(1,0.22+0.78*vv);
    ctx.fillStyle='#101010';
    ctx.fillRect(
      x*cell+(cell-s)/2+(ox||0),
      y*cell+(cell-s)/2+(oy||0),
      s,s
    );
  }

  function drawFlip(x,y,v,p){
    var cx=x*cell+cell*0.5, cy=y*cell+cell*0.5;
    var scaleX=p<0.5 ? 1-p*2 : (p-0.5)*2;
    scaleX=Math.max(scaleX,0.04);
    ctx.save();
    ctx.translate(cx,cy);
    ctx.scale(scaleX,1);
    if(p<0.5){
      if(v>=0.03){
        var s=Math.pow(v,0.82)*cell*0.94;
        ctx.globalAlpha=0.22+0.78*v;
        ctx.fillStyle='#101010';
        ctx.fillRect(-s*0.5,-s*0.5,s,s);
      }
    }else if(portraitReady){
      var iw=portrait.width, ih=portrait.height;
      ctx.globalAlpha=1;
      ctx.drawImage(
        portrait,
        x*iw/COLS, y*ih/ROWS, iw/COLS, ih/ROWS,
        -cell*0.5, -cell*0.5, cell, cell
      );
    }
    ctx.restore();
  }

  function size(){
    var w=cv.clientWidth||520;
    var h=w*ROWS/COLS;
    dpr=Math.min(window.devicePixelRatio||1,2);
    cv.style.height=h+'px';
    cv.width=Math.round(w*dpr); cv.height=Math.round(h*dpr);
    cell=(w/COLS)*dpr;
  }

  function paint(now){
    updateReveal(now);
    ctx.clearRect(0,0,cv.width,cv.height);

    if(revealT>=1 && portraitReady){
      ctx.drawImage(portrait,0,0,cv.width,cv.height);
      return;
    }

    var revealing=revealT>0 || revealStart!==null;
    /* when tour music is on, kill the upward wave — particles hit with the bass instead */
    var bass=window.__guideBass||0;
    var hit=window.__guideBassHit||0;
    var bassMode=!reduced && !revealing && bass>0.03;
    var wave = (reduced || revealing || bassMode) ? -999 : (1.4 - 2.8*(((now-t0)%CYCLE)/CYCLE))*ROWS;
    ctx.fillStyle='#101010';

    for(var y=0;y<ROWS;y++){
      var d=(y-wave)/SIGMA, infl = (!bassMode && d>-3.2&&d<3.2) ? Math.exp(-d*d) : 0;
      for(var x=0;x<COLS;x++){
        var i=y*COLS+x, v=val[i];
        var p=cellProgress(i);

        if(p>=1){
          drawImageTile(x,y);
        }else if(p>0){
          drawFlip(x,y,v,p);
        }else if(v>=0.03){
          var ox=0,oy=0,boost=0;
          if(bassMode){
            /* light hit vibration — follows the beat up and down, never locks loud */
            var punch=Math.min(0.7,bass*0.55+hit*0.45);
            var rx=rnd[i]*2-1;
            var ry=rnd[(i*13+7)%n]*2-1;
            ox=rx*punch*cell*1.35;
            oy=ry*punch*cell*1.35;
            boost=punch*0.55;
          }
          drawSquare(x,y,v,infl,rnd[i],ox,oy,boost);
        }
      }
    }
    ctx.globalAlpha=1;
  }

  function loop(now){
    if(!t0)t0=now;
    if(visible) paint(now);
    if(!reduced) requestAnimationFrame(loop);
  }

  size(); requestAnimationFrame(loop);
  var rt;
  window.addEventListener('resize',function(){
    clearTimeout(rt); rt=setTimeout(function(){size(); if(reduced) paint(performance.now());},150);
  });

  if('IntersectionObserver' in window){
    new IntersectionObserver(function(e){visible=e[0].isIntersecting;},{threshold:0}).observe(cv);
  }

  /* click: reveal radiates from click point; hover: original lens peek */
  inner.addEventListener('click',function(e){
    setOriginFromEvent(e);
    locked=!locked;
    if(reduced){
      revealT=locked?1:0;
      revealGoal=revealT;
      revealStart=null;
      inner.classList.toggle('locked-reveal',locked);
      inner.classList.remove('full-reveal','lens');
      clearRealMask();
      paint(performance.now());
      return;
    }
    setRevealGoal(locked?1:0);
  });
  inner.addEventListener('keydown',function(e){
    if(e.key==='Enter' || e.key===' '){
      e.preventDefault();
      var r=inner.getBoundingClientRect();
      setOriginFromEvent({clientX:r.left+r.width/2,clientY:r.top+r.height/2});
      locked=!locked;
      if(reduced){
        revealT=locked?1:0;
        revealGoal=revealT;
        revealStart=null;
        inner.classList.toggle('locked-reveal',locked);
        inner.classList.remove('full-reveal');
        paint(performance.now());
      }else{
        setRevealGoal(locked?1:0);
      }
    }
  });

  inner.addEventListener('pointermove',function(e){
    var r=inner.getBoundingClientRect();
    inner.style.setProperty('--mx',(e.clientX-r.left)+'px');
    inner.style.setProperty('--my',(e.clientY-r.top)+'px');
    if(!locked && revealStart===null && revealT<0.02) inner.classList.add('lens');
  });
  inner.addEventListener('pointerleave',function(){
    if(!locked && revealStart===null) inner.classList.remove('lens');
  });
})();

