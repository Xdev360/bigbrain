/* X Big X — answers from your data; unknown questions go to your Telegram */
(function(global){
  var knowledge=null;

  function cfg(){ return global.BIGBRAIN_CONFIG||{}; }

  function loadKnowledge(){
    if(knowledge) return Promise.resolve(knowledge);
    var url=(cfg().knowledgeUrl)||'data/knowledge.json';
    return fetch(url,{cache:'no-store'}).then(function(r){return r.json()}).then(function(data){
      knowledge=data;
      return data;
    }).catch(function(){
      knowledge={
        assistant_name:'X Big X',
        person:{name:'Oladele Ibraheem',role:'Designer',location:'Lagos',status:'Open for work'},
        contact:{email:'ibrahimoladele9@gmail.com'},
        services:[],
        selected_work:[],
        marketplace:{},
        presets:[]
      };
      return knowledge;
    });
  }

  function norm(s){
    return String(s||'').toLowerCase().replace(/[^a-z0-9\s+]/g,' ').replace(/\s+/g,' ').trim();
  }

  function tokens(s){
    return norm(s).split(' ').filter(function(w){ return w.length>2; });
  }

  function scoreMatch(query, target){
    var q=norm(query);
    var t=norm(target);
    if(!q||!t) return 0;
    if(q===t) return 100;
    if(t.indexOf(q)!==-1 || q.indexOf(t)!==-1) return 80;
    var qt=tokens(q);
    var tt=tokens(t);
    if(!qt.length) return 0;
    var hit=0;
    qt.forEach(function(w){ if(tt.indexOf(w)!==-1) hit++; });
    return (hit/qt.length)*70;
  }

  function answerFromKnowledge(k, q){
    var n=norm(q);
    var p=k.person||{};
    var c=k.contact||{};
    var m=k.marketplace||{};

    if(/\b(who|about|oladele|bigbrain|yourself|you)\b/.test(n) && /\b(who|about|are|is|name)\b/.test(n)){
      return (p.name||'Oladele')+' ('+(p.aka||'BigBrain')+') — '+(p.role||'Designer')+
        '. Based in '+(p.location||'Lagos')+'. '+(p.experience||'')+'. Status: '+(p.status||'Open for work')+'.';
    }
    if(/\b(service|offer|do you do|what can|hire|design)\b/.test(n)){
      var services=(k.services||[]).join(', ');
      return services ? ('Services: '+services+'.') : null;
    }
    if(/\b(work|project|portfolio|case|golden|goalden|credigo|wintech|qafrica|cue\s*africa|blackgold|spotlight|nicovellor|velourian)\b/.test(n)){
      var works=(k.selected_work||[]).map(function(w){
        return w.name+' ('+w.type+', '+w.year+')';
      }).join('; ');
      return works ? ('Selected work: '+works+'.') : null;
    }
    if(/\b(template|marketplace|buy|price|selar)\b/.test(n)){
      return m.templates || 'Templates are in Marketplace — checkout happens off-site after you pick a kit.';
    }
    if(/\b(equity|startup|stake|share)\b/.test(n)){
      return m.equity || 'Equity listings are selective — review demos in Marketplace.';
    }
    if(/\b(write|writing|essay|ebook|e-book|substack|blog)\b/.test(n)){
      return (m.writing||'Writing lives on Substack.')+' '+(c.substack||cfg().substackUrl||'');
    }
    if(/\b(podcast)\b/.test(n)){
      return m.podcasts || 'Podcasts — coming soon.';
    }
    if(/\b(contact|email|reach|phone|call|dm|hire me|open for)\b/.test(n) || /\bavailable\b/.test(n)){
      var bits=[];
      if(c.email) bits.push('Email '+c.email);
      if(c.phone) bits.push('call '+c.phone);
      if(p.status) bits.push(p.status);
      return bits.length ? bits.join(' · ')+'.' : null;
    }
    if(/\b(studio|wintech)\b/.test(n)){
      var s=k.studio||{};
      return s.name ? (s.name+' — '+(s.focus||'')) : null;
    }
    return null;
  }

  function matchPreset(k, q){
    var presets=k.presets||[];
    var best=null;
    var bestScore=0;
    presets.forEach(function(item){
      var s=Math.max(scoreMatch(q, item.q), scoreMatch(q, item.a));
      if(s>bestScore){ bestScore=s; best=item; }
    });
    if(best && bestScore>=42) return best;
    return null;
  }

  function telegramConfigured(){
    var c=cfg();
    return !!(c.telegramBotToken && c.telegramChatId);
  }

  function sendTelegram(text){
    var c=cfg();
    if(!c.telegramBotToken || !c.telegramChatId){
      return Promise.resolve({ok:false, reason:'missing'});
    }
    var url='https://api.telegram.org/bot'+encodeURIComponent(c.telegramBotToken)+
      '/sendMessage?chat_id='+encodeURIComponent(c.telegramChatId)+
      '&text='+encodeURIComponent(text);
    /* GET + no-cors avoids browser CORS blocks on api.telegram.org */
    return fetch(url,{mode:'no-cors',cache:'no-store'}).then(function(){
      return {ok:true};
    }).catch(function(){
      try{
        var img=new Image();
        img.src=url;
        return {ok:true};
      }catch(e){
        return {ok:false, reason:'network'};
      }
    });
  }

  function ask(userText){
    var q=String(userText||'').trim();
    if(!q) return Promise.resolve('');

    return loadKnowledge().then(function(k){
      var preset=matchPreset(k, q);
      if(preset) return {type:'local', text:preset.a};

      var built=answerFromKnowledge(k, q);
      if(built) return {type:'local', text:built};

      var msg='New question from the site (X Big X):\n\n"'+q+'"\n\nReply to them yourself when you can.';
      return sendTelegram(msg).then(function(res){
        if(res && res.ok){
          return {
            type:'telegram',
            text:'That one\'s outside my notes — I sent it to Oladele on Telegram. He\'ll answer you himself.'
          };
        }
        if(res && res.reason==='missing'){
          return {
            type:'fallback',
            text:'I don\'t have that in my notes yet. Email Oladele at '+
              ((k.contact&&k.contact.email)||'ibrahimoladele9@gmail.com')+
              ' — or ask one of the suggested questions.'
          };
        }
        return {
          type:'fallback',
          text:'Couldn\'t reach Telegram just now. Email '+
            ((k.contact&&k.contact.email)||'ibrahimoladele9@gmail.com')+' with your question.'
        };
      });
    });
  }

  function renderPresets(root, log, askFn){
    var host=root.querySelector('[data-ai-presets]');
    if(!host) return;
    loadKnowledge().then(function(k){
      host.innerHTML='';
      (k.presets||[]).forEach(function(item){
        var btn=document.createElement('button');
        btn.type='button';
        btn.className='ai-preset';
        btn.textContent=item.q;
        btn.addEventListener('click',function(){
          askFn(item.q, item.a);
        });
        host.appendChild(btn);
      });
    });
  }

  function bindPanel(root){
    if(!root || root.dataset.aiBound==='1') return;
    var log=root.querySelector('[data-ai-log]');
    var form=root.querySelector('[data-ai-form]');
    var input=root.querySelector('[data-ai-input]');
    if(!log||!form||!input) return;
    root.dataset.aiBound='1';

    function add(role,text){
      var row=document.createElement('div');
      row.className='ai-msg ai-msg-'+role;
      row.textContent=text;
      log.appendChild(row);
      log.scrollTop=log.scrollHeight;
      return row;
    }

    function runQuestion(q, knownAnswer){
      add('user',q);
      if(knownAnswer){
        add('bot',knownAnswer);
        return;
      }
      var pending=add('bot','…');
      ask(q).then(function(res){
        pending.textContent=(res&&res.text)||'No reply.';
        log.scrollTop=log.scrollHeight;
      });
    }

    loadKnowledge().then(function(k){
      if(!log.dataset.ready){
        var tip=telegramConfigured()
          ? 'Tap a question below, or type anything — if I don\'t know it, Oladele gets it on Telegram.'
          : 'Tap a question below for an instant answer. Add Telegram in js/config.js to forward the rest to Oladele.';
        add('bot','I\'m '+(k.assistant_name||'X Big X')+'. '+tip);
        log.dataset.ready='1';
      }
      renderPresets(root, log, runQuestion);
    });

    form.addEventListener('submit',function(e){
      e.preventDefault();
      var q=input.value.trim();
      if(!q) return;
      input.value='';
      runQuestion(q);
    });
  }

  global.XBigX={
    ask:ask,
    bindPanel:bindPanel,
    loadKnowledge:loadKnowledge,
    sendTelegram:sendTelegram,
    telegramConfigured:telegramConfigured
  };
})(window);
