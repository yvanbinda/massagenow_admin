/**
 * GENESIS ADMIN MINTING SCRIPT
 * 
 * Instructions:
 * 1. Go to Firebase Console > Project Settings > Service Accounts.
 * 2. Click "Generate New Private Key".
 * 3. Save the JSON file as "service-account.json" in the ROOT of this project.
 * 4. Run: node scripts/mint-admin.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Dynamically locate the service account file in the project root
const serviceAccountPath = path.join(__dirname, '..', 'service-account.json');

try {
  const serviceAccount = require(serviceAccountPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  // The UID of the user you manually created in Firebase Authentication
  const adminUid = 'B76Ip9ZInwa1tGuJZUjatREkLRp1';

  admin.auth().setCustomUserClaims(adminUid, { role: 'super_admin' })
    .then(() => {
      console.log('✅ Success: Genesis Super Admin badge minted!');
      console.log('You can now log in to the admin panel with this account.');
      process.exit();
    })
    .catch((error) => {
      console.error('❌ Error minting badge:', error);
      process.exit(1);
    });

} catch (e) {
  console.error('❌ Error: Could not find "service-account.json" in the root directory.');
  console.error('Please download your service account key from Firebase and rename it to "service-account.json".');
  process.exit(1);
}
