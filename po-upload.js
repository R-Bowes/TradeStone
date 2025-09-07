import { initFirebase } from './firebase-init.js';
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-storage.js';

const { db, auth, storage } = initFirebase();
const params = new URLSearchParams(window.location.search);
const contractId = params.get('id');

const form = document.getElementById('po-form');
const timelineEl = document.getElementById('status-timeline');

onAuthStateChanged(auth, user => {
  if (user) {
    form.addEventListener('submit', e => submitPO(e, user.uid));
    loadTimeline();
  }
});

async function submitPO(e, uid) {
  e.preventDefault();
  const file = document.getElementById('po-file').files[0];
  const status = document.getElementById('po-status').value.trim();
  if (!file) return;
  const r = ref(storage, `purchaseOrders/${contractId}/${uid}/${file.name}`);
  await uploadBytes(r, file);
  const url = await getDownloadURL(r);
  await addDoc(collection(db, 'contracts', contractId, 'purchaseOrders'), {
    user: uid,
    url,
    status,
    createdAt: serverTimestamp()
  });
  form.reset();
  await loadTimeline();
}

async function loadTimeline() {
  timelineEl.innerHTML = '';
  const snap = await getDocs(collection(db, 'contracts', contractId, 'purchaseOrders'));
  snap.forEach(d => {
    const data = d.data();
    const li = document.createElement('li');
    const created = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
    li.textContent = `${data.status || 'Uploaded'} - ${created.toLocaleString()}`;
    timelineEl.appendChild(li);
  });
}
