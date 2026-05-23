(function() {

  const EMAILJS_PUBLIC_KEY  = 'o9jC1pfYTwvFVR2T4';
  const EMAILJS_SERVICE_ID  = 'service_y15cv6z';
  const EMAILJS_TEMPLATE_ID = 'template_75zl08i';

  let visitStart = null;
  let sessionSent = false;

  function getDeviceInfo() {
    const ua = navigator.userAgent;

    let os = 'Unknown OS';
    if (/Windows NT 10/.test(ua))        os = 'Windows 10/11';
    else if (/Windows NT 6\.3/.test(ua)) os = 'Windows 8.1';
    else if (/Windows NT 6\.1/.test(ua)) os = 'Windows 7';
    else if (/Windows/.test(ua))         os = 'Windows';
    else if (/Mac OS X/.test(ua))        os = 'macOS ' + (ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g,'.') || '');
    else if (/Android/.test(ua))         os = 'Android ' + (ua.match(/Android ([\d.]+)/)?.[1] || '');
    else if (/iPhone|iPad/.test(ua))     os = 'iOS ' + (ua.match(/OS ([\d_]+)/)?.[1]?.replace(/_/g,'.') || '');
    else if (/Linux/.test(ua))           os = 'Linux';

    let browser = 'Unknown Browser';
    if (/Edg\//.test(ua))          browser = 'Edge '    + (ua.match(/Edg\/([\d.]+)/)?.[1] || '');
    else if (/OPR\//.test(ua))     browser = 'Opera '   + (ua.match(/OPR\/([\d.]+)/)?.[1] || '');
    else if (/Chrome\//.test(ua))  browser = 'Chrome '  + (ua.match(/Chrome\/([\d.]+)/)?.[1] || '');
    else if (/Firefox\//.test(ua)) browser = 'Firefox ' + (ua.match(/Firefox\/([\d.]+)/)?.[1] || '');
    else if (/Safari\//.test(ua))  browser = 'Safari '  + (ua.match(/Version\/([\d.]+)/)?.[1] || '');

    const isMob = /Mobi|Android|iPhone|iPad/i.test(ua);
    const device = isMob ? 'Mobile / Tablet' : 'Desktop';

    const now = new Date();
    const timeVisited = now.toLocaleString('id-ID', {
      weekday:'long', year:'numeric', month:'long',
      day:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit',
      timeZoneName:'short'
    });

    return { os, browser, device, timeVisited };
  }

  function formatDuration(ms) {
    const totalSec = Math.round(ms / 1000);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    if (mins > 0) return `${mins} min ${secs} sec`;
    return `${secs} sec`;
  }

  function sendTimeSpent() {
    if (sessionSent || !visitStart) return;
    sessionSent = true;
    const duration = formatDuration(Date.now() - visitStart);
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      visit_time      : 'Session Ended',
      visitor_country : '—',
      visitor_region  : '—',
      visitor_city    : '—',
      visitor_lat     : '—',
      visitor_lon     : '—',
      maps_link       : '—',
      visitor_device  : '—',
      visitor_os      : '—',
      visitor_browser : '—',
      referrer        : `Time spent: ${duration}`,
      time_spent      : duration,
    }).catch(() => {});
  }

  async function trackVisitor() {
    try {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

      let country = 'Unknown', region = 'Unknown',
          city = 'Unknown', lat = '-', lon = '-';

      try {
        const res  = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        country = data.country_name || 'Unknown';
        region  = data.region       || 'Unknown';
        city    = data.city         || 'Unknown';
        lat     = data.latitude     || '-';
        lon     = data.longitude    || '-';
      } catch(_) {}

      const { os, browser, device, timeVisited } = getDeviceInfo();

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        visit_time      : timeVisited,
        visitor_country : country,
        visitor_region  : region,
        visitor_city    : city,
        visitor_lat     : lat,
        visitor_lon     : lon,
        maps_link       : (lat !== '-' && lon !== '-')
                          ? `https://maps.google.com/?q=${lat},${lon}`
                          : 'N/A',
        visitor_device  : device,
        visitor_os      : os,
        visitor_browser : browser,
        referrer        : document.referrer || 'Direct / Unknown',
        time_spent      : 'still visiting...',
      }).catch(() => {});

      visitStart = Date.now();

      window.addEventListener('beforeunload', sendTimeSpent);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') sendTimeSpent();
      });

    } catch(_) {}
  }

  (function waitAndTrack() {
    const loader = document.getElementById('loader');
    if (!loader) { setTimeout(waitAndTrack, 200); return; }
    const obs = new MutationObserver(() => {
      if (loader.classList.contains('out')) {
        obs.disconnect();
        trackVisitor();
      }
    });
    obs.observe(loader, { attributes: true, attributeFilter: ['class'] });
  })();
})();