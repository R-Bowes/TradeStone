import { initFirebase } from './firebase-init.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js';
import { DEMO_MODE, showDemo } from "./demo-placeholder.js";

const { db } = initFirebase();
let allItems = [];
const list = document.getElementById('item-list');
let userLocation = null;

const params = new URLSearchParams(window.location.search);
document.getElementById('search').value = params.get('search') || '';
document.getElementById('location-filter').value = params.get('location') || '';
document.getElementById('radius').value = params.get('radius') || '';

const catParam = (params.get('cats') || '').split(',').filter(Boolean);
catParam.forEach(val => {
  const cb = document.querySelector(`.cat-checkbox[value="${val}"]`);
  if (cb) cb.checked = true;
});

const ageParam = (params.get('ages') || '').split(',').filter(Boolean);
ageParam.forEach(val => {
  const cb = document.querySelector(`.age-checkbox[value="${val}"]`);
  if (cb) cb.checked = true;
});

if (params.get('lat') && params.get('lng')) {
  userLocation = { lat: parseFloat(params.get('lat')), lng: parseFloat(params.get('lng')) };
}

loadSavedSearches();

function createCard(item) {
  const link = document.createElement('a');
  link.href = `listing-detail.html?id=${item.id}`;
  const card = document.createElement('div');
  card.className = 'bg-white rounded-lg shadow p-4 flex flex-col space-y-2 cursor-pointer';

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
  link.appendChild(card);
  return link;
}

function filterAndRender() {
  const search = document.getElementById('search').value.toLowerCase();
  const location = document.getElementById('location-filter').value.trim().toLowerCase();
  const radiusVal = parseFloat(document.getElementById('radius').value);
  const selectedCats = Array.from(document.querySelectorAll('.cat-checkbox:checked')).map(cb => cb.value);
  const selectedAges = Array.from(document.querySelectorAll('.age-checkbox:checked')).map(cb => cb.value);

  let filtered = allItems.filter(it => {
    const matchText = !search || (it.title && it.title.toLowerCase().includes(search)) || (it.description && it.description.toLowerCase().includes(search));
    const matchCat = selectedCats.length === 0 || selectedCats.includes(it.category);
    const matchAge = selectedAges.length === 0 || selectedAges.includes(it.condition);
    const matchLocation = !location || (it.location && it.location.toLowerCase().includes(location));
    return matchText && matchCat && matchAge && matchLocation;
  });

  if (!isNaN(radiusVal) && userLocation) {
    filtered = filtered.filter(it => {
      if (!it.coords) return false;
      const d = getDistance(userLocation.lat, userLocation.lng, it.coords.lat, it.coords.lng);
      return d <= radiusVal;
    });
  }

  list.innerHTML = '';
  if (filtered.length === 0) {
    list.innerHTML = '<p class="text-gray-700 text-center col-span-full">No items found.</p>';
  } else {
    filtered.forEach(it => list.appendChild(createCard(it)));
  }

  updateURL(search, location, selectedCats, selectedAges, radiusVal);
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function updateURL(search, location, cats, ages, radiusVal) {
  const p = new URLSearchParams();
  if (search) p.set('search', search);
  if (location) p.set('location', location);
  if (cats.length) p.set('cats', cats.join(','));
  if (ages.length) p.set('ages', ages.join(','));
  if (!isNaN(radiusVal) && radiusVal > 0) p.set('radius', radiusVal);
  if (userLocation) {
    p.set('lat', userLocation.lat);
    p.set('lng', userLocation.lng);
  }
  history.replaceState(null, '', '?' + p.toString());
}

function loadSavedSearches() {
  const saved = JSON.parse(localStorage.getItem('savedSearches') || '[]');
  const select = document.getElementById('saved-searches');
  select.innerHTML = '<option value="">Saved Searches</option>';
  if (saved.length) {
    select.classList.remove('hidden');
    saved.forEach((s, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = s.name;
      select.appendChild(opt);
    });
  } else {
    select.classList.add('hidden');
  }
}

function saveCurrentSearch() {
  const name = prompt('Name this search');
  if (!name) return;
  const saved = JSON.parse(localStorage.getItem('savedSearches') || '[]');
  saved.push({ name, params: new URLSearchParams(window.location.search).toString() });
  localStorage.setItem('savedSearches', JSON.stringify(saved));
  loadSavedSearches();
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
document.getElementById('near-me').addEventListener('click', () => {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(pos => {
    userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    filterAndRender();
  });
});
document.getElementById('save-search').addEventListener('click', saveCurrentSearch);
document.getElementById('saved-searches').addEventListener('change', e => {
  const saved = JSON.parse(localStorage.getItem('savedSearches') || '[]');
  const sel = saved[e.target.value];
  if (sel) window.location.search = sel.params;
});
document.getElementById('toggle-map').addEventListener('click', () => {
  const map = document.getElementById('map');
  map.classList.toggle('hidden');
  const btn = document.getElementById('toggle-map');
  btn.textContent = map.classList.contains('hidden') ? 'Show Map' : 'Hide Map';
});
loadItems();

