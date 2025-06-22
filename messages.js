import { initFirebase } from './firebase-init.js';
import {
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js';
import {
  collection,
  query,
  where,
  orderBy,
  addDoc,
  onSnapshot,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js';

const { auth, db } = initFirebase();

const convListEl = document.getElementById('conversation-list');
const messagesEl = document.getElementById('messages');
const form = document.getElementById('message-form');
const input = document.getElementById('message-input');

let currentConvId = null;
let unsubMessages = null;

onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  loadConversations(user.uid);

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!currentConvId || !input.value.trim()) return;
    await addDoc(collection(db, 'conversations', currentConvId, 'messages'), {
      sender: user.uid,
      text: input.value.trim(),
      createdAt: serverTimestamp()
    });
    input.value = '';
  });
});

function loadConversations(uid) {
  const q = query(collection(db, 'conversations'), where('participants', 'array-contains', uid));
  onSnapshot(q, snap => {
    convListEl.textContent = '';
    if (snap.empty) {
      const p = document.createElement('p');
      p.className = 'text-gray-700';
      p.textContent = 'No conversations.';
      convListEl.appendChild(p);
      return;
    }
    snap.forEach(doc => {
      const data = doc.data();
      const btn = document.createElement('button');
      btn.className = 'block w-full text-left px-2 py-1 hover:bg-gray-100';
      btn.textContent = data.title || doc.id;
      btn.addEventListener('click', () => selectConversation(doc.id));
      convListEl.appendChild(btn);
    });
  });
}

function selectConversation(id) {
  currentConvId = id;
  messagesEl.textContent = '';
  if (unsubMessages) unsubMessages();
  const q = query(collection(db, 'conversations', id, 'messages'), orderBy('createdAt'));
  unsubMessages = onSnapshot(q, snap => {
    messagesEl.textContent = '';
    snap.forEach(doc => {
      const m = doc.data();
      const div = document.createElement('div');
      div.className = m.sender === auth.currentUser.uid ? 'text-right' : 'text-left';
      const span = document.createElement('span');
      span.className = 'inline-block bg-gray-100 rounded px-2 py-1 my-1';
      span.textContent = m.text;
      div.appendChild(span);
      messagesEl.appendChild(div);
    });
    messagesEl.scrollTop = messagesEl.scrollHeight;
  });
}
