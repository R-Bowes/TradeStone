# TradeStone

TradeStone is a simple demo web app for connecting people with trade professionals.
It showcases signup, login, and profile management features built with HTML and Tailwind CSS.
Firebase powers authentication, Firestore storage, and hosting of profile images.

## Setup

1. Create a Firebase project and copy its configuration.
2. Provide the credentials using environment variables or a config file:
   - Set variables like `FIREBASE_API_KEY` and `FIREBASE_AUTH_DOMAIN` when bundling/serving the app.
   - Or create `firebase-config.js` in the project root based on `firebase-config.example.js` and include it before `firebase-init.js` in your HTML.
3. Serve the static files using any web server (for example `npx serve .`) or open the HTML files directly in the browser.

## Usage

- Sign up via `signup.html` and choose either a professional or personal account.
- Log in through `login.html`, selecting the matching login type before entering credentials.
- Professionals can create a profile which is stored in Firestore and displayed on the browse page.
- Error messages for login, signup, and account settings now appear directly on the page instead of using browser alert dialogs.

### Marketplace

- Both professional and personal accounts can list surplus materials or tools from `marketplace.html` once signed in.
- Use the search bar on that page to look for items, filter by location, and apply the filter checkboxes to narrow the results.
- Free accounts may list items but cannot offer paid services; Pro accounts gain additional selling features.

### Blog

- Visit **Blog** from the burger menu to read community posts.
- When logged in, a form appears allowing you to publish a new post.
- Click a post title to view it on its own page. There you can comment and hit the **Hammer** button to like the post.
- Posting and commenting are restricted to authenticated users.

All pages import `firebase-init.js` which centralizes Firebase initialization. Supply credentials via environment variables or `firebase-config.js` and the app will use them across every page.

### Marketplace

- Browse items on `marketplace.html`. Use the sidebar to search by text, filter by location, and narrow results by category.
- Logged in users can list items from `post.html`. Upload images and provide details like price and condition.
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

### Messaging

- Visit **Messages** from the burger menu to chat with other users.
- Conversations appear on the left. Select one to view and send messages in real time.
