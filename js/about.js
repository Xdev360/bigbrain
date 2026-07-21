/* About — cursor-lens portrait reveal + Obsidian-style graph (data-driven) */
(function(){
  var portrait=document.getElementById('aboutPortrait');
  var graph=document.getElementById('aboutGraph');
  var nodesEl=document.getElementById('aboutNodes');
  var svg=document.getElementById('aboutLinks');
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var NS='http://www.w3.org/2000/svg';

  /* ---- portrait: cursor-following lens (hover) + click to fully reveal ---- */
  if(portrait){
    var media=portrait.querySelector('.about-portrait-media');
    portrait.addEventListener('pointermove',function(e){
      if(portrait.classList.contains('is-met')) return;
      var r=(media||portrait).getBoundingClientRect();
      portrait.style.setProperty('--mx',(e.clientX-r.left)+'px');
      portrait.style.setProperty('--my',(e.clientY-r.top)+'px');
      portrait.classList.add('is-lens');
    });
    var dropLens=function(){ portrait.classList.remove('is-lens'); };
    portrait.addEventListener('pointerleave',dropLens);
    portrait.addEventListener('pointercancel',dropLens);
    portrait.addEventListener('click',function(){
      var met=portrait.classList.toggle('is-met');
      portrait.setAttribute('aria-pressed',met?'true':'false');
      if(met) portrait.classList.remove('is-lens');
    });
  }

  if(!graph||!nodesEl||!svg) return;

  /* ---- graph data: characteristics as nodes (x/y are % of the box) ---- */
  var NODES=[
    {label:'Founder, Wintech Studio',     x:24, y:15, depth:22, core:true},
    {label:'“Big Brain” thinker',         x:53, y:8,  depth:28, core:true},
    {label:'Product strategist',          x:82, y:18, depth:32, core:true},
    {label:'Multidisciplinary designer',  x:90, y:49, depth:36, core:false},
    {label:'Brand & identity',            x:84, y:82, depth:24, core:false},
    {label:'Web & product design',        x:53, y:92, depth:30, core:true},
    {label:'AI & automation',             x:17, y:83, depth:34, core:false},
    {label:'Growth systems',              x:8,  y:50, depth:26, core:true},
    {label:'5+ years shipping',           x:12, y:31, depth:20, core:true}
  ];
  var mq=window.matchMedia('(max-width:820px)');
  var items=[];      /* built chip records */
  var edges=[];      /* {line, a, b} — 'h' means hub/ring */
  var cw=0, ch=0, hubx=0, huby=0, R=0;

  function build(){
    var mobile=mq.matches;
    var fx=mobile?0.78:1, fy=mobile?0.86:1;   /* pull labels inward on small boxes */
    nodesEl.innerHTML='';
    svg.innerHTML='';
    items=[]; edges=[];

    var idx={};   /* NODES index -> item */
    NODES.forEach(function(n,i){
      if(mobile && !n.core) return;
      var px=50+(n.x-50)*fx, py=50+(n.y-50)*fy;
      var el=document.createElement('span');
      el.className='about-chip';
      el.innerHTML=n.label;
      el.style.left=px+'%';
      el.style.top=py+'%';
      nodesEl.appendChild(el);
      var it={
        el:el, i:i, px:px, py:py, depth:n.depth,
        pull:0.24*(n.depth/26),
        cap:20+n.depth*0.7,
        phase:i*1.15, amp:3+(i%3)*2,
        hx:0, hy:0, dx:0, dy:0
      };
      items.push(it); idx[i]=it;
    });

    /* every label links only to the portrait's outer ring border */
    items.forEach(function(it){
      var ln=document.createElementNS(NS,'line');
      svg.appendChild(ln);
      edges.push({line:ln, a:'h', b:it});
    });

    measure();
    if(reduced) draw();
  }

  function measure(){
    cw=graph.clientWidth; ch=graph.clientHeight;
    hubx=cw/2; huby=ch/2;
    R=(portrait?portrait.offsetWidth/2:120)+14;   /* portrait radius + ring inset */
    svg.setAttribute('viewBox','0 0 '+cw+' '+ch);
    items.forEach(function(it){ it.hx=it.px/100*cw; it.hy=it.py/100*ch; });
  }

  function endpoints(e){
    var bx=e.b.hx+e.b.dx, by=e.b.hy+e.b.dy;
    if(e.a==='h'){
      var vx=bx-hubx, vy=by-huby, m=Math.sqrt(vx*vx+vy*vy)||1;
      return [hubx+vx/m*R, huby+vy/m*R, bx, by];
    }
    return [e.a.hx+e.a.dx, e.a.hy+e.a.dy, bx, by];
  }

  function draw(){
    for(var i=0;i<edges.length;i++){
      var p=endpoints(edges[i]);
      var ln=edges[i].line;
      ln.setAttribute('x1',p[0].toFixed(2));
      ln.setAttribute('y1',p[1].toFixed(2));
      ln.setAttribute('x2',p[2].toFixed(2));
      ln.setAttribute('y2',p[3].toFixed(2));
    }
  }

  build();
  window.addEventListener('resize',measure);
  window.addEventListener('load',measure);
  if(mq.addEventListener) mq.addEventListener('change',build);
  else if(mq.addListener) mq.addListener(build);
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(measure);

  if(reduced) return;

  /* ---- cursor lean: labels drift toward the pointer (more sensitive) ---- */
  var tmx=hubx, tmy=huby, curX=hubx, curY=huby, pull=0, pullT=0;
  graph.addEventListener('pointermove',function(e){
    var r=graph.getBoundingClientRect();
    if(!r.width||!r.height) return;
    tmx=e.clientX-r.left; tmy=e.clientY-r.top; pullT=1;
  });
  graph.addEventListener('pointerleave',function(){ pullT=0; });

  var startT=performance.now();
  function tick(now){
    pull+=(pullT-pull)*0.14;
    curX+=(tmx-curX)*0.2;
    curY+=(tmy-curY)*0.2;
    var t=(now-startT)/1000;
    for(var i=0;i<items.length;i++){
      var d=items[i];
      var bob=Math.sin(t*0.8+d.phase)*d.amp;
      var rawX=(curX-d.hx)*d.pull;
      var rawY=(curY-d.hy)*d.pull;
      if(rawX> d.cap) rawX= d.cap; else if(rawX<-d.cap) rawX=-d.cap;
      if(rawY> d.cap) rawY= d.cap; else if(rawY<-d.cap) rawY=-d.cap;
      d.dx=rawX*pull;
      d.dy=rawY*pull+bob;
      d.el.style.transform='translate(-50%,-50%) translate('+d.dx.toFixed(2)+'px,'+d.dy.toFixed(2)+'px)';
    }
    draw();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
