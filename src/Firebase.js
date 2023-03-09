import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCtWuu15UQDHW4KsqA1f-akPf0GL_A0mOE",
  authDomain: "deafbeats-29510.firebaseapp.com",
  projectId: "deafbeats-29510",
  storageBucket: "deafbeats-29510.appspot.com",
  messagingSenderId: "1022163517272",
  appId: "1:1022163517272:web:6435ce59935dacf28e2f2d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
