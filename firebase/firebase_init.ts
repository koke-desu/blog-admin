const admin = require("firebase-admin");
const ServiceAccount = require("../firebase/serviceAccountKey.json");

try {
  admin.initializeApp({
    credential: admin.credential.cert(ServiceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
} catch (error) {
  //console.log(error);
}

export default admin;
