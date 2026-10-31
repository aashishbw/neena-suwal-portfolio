# Neena Suwal portfolio — Botpress-ready

This package preserves the portfolio, blog, photo, logo, downloadable CV, and WhatsApp link.

## Activate Botpress
1. Create and publish a bot at https://botpress.com/ .
2. In the Botpress dashboard, open your bot > Webchat > Deploy Settings.
3. Select the standard floating/toggle chat interface, and copy the Embed code.
4. Open `botpress-config.js`. Paste the **public** `https://cdn.botpress.cloud/webchat/.../inject.js` URL into `BOTPRESS_INJECT_URL`, and the `https://files.bpcontent.cloud/...js` URL into `BOTPRESS_BOT_CONFIG_URL`. Do not paste credentials.
5. Upload every file in this package to the root of your existing GitHub repository and commit. Vercel should redeploy automatically.
6. Test on desktop and mobile. Botpress's chat launcher will appear after a published bot's valid URLs are configured.

The Botpress widget is **not active** until you add your published bot's two public URLs. The previous unconfigured tawk.to integration has been removed to avoid duplicate chat widgets.

Review Neena's permission to publish the CV, photo, and WhatsApp number. Verify the number is registered on WhatsApp.


## Website editor
Open `/admin/` for Neena Studio, the visual website editor. See `SETUP.md` for Supabase authentication and publishing instructions.
