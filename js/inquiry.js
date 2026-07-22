/* Custom project inquiry → Telegram */
(function(){
  var overlay=document.getElementById('inqOverlay');
  var openBtn=document.getElementById('openInquiry');
  var openTitle=document.getElementById('openInquiryTitle');
  var closeBtn=document.getElementById('inqClose');
  var form=document.getElementById('inqForm');
  var statusEl=document.getElementById('inqStatus');
  var submitBtn=document.getElementById('inqSubmit');
  var track=document.getElementById('inqScrollTrack');
  if(!overlay || !form) return;

  var categories=[
    {
      label:'App design',
      items:[
        {
          name:'Goalden',
          blurb:'Master goals → yearly, monthly, weekly, daily.',
          image:'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=640&q=80'
        },
        {
          name:'Blackgold Studio',
          blurb:'Skincare P2P with subscribe and pay-small-small.',
          image:'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=640&q=80'
        }
      ]
    },
    {
      label:'Web design',
      items:[
        {
          name:'CrediGo',
          blurb:'Agency site that books brand and web work.',
          image:'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=640&q=80'
        },
        {
          name:'Cue Africa',
          blurb:'Crew marketplace — browse, book, pay.',
          image:'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=640&q=80'
        }
      ]
    },
    {
      label:'Brand identity',
      items:[
        {
          name:'Nicovellor',
          blurb:'Coded luxury for Velourians — black and white.',
          image:'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=640&q=80'
        },
        {
          name:'Goalden',
          blurb:'Green system for consistency and focus.',
          image:'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=640&q=80'
        }
      ]
    },
    {
      label:'Graphic design',
      items:[
        {
          name:'Blackgold Studio',
          blurb:'Burgundy and pink campaign + plan explainers.',
          image:'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=640&q=80'
        },
        {
          name:'Cue Africa',
          blurb:'Casting and crew role kits.',
          image:'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=640&q=80'
        }
      ]
    }
  ];

  function esc(s){
    return String(s||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;');
  }

  function cardHtml(item){
    return ''+
      '<article class="inq-card">'+
        '<img src="'+esc(item.image)+'" alt="" loading="lazy" width="320" height="120">'+
        '<div class="inq-card-body">'+
          '<strong>'+esc(item.name)+'</strong>'+
          '<p>'+esc(item.blurb)+'</p>'+
        '</div>'+
      '</article>';
  }

  function buildScroll(){
    if(!track) return;
    var html='';
    categories.forEach(function(cat){
      html+='<p class="inq-cat">'+esc(cat.label)+'</p>';
      cat.items.forEach(function(item){ html+=cardHtml(item); });
    });
    /* duplicate for seamless marquee */
    track.innerHTML=html+html;
  }

  function selectedValues(group){
    var host=form.querySelector('[data-inq-group="'+group+'"]');
    if(!host) return [];
    return Array.prototype.map.call(
      host.querySelectorAll('.inq-pill.is-on'),
      function(btn){ return btn.getAttribute('data-value'); }
    );
  }

  function setStatus(msg, kind){
    if(!statusEl) return;
    statusEl.hidden=!msg;
    statusEl.textContent=msg||'';
    statusEl.classList.remove('is-ok','is-err');
    if(kind) statusEl.classList.add(kind);
  }

  function open(){
    overlay.classList.add('is-on');
    overlay.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    setStatus('',null);
    var first=form.querySelector('input,textarea,button.inq-pill');
    if(first) window.setTimeout(function(){ first.focus(); },40);
  }

  function close(){
    overlay.classList.remove('is-on');
    overlay.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  }

  function bindPills(){
    form.querySelectorAll('.inq-pills').forEach(function(group){
      var mode=group.getAttribute('data-inq-mode')||'multi';
      group.querySelectorAll('.inq-pill').forEach(function(b){
        if(!b.hasAttribute('aria-pressed')) b.setAttribute('aria-pressed', b.classList.contains('is-on')?'true':'false');
      });
      group.addEventListener('click',function(e){
        var btn=e.target.closest('.inq-pill');
        if(!btn || !group.contains(btn)) return;
        if(mode==='single'){
          var on=btn.classList.contains('is-on');
          group.querySelectorAll('.inq-pill').forEach(function(b){
            b.classList.remove('is-on');
            b.setAttribute('aria-pressed','false');
          });
          if(!on){
            btn.classList.add('is-on');
            btn.setAttribute('aria-pressed','true');
          }
        }else{
          btn.classList.toggle('is-on');
          btn.setAttribute('aria-pressed', btn.classList.contains('is-on') ? 'true' : 'false');
        }
      });
    });
  }

  function buildTelegramMessage(data){
    var lines=[
      'New custom project inquiry',
      '────────────────────',
      '',
      'Name: '+data.name,
      'Email: '+data.email,
      '',
      'Services: '+(data.services.length ? data.services.join(', ') : '— not selected'),
      'Budget: '+(data.budget || '— not selected'),
      'Found via: '+(data.referral || '— not selected'),
      '',
      'Project details:',
      data.details,
      '',
      '────────────────────',
      'Source: bigbrainportfolio · Custom projects form',
      'Time: '+new Date().toISOString()
    ];
    return lines.join('\n');
  }

  function send(data){
    var text=buildTelegramMessage(data);
    if(window.XBigX && typeof window.XBigX.sendTelegram==='function'){
      return window.XBigX.sendTelegram(text);
    }
    var c=window.BIGBRAIN_CONFIG||{};
    if(!c.telegramBotToken || !c.telegramChatId){
      return Promise.resolve({ok:false, reason:'missing'});
    }
    var url='https://api.telegram.org/bot'+encodeURIComponent(c.telegramBotToken)+
      '/sendMessage?chat_id='+encodeURIComponent(c.telegramChatId)+
      '&text='+encodeURIComponent(text);
    return fetch(url,{mode:'no-cors',cache:'no-store'}).then(function(){
      return {ok:true};
    }).catch(function(){
      return {ok:false, reason:'network'};
    });
  }

  form.addEventListener('submit',function(e){
    e.preventDefault();
    var name=(document.getElementById('inqName').value||'').trim();
    var email=(document.getElementById('inqEmail').value||'').trim();
    var details=(document.getElementById('inqDetails').value||'').trim();
    var services=selectedValues('service');
    var budget=selectedValues('budget')[0]||'';
    var referral=selectedValues('referral')[0]||'';

    if(!name || !email || !details){
      setStatus('Please fill in name, email, and project details.', 'is-err');
      return;
    }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      setStatus('Please enter a valid email.', 'is-err');
      return;
    }

    submitBtn.disabled=true;
    setStatus('Sending…', null);

    send({
      name:name,
      email:email,
      details:details,
      services:services,
      budget:budget,
      referral:referral
    }).then(function(res){
      submitBtn.disabled=false;
      if(res && res.ok){
        setStatus('Sent. I’ll get back to you on email.', 'is-ok');
        form.reset();
        form.querySelectorAll('.inq-pill.is-on').forEach(function(b){ b.classList.remove('is-on'); });
        return;
      }
      if(res && res.reason==='missing'){
        setStatus('Telegram isn’t configured yet. Email ibrahimoladele9@gmail.com instead.', 'is-err');
        return;
      }
      setStatus('Couldn’t send just now. Try again or email ibrahimoladele9@gmail.com.', 'is-err');
    });
  });

  if(openBtn) openBtn.addEventListener('click',open);
  if(openTitle) openTitle.addEventListener('click',open);
  if(closeBtn) closeBtn.addEventListener('click',close);
  overlay.addEventListener('click',function(e){
    if(e.target===overlay) close();
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape' && overlay.classList.contains('is-on')) close();
  });

  /* Also open when hash is #custom-brief */
  if(location.hash==='#custom-brief') open();

  bindPills();
  buildScroll();
})();
