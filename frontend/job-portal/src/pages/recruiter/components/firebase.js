import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCGADYXkj4O9YruTegiyi8x-GFZSzYRcyE",
  authDomain: "job-portal-otp-54262.firebaseapp.com",
  projectId: "job-portal-otp-54262",
  storageBucket: "job-portal-otp-54262.appspot.com",
  messagingSenderId: "894125118227",
  appId: "1:894125118227:web:acb3bb80947a0f69ae40e6",
  measurementId: "G-HFVSKLMSFB"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);