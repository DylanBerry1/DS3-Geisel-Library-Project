// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// 🚨 TODO: Fill in these values from his Firebase console.
// 1. Go to Firebase console → Project settings (gear icon).
// 2. In "Your apps" → pick the Web app → copy the config object.
// 3. Paste each value into the matching field below.
// 4. For databaseURL, go to Realtime Database → copy the URL.

const firebaseConfig = {
  apiKey: "PASTE_API_KEY_HERE",
  authDomain: "PASTE_AUTH_DOMAIN_HERE",
  databaseURL: "PASTE_DATABASE_URL_HERE",
  projectId: "PASTE_PROJECT_ID_HERE",
  storageBucket: "PASTE_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_MESSAGING_SENDER_ID_HERE",
  appId: "PASTE_APP_ID_HERE",
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app); // Realtime Database instance

export default app;
