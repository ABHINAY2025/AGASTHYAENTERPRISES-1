// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Your Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyCkZ2fnyYua7-jC7_Iw7S_o7HVkzm9o3p0",
    authDomain: "agasthya-enterprises.firebaseapp.com",
    projectId: "agasthya-enterprises",
    storageBucket: "agasthya-enterprises.firebasestorage.app",
    messagingSenderId: "47614470315",
    appId: "1:47614470315:web:06e21f22cda64667cc2fee",
    measurementId: "G-2RHC16R8NN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, addDoc, collection };
