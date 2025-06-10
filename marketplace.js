import { initFirebase } from './firebase-init.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js';

const { db } = initFirebase();
let allItems = [];
const list = document.getElementById('item-list');

function createCard(item) {
  const card = document.createElement('div');
  card.className = 'bg-white rounded-lg shadow p-4 flex flex-col space-y-2';

  if (item.images && item.images.length) {
    const img = document.createElement('img');
    img.src = item.images[0];
    img.alt = item.title;
    img.className = 'w-full h-32 object-cover mb-2 rounded';
    card.appendChild(img);
  }

  const title = document.createElement('h2');
  title.className = 'text-lg font-bold';
  title.textContent = item.title;
  card.appendChild(title);

  const price = document.createElement('p');
  price.className = 'text-sm text-gray-700';
  price.textContent = `£${Number(item.price).toFixed(2)}`;
  card.appendChild(price);

  const condition = document.createElement('p');
  condition.className = 'text-sm text-gray-700';
  condition.textContent = item.condition;
  card.appendChild(condition);

  if (item.location) {
    const locationEl = document.createElement('p');
    locationEl.className = 'text-sm text-gray-700';
    locationEl.textContent = item.location;
    card.appendChild(locationEl);
  }

  return card;
}

function filterAndRender() {
  const search = document.getElementById('search').value.toLowerCase();
  const selectedCats = Array.from(document.querySelectorAll('.cat-checkbox:checked')).map(cb => cb.value);
  const selectedAges = Array.from(document.querySelectorAll('.age-checkbox:checked')).map(cb => cb.value);

  const filtered = allItems.filter(it => {
    const matchText = !search || (it.title && it.title.toLowerCase().includes(search)) || (it.description && it.description.toLowerCase().includes(search));
    const matchCat = selectedCats.length === 0 || selectedCats.includes(it.category);
    const matchAge = selectedAges.length === 0 || selectedAges.includes(it.condition);
    return matchText && matchCat && matchAge;
  });

  list.innerHTML = '';
  if (filtered.length === 0) {
    list.innerHTML = '<p class="text-gray-700 text-center col-span-full">No items found.</p>';
  } else {
    filtered.forEach(it => list.appendChild(createCard(it)));
  }
}

async function loadItems() {
  try {
    const snap = await getDocs(collection(db, 'marketplaceItems'));
    allItems = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    filterAndRender();
  } catch (err) {
    console.error('Error loading items:', err);
    list.innerHTML = '<p class="text-red-500 text-center col-span-full">Could not load items.</p>';
  }
}

document.getElementById('apply-filters').addEventListener('click', filterAndRender);
loadItems();

