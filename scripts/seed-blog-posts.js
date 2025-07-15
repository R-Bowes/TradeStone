import admin from 'firebase-admin';

// Initialize using default credentials or service account via GOOGLE_APPLICATION_CREDENTIALS
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

const posts = [
  {
    title: 'How do I fix a leaky faucet?',
    content: 'I\'ve got a persistent drip from my kitchen faucet. What\'s the quickest DIY fix before I call a plumber?',
    comments: [
      'Try replacing the washer inside the handle first. It\'s usually a cheap fix.',
    ],
  },
  {
    title: 'Best way to insulate a garage?',
    content: 'I\'m converting my detached garage into a workshop and want to keep the temperature stable. Any tips on insulation?',
    comments: [
      'Rigid foam boards on the walls and batt insulation in the ceiling worked well for me.',
      'Don\'t forget to weatherstrip the door too!',
    ],
  },
  {
    title: 'Tips for painting exterior walls?',
    content: 'About to repaint the outside of my house. Should I use a primer first or does the modern paint include it?',
    comments: [
      'Always prime if the old paint is flaking or if you\'re changing color drastically.',
    ],
  },
];

async function seed() {
  for (const p of posts) {
    const docRef = await db.collection('posts').add({
      authorId: 'demo-seeder',
      title: p.title,
      content: p.content,
      hammerCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    for (const text of p.comments) {
      await db
        .collection('posts')
        .doc(docRef.id)
        .collection('comments')
        .add({
          authorId: 'demo-seeder',
          text,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    }
    console.log(`Added posts/${docRef.id}`);
  }
}

await seed();
console.log('Sample blog posts added.');
