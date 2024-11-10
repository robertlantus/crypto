
// auth.js

import express from 'express';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseApp from '../config/firebaseConfig.js' 

const router = express.Router();

// Route handler signup
// Make a POST from signup.html
// POST http://localhost:3333/api/auth/signup

router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const auth = getAuth(firebaseApp);

        // console.log(auth);

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        // Create a new user with Firebase

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        res.status(201).json({ 
                            message: 'User registered successfully', 
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
        const auth = getAuth(firebaseApp);

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        res.status(200).json({ 
                            message: 'Login successful', 
                            user: {
                                uid: user.uid, 
                                email: user.email 
                            } });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

export default router;
