import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC6utuBTxI6yYumDh_2LB6nrMu-9HE2rmA",
  authDomain: "anket-demo-3361a.firebaseapp.com",
  projectId: "anket-demo-3361a",
  storageBucket: "anket-demo-3361a.appspot.com",
  messagingSenderId: "663168758419",
  appId: "1:663168758419:web:91ab70e2ad72adcd4a9366",
  measurementId: "G-499EMGQ39F",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, app, auth};
