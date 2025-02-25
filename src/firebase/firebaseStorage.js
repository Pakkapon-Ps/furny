import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC44rNtr1JavKFjT7f3XfJDNzi1GMI81AM",
  authDomain: "final-web-g8.firebaseapp.com",
  projectId: "final-web-g8",
  storageBucket: "final-web-g8.firebasestorage.app",
  messagingSenderId: "15623497017",
  appId: "1:15623497017:web:3af8709cedf8e71031f4e8",
  measurementId: "G-XJT60FV3RZ"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

export { storage };