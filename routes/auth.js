
// auth.js

import express from 'express';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseApp from '../config/firebaseConfig.js';
import jwt from 'jsonwebtoken';
import { sendSignupErrorResponse, sendLoginErrorResponse } from '../utils/errorHandling.js';

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'BNdfp2DpDyiTFzGpJ9nQlzNrAj/yusBJS3kP52rH0/rM2xLpZrSiaNGFo3q9O74UIJ3P9p2YoFmmQ/m1l7kqrg==';

const router = express.Router();

// Route handler signup
// Make a POST from signup.html
// POST http://localhost:3333/api/auth/signup

// Refactored

router.post('/signup', async (req, res) => {

    const { email, password } = req.body;

    // Check for missing credentials
    if (!email || !password) {
        return sendSignupErrorResponse(res, 401, 'Email and password are required.', true);
    }

    try {
        // Get an instance of the auth object
        const auth = getAuth(firebaseApp);

        // Create a new user with Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Generate JWT
        const token = jwt.sign({ uid: user.uid, email: user.email }, 
                                JWT_SECRET, 
                                { expiresIn: '1h' });  

        // Successful user signup
        res.status(201).json({ 
                                message: 'User registered successfully', 
                                token
                            });

    } catch (error) {

        // Default to Unauthorized
        let code = 401;
        let errorMessage = 'An error occurred during signup.';

        // Handle Firebase-specific errors
        switch (error.code) {
            case ('auth/invalid-email'):
                errorMessage = `The email address is not valid.
                                Please enter a correct email.`;
                break;
            case ('auth/weak-password'):
                code = 406;     // Not Acceptable
                errorMessage = `The password provided is too weak. 
                                Please use a stronger password.`;
                break;
            case ('auth/email-already-in-use'):
                code = 409;     // Conflict
                errorMessage = `This email is already in use. 
                                Please use a different email or log in.`;
                break;
            default: console.error('Unexpected signup error:', error);
        }

        // Send appropriate error response
        return sendSignupErrorResponse(res, code, errorMessage, code);
    }
});

// Route handler login
// Make a POST from login.html
// POST http://localhost:3333/api/auth/login

router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    // Check for missing credentials
    if (!email || !password) {
        return sendLoginErrorResponse(res, 401, 'Email and password are required.', true);
    }

    try {
        // Get an instance of the auth object
        const auth = getAuth(firebaseApp);

        // Sign in an existing user with Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Generate JWT
        const token = jwt.sign({ uid: user.uid, email: user.email }, 
                                JWT_SECRET, 
                                { expiresIn: '1h' });
        
        // Successful login response
        res.status(200).json({ 
                                message: 'Login successful', 
                                token
                            });  

    } catch (error) {

        // console.log(error);     // FirebaseError: Firebase: Error (auth/invalid-credential)
        // console.log(error.code);    // auth/invalid-credential

        // Default to Unauthorized
        let code = 401;
        let errorMessage = 'An error occurred during login.';

        // Handle Firebase-specific errors
        switch (error.code) {
            case ('auth/invalid-credential'):
                errorMessage = `Invalid credential. 
                                Please try again.`;
                break;
            case ('auth/too-many-requests'):
                code = 403;     // Forbidden
                errorMessage = `Too many failed login attempts. 
                                Please try again later.`;
                break;
            default: console.error('Unexpected login error:', error);
        }

        // Send appropriate error response
        return sendLoginErrorResponse(res, code, errorMessage, code === 401);
    }
});

// Original

// router.post('/signup', async (req, res) => {
    // try {
        // const { email, password } = req.body;
        // const auth = getAuth(firebaseApp);      // Get an instance of the auth object

        // if (!email || !password) {
            // return res.status(400).json({ error: 'Email and password are required.' });
        // }

        // // Create a new user with Firebase

        // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // const user = userCredential.user;

        // // Generate JWT
        // const token = jwt.sign({ uid: user.uid, email: user.email }, JWT_SECRET, { expiresIn: '1h' });     
        
        // res.status(201).json({ 
        //                     message: 'User registered successfully', 
        //                     token,
        //                     // user: { 
        //                     //     uid: user.uid, 
        //                     //     email: user.email 
        //                     // } 
        //                     });
    // } catch (error) {

        // console.log(error);
        // console.log(error.message);
        // console.log(error.code);

        // let errorMessage = 'An error occurred during signup.';

        // Handle specific Firebase error cases

        // switch (error.code) {
        //     case ('auth/invalid-email'):
        //         errorMessage = `The email address is not valid.
        //                         Please enter a correct email.`;
        //         break;
        //     case ('auth/weak-password'):
        //         errorMessage = `The password provided is too weak. 
        //                         Please use a stronger password.`;
        //         break;
        //     case ('auth/email-already-in-use'):
        //         errorMessage = `This email is already in use. 
        //                         Please use a different email or log in.`;
        //         break;
        //     default: console.error('Unexpected signup error:', error);
        // }

        // res.status(400).json({ error: errorMessage });
    // }
// });

// Route handler login
// Make a POST from login.html
// POST http://localhost:3333/api/auth/login

// Refactored With Alex

// router.post('/login', async (req, res) => {

//     let code = 401;
    
//     try {
//         const { email, password } = req.body;

//         // Get an instance of the auth object
//         const auth = getAuth(firebaseApp);      

//         if (!email || !password) {

//             // res.status(code);
//             // res.append('WWW-Authenticate', 'Bearer');
//             // res.append('Location', 'http://localhost:3333/login.html');
//             // return res.json({ error: 'Email and password are required.' });

//             return res.status(code)
//                       .append('WWW-Authenticate', 'Bearer')
//                       .append('Location', 'http://localhost:3333/login.html')
//                       .json({ error: 'Email and password are required.' });
//         }

//         // Sign in an existing user with Firebase

//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;

//         // Generate JWT
//         const token = jwt.sign({ uid: user.uid, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

//         res.status(200).json({ 
//                             message: 'Login successful', 
//                             token,
//                             // user: {
//                             //     uid: user.uid, 
//                             //     email: user.email 
//                             // } 
//                         });  
//     } catch (error) {

//         // console.log(error);     // FirebaseError: Firebase: Error (auth/invalid-credential)
//         // console.log(error.code);    // auth/invalid-credential

//         let errorMessage = 'An error occurred during login.';

//         // Handle specific Firebase error cases

//         switch (error.code) {
//             case ('auth/invalid-credential'):
//                 errorMessage = `Invalid credential. 
//                                 Please try again.`;
//                 break;
//             case ('auth/too-many-requests'):
//                 code = 403;
//                 errorMessage = `Too many failed login attempts. 
//                                 Please try again later.`;
//                 break;
//             default: console.error('Unexpected login error:', error);
//         }

//         res.status(code);

//         if (code === 401) {
//             // res.status(code).append({'WWW-Authenticate': 'Bearer',
//             //                         'Location': 'http://localhost:3333/login.html'
//             // });
//             res.append('WWW-Authenticate', 'Bearer');
//             res.append('Location', 'http://localhost:3333/login.html');
//         }

//         return res.json({ error: errorMessage });
//     }
// });

export default router;
