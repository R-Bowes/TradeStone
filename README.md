# TradeStone

TradeStone is a simple demo web app for connecting people with trade professionals.
It showcases signup, login, and profile management features built with HTML and Tailwind CSS.
Firebase powers authentication, Firestore storage, and hosting of profile images.

## Setup

1. Create a Firebase project and copy its configuration.
2. Provide the credentials using environment variables or a config file:
   - Set variables like `FIREBASE_API_KEY` and `FIREBASE_AUTH_DOMAIN` when bundling/serving the app.
   - Or create `firebase-config.js` in the project root based on `firebase-config.example.js` and include it before `firebase-init.js` in your HTML.
   - After copying, edit `firebase-config.js` and replace every `<PLACEHOLDER>` with the actual values from your Firebase project.
3. Serve the static files using any web server (for example `npx serve .`) or open the HTML files directly in the browser.

## Firebase App Check

Protect your backend resources by enabling App Check with reCAPTCHA&nbsp;v3.

1. In the Firebase console open **App Check** and register your web app using the **reCAPTCHA v3** provider.
2. Copy the generated site key and set it as `appCheckSiteKey` via environment variables or in `firebase-config.js`.
3. `firebase-init.js` calls `initializeAppCheck` with this key so tokens are automatically refreshed when running in the browser.

See the [Firebase documentation](https://firebase.google.com/docs/app-check/web/recaptcha-provider) for full instructions.

## Production Security Rules

Sample notes mention temporary open rules for Firestore and Realtime Database. Before deploying, write restrictive rules that only allow the actions your app requires.

- Follow the [Firestore Security Rules guide](https://firebase.google.com/docs/firestore/security/get-started) to define document-level permissions and validation.
- Use the [Realtime Database Rules guide](https://firebase.google.com/docs/database/security) to secure any realtime chat data.

Apply the updated rules in the Firebase console or with the Firebase CLI.

## Usage

- Sign up via `signup.html` and choose either a professional or personal account.
- Log in through `login.html`, selecting the matching login type before entering credentials.
- Professionals can create a profile which is stored in Firestore and displayed on the browse page.
- Error messages for login, signup, and account settings now appear directly on the page instead of using browser alert dialogs.

### Marketplace
- Browse or list surplus materials on `marketplace.html`. Both personal and professional users can create listings once signed in.
- Use the search bar and sidebar filters to find items by text, location, or category.
- Post new items from `post.html` by uploading images and details like price and condition.
- Items are stored in the `marketplaceItems` collection with fields:
  - `title` – item name
  - `description` – full text description
  - `price` – numeric price in GBP
  - `condition` – `New` or `Used`
  - `category` – one of the available categories
  - `location` – where the item is located
  - `images` – array of download URLs (optional)
  - `postedBy` – UID of the user who created the listing
  - `createdAt` – Firestore timestamp
- Free accounts may list items but cannot offer paid services; Pro accounts gain additional selling features.
### Blog

- Visit **Blog** from the burger menu to read community posts.
- When logged in, a form appears allowing you to publish a new post.
- Click a post title to view it on its own page. There you can comment and hit the **Hammer** button to like the post.
- Posting and commenting are restricted to authenticated users.

All pages import `firebase-init.js` which centralizes Firebase initialization. Supply credentials via environment variables or `firebase-config.js` and the app will use them across every page.


### Contracts

- Browse contract opportunities on `contracts.html`. Use the sidebar filters to search by text or location.
- Professional accounts can create new listings from `post-contract.html`.
- The posting form mirrors the professional profile screen, with familiar text fields, file uploads, and date pickers.
- Applications are stored in the `applications` subcollection of each contract document.

### Messaging

- Visit **Messages** from the burger menu to chat with other users.
- Conversations appear on the left. Select one to view and send messages in real time.

### Test Accounts

A small utility script is included to spin up demo users so you can showcase the
site without cluttering your real database. The script uses the Firebase Admin
SDK and requires a service account JSON key.

1. Install dependencies using `npm install` (requires internet access).
2. Export the path to your service account key:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json
   ```
3. Create the demo users:
   ```bash
   node scripts/manage-test-users.js create
   ```
   Two accounts will be created:
   - `demo-personal@example.com` (password `demopass`)
   - `demo-professional@example.com` (password `demopass`)
4. When finished testing, remove them with:
   ```bash
   node scripts/manage-test-users.js delete
   ```

The script adds the appropriate documents to the `users` collection so the demo
accounts behave like normal ones and can post in the marketplace or create
profiles. Deleting removes the auth user and related Firestore document.

### Sample Data

Need some content to showcase the browse pages? Seed Firestore with example
profiles, contracts and marketplace items using the provided script. Make sure
`GOOGLE_APPLICATION_CREDENTIALS` points at your service account as described
above and then run:

```bash
node scripts/seed-sample-data.js
```

This will create a handful of fake professionals, contract listings and items so
the `Browse Professionals`, `Contracts` and `Marketplace` pages display sample
results.
