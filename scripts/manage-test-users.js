import admin from 'firebase-admin';

const action = process.argv[2];
if (!action || !['create', 'delete'].includes(action)) {
  console.log('Usage: node scripts/manage-test-users.js <create|delete>');
  process.exit(1);
}

// Initialize using the default credentials or service account specified via
// GOOGLE_APPLICATION_CREDENTIALS.
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const auth = admin.auth();
const db = admin.firestore();

const testUsers = [
  { email: 'demo-personal@example.com', password: 'demopass', accountType: 'personal' },
  { email: 'demo-professional@example.com', password: 'demopass', accountType: 'professional' },
];

async function createUsers() {
  for (const user of testUsers) {
    try {
      const { uid } = await auth.createUser({ email: user.email, password: user.password });
      await db.collection('users').doc(uid).set({
        accountType: user.accountType,
        notifications: { emailUpdates: true, smsUpdates: true },
      });
      console.log(`Created ${user.email}`);
    } catch (err) {
      console.error(`Failed to create ${user.email}: ${err.message}`);
    }
  }
}

async function deleteUsers() {
  for (const user of testUsers) {
    try {
      const existing = await auth.getUserByEmail(user.email);
      await db.collection('users').doc(existing.uid).delete();
      await auth.deleteUser(existing.uid);
      console.log(`Deleted ${user.email}`);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        console.log(`${user.email} not found, skipping.`);
      } else {
        console.error(`Failed to delete ${user.email}: ${err.message}`);
      }
    }
  }
}

if (action === 'create') {
  await createUsers();
} else {
  await deleteUsers();
}
