// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3ptv4Rfuulw_7xD5HVF6hOCQmqtPYi8s",
  authDomain: "leooli-portfolio.firebaseapp.com",
  projectId: "leooli-portfolio",
  storageBucket: "leooli-portfolio.firebasestorage.app",
  messagingSenderId: "992090678811",
  appId: "1:992090678811:web:910282ca01266590afbabe",
  measurementId: "G-FE9D94ZD81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);