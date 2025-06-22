import { initFirebase } from './firebase-init.js';
import { collection, getDocs, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js';

const { db, auth } = initFirebase();
let allContracts = [];
const list = document.getElementById('contract-list');

function createCard(contract) {
  const card = document.createElement('div');
  card.className = 'bg-white rounded-lg shadow p-4 flex flex-col space-y-2';

  const title = document.createElement('h2');
  title.className = 'text-lg font-bold';
  title.textContent = contract.title;
  card.appendChild(title);

  const desc = document.createElement('p');
  desc.className = 'text-sm text-gray-700';
  desc.textContent = contract.description;
  card.appendChild(desc);

  if (contract.location) {
    const loc = document.createElement('p');
    loc.className = 'text-sm text-gray-700';
    loc.textContent = contract.location;
    card.appendChild(loc);
  }

  if (contract.budget) {
    const bud = document.createElement('p');
    bud.className = 'text-sm text-gray-700';
    bud.textContent = `Budget: £${Number(contract.budget).toFixed(2)}`;
    card.appendChild(bud);
  }

  const btn = document.createElement('button');
  btn.textContent = 'Apply';
  btn.className = 'mt-auto bg-orange-500 text-white px-4 py-1 rounded';
  btn.addEventListener('click', () => applyForContract(contract.id));
  card.appendChild(btn);

  return card;
}

async function applyForContract(id) {
  const user = auth.currentUser;
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  try {
    await addDoc(collection(db, 'contracts', id, 'applications'), {
      applicant: user.uid,
      createdAt: serverTimestamp()
    });
    alert('Application submitted');
  } catch (err) {
    alert(err.message);
  }
}

function filterAndRender() {
  const search = document.getElementById('search').value.toLowerCase();
  const location = document.getElementById('location-filter').value.trim().toLowerCase();

  const filtered = allContracts.filter(c => {
    const matchText = !search || (c.title && c.title.toLowerCase().includes(search)) || (c.description && c.description.toLowerCase().includes(search));
    const matchLocation = !location || (c.location && c.location.toLowerCase().includes(location));
    return matchText && matchLocation;
  });

  list.innerHTML = '';
  if (filtered.length === 0) {
    list.innerHTML = '<p class="text-gray-700 text-center col-span-full">No contracts found.</p>';
  } else {
    filtered.forEach(c => list.appendChild(createCard(c)));
  }
}

async function loadContracts() {
  try {
    const snap = await getDocs(collection(db, 'contracts'));
    allContracts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    filterAndRender();
  } catch (err) {
    console.error('Error loading contracts:', err);
    list.innerHTML = '<p class="text-red-500 text-center col-span-full">Could not load contracts.</p>';
  }
}

document.getElementById('apply-filters').addEventListener('click', filterAndRender);
loadContracts();

