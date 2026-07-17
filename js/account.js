(function(){
  var user=window.MPAuth?window.MPAuth.getUser():null;
  if(!user){
    location.replace('signup.html');
    return;
  }

  /* if arriving fresh from checkout, remember the template on the account */
  var params=new URLSearchParams(location.search);
  var t=params.get('template');
  if(t&&user.template!==t){
    user.template=t;
    window.MPAuth.setUser(user);
  }

  var avatar=document.getElementById('acctAvatar');
  var nameEl=document.querySelector('#acctName span');
  var emailEl=document.getElementById('acctEmail');
  var rowsEl=document.getElementById('acctRows');
  var planRowsEl=document.getElementById('acctPlanRows');
  var sideUser=document.getElementById('acctSideUser');

  avatar.textContent=window.MPAuth.initials(user.name);
  nameEl.textContent=user.name;
  emailEl.textContent=user.email;

  var joined=new Date(user.joined||Date.now());
  var joinedStr=joined.toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});

  function row(label,value){
    return '<div class="acct-row"><span>'+label+'</span><b>'+value+'</b></div>';
  }

  rowsEl.innerHTML=
    row('Full name:',user.name)+
    row('Email:',user.email)+
    row('Member since:',joinedStr)+
    row('Country:','🇳🇬 Nigeria')+
    row('Subdomain:',user.name.toLowerCase().replace(/[^a-z0-9]+/g,'')+'.bigbrain.com');

  planRowsEl.innerHTML=
    row('Current plan:',user.plan||'Code Only')+
    row('Template:',user.template?user.template.replace(/-/g,' '):'None yet — browse the marketplace')+
    row('Billing:','₦35,000 one-time · paid');

  /* Serena-style user chip, bottom of sidebar */
  sideUser.innerHTML=
    '<div class="mp-user" title="'+user.email+'">'+
      '<span class="mp-user-avatar">'+window.MPAuth.initials(user.name)+'</span>'+
      '<span class="mp-user-meta mp-side-label">'+
        '<strong>'+user.name+'</strong>'+
        '<span>'+user.email+'</span>'+
      '</span>'+
    '</div>';

  document.getElementById('acctSignOut').addEventListener('click',function(){
    window.MPAuth.signOut();
    location.href='marketplace.html';
  });

  /* sidebar collapse — same behavior as marketplace */
  var app=document.getElementById('acctApp');
  var collapseBtn=document.getElementById('acctCollapse');
  var COLLAPSE_KEY='bigbrain-mp-collapsed';
  function setCollapsed(on){
    app.classList.toggle('is-collapsed',on);
    collapseBtn.setAttribute('aria-label',on?'Expand sidebar':'Collapse sidebar');
    collapseBtn.setAttribute('title',on?'Expand sidebar':'Collapse sidebar');
    try{ localStorage.setItem(COLLAPSE_KEY,on?'1':'0'); }catch(e){}
  }
  collapseBtn.addEventListener('click',function(){
    setCollapsed(!app.classList.contains('is-collapsed'));
  });
  try{ if(localStorage.getItem(COLLAPSE_KEY)==='1') setCollapsed(true); }catch(e){}

  /* nav items just set active state + breadcrumb (Profile is the built page) */
  var crumbHere=document.getElementById('acctCrumbHere');
  document.querySelectorAll('.mp-nav-item[data-acct]').forEach(function(btn){
    btn.addEventListener('click',function(){
      document.querySelectorAll('.mp-nav-item[data-acct]').forEach(function(b){
        b.classList.toggle('is-active',b===btn);
      });
      crumbHere.textContent=btn.querySelector('.mp-side-label').textContent;
    });
  });
})();
