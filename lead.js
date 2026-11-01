// Dar Serenity — formulaire propriétaire des pages d'atterrissage
window.DS_WHATSAPP = window.DS_WHATSAPP || '212600000000'; // même numéro que app.js
(function () {
  var f = document.getElementById('lead'); if (!f) return;
  var en = (document.documentElement.lang || 'fr').slice(0, 2) === 'en';
  var L = en
    ? { o: 'Hello Dar Serenity, I own a property and would like a free estimate.', type: 'Property', obj: 'Goal', name: 'Name', contact: 'Contact', msg: 'Message', ref: 'Ref', page: 'Page', sep: ': ' }
    : { o: 'Bonjour Dar Serenity, je suis propriétaire et je souhaite une estimation gratuite.', type: 'Bien', obj: 'Objectif', name: 'Nom', contact: 'Contact', msg: 'Message', ref: 'Réf', page: 'Page', sep: ': ' };
  var v = function (n) { var el = f.elements[n]; return el ? el.value.trim() : ''; };
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var lines = [L.o, L.type + L.sep + v('type'), L.obj + L.sep + v('objectif')];
    if (v('nom')) lines.push(L.name + L.sep + v('nom'));
    if (v('contact')) lines.push(L.contact + L.sep + v('contact'));
    if (v('message')) lines.push(L.msg + L.sep + v('message'));
    var src = window.dsSource ? window.dsSource() : ''; if (src) lines.push(L.ref + L.sep + src);
    lines.push(L.page + L.sep + (document.body.dataset.page || location.pathname));
    if (window.dsEvent) window.dsEvent('generate_lead', { who: 'owner', type: v('type'), objective: v('objectif'), page: document.body.dataset.page || location.pathname });
    window.open('https://wa.me/' + window.DS_WHATSAPP + '?text=' + encodeURIComponent(lines.join('\n')), '_blank');
    var ok = f.querySelector('.ok'); if (ok) ok.style.display = 'block';
  });
})();
