# Neena Studio — website editor setup

Open `/admin/` after uploading the files to GitHub and deploying to Vercel. In **Visual editor**, click text in the website preview to edit it. The draft is stored in the browser. The website itself is **not changed** until you set up Supabase and click Publish.

## Enable publishing (Supabase)
1. Create a Supabase project. In **Authentication → Users**, invite/create the editor user with a strong password. Disable public signup unless needed.
2. In **SQL Editor**, run `supabase-setup.sql` from this package.
3. Find the approved user's UUID in Authentication → Users, then run: `insert into public.admin_users(user_id) values ('YOUR-USER-UUID');`.
4. In `site-config.js`, fill in your project URL and **public anon/publishable key**. Do **not** use the service-role or secret key.
5. Upload the complete package (including `admin/` directory) to the GitHub repository root and commit. Vercel will redeploy.
6. Visit `/admin/` → Publish & setup → sign in with approved user credentials. Edit content in Visual editor and press **Publish changes**. Reload the public site.

## Important limitations
- The editor updates mapped text and four theme colors. It does not upload new images, edit the full blog article body, or automatically change files in GitHub.
- Supabase is the shared content store. GitHub continues to host the static site, and Vercel serves it. Public pages load published content from Supabase.
- No backend or Supabase credentials are included. A secure publish feature requires the setup above.
- Botpress remains inactive until valid published bot embed URLs are set in `botpress-config.js`.
- Review the CV, image, and phone number with Neena before publication.
