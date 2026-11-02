/* Dar Serenity — suivi & consentement
   Renseigner les identifiants ci-dessous. Vide = désactivé. */
window.DS_TRACK = window.DS_TRACK || {
  ga4: '',          // ex. 'G-XXXXXXXXXX'
  meta: '',         // ex. '123456789012345' (ID du pixel Meta)
  gads: 'AW-18550453830', // Google Ads
  gadsLead: 'AW-18550453830/wpegCOSK97AdEMbsxY1F', // conversion "Lead" formulaire
  gadsContact: ''   // ex. 'AW-123456789/XyZ' (conversion "Clic WhatsApp")
};

(function () {
  var T = window.DS_TRACK, L = (document.documentElement.lang || 'fr').slice(0, 2);
  var KEY = 'ds_consent';
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ---- UTM / source de la visite ---- */
  try {
    var q = new URLSearchParams(location.search), u = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'].forEach(function (k) { if (q.get(k)) u[k] = q.get(k); });
    if (Object.keys(u).length) sessionStorage.setItem('ds_utm', JSON.stringify(u));
    else if (!sessionStorage.getItem('ds_utm') && document.referrer && document.referrer.indexOf(location.host) < 0) sessionStorage.setItem('ds_utm', JSON.stringify({ ref: document.referrer.replace(/^https?:\/\//, '').split('/')[0] }));
  } catch (e) {}
  window.dsSource = function () {
    try {
      var u = JSON.parse(sessionStorage.getItem('ds_utm') || '{}');
      if (u.utm_source) return [u.utm_source, u.utm_medium, u.utm_campaign].filter(Boolean).join(' / ');
      if (u.gclid) return 'google ads';
      if (u.fbclid) return 'meta ads';
      if (u.ref) return u.ref;
    } catch (e) {}
    return '';
  };

  /* ---- Consent Mode v2 (Google) : refusé par défaut ---- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500 });

  var loaded = false;
  function loadTrackers() {
    if (loaded) return; loaded = true;
    gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' });
    var ids = [T.ga4, T.gads].filter(Boolean);
    if (ids.length) {
      var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ids[0]; document.head.appendChild(s);
      gtag('js', new Date());
      ids.forEach(function (id) { gtag('config', id, { anonymize_ip: true }); });
    }
    if (T.meta) {
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', T.meta); fbq('track', 'PageView');
    }
  }

  /* ---- Événements ---- */
  window.dsEvent = function (name, params) {
    params = params || {}; params.source = params.source || window.dsSource() || 'direct';
    try {
      if (window.gtag) gtag('event', name, params);
      if (window.fbq) {
        if (name === 'generate_lead') fbq('track', 'Lead', { content_category: params.who, content_name: params.type });
        else if (name === 'contact') fbq('track', 'Contact', { content_name: params.channel });
        else fbq('trackCustom', name, params);
      }
      if (window.gtag && T.gadsLead && name === 'generate_lead') gtag('event', 'conversion', { send_to: T.gadsLead });
      if (window.gtag && T.gadsContact && name === 'contact' && params.channel === 'whatsapp') gtag('event', 'conversion', { send_to: T.gadsContact });
    } catch (e) {}
  };

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a'); if (!a) return;
    var h = a.getAttribute('href') || '';
    if (/wa\.me|whatsapp/.test(h)) window.dsEvent('contact', { channel: 'whatsapp', label: a.classList.contains('wa') ? 'floating' : 'link' });
    else if (/^tel:/.test(h)) window.dsEvent('contact', { channel: 'phone' });
    else if (/^mailto:/.test(h)) window.dsEvent('contact', { channel: 'email' });
    else if (a.classList.contains('btn') || a.classList.contains('pill') || a.closest('.audience')) window.dsEvent('cta_click', { label: (a.textContent || '').trim().slice(0, 60), who: a.dataset.who || '' });
  }, true);

  /* ---- Bandeau cookies ---- */
  var c = get(KEY);
  if (c === 'yes') loadTrackers();
  else if (c !== 'no' && (T.ga4 || T.meta || T.gads)) {
    var txt = L === 'en'
      ? ['We use cookies to measure our advertising and improve the site. You can refuse.', 'Accept', 'Refuse', 'Privacy']
      : ['Nous utilisons des cookies pour mesurer nos publicités et améliorer le site. Vous pouvez refuser.', 'Accepter', 'Refuser', 'Confidentialité'];
    var priv = L === 'en' ? '/en/privacy.html' : '/confidentialite.html';
    var b = document.createElement('div'); b.id = 'ds-consent'; b.setAttribute('role', 'dialog'); b.setAttribute('aria-label', 'Cookies');
    b.innerHTML = '<p>' + txt[0] + ' <a href="' + priv + '">' + txt[3] + '</a></p><div><button type="button" id="ds-no">' + txt[2] + '</button><button type="button" id="ds-yes">' + txt[1] + '</button></div>';
    var st = document.createElement('style');
    st.textContent = '#ds-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:60;max-width:560px;margin:0 auto;background:#fff;color:#141414;border:1px solid #E7E3DC;box-shadow:0 12px 40px rgba(0,0,0,.14);padding:18px 20px;display:flex;gap:18px;align-items:center;flex-wrap:wrap;font-size:14px;line-height:1.5}#ds-consent p{margin:0;flex:1 1 260px}#ds-consent a{text-decoration:underline}#ds-consent div{display:flex;gap:10px}#ds-consent button{font:inherit;font-size:12px;letter-spacing:.14em;text-transform:uppercase;padding:12px 16px;border:1px solid #141414;background:#fff;color:#141414;cursor:pointer}#ds-consent #ds-yes{background:#141414;color:#fff}@media(max-width:820px){#ds-consent{left:0;right:0;bottom:0;max-width:none;padding:10px 14px;gap:10px;font-size:13px;line-height:1.35;box-shadow:0 -6px 24px rgba(0,0,0,.12)}#ds-consent p{flex:1 1 180px}#ds-consent button{padding:9px 12px;font-size:11px}body.consent-open .wa{bottom:112px}}';
    document.head.appendChild(st);
    function mount() { document.body.insertBefore(b, document.body.firstChild); document.body.classList.add('consent-open');
      document.getElementById('ds-yes').onclick = function () { set(KEY, 'yes'); b.remove(); document.body.classList.remove('consent-open'); loadTrackers(); };
      document.getElementById('ds-no').onclick = function () { set(KEY, 'no'); b.remove(); document.body.classList.remove('consent-open'); }; }
    if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
  }
})();
