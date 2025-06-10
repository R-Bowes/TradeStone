# TradeStone

TradeStone is a simple demo web app for connecting people with trade professionals.
It showcases signup, login, and profile management features built with HTML and Tailwind CSS.
Firebase powers authentication, Firestore storage, and hosting of profile images.

## Setup

1. Create a Firebase project and copy its configuration.
2. Edit `firebase-init.js` in the project root and replace the placeholder credentials with your own.
3. Serve the static files using any web server (for example `npx serve .`) or open the HTML files directly in the browser.

## Usage

- Sign up via `signup.html` and choose whether you need a professional or personal account on that page.
- Log in through `login.html`, which will route you to the appropriate dashboard once authenticated.
- Professionals can create a profile which is stored in Firestore and displayed on the browse page.
- Error messages for login, signup, and account settings now appear directly on the page instead of using browser alert dialogs.

All pages import `firebase-init.js` which centralizes Firebase initialization. Update that file with your credentials and the app will use them across every page.