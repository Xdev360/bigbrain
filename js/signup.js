(function(){
  var mode='signup';

  var els={
    title:document.getElementById('authTitle'),
    sub:document.getElementById('authSub'),
    form:document.getElementById('authForm'),
    nameField:document.getElementById('authNameField'),
    name:document.getElementById('authName'),
    email:document.getElementById('authEmail'),
    pass:document.getElementById('authPass'),
    passToggle:document.getElementById('authPassToggle'),
    submit:document.getElementById('authSubmit'),
    error:document.getElementById('authError'),
    switchText:document.getElementById('authSwitch'),
    toggle:document.getElementById('authToggle'),
    templateNote:document.getElementById('authTemplateNote'),
    quotePrev:document.getElementById('authQuotePrev'),
    quoteNext:document.getElementById('authQuoteNext')
  };

  /* already signed in → straight to account */
  if(window.MPAuth&&window.MPAuth.getUser()){
    location.replace('account.html');
    return;
  }

  var params=new URLSearchParams(location.search);
  var template=params.get('template')||'';
  if(template&&els.templateNote){
    els.templateNote.hidden=false;
    els.templateNote.textContent='You\u2019re one step from your template — create an account to continue to checkout.';
  }
  if(params.get('mode')==='login') setMode('login');

  function setMode(m){
    mode=m;
    var signup=mode==='signup';
    els.title.textContent=signup?'Create an account':'Welcome back';
    els.sub.textContent=signup
      ?'Start exploring and utilizing all the resources that will help you elevate every design you make.'
      :'Log in to manage your templates, site, and account.';
    els.nameField.style.display=signup?'':'none';
    els.pass.setAttribute('placeholder',signup?'Create a password':'Your password');
    els.pass.setAttribute('autocomplete',signup?'new-password':'current-password');
    els.submit.textContent=signup?'Create account':'Log in';
    els.switchText.childNodes[0].nodeValue=signup?'Already have an account? ':'New to BigBrain? ';
    els.toggle.textContent=signup?'Log in':'Create an account';
    hideError();
  }

  function showError(msg){
    els.error.hidden=false;
    els.error.textContent=msg;
  }
  function hideError(){
    els.error.hidden=true;
  }

  els.toggle.addEventListener('click',function(e){
    e.preventDefault();
    setMode(mode==='signup'?'login':'signup');
  });

  els.passToggle.addEventListener('click',function(){
    var showing=els.pass.type==='text';
    els.pass.type=showing?'password':'text';
    els.passToggle.setAttribute('aria-label',showing?'Show password':'Hide password');
  });

  els.form.addEventListener('submit',function(e){
    e.preventDefault();
    hideError();
    var email=(els.email.value||'').trim();
    var pass=els.pass.value||'';
    var name=(els.name.value||'').trim();

    if(!/^\S+@\S+\.\S+$/.test(email)){ showError('Enter a valid email address.'); return; }
    if(pass.length<6){ showError('Password must be at least 6 characters.'); return; }
    if(mode==='signup'&&!name){ showError('Enter your name.'); return; }

    var user={
      name:mode==='signup'?name:(email.split('@')[0].replace(/[._-]+/g,' ')),
      email:email,
      joined:new Date().toISOString(),
      template:template||null,
      plan:'Code Only'
    };
    window.MPAuth.setUser(user);
    location.href='account.html'+(template?'?template='+encodeURIComponent(template):'');
  });

  /* rotating testimonials on the visual panel */
  var quotes=[
    {text:'I was able to reduce the time taken to present high-level designs by 35% using the platform.',name:'Sara Bright',role:'Freelancer Designer'},
    {text:'My food business finally has a real website. Orders come in straight from the menu page.',name:'Chiamaka O.',role:'Food Vendor, Lagos'},
    {text:'Bought the developer portfolio in the morning, my site was live before dinner. Same day, no stress.',name:'Tunde A.',role:'Front-end Developer'}
  ];
  var qi=0;
  var quoteEl=document.querySelector('.auth-visual-quote p');
  var quoteName=document.querySelector('.auth-visual-quote strong');
  var quoteRole=document.querySelector('.auth-visual-quote footer span');
  function setQuote(i){
    qi=(i+quotes.length)%quotes.length;
    quoteEl.textContent=quotes[qi].text;
    quoteName.textContent=quotes[qi].name;
    quoteRole.textContent=quotes[qi].role;
  }
  if(els.quotePrev) els.quotePrev.addEventListener('click',function(){setQuote(qi-1)});
  if(els.quoteNext) els.quoteNext.addEventListener('click',function(){setQuote(qi+1)});
})();
