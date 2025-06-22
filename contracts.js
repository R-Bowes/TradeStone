import { initFirebase } from './firebase-init.js';
import { collection, getDocs, addDoc, serverTimestamp, query, where, doc, getDoc } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js';

const { db, auth } = initFirebase();
let userTrade = null;
let allContracts = [];
const list = document.getElementById('contract-list');

onAuthStateChanged(auth, async user => {
  if (user) {
    try {
      const snap = await getDoc(doc(db, 'profiles', user.uid));
      if (snap.exists()) {
        userTrade = snap.data().tradeType || null;
      }
    } catch (err) {
      console.error('Failed to load user profile', err);
    }
  }
});
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

  const view = document.createElement('a');
  view.href = `contract-detail.html?id=${contract.id}`;
  view.textContent = 'View Details';
  view.className = 'text-orange-500 hover:underline';
  card.appendChild(view);

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

async function filterAndRender() {
  const search = document.getElementById('search').value.toLowerCase();
  const location = document.getElementById('location-filter').value.trim().toLowerCase();
  const contractType = document.getElementById('contract-type').value;
  const selectedTrades = Array.from(document.querySelectorAll('.trade-checkbox:checked')).map(cb => cb.value);
  const minBudget = parseFloat(document.getElementById('budget-min').value);
  const maxBudget = parseFloat(document.getElementById('budget-max').value);
  const startAfter = document.getElementById('start-date-from').value;
  const endBefore = document.getElementById('start-date-to').value;
  const verifiedOnly = document.getElementById('verified-only').checked;
  const qualifyOnly = document.getElementById('qualify-only').checked;

  let q = collection(db, 'contracts');
  const conditions = [];
  if (contractType) conditions.push(where('type', '==', contractType));
  if (selectedTrades.length) conditions.push(where('trade', 'array-contains-any', selectedTrades));
  if (!isNaN(minBudget)) conditions.push(where('budget', '>=', minBudget));
  if (!isNaN(maxBudget)) conditions.push(where('budget', '<=', maxBudget));
  if (startAfter) conditions.push(where('startDate', '>=', startAfter));
  if (endBefore) conditions.push(where('endDate', '<=', endBefore));
  if (verifiedOnly) conditions.push(where('verified', '==', true));
  if (conditions.length) q = query(q, ...conditions);

  try {
    const snap = await getDocs(q);
    allContracts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('Error loading contracts:', err);
    list.innerHTML = '<p class="text-red-500 text-center col-span-full">Could not load contracts.</p>';
    return;
  }

  const filtered = allContracts.filter(c => {
    const matchText = !search || (c.title && c.title.toLowerCase().includes(search)) || (c.description && c.description.toLowerCase().includes(search));
    const matchLocation = !location || (c.location && c.location.toLowerCase().includes(location));
    let matchQualify = true;
    if (qualifyOnly && userTrade) {
      const tradeVal = c.trade || c.tradeType || c.tradeCategory;
      if (Array.isArray(tradeVal)) {
        matchQualify = tradeVal.map(t => t.toLowerCase()).includes(userTrade.toLowerCase());
      } else if (typeof tradeVal === 'string') {
        matchQualify = tradeVal.toLowerCase() === userTrade.toLowerCase();
      } else {
        matchQualify = false;
      }
    }
    return matchText && matchLocation && matchQualify;
  });

  list.innerHTML = '';
  if (filtered.length === 0) {
    list.innerHTML = '<p class="text-gray-700 text-center col-span-full">No contracts found.</p>';
  } else {
    filtered.forEach(c => list.appendChild(createCard(c)));
  }
}

async function loadContracts() {
  filterAndRender();
}

document.getElementById('apply-filters').addEventListener('click', filterAndRender);
const toggle = document.getElementById('toggle-filters');
if (toggle) {
  toggle.addEventListener('click', () => {
    document.getElementById('filter-sidebar').classList.toggle('hidden');
  });
}
loadContracts();

