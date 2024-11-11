
// auth.js

import express from 'express';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseApp from '../config/firebaseConfig.js' 

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

        // console.log(auth);

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        // Create a new user with Firebase

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Generate JWT
        const token = jwt.sign({ uid: user.uid, email: user.email }, JWT_SECRET, { expiresIn: '12h' });
        
        res.status(201).json({ 
                            message: 'User registered successfully', 
                            token,
                            user: { 
                                uid: user.uid, 
                                email: user.email 
                            } });
    } catch (error) {
        res.status(400).json({ error: error.message });
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
        const token = jwt.sign({ uid: user.uid, email: user.email }, JWT_SECRET, { expiresIn: '12h' });

        res.status(200).json({ 
                            message: 'Login successful', 
                            token,
                            user: {
                                uid: user.uid, 
                                email: user.email 
                            } });  
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

export default router;
