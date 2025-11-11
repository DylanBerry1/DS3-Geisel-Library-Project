// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXjVr2GG8l0UPudcAJhRrZHaRUq8JsfR4",
  authDomain: "esp32testdb-26f23.firebaseapp.com",
  databaseURL: "https://esp32testdb-26f23-default-rtdb.firebaseio.com",
  projectId: "esp32testdb-26f23",
  storageBucket: "esp32testdb-26f23.firebasestorage.app",
  messagingSenderId: "205179121145",
  appId: "1:205179121145:web:4789cd0f57a0aeabd5e128",
  measurementId: "G-RYF5YDWX4H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);