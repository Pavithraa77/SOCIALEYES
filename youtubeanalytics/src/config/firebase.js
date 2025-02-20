// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6iZ78oLv06fnBpO9RYLZC1oZQKj7PmaM",
  authDomain: "socialeyes-39a20.firebaseapp.com",
  projectId: "socialeyes-39a20",
  storageBucket: "socialeyes-39a20.firebasestorage.app",
  messagingSenderId: "738247253720",
  appId: "1:738247253720:web:cf3892ac7949d707f281ad",
  measurementId: "G-H08EWBHR0T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);