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
    apiKey: env.FIREBASE_API_KEY || cfg.apiKey || 'AIzaSyAjA_fDLdSbIW6eRFDe4oKpfdB8O4Ix4zo',
    authDomain: env.FIREBASE_AUTH_DOMAIN || cfg.authDomain || 'tradestone-efb30.firebaseapp.com',
    databaseURL: env.FIREBASE_DATABASE_URL || cfg.databaseURL || 'https://tradestone-efb30-default-rtdb.firebaseio.com',
    projectId: env.FIREBASE_PROJECT_ID || cfg.projectId || 'tradestone-efb30',
    storageBucket: env.FIREBASE_STORAGE_BUCKET || cfg.storageBucket || 'tradestone-efb30.firebasestorage.app',
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID || cfg.messagingSenderId || '761717818779',
    appId: env.FIREBASE_APP_ID || cfg.appId || '1:761717818779:web:05287865a076dbfed68d3e',
    measurementId: env.FIREBASE_MEASUREMENT_ID || cfg.measurementId || 'G-TM9DK5H25J',
    appCheckSiteKey: env.FIREBASE_APPCHECK_SITE_KEY || cfg.appCheckSiteKey || '060696'
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
