// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_sfi0b_E0Q4mrUaWVDxBQ18_oOUtXDJ0",
  authDomain: "anket-2fcf8.firebaseapp.com",
  projectId: "anket-2fcf8",
  storageBucket: "anket-2fcf8.appspot.com",
  messagingSenderId: "616976016291",
  appId: "1:616976016291:web:c16015560c498b4264b016",
  measurementId: "G-D08RD5LZCK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

