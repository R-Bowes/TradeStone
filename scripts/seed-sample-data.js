import admin from 'firebase-admin';

// Initialize using default credentials or service account via GOOGLE_APPLICATION_CREDENTIALS
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

function generateCompanyId() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

const profiles = [
  {
    businessName: 'Ace Builders',
    tradeType: 'Builder',
    location: 'London',
    travelRadius: 25,
    description: 'We build quality homes.',
    avgRating: 4.7,
    companyId: generateCompanyId(),
  },
  {
    businessName: 'Bright Sparks Electrical',
    tradeType: 'Electrician',
    location: 'Manchester',
    travelRadius: 20,
    description: 'Certified electricians for residential and commercial jobs.',
    avgRating: 4.9,
    companyId: generateCompanyId(),
  },
  {
    businessName: 'Pipe Pros',
    tradeType: 'Plumber',
    location: 'Birmingham',
    travelRadius: 15,
    description: 'Emergency plumbing and heating services.',
    avgRating: 4.5,
    companyId: generateCompanyId(),
  }
];

const contracts = [
  {
    title: 'Refurbish kitchen',
    description: 'Looking for a builder to remodel a small kitchen.',
    location: 'London',
    budget: 5000,
    contractType: 'Fixed Price',
    requiredTrades: ['Builder'],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: 'Install new wiring',
    description: 'Need complete rewiring of a three bedroom house.',
    location: 'Manchester',
    budget: 3000,
    contractType: 'Fixed Price',
    requiredTrades: ['Electrician'],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  }
];

const items = [
  {
    title: 'Cordless Drill',
    description: 'Lightly used cordless drill with two batteries.',
    price: 80,
    condition: 'Used',
    category: 'Tools',
    location: 'Liverpool',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: 'Bulk timber planks',
    description: 'Mixed hardwood planks, around 30 pieces.',
    price: 200,
    condition: 'New',
    category: 'Materials',
    location: 'Leeds',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  }
];

async function seedCollection(name, data) {
  for (const entry of data) {
    const doc = await db.collection(name).add(entry);
    console.log(`Added ${name}/${doc.id}`);
  }
}

await seedCollection('profiles', profiles);
await seedCollection('contracts', contracts);
await seedCollection('marketplaceItems', items);

console.log('Sample data added.');
