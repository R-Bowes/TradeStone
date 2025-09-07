import { initFirebase } from './firebase-init.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js';

const { db } = initFirebase();
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

async function loadItem() {
  if (!id) {
    document.getElementById('title').textContent = 'Listing not found';
    return;
  }
  const snap = await getDoc(doc(db, 'marketplaceItems', id));
  if (!snap.exists()) {
    document.getElementById('title').textContent = 'Listing not found';
    return;
  }
  const item = snap.data();
  document.getElementById('title').textContent = item.title;
  document.getElementById('price').textContent = item.price ? `£${Number(item.price).toFixed(2)}` : '';
  document.getElementById('condition').textContent = item.condition;
  document.getElementById('location').textContent = item.location || '';
  document.getElementById('description').textContent = item.description || '';

  const gallery = document.getElementById('gallery');
  if (item.images && item.images.length) {
    item.images.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      img.className = 'w-full max-h-64 object-cover mb-2 rounded';
      gallery.appendChild(img);
    });
  }

  const sellerSnap = await getDoc(doc(db, 'profiles', item.postedBy));
  if (sellerSnap.exists()) {
    const seller = sellerSnap.data();
    const sellerDiv = document.getElementById('seller');
    const link = document.createElement('a');
    link.href = `professional-profile.html?id=${item.postedBy}`;
    link.textContent = seller.companyName || 'Seller profile';
    link.className = 'text-blue-500 underline';
    sellerDiv.appendChild(link);
    if (seller.accountType === 'professional') {
      const badge = document.createElement('span');
      badge.textContent = 'Pro';
      badge.className = 'ml-2 bg-yellow-400 text-xs px-1 rounded';
      document.getElementById('message').appendChild(badge);
    }
  }

  document.getElementById('message').addEventListener('click', () => {
    window.location.href = `messages.html?to=${item.postedBy}`;
  });
}

document.getElementById('report').addEventListener('click', () => alert('Reported'));
loadItem();
