import firebase from 'firebase/compat/app'; 
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBQXdb2mOU0OM866Pna5P9x-zinWwyQb0s",
  authDomain: "footysta-2ea9f.firebaseapp.com",
  projectId: "footysta-2ea9f",
  storageBucket: "footysta-2ea9f.appspot.com",
  messagingSenderId: "401343816188",
  appId: "1:401343816188:web:74967407662f9a132bd279",
  measurementId: "G-RCNTD4CMSZ"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const fs = firebase.firestore();
const st = firebase.storage();
 

export { auth, fs, st }
