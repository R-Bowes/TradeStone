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

  return {
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
}

let services;

/**
 * Initialize Firebase app and return common services.
 * Subsequent calls return the same instances.
 */
export function initFirebase() {
  if (!services) {
    const cfg = buildConfig();
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
