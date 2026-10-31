/* Botpress setup: paste the TWO public script URLs from your published bot's
   Botpress Dashboard > Webchat > Deploy Settings > Embed code below.
   Do not paste private API keys or access tokens.
   Leave blank until your bot is published; website works without it. */
const BOTPRESS_INJECT_URL = "";
const BOTPRESS_BOT_CONFIG_URL = "";

if (BOTPRESS_INJECT_URL && BOTPRESS_BOT_CONFIG_URL) {
  const validInject = /^https:\/\/cdn\.botpress\.cloud\/webchat\/[^\s]+\/inject\.js(?:\?.*)?$/.test(BOTPRESS_INJECT_URL);
  const validConfig = /^https:\/\/files\.bpcontent\.cloud\/[^\s]+\.js(?:\?.*)?$/.test(BOTPRESS_BOT_CONFIG_URL);
  if (validInject && validConfig) {
    const loader = document.createElement('script');
    loader.src = BOTPRESS_INJECT_URL;
    loader.async = true;
    loader.onload = () => {
      const config = document.createElement('script');
      config.src = BOTPRESS_BOT_CONFIG_URL;
      config.async = true;
      document.head.appendChild(config);
    };
    document.head.appendChild(loader);
    document.body.classList.add('botpress-enabled');
  } else {
    console.warn('Botpress embed URLs must be the two public URLs from Webchat Deploy Settings.');
  }
}
