/* Tawk.to setup: replace the empty strings with your Property ID and Widget ID.
   Find both in tawk.to Dashboard > Administration > Chat Widget > Direct Chat Link / Widget Code.
   Do not paste a password or API secret here. */
const TAWK_PROPERTY_ID = "";
const TAWK_WIDGET_ID = "";
if (TAWK_PROPERTY_ID && TAWK_WIDGET_ID) {
  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_LoadStart = new Date();
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://embed.tawk.to/${encodeURIComponent(TAWK_PROPERTY_ID)}/${encodeURIComponent(TAWK_WIDGET_ID)}`;
  script.charset = "UTF-8";
  script.setAttribute("crossorigin", "*");
  document.head.appendChild(script);
  document.body.classList.add("tawk-enabled");
}
