// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// 🚨 TODO: Fill in these values from his Firebase console.
// 1. Go to Firebase console → Project settings (gear icon).
// 2. In "Your apps" → pick the Web app → copy the config object.
// 3. Paste each value into the matching field below.
// 4. For databaseURL, go to Realtime Database → copy the URL.

const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  databaseURL: import.meta.env.VITE_databaseURL,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId
}

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app); // Realtime Database instance

export default app;
