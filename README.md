# TradeStone

TradeStone is a simple demo web app for connecting people with trade professionals.
It showcases signup, login, and profile management features built with HTML and Tailwind CSS.
Firebase powers authentication, Firestore storage, and hosting of profile images.

## Setup

1. Ensure you have a Firebase project and replace the configuration found in the HTML files with your own credentials.
2. Serve the static files using any web server (for example `npx serve .`) or open the HTML files directly in the browser.

## Usage

- Sign up via `signup.html` selecting either a personal or professional account.
- Login through `login.html` to access the respective dashboard.
- Professionals can create a profile which is stored in Firestore and displayed on the browse page.

Firebase configuration snippets are included in the HTML files and must be customized for your own project.

