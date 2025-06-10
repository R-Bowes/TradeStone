import { initFirebase } from './firebase-init.js';
import { collection, query, orderBy, addDoc, getDocs, getDoc, doc, serverTimestamp, setDoc, updateDoc, deleteDoc, increment } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js';

const { db } = initFirebase();

export async function createPost(userId, title, content) {
  const ref = await addDoc(collection(db, 'posts'), {
    authorId: userId,
    title,
    content,
    createdAt: serverTimestamp(),
    hammerCount: 0
  });
  return ref.id;
}

export async function getPosts() {
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getPost(id) {
  const snap = await getDoc(doc(db, 'posts', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function addComment(postId, userId, text) {
  await addDoc(collection(db, 'posts', postId, 'comments'), {
    authorId: userId,
    text,
    createdAt: serverTimestamp()
  });
}

export async function getComments(postId) {
  const q = query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function toggleHammer(postId, userId) {
  const hammerRef = doc(db, 'posts', postId, 'hammers', userId);
  const hammerSnap = await getDoc(hammerRef);
  if (hammerSnap.exists()) {
    await deleteDoc(hammerRef);
    await updateDoc(doc(db, 'posts', postId), { hammerCount: increment(-1) });
    return false;
  } else {
    await setDoc(hammerRef, { createdAt: serverTimestamp() });
    await updateDoc(doc(db, 'posts', postId), { hammerCount: increment(1) });
    return true;
  }
}

export async function hasHammered(postId, userId) {
  const snap = await getDoc(doc(db, 'posts', postId, 'hammers', userId));
  return snap.exists();
}
