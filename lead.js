// Dar Serenity — formulaires propriétaires des pages d'atterrissage
window.DS_WHATSAPP = window.DS_WHATSAPP || '212684596946'; // même numéro que app.js
(function () {
  var en = (document.documentElement.lang || 'fr').slice(0, 2) === 'en';
  var L = en
    ? { o: 'Hello Dar Serenity, I own a property and would like a free estimate.', type: 'Property', obj: 'Goal', name: 'Name', contact: 'Contact', msg: 'Message', ref: 'Ref', page: 'Page', sep: ': ', need: 'Please enter a WhatsApp number or an e-mail.', ok: 'Thank you. If WhatsApp did not open: ', wa: 'open WhatsApp', mail: 'send by e-mail', subj: 'Free estimate request' }
    : { o: 'Bonjour Dar Serenity, je suis propriétaire et je souhaite une estimation gratuite.', type: 'Bien', obj: 'Objectif', name: 'Nom', contact: 'Contact', msg: 'Message', ref: 'Réf', page: 'Page', sep: ' : ', need: 'Indiquez un numéro WhatsApp ou un e-mail.', ok: "Merci. Si WhatsApp ne s'est pas ouvert : ", wa: 'ouvrir WhatsApp', mail: 'envoyer par e-mail', subj: "Demande d'estimation" };
  document.querySelectorAll('#lead, form.lead').forEach(function (f) {
    var v = function (n) { var el = f.elements[n]; return el ? el.value.trim() : ''; };
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var c = f.elements['contact'];
      if (c && !v('contact')) { c.setCustomValidity(L.need); c.reportValidity(); c.setCustomValidity(''); c.focus(); return; }
      var lines = [L.o, L.type + L.sep + v('type'), L.obj + L.sep + v('objectif')];
      if (v('nom')) lines.push(L.name + L.sep + v('nom'));
      lines.push(L.contact + L.sep + v('contact'));
      if (v('message')) lines.push(L.msg + L.sep + v('message'));
      var src = window.dsSource ? window.dsSource() : ''; if (src) lines.push(L.ref + L.sep + src);
      var page = document.body.dataset.page || location.pathname; lines.push(L.page + L.sep + page);
      if (window.dsEvent) window.dsEvent('generate_lead', { who: 'owner', type: v('type'), objective: v('objectif'), page: page });
      var txt = lines.join('\n');
      var url = 'https://wa.me/' + window.DS_WHATSAPP + '?text=' + encodeURIComponent(txt);
      var mail = 'mailto:contact@darserenity.com?subject=' + encodeURIComponent(L.subj) + '&body=' + encodeURIComponent(txt);
      window.open(url, '_blank');
      var ok = f.querySelector('.ok');
      if (ok) { ok.innerHTML = L.ok + '<a href="' + url + '" target="_blank" rel="noopener">' + L.wa + '</a> · <a href="' + mail + '">' + L.mail + '</a>'; ok.style.display = 'block'; ok.setAttribute('tabindex', '-1'); ok.focus({ preventScroll: true }); ok.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
    });
  });
})();
