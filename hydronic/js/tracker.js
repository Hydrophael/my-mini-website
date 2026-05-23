(function() {
  
  const EMAILJS_PUBLIC_KEY  = 'o9jC1pfYTwvFVR2T4';   
  const EMAILJS_SERVICE_ID  = 'service_y15cv6z';   
  const EMAILJS_TEMPLATE_ID = 'template_75zl08i';  

  function getDeviceInfo() {
    const ua = navigator.userAgent;

    
    let os = 'Unknown OS';
    if (/Windows NT 10/.test(ua))       os = 'Windows 10/11';
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

    
    const screen = `${window.screen.width}×${window.screen.height} (viewport: ${window.innerWidth}×${window.innerHeight})`;

    
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';

    
    const lang = navigator.language || navigator.userLanguage || 'Unknown';

    
    const now = new Date();
    const timeVisited = now.toLocaleString('id-ID', {
      weekday:'long', year:'numeric', month:'long',
      day:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit',
      timeZoneName:'short'
    });

    return { os, browser, device, screen, timezone, lang, timeVisited };
  }

  async function trackVisitor() {
    try {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

      
      let ip = 'Unknown', country = 'Unknown', region = 'Unknown',
          city = 'Unknown', isp = 'Unknown', lat = '-', lon = '-';

      try {
        const res  = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        country = data.country_name || 'Unknown';
        region  = data.region   || 'Unknown';
        city    = data.city     || 'Unknown';
        lat     = data.latitude || '-';
        lon     = data.longitude|| '-';
      } catch(_) {  }

      const { os, browser, device, screen, timezone, lang, timeVisited } = getDeviceInfo();

      const templateParams = {
        
        visit_time    : timeVisited,
        
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
      };

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .catch(() => {}); 

    } catch(_) {  }
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