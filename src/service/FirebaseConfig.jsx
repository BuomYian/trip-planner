// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: "ai-trip-planner-18a6c.firebaseapp.com",
  projectId: "ai-trip-planner-18a6c",
  storageBucket: "ai-trip-planner-18a6c.firebasestorage.app",
  messagingSenderId: "643230880769",
  appId: "1:643230880769:web:74ec8bc4ae88108718dc00",
  measurementId: "G-Z4BB8GM7S6",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
// const analytics = getAnalytics(app);
