
// auth.js

import express from 'express';
// Import the auth instance from admin.js
import { auth } from '../config/admin.js';

const router = express.Router();

router.post('/signup', async (req, res) => {

    const { email, password } = req.body;

    // Use Firebase’s createUser method to register users
    try {
        const userRecord = await auth.createUser({
            email: email,
            password: password
        });
        console.log(`User created with ID: ${userRecord.uid}`);
        
        res.status(201).send(`User created with ID: ${userRecord.uid}`);

    } catch (error) {
        res.status(400).send(`Error creating user: ${error.message}`);
    }
})

export default router;
