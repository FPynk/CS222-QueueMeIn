// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Required for side-effects
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyAOLuac2U-AymcCv_4YiQ9IsTE4hmReDaA",
  authDomain: "queuemein-bd29e.firebaseapp.com",
  projectId: "queuemein-bd29e",
  storageBucket: "queuemein-bd29e.appspot.com",
  messagingSenderId: "703330693782",
  appId: "1:703330693782:web:a16d038860fc8ffc8008b7"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();