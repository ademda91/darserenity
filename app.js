// Dar Serenity — configuration
window.DS_WHATSAPP = window.DS_WHATSAPP || '212600000000'; // numéro WhatsApp au format international sans + ni espaces

(function(){
  var root=document.documentElement, body=document.body;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){body.classList.add('static')}else{root.classList.add('js')}
  var nav=document.getElementById('nav');
  function onNav(){nav.classList.toggle('solid',window.scrollY>40)}
  var mm=document.getElementById('mmenu');
  var burger=document.getElementById('burger');function closeMenu(){mm.classList.remove('open');burger.setAttribute('aria-expanded','false');document.body.style.overflow=''}
  burger.addEventListener('click',function(){mm.classList.add('open');burger.setAttribute('aria-expanded','true');document.body.style.overflow='hidden'});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu()});
  document.getElementById('mclose').addEventListener('click',closeMenu);
  mm.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeMenu)});

  // Form audience toggle
  var form=document.getElementById('form'),submit=document.getElementById('submit');
  function setWho(w){form.classList.remove('owner','buyer');form.classList.add(w);document.querySelectorAll('#who button').forEach(function(b){b.classList.toggle('on',b.dataset.who===w)});submit.textContent=window.DS_LANG==='en'?(w==='owner'?'Receive my estimate':'Receive the selection'):(w==='owner'?'Recevoir mon estimation':'Recevoir la sélection')}
  document.querySelectorAll('#who button').forEach(function(b){b.addEventListener('click',function(){setWho(b.dataset.who)})});
  document.querySelectorAll('[data-who][href$="#contact"]').forEach(function(a){a.addEventListener('click',function(){setWho(a.dataset.who)})});
  try{var qw=new URLSearchParams(location.search).get('who');if(qw==='buyer'||qw==='owner')setWho(qw)}catch(e){}
  form.addEventListener('submit',function(e){e.preventDefault();
    var w=form.classList.contains('buyer')?'buyer':'owner';
    var v=function(id){var el=document.getElementById(id);return el?el.value.trim():''};
    var L=window.DS_LANG==='en'?{o:'Hello Dar Serenity, I own a property and would like a free estimate.',b:'Hello Dar Serenity, I am looking to buy in Marrakech and would like your selection.',type:'Property',obj:'Goal',budget:'Budget',proj:'Project',name:'Name',contact:'Contact',msg:'Message',sep:': '}:{o:'Bonjour Dar Serenity, je suis propriétaire et je souhaite une estimation gratuite.',b:'Bonjour Dar Serenity, je cherche à acheter à Marrakech et je souhaite recevoir votre sélection.',type:'Bien',obj:'Objectif',budget:'Budget',proj:'Projet',name:'Nom',contact:'Contact',msg:'Message',sep:' : '};
    var lines=[w==='owner'?L.o:L.b];
    if(w==='owner'){lines.push(L.type+L.sep+v('f-type'));lines.push(L.obj+L.sep+v('f-obj'))}else{lines.push(L.budget+L.sep+v('b-budget'));lines.push(L.proj+L.sep+v('b-obj'))}
    if(v('f-nom'))lines.push(L.name+L.sep+v('f-nom'));if(v('f-tel'))lines.push(L.contact+L.sep+v('f-tel'));if(v('f-msg'))lines.push(L.msg+L.sep+v('f-msg'));
    var url='https://wa.me/'+window.DS_WHATSAPP+'?text='+encodeURIComponent(lines.join('\n'));
    window.open(url,'_blank');document.getElementById('ok').style.display='block'});

  // Simulator
  var S={type:'appart',ch:2,std:1,pool:0};
  var base={appart:{night:900,occ:.68},riad:{night:1900,occ:.62},villa:{night:3200,occ:.64}};
  function fmt(n){return Math.round(n/1000)*1000}
  function num(n){return n.toLocaleString('fr-FR').replace(/ | /g,' ')}
  function calc(){var b=base[S.type];var night=b.night*(1+(Math.min(S.ch,5)-2)*0.22)*S.std*(S.pool?1.25:1);
    var gross=night*365*b.occ;var us=gross*0.82;
    document.getElementById('s-us').textContent=window.DS_LANG==='en'?'MAD '+fmt(us).toLocaleString('en-GB'):num(fmt(us))+' MAD';
    document.getElementById('s-eur').textContent=window.DS_LANG==='en'?'€'+num(fmt(us/10.7)):num(fmt(us/10.7))+' €';
    document.getElementById('s-month').textContent=window.DS_LANG==='en'?'MAD '+(Math.round(us/12/500)*500).toLocaleString('en-GB'):num(Math.round(us/12/500)*500)+' MAD'}
  function seg(id,key,parse){document.querySelectorAll('#'+id+' button').forEach(function(b){b.addEventListener('click',function(){document.querySelectorAll('#'+id+' button').forEach(function(x){x.classList.remove('on')});b.classList.add('on');S[key]=parse(b.dataset.v);calc()})})}
  seg('s-type','type',String);seg('s-std','std',parseFloat);seg('s-pool','pool',parseInt);
  var ch=document.getElementById('s-ch');ch.addEventListener('input',function(){S.ch=+ch.value;document.getElementById('s-ch-v').textContent=ch.value;calc()});
  calc();
  var scta=document.getElementById('s-cta');
  if(scta){scta.addEventListener('click',function(){setWho('owner');
    var L=window.DS_LANG==='en';var names=L?{appart:'Apartment',riad:'Riad',villa:'Villa'}:{appart:'Appartement',riad:'Riad',villa:'Villa'};
    var ft=document.getElementById('f-type');if(ft){ft.value=names[S.type]}
    var msg=(L?'Simulator estimate: ':'Estimation simulateur : ')+names[S.type]+', '+S.ch+(L?' bed, ':' ch, ')+(S.std>1?(L?'premium':'luxe'):S.std<1?(L?'classic':'classique'):(L?'comfort':'confort'))+(S.pool?(L?', pool':', piscine'):'')+' → '+document.getElementById('s-us').textContent+(L?'/year':'/an');
    var fm=document.getElementById('f-msg');if(fm)fm.value=msg})}

  // Reveal + counters
  function count(el){var to=+el.dataset.count,pre=el.dataset.prefix||'',suf=el.dataset.suffix||'',t0=null;
    function f(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/1500);p=1-Math.pow(1-p,3);el.textContent=pre+num(Math.round(to*p))+suf;if(p<1)requestAnimationFrame(f)}
    requestAnimationFrame(f)}
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');e.target.querySelectorAll('[data-count]').forEach(count);io.unobserve(e.target)}})},{threshold:.15});
    document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});
  }else{document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in')})}

  // Scroll-driven
  var par=[].slice.call(document.querySelectorAll('[data-parallax]'));
  var proc=document.getElementById('process'),steps=[].slice.call(document.querySelectorAll('#steps .step')),pimgs=[].slice.call(document.querySelectorAll('#process .media img')),pnum=document.getElementById('pnum'),pbar=document.getElementById('pbar');
  var gal=document.getElementById('biens'),track=document.getElementById('track');
  var mobile=window.matchMedia('(max-width: 820px)');
  var ticking=false;
  function frame(){
    ticking=false; onNav();
    if(reduce)return;
    var vh=window.innerHeight;
    par.forEach(function(el){var r=el.parentElement.getBoundingClientRect();if(r.bottom<0||r.top>vh)return;var k=+el.dataset.parallax;el.style.transform='translateY('+((r.top*-1)*k*0.5)+'px)'});
    if(mobile.matches)return;
    var pr=proc.getBoundingClientRect(),ph=proc.offsetHeight-vh;
    if(pr.top<=0&&pr.bottom>=vh){var p=Math.min(1,Math.max(0,-pr.top/ph));var i=Math.min(3,Math.floor(p*4));
      steps.forEach(function(s,k){s.classList.toggle('on',k===i)});pimgs.forEach(function(im,k){im.classList.toggle('on',k===i)});pnum.textContent='0'+(i+1);pbar.style.width=(p*100)+'%'}
    var gr=gal.getBoundingClientRect(),gh=gal.offsetHeight-vh;
    if(gr.top<=0&&gr.bottom>=vh){var q=Math.min(1,Math.max(0,-gr.top/gh));var max=track.scrollWidth-window.innerWidth+48;track.style.transform='translateX('+(-q*max)+'px)'}
    else if(gr.top>0){track.style.transform='translateX(0)'}
    else if(gr.bottom<vh){track.style.transform='translateX('+(-(track.scrollWidth-window.innerWidth+48))+'px)'}
  }
  window.addEventListener('scroll',function(){if(!ticking){requestAnimationFrame(frame);ticking=true}},{passive:true});
  window.addEventListener('resize',frame);
  frame();
})();
