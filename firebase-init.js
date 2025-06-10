import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-storage.js';

// Replace these credentials with your Firebase project configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAjA_fDLdSbIW6eRFDe4oKpfdB8O4Ix4zo',
  authDomain: 'tradestone-efb30.firebaseapp.com',
  databaseURL: 'https://tradestone-efb30-default-rtdb.firebaseio.com',
  projectId: 'tradestone-efb30',
  storageBucket: 'tradestone-efb30.appspot.com',
  messagingSenderId: '761717818779',
  appId: '1:761717818779:web:05287865a076dbfed68d3e',
  measurementId: 'G-TM9DK5H25J'
};

let services;

/**
 * Initialize Firebase app and return common services.
 * Subsequent calls return the same instances.
 */
export function initFirebase() {
  if (!services) {
    const app = initializeApp(firebaseConfig);
    services = {
      app,
      auth: getAuth(app),
      db: getFirestore(app),
      storage: getStorage(app)
    };
  }
  return services;
}
