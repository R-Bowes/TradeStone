import { initFirebase } from './firebase-init.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js';
import { DEMO_MODE, showDemo } from "./demo-placeholder.js";

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

  if (item.distance) {
    const dist = document.createElement('p');
    dist.className = 'text-sm text-gray-700';
    dist.textContent = `${item.distance} miles away`;
    card.appendChild(dist);
  }

  if (item.tags && item.tags.length) {
    const tags = document.createElement('div');
    tags.className = 'flex flex-wrap gap-1';
    item.tags.forEach(t => {
      const span = document.createElement('span');
      span.textContent = t;
      span.className = 'text-xs bg-gray-200 rounded px-2 py-1';
      tags.appendChild(span);
    });
    card.appendChild(tags);
  }

  const viewBtn = document.createElement('a');
  viewBtn.href = `#`;
  viewBtn.className = 'mt-auto inline-block px-4 py-2 bg-[var(--primary)] text-white rounded text-center font-semibold';
  viewBtn.textContent = 'View';
  card.appendChild(viewBtn);

  if (DEMO_MODE) {
    const demoLink = document.createElement('a');
    demoLink.href = '#';
    demoLink.className = 'text-orange-500 block hover:underline';
    demoLink.textContent = 'Demo Info';
    demoLink.addEventListener('click', e => {
      e.preventDefault();
      const html = `<h2 class="text-lg font-bold mb-2">${item.title}</h2><p>Condition: ${item.condition}</p><p>Located at ${item.location || 'various locations'}.</p>`;
      showDemo(html);
    });
    card.appendChild(demoLink);
  }
  return card;
}

function filterAndRender() {
  const search = document.getElementById('search').value.toLowerCase();
  const location = document.getElementById('location-filter').value.trim().toLowerCase();
  const selectedCats = Array.from(document.querySelectorAll('.cat-checkbox:checked')).map(cb => cb.value);
  const selectedAges = Array.from(document.querySelectorAll('.age-checkbox:checked')).map(cb => cb.value);

  const filtered = allItems.filter(it => {
    const matchText = !search || (it.title && it.title.toLowerCase().includes(search)) || (it.description && it.description.toLowerCase().includes(search));
    const matchCat = selectedCats.length === 0 || selectedCats.includes(it.category);
    const matchAge = selectedAges.length === 0 || selectedAges.includes(it.condition);
    const matchLocation = !location || (it.location && it.location.toLowerCase().includes(location));
    return matchText && matchCat && matchAge && matchLocation;
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

