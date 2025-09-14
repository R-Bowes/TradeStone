import { initFirebase } from './firebase-init.js';
import {
  collection,
  getDocs,
  updateDoc,
  doc
} from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js';

const { db, auth } = initFirebase();
const listEl = document.getElementById('pending-listings');

onAuthStateChanged(auth, user => {
  if (user) {
    loadListings();
  }
});

async function loadListings() {
  listEl.innerHTML = '';
  const snap = await getDocs(collection(db, 'contracts'));
  snap.forEach(d => {
    const data = d.data();
    if (data.status === 'pending') {
      const div = document.createElement('div');
      div.className = 'border p-2 mb-4';
      const title = document.createElement('h3');
      title.className = 'font-semibold';
      title.textContent = data.title || 'Untitled';
      const suggestion = document.createElement('p');
      suggestion.className = 'text-sm text-gray-600 mb-2';
      suggestion.textContent = suggestImprovement(data.description || '');
      const approve = document.createElement('button');
      approve.className = 'bg-green-500 text-white px-2 py-1 rounded mr-2';
      approve.textContent = 'Approve';
      approve.onclick = () => updateDoc(doc(db, 'contracts', d.id), { status: 'approved' });
      const reject = document.createElement('button');
      reject.className = 'bg-red-500 text-white px-2 py-1 rounded';
      reject.textContent = 'Reject';
      reject.onclick = () => updateDoc(doc(db, 'contracts', d.id), { status: 'rejected' });
      div.append(title, suggestion, approve, reject);
      listEl.appendChild(div);
    }
  });
}

function suggestImprovement(description) {
  if (!description) return 'Add a detailed description to attract better bids.';
  return description.length < 50 ? 'Consider providing more details.' : 'Looks good!';
}
