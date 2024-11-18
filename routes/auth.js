
// auth.js

import express from 'express';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseApp from '../config/firebaseConfig.js';
import { handleErrorResponse } from '../utils/errorHandling.js'; 

import jwt from 'jsonwebtoken';

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'BNdfp2DpDyiTFzGpJ9nQlzNrAj/yusBJS3kP52rH0/rM2xLpZrSiaNGFo3q9O74UIJ3P9p2YoFmmQ/m1l7kqrg==';

const router = express.Router();

// Route handler signup
// Make a POST from signup.html
// POST http://localhost:3333/api/auth/signup

router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const auth = getAuth(firebaseApp);      // Get an instance of the auth object

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        // Create a new user with Firebase

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Generate JWT
        const token = jwt.sign({ uid: user.uid, email: user.email }, JWT_SECRET, { expiresIn: '1h' });     
        
        res.status(201).json({ 
                            message: 'User registered successfully', 
                            token,
                            // user: { 
                            //     uid: user.uid, 
                            //     email: user.email 
                            // } 
                            });
    } catch (error) {

        // console.log(error);
        // console.log(error.message);
        // console.log(error.code);

        let errorMessage = 'An error occurred during signup.';

        // Handle specific Firebase error cases

        switch (error.code) {
            case ('auth/invalid-email'):
                errorMessage = `The email address is not valid.
                                Please enter a correct email.`;
                break;
            case ('auth/weak-password'):
                errorMessage = `The password provided is too weak. 
                                Please use a stronger password.`;
                break;
            case ('auth/email-already-in-use'):
                errorMessage = `This email is already in use. 
                                Please use a different email or log in.`;
                break;
            default: console.error('Unexpected signup error:', error);
        }

        res.status(400).json({ error: errorMessage });
    }
});

// Route handler login
// Make a POST from login.html
// POST http://localhost:3333/api/auth/login

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const auth = getAuth(firebaseApp);      // Get an instance of the auth object

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        // Sign in an existing user with Firebase

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Generate JWT
        const token = jwt.sign({ uid: user.uid, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ 
                            message: 'Login successful', 
                            token,
                            // user: {
                            //     uid: user.uid, 
                            //     email: user.email 
                            // } 
                        });  
    } catch (error) {

        let errorMessage = 'An error occurred during login.';

        // Handle specific Firebase error cases

        switch (error.code) {
            case ('auth/invalid-credential'):
                errorMessage = `Invalid credential. 
                                Please try again.`;
                break;
            case ('auth/too-many-requests'):
                errorMessage = `Too many failed login attempts. 
                                Please try again later.`;
                break;
            default: console.error('Unexpected login error:', error);
        }

        res.status(400).json({ error: errorMessage });
    }
});

export default router;
