import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, initializeFirestore, memoryLocalCache, persistentLocalCache } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "knights-of-the-round-web",
  appId: "1:413142442500:web:ff6418bbeb7fb372a54b51",
  storageBucket: "knights-of-the-round-web.firebasestorage.app",
  apiKey: "AIzaSyD1OhnnhTvSNbi83fb_YgO1pNHEYprqtCc",
  authDomain: "knights-of-the-round-web.firebaseapp.com",
  messagingSenderId: "413142442500",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = initializeFirestore(app, {
  localCache: typeof window === 'undefined' 
    ? memoryLocalCache()
    : persistentLocalCache({}),
});

export { db };
