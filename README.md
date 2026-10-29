# Neena Suwal — Portfolio with Live Chat + WhatsApp

Static HTML/CSS/JS portfolio. Deploy to Vercel by uploading the files to the root of your existing GitHub repository.

## Live chat: free tawk.to account required
1. Sign up or log in at https://www.tawk.to/.
2. Create a property for Neena Suwal's website using its **actual deployed Vercel URL**.
3. Open tawk.to Dashboard → Administration → Chat Widget and locate the embed script.
4. In that script, find the URL `https://embed.tawk.to/PROPERTY_ID/WIDGET_ID`.
5. Open `chat-config.js` and replace the two empty strings with those two IDs only.
6. Commit the updated file to GitHub; Vercel will redeploy. The tawk.to bubble then appears automatically.
7. Sign in to the tawk.to dashboard or mobile app to receive and answer chats. Set up notifications and availability there.

**Important:** Live chat is not active until the property/widget IDs are entered. Do not add API secrets to frontend code. AI Assist is optional and subject to its current plan limits.

## WhatsApp
The floating WhatsApp button is already linked to the phone number shown on Neena's CV: +977 9840484114. **Confirm with Neena that this number is on WhatsApp and she wants it publicly linked** before publishing. If not, replace `9779840484114` in `index.html` with her approved WhatsApp number, or remove the WhatsApp button.

## Deployment
Upload all six files (`index.html`, `style.css`, `script.js`, `chat-config.js`, `neena-logo.png`, `README.md`) to the existing GitHub repository root and commit. The site needs no build command or environment variables.


## Download CV
The Download CV links in the navigation and homepage download `Neena-Suwal-CV.pdf` from the repository root. The original supplied CV is included unchanged.


Portrait update: `neena-photo.jpg` is shown in the homepage hero section. Upload it along with the updated `index.html` and `style.css`.
