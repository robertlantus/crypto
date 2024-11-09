
// auth.js

import express from 'express';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import firebaseApp from '../config/firebaseConfig.js' 

const router = express.Router();

// Route handler for signup
// POST http://localhost:3333/api/auth/signup
// Make a POST from signup.html

router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const auth = getAuth(firebaseApp);

        // console.log(auth);

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        res.status(201).json({ message: 'User registered successfully', user });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
