import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // From Image: Full Trading course (full-trading-course)
  apiKey: "YOUR_FIREBASE_WEB_API_KEY", // Get this from 'General' tab or google-services.json
  authDomain: "://firebaseapp.com",
  projectId: "full-trading-course",
  storageBucket: "://appspot.com",
  messagingSenderId: "497704676718", // From Image: Project number
  appId: "1:497704676718:android:45cfe2a4ca32c6ad966571" // From Image: App ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
