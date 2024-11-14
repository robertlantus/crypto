
// firebaseConfig.js

import { initializeApp } from 'firebase/app';

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;

const firebaseConfig = {
    // apiKey: "AIzaSyAW2OUDdohg-gsystLbLlwe17Mb6T51mXc",
    apiKey: FIREBASE_API_KEY,
    authDomain: "gecko-users.firebaseapp.com",
    projectId: "gecko-users",
    storageBucket: "gecko-users.firebasestorage.app",
    messagingSenderId: "151434330844",
    appId: "1:151434330844:web:9e234286e4f53e8f2eaa19",
    measurementId: "G-91TC76BCYB"
};

const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;

