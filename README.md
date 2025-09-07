# TradeStone

TradeStone is a simple demo web app for connecting people with trade professionals.
It showcases signup, login, and profile management features built with HTML and Tailwind CSS.
Supabase powers authentication, database storage, and hosting of profile images.

## Setup

1. This demo is preconfigured for the Supabase project at `https://ifjapjnxgkgtyjqlrriu.supabase.co`.
2. The repository includes `supabase-config.js` with the project's anon key.
    - You can replace the key by editing this file or by setting the `SUPABASE_KEY` environment variable when bundling or serving the app.
    - If no key is provided, `supabase-init.js` throws an error to help diagnose the missing configuration.
3. Serve the static files using any web server (for example `npx serve .`) or open the HTML files directly in the browser.

## Usage

- Sign up via `signup.html` and choose either a professional or personal account.
- Log in through `personal-login.html`, selecting the matching login type before entering credentials.
- Professionals can create a profile which is stored in Supabase and displayed on the browse page.
- Error messages for login, signup, and account settings appear directly on the page instead of using browser alert dialogs.

All pages import `supabase-init.js` which centralizes Supabase initialization. Supply credentials via environment variables or `supabase-config.js` and the app will use them across every page.
