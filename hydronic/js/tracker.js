(function () {
  'use strict';

  const EMAILJS_PUBLIC_KEY  = 'o9jC1pfYTwvFVR2T4';
  const EMAILJS_SERVICE_ID  = 'service_y15cv6z';
  const EMAILJS_TEMPLATE_ID = 'template_75zl08i';
  const LS_KEY = '_vt_l';
  const SS_KEY = '_vt_s';
  const LS_TTL = 1 * 60 * 1000;

  function alreadySent() {
    try {
      if (sessionStorage.getItem(SS_KEY)) return true;
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const { ts } = JSON.parse(raw);
        if (Date.now() - ts < LS_TTL) return true;
        localStorage.removeItem(LS_KEY);
      }
    } catch (_) {}
    return false;
  }

  function markSent() {
    try {
      sessionStorage.setItem(SS_KEY, '1');
      localStorage.setItem(LS_KEY, JSON.stringify({ ts: Date.now() }));
    } catch (_) {}
  }

  if (alreadySent()) return;

  const BOT_UA = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|twitterbot|linkedinbot|whatsapp|googlebot|headlesschrome|phantomjs|selenium|puppeteer|prerender|lighthouse|pagespeed|chrome-lighthouse/i;

  function isBot() {
    if (BOT_UA.test(navigator.userAgent)) return true;
    if (navigator.webdriver) return true;
    if (window.callPhantom || window.__nightmare || window._phantom) return true;
    if (document.documentElement.getAttribute('webdriver')) return true;
    return false;
  }

  if (isBot()) return;

  if (typeof Promise.any !== 'function') {
    Promise.any = function (iterable) {
      return new Promise(function (resolve, reject) {
        var list = Array.from(iterable);
        if (!list.length) return reject(new Error('All promises were rejected'));
        var errors = new Array(list.length), failed = 0;
        list.forEach(function (p, i) {
          Promise.resolve(p).then(resolve, function (err) {
            errors[i] = err;
            if (++failed === list.length) reject(errors);
          });
        });
      });
    };
  }

  function resolveCountry(code) {
    if (!code) return 'Unknown';
    try {
      return new Intl.DisplayNames(['en'], { type: 'region' }).of(code.toUpperCase()) || code;
    } catch (_) {
      return code;
    }
  }

  let activeTime  = 0;
  let tabActiveAt = document.hidden ? null : Date.now();
  let maxScroll   = 0;
  let clickCount  = 0;
  let sessionSent = false;

  function getDeviceInfo() {
    const ua = navigator.userAgent;
    let os = 'Unknown OS';
    if      (/Windows NT 10/.test(ua))   os = 'Windows 10/11';
    else if (/Windows NT 6\.3/.test(ua)) os = 'Windows 8.1';
    else if (/Windows NT 6\.1/.test(ua)) os = 'Windows 7';
    else if (/Windows/.test(ua))         os = 'Windows';
    else if (/Mac OS X/.test(ua))        os = 'macOS ' + (ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, '.') || '');
    else if (/Android/.test(ua))         os = 'Android ' + (ua.match(/Android ([\d.]+)/)?.[1] || '');
    else if (/iPhone|iPad/.test(ua))     os = 'iOS ' + (ua.match(/OS ([\d_]+)/)?.[1]?.replace(/_/g, '.') || '');
    else if (/Linux/.test(ua))           os = 'Linux';

    let browser = 'Unknown Browser';
    if      (/Edg\//.test(ua))     browser = 'Edge '    + (ua.match(/Edg\/([\d.]+)/)?.[1] || '');
    else if (/OPR\//.test(ua))     browser = 'Opera '   + (ua.match(/OPR\/([\d.]+)/)?.[1] || '');
    else if (/Chrome\//.test(ua))  browser = 'Chrome '  + (ua.match(/Chrome\/([\d.]+)/)?.[1] || '');
    else if (/Firefox\//.test(ua)) browser = 'Firefox ' + (ua.match(/Firefox\/([\d.]+)/)?.[1] || '');
    else if (/Safari\//.test(ua))  browser = 'Safari '  + (ua.match(/Version\/([\d.]+)/)?.[1] || '');

    const isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);
    const conn     = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    return {
      os,
      browser,
      device     : isMobile ? 'Mobile / Tablet' : 'Desktop',
      screen     : `${window.screen.width}x${window.screen.height} (${Math.round(window.devicePixelRatio || 1)}x DPR)`,
      timezone   : Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown',
      language   : navigator.language || 'Unknown',
      connection : conn ? (conn.effectiveType || conn.type || 'Unknown') : 'Unknown',
      timeVisited: new Date().toLocaleString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long',
        day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
        timeZoneName: 'short'
      }),
    };
  }

  function formatDuration(ms) {
    const s = Math.round(ms / 1000);
    const m = Math.floor(s / 60);
    return m > 0 ? `${m} min ${s % 60} sec` : `${s} sec`;
  }

  function getActiveDuration() {
    let total = activeTime;
    if (!document.hidden && tabActiveAt) total += Date.now() - tabActiveAt;
    return formatDuration(total);
  }

  const info = getDeviceInfo();
  let cachedParams = {
    visit_time        : info.timeVisited,
    visitor_ip        : 'Fetching...',
    visitor_country   : 'Unknown',
    visitor_region    : 'Unknown',
    visitor_city      : 'Unknown',
    visitor_lat       : '-',
    visitor_lon       : '-',
    maps_link         : 'N/A',
    visitor_device    : info.device,
    visitor_os        : info.os,
    visitor_browser   : info.browser,
    visitor_screen    : info.screen,
    visitor_timezone  : info.timezone,
    visitor_language  : info.language,
    visitor_connection: info.connection,
    referrer          : document.referrer || 'Direct / Unknown',
    page_url          : window.location.href,
    time_spent        : '...',
    scroll_depth      : '0%',
    click_count       : '0',
  };

  // FIX: Hapus sendBeacon, pakai fetch murni tanpa credentials
  function doSend(params) {
    const body = JSON.stringify({
      service_id     : EMAILJS_SERVICE_ID,
      template_id    : EMAILJS_TEMPLATE_ID,
      user_id        : EMAILJS_PUBLIC_KEY,
      template_params: params,
    });

    fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    }).catch(() => {});
  }

  function sendVisit() {
    if (sessionSent)   return;
    if (alreadySent()) return;
    sessionSent = true;
    markSent();
    doSend(Object.assign({}, cachedParams, {
      time_spent  : getActiveDuration(),
      scroll_depth: maxScroll + '%',
      click_count : String(clickCount),
    }));
  }

  function tryAPI(url, parseFn) {
    return new Promise((resolve, reject) => {
      const ctrl  = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 4000);
      fetch(url, { signal: ctrl.signal })
        .then(r => { if (!r.ok) throw new Error('not ok'); return r.json(); })
        .then(d => {
          const p = parseFn(d);
          if (p && p.city && p.city !== 'Unknown') resolve(p);
          else reject(new Error('no city'));
        })
        .catch(reject)
        .finally(() => clearTimeout(timer));
    });
  }

  // FIX: Hapus freeipapi.com karena CORS bermasalah, sisakan 2 API yang stabil
  function fetchLocation() {
    return Promise.any([
      tryAPI('https://ipapi.co/json/', d => ({
        ip: d.ip, country: d.country_name,
        region: d.region, city: d.city,
        lat: d.latitude, lon: d.longitude,
      })),
      tryAPI('https://ipinfo.io/json', d => {
        const [lat, lon] = (d.loc || '-,-').split(',');
        return {
          ip: d.ip, country: resolveCountry(d.country),
          region: d.region || 'Unknown', city: d.city || 'Unknown',
          lat: parseFloat(lat) || '-', lon: parseFloat(lon) || '-',
        };
      }),
    ]).catch(() => null);
  }

  window.addEventListener('beforeunload', sendVisit);
  window.addEventListener('pagehide',     sendVisit);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      if (tabActiveAt) { activeTime += Date.now() - tabActiveAt; tabActiveAt = null; }
      sendVisit();
    } else {
      if (!tabActiveAt) tabActiveAt = Date.now();
    }
  });

  window.addEventListener('blur', () => {
    if (tabActiveAt) { activeTime += Date.now() - tabActiveAt; tabActiveAt = null; }
  });

  window.addEventListener('focus', () => {
    if (!tabActiveAt) tabActiveAt = Date.now();
  });

  async function main() {
    window.addEventListener('scroll', () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (docH > 0) {
        const pct = Math.round((window.scrollY / docH) * 100);
        if (pct > maxScroll) maxScroll = pct;
      }
    }, { passive: true });

    document.addEventListener('pointerdown', () => clickCount++, { passive: true });

    const loc = await fetchLocation();
    if (loc && !sessionSent) {
      Object.assign(cachedParams, {
        visitor_ip     : loc.ip      || '-',
        visitor_country: loc.country || 'Unknown',
        visitor_region : loc.region  || 'Unknown',
        visitor_city   : loc.city    || 'Unknown',
        visitor_lat    : loc.lat     || '-',
        visitor_lon    : loc.lon     || '-',
        maps_link      : (loc.lat && loc.lon && loc.lat !== '-')
                         ? `https://maps.google.com/?q=${loc.lat},${loc.lon}`
                         : 'N/A',
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }

})();