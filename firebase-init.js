import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-storage.js';
import { initializeAppCheck, ReCaptchaV3Provider } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-app-check.js';

/**
 * Build the Firebase configuration using environment variables when available
 * or values exposed on `window.firebaseConfig` via a separate config file.
 */
function buildConfig() {
  const env = (typeof process !== 'undefined' && process.env) ? process.env : {};
  const win = (typeof window !== 'undefined' ? window : {});
  const cfg = win.firebaseConfig || {};

  const config = {
    apiKey: env.FIREBASE_API_KEY || cfg.apiKey || '<API_KEY>',
    authDomain: env.FIREBASE_AUTH_DOMAIN || cfg.authDomain || '<AUTH_DOMAIN>',
    databaseURL: env.FIREBASE_DATABASE_URL || cfg.databaseURL || '<DATABASE_URL>',
    projectId: env.FIREBASE_PROJECT_ID || cfg.projectId || '<PROJECT_ID>',
    storageBucket: env.FIREBASE_STORAGE_BUCKET || cfg.storageBucket || '<STORAGE_BUCKET>',
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID || cfg.messagingSenderId || '<MESSAGING_SENDER_ID>',
    appId: env.FIREBASE_APP_ID || cfg.appId || '<APP_ID>',
    measurementId: env.FIREBASE_MEASUREMENT_ID || cfg.measurementId || '<MEASUREMENT_ID>',
    appCheckSiteKey: env.FIREBASE_APPCHECK_SITE_KEY || cfg.appCheckSiteKey || '<APPCHECK_SITE_KEY>'
  };

  const missing = Object.entries(config)
    .filter(([, v]) => /^<.*>$/.test(v))
    .map(([k]) => k);

  if (missing.length) {
    const msg =
      'Missing Firebase configuration. Provide values for: ' + missing.join(', ');
    throw new Error(msg);
  }

  return config;
}

let services;

/**
 * Initialize Firebase app and return common services.
 * Subsequent calls return the same instances.
 */
export function initFirebase() {
  if (!services) {
    let cfg;
    try {
      cfg = buildConfig();
    } catch (err) {
      if (typeof document !== 'undefined') {
        const el = document.createElement('div');
        el.textContent = err.message;
        el.style.cssText = 'background:#fee;color:#b00;border:1px solid #f00;margin:1em;padding:.5em';
        document.body.prepend(el);
      }
      throw err;
    }
    const app = initializeApp(cfg);
    services = {
      app,
      auth: getAuth(app),
      db: getFirestore(app),
      storage: getStorage(app)
    };

    if (typeof window !== 'undefined') {
      services.appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(cfg.appCheckSiteKey),
        isTokenAutoRefreshEnabled: true
      });
    }
  }
  return services;
}
