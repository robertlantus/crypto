
// firebaseConfig.js

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAW2OUDdohg-gsystLbLlwe17Mb6T51mXc",
//   authDomain: "gecko-users.firebaseapp.com",
//   projectId: "gecko-users",
//   storageBucket: "gecko-users.firebasestorage.app",
//   messagingSenderId: "151434330844",
//   appId: "1:151434330844:web:9e234286e4f53e8f2eaa19",
//   measurementId: "G-91TC76BCYB"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAW2OUDdohg-gsystLbLlwe17Mb6T51mXc",
    authDomain: "gecko-users.firebaseapp.com",
    projectId: "gecko-users",
    storageBucket: "gecko-users.firebasestorage.app",
    messagingSenderId: "151434330844",
    appId: "1:151434330844:web:9e234286e4f53e8f2eaa19",
    measurementId: "G-91TC76BCYB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);