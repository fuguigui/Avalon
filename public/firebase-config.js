// Import the functions you need from the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbHNVqWuI84ndH1x-LoagJunomJIGccyI",
  authDomain: "avalon-c2f49.firebaseapp.com",
  projectId: "avalon-c2f49",
  storageBucket: "avalon-c2f49.firebasestorage.app",
  messagingSenderId: "635983011533",
  appId: "1:635983011533:web:cac9c0e387591fc905d384",
  measurementId: "G-RGBLR20FSX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the Firestore database service
const db = getFirestore(app);

// Export the initialized app and db instances so they can be imported elsewhere
export { app, db };
