
// auth.js

import express from 'express';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import firebaseApp from '../config/firebaseConfig.js' 

// Import the auth instance from admin.js
// import { auth } from '../config/admin.js';

// Import the Firebase initialization script
// import '../config/admin.js';

const router = express.Router();

// Route handler for signup
// POST http://localhost:3333/api/auth/signup

// Thunder Client 

// router.post('/signup', async (req, res) => {

//     try {
//         const { email, password } = req.body;
//         // const auth = getAuth();

//         // Create the user in Firebase Authentication

//         const userRecord = await auth.createUser({      // Use Firebase’s createUser method to register users
//             email: email,
//             password: password
//         });

//         // Generate a custom token (Optional)
//         const token = await auth.createCustomToken(userRecord.uid);

//         // console.log(`User created with ID: ${userRecord.uid}`);
//         // res.status(201).send(`User created with ID: ${userRecord.uid}`);

//         // Send a response with user info
//         res.status(201).json({
//             message: 'User created successsfully',
//             user: {
//                 uid: userRecord.uid,
//                 email: userRecord.email
//             },
//             token: token
//         });

//     } catch (error) {
//         // res.status(400).send(`Error creating user: ${error.message}`);
//         console.error('Error creating user:', error);
//         res.status(400).json({ message: 'Error creating user', error: error.message });
//     }
// });

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
