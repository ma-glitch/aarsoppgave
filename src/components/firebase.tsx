
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth } from "firebase/auth";



const firebaseApp = {
  apiKey: "AIzaSyDqMGyH9pft96ZBm-oyxGmjkcVU1ziCge4",
  authDomain: "skodex-417108.firebaseapp.com",
  projectId: "skodex-417108",
  storageBucket: "skodex-417108.appspot.com",
  messagingSenderId: "18167012444",
  appId: "1:18167012444:web:d35a14508bf75873d5da99",
  measurementId: "G-DN84ZG4C2P"
};

// Initialize Firebase
const app = initializeApp(firebaseApp);
const auth = getAuth(app)
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();

export {auth, provider};
