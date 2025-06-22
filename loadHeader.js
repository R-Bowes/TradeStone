import { initFirebase } from './firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js';

export async function loadHeader() {
  const container = document.getElementById('header');
  if (!container) return;
  try {
    const res = await fetch('header.html');
    container.innerHTML = await res.text();
    const btn = container.querySelector('#burger-btn');
    const menu = container.querySelector('#burger-menu');
    if (btn && menu) {
      btn.addEventListener('click', () => {
        menu.classList.toggle('translate-x-full');
        menu.classList.toggle('hidden');
      });
    }

    // Update profile link based on logged in user
    const link = container.querySelector('#profile-link');
    if (link) {
      const { auth, db } = initFirebase();
      onAuthStateChanged(auth, async user => {
        if (!user) {
          link.href = 'login.html';
          return;
        }
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists() && snap.data().accountType === 'professional') {
            link.href = 'professional-dashboard.html';
          } else {
            link.href = 'personal-dashboard.html';
          }
        } catch {
          link.href = 'personal-dashboard.html';
        }
      });
    }
  } catch (err) {
    console.error('Failed to load header:', err);
  }
}
