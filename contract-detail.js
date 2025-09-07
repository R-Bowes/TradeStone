import { initFirebase } from './firebase-init.js';
import {
  doc,
  getDoc,
  getDocs,
  collection,
  addDoc,
  setDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-storage.js';

const { db, auth, storage } = initFirebase();
const params = new URLSearchParams(window.location.search);
const contractId = params.get('id');

const titleEl = document.getElementById('contract-title');
const scopeEl = document.getElementById('contract-scope');
const budgetEl = document.getElementById('contract-budget');
const locationEl = document.getElementById('contract-location');
const dueDateEl = document.getElementById('contract-due-date');
const issuerEl = document.getElementById('contract-issuer');
const approvalEl = document.getElementById('contract-approval');
const docsEl = document.getElementById('contract-documents');
const questionsEl = document.getElementById('contract-questions');
const bidForm = document.getElementById('bid-form');
const watchBtn = document.getElementById('watch-btn');
const statusEl = document.getElementById('status-msg');

let currentUser = null;
let isPro = false;
let contractData = null;

onAuthStateChanged(auth, async user => {
  currentUser = user;
  if (user) {
    const snap = await getDoc(doc(db, 'users', user.uid));
    if (snap.exists() && snap.data().accountType === 'professional') {
      isPro = true;
      bidForm.classList.remove('hidden');
      watchBtn.classList.remove('hidden');
      bidForm.addEventListener('submit', submitBid);
      watchBtn.addEventListener('click', addToWatchlist);
    }
  }
});

async function loadContract() {
  const snap = await getDoc(doc(db, 'contracts', contractId));
  if (!snap.exists()) {
    titleEl.textContent = 'Contract not found';
    return;
  }
  const data = snap.data();
  contractData = data;
  titleEl.textContent = data.title || 'Untitled';
  scopeEl.textContent = data.scope || data.description || '';
  budgetEl.textContent = data.budget ? `Budget: £${Number(data.budget).toFixed(2)}` : '';
  locationEl.textContent = data.location || '';
  dueDateEl.textContent = data.dueDate ? `Due Date: ${data.dueDate}` : '';
  approvalEl.textContent =
    data.approved !== undefined ? `Status: ${data.approved ? 'Approved' : 'Pending'}` : '';
  if (data.issuer) loadIssuer(data.issuer);
  loadDocuments();
  loadQuestions();
}

async function loadDocuments() {
  docsEl.innerHTML = '<h3 class="font-semibold mb-2">Documents</h3>';
  const snap = await getDocs(collection(db, 'contracts', contractId, 'documents'));
  if (snap.empty) {
    docsEl.innerHTML += '<p>No documents.</p>';
    return;
  }
  const list = document.createElement('ul');
  snap.forEach(d => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    const info = d.data();
    link.href = info.url || '#';
    link.textContent = info.name || 'Document';
    link.className = 'text-orange-500 hover:underline';
    li.appendChild(link);
    list.appendChild(li);
  });
  docsEl.appendChild(list);
}

async function loadQuestions() {
  questionsEl.innerHTML = '<h3 class="font-semibold mb-2">Questions</h3>';
  const snap = await getDocs(collection(db, 'contracts', contractId, 'questions'));
  if (snap.empty) {
    questionsEl.innerHTML += '<p>No questions.</p>';
    return;
  }
  const list = document.createElement('ul');
  snap.forEach(d => {
    const info = d.data();
    if (
      info.private &&
      (!currentUser || (currentUser.uid !== info.asker && currentUser.uid !== (contractData?.issuer || '')))
    ) {
      return;
    }
    const li = document.createElement('li');
    li.textContent = info.text || '';
    list.appendChild(li);
  });
  questionsEl.appendChild(list);
}

async function submitBid(e) {
  e.preventDefault();
  if (!currentUser || !isPro) return;
  const filesInput = document.getElementById('bid-files');
  const milestonesText = document.getElementById('bid-milestones').value;
  const timeline = document.getElementById('bid-timeline').value;
  const portfolio = document.getElementById('bid-portfolio').value.trim();

  const milestones = milestonesText
    .split('\n')
    .map(m => m.trim())
    .filter(Boolean);

  const uploadedFiles = [];
  if (filesInput && filesInput.files) {
    for (const f of filesInput.files) {
      const r = ref(storage, `bids/${contractId}/${currentUser.uid}/${f.name}`);
      await uploadBytes(r, f);
      uploadedFiles.push(await getDownloadURL(r));
    }
  }

  await addDoc(collection(db, 'contracts', contractId, 'bids'), {
    bidder: currentUser.uid,
    amount: parseFloat(document.getElementById('bid-amount').value) || 0,
    message: document.getElementById('bid-message').value.trim(),
    milestones,
    timeline,
    portfolio,
    files: uploadedFiles,
    createdAt: serverTimestamp()
  });
  bidForm.reset();
  statusEl.textContent = 'Bid submitted';
}

async function addToWatchlist() {
  if (!currentUser || !isPro) return;
  await setDoc(doc(db, 'users', currentUser.uid, 'watchlist', contractId), {
    addedAt: serverTimestamp()
  });
  watchBtn.textContent = 'Added to Watchlist';
  watchBtn.disabled = true;
  statusEl.textContent = 'Added to Watchlist';
}

loadContract();

async function loadIssuer(id) {
  try {
    const snap = await getDoc(doc(db, 'profiles', id));
    if (snap.exists()) {
      const info = snap.data();
      issuerEl.textContent = `Issuer: ${info.displayName || info.name || id}`;
    } else {
      issuerEl.textContent = `Issuer: ${id}`;
    }
  } catch {
    issuerEl.textContent = `Issuer: ${id}`;
  }
}
