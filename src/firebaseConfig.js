import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDcimIsWi2YyuSBvaipdIwxek4EqAmca1k",
  authDomain: "bingoai.firebaseapp.com",
  projectId: "bingoai",
  storageBucket: "bingoai.appspot.com",
  messagingSenderId: "45067130660",
  appId: "1:45067130660:web:b33f8eb6cacecdbf9985b1",
  measurementId: "G-D4ZE05KDQW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db } ;