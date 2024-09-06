// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';  // Importer Firebase Auth
import { getDatabase } from 'firebase/database'; // Importer la Realtime Database

// Configuration Firebase (fourni par Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyATqD1CaVzYguNOnrCk6PH489DQVocVX1M",
  authDomain: "my-game-3be5e.firebaseapp.com",
  projectId: "my-game-3be5e",
  storageBucket: "my-game-3be5e.appspot.com",
  messagingSenderId: "20501512796",
  appId: "1:20501512796:web:39e2165bfd993d72185c99",
  measurementId: "G-0L45SFZHMX",
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  // Initialiser Firebase Authentication
const database = getDatabase(app);  // Initialiser la Realtime Database

export { auth, database };
