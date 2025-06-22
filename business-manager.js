import { initFirebase } from './firebase-init.js';
import {
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  query,
  onSnapshot
} from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js';

const { auth, db } = initFirebase();

const tabButtons = document.querySelectorAll('.tab-btn');
const sections = document.querySelectorAll('.tab-section');

// simple tab logic
function showTab(id) {
  sections.forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => showTab(btn.dataset.tab));
});

let uid = null;

onAuthStateChanged(auth, async user => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  uid = user.uid;
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists() || snap.data().accountType !== 'professional') {
    window.location.href = 'index.html';
    return;
  }
  // default tab
  showTab('team');
  loadTeam();
  loadSchedule();
  loadInvoices();
  loadProjects();

  document.getElementById('team-form').addEventListener('submit', addTeam);
  document.getElementById('schedule-form').addEventListener('submit', addSchedule);
  document.getElementById('invoice-form').addEventListener('submit', addInvoice);
  document.getElementById('project-form').addEventListener('submit', addProject);
});

async function addTeam(e) {
  e.preventDefault();
  const name = document.getElementById('member-name').value.trim();
  const role = document.getElementById('member-role').value.trim();
  if (!name || !role) return;
  await addDoc(collection(db, 'users', uid, 'team'), { name, role });
  e.target.reset();
}

function loadTeam() {
  const q = query(collection(db, 'users', uid, 'team'));
  onSnapshot(q, snap => {
    const list = document.getElementById('team-list');
    list.textContent = '';
    snap.forEach(doc => {
      const li = document.createElement('li');
      li.className = 'border rounded p-2';
      const data = doc.data();
      li.textContent = `${data.name} – ${data.role}`;
      list.appendChild(li);
    });
  });
}

async function addSchedule(e) {
  e.preventDefault();
  const date = document.getElementById('schedule-date').value;
  const task = document.getElementById('schedule-task').value.trim();
  if (!date || !task) return;
  await addDoc(collection(db, 'users', uid, 'schedule'), { date, task });
  e.target.reset();
}

function loadSchedule() {
  const q = query(collection(db, 'users', uid, 'schedule'));
  onSnapshot(q, snap => {
    const list = document.getElementById('schedule-list');
    list.textContent = '';
    snap.forEach(doc => {
      const li = document.createElement('li');
      li.className = 'border rounded p-2';
      const data = doc.data();
      li.textContent = `${data.date}: ${data.task}`;
      list.appendChild(li);
    });
  });
}

async function addInvoice(e) {
  e.preventDefault();
  const client = document.getElementById('invoice-client').value.trim();
  const amount = parseFloat(document.getElementById('invoice-amount').value);
  if (!client || isNaN(amount)) return;
  await addDoc(collection(db, 'users', uid, 'invoices'), { client, amount });
  e.target.reset();
}

function loadInvoices() {
  const q = query(collection(db, 'users', uid, 'invoices'));
  onSnapshot(q, snap => {
    const list = document.getElementById('invoice-list');
    list.textContent = '';
    snap.forEach(doc => {
      const li = document.createElement('li');
      li.className = 'border rounded p-2';
      const data = doc.data();
      li.textContent = `${data.client}: £${data.amount}`;
      list.appendChild(li);
    });
  });
}

async function addProject(e) {
  e.preventDefault();
  const name = document.getElementById('project-name').value.trim();
  const status = document.getElementById('project-status').value.trim();
  if (!name || !status) return;
  await addDoc(collection(db, 'users', uid, 'projects'), { name, status });
  e.target.reset();
}

function loadProjects() {
  const q = query(collection(db, 'users', uid, 'projects'));
  onSnapshot(q, snap => {
    const list = document.getElementById('project-list');
    list.textContent = '';
    snap.forEach(doc => {
      const li = document.createElement('li');
      li.className = 'border rounded p-2';
      const data = doc.data();
      li.textContent = `${data.name} – ${data.status}`;
      list.appendChild(li);
    });
  });
}
