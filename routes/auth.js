
// auth.js

import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { registerSchema, loginSchema } from '../config/validators.js';

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'BNdfp2DpDyiTFzGpJ9nQlzNrAj/yusBJS3kP52rH0/rM2xLpZrSiaNGFo3q9O74UIJ3P9p2YoFmmQ/m1l7kqrg==';

const router = express.Router();

// Base URL for this resource
const BASE_URL = '/api/auth';

// Route handler to signup a new user
// POST http://localhost:3333/api/auth/signup

router.post('/signup', async (req, res) => {

    const { username, email, password } = req.body;

    // Validate input using the validators schemas (with Joi library)
    const { error } = registerSchema.validate({ username, email, password });
    // console.log(error);

    if (error) {
        return res.status(400).json({ 
            message: error.details[0].message,
            links: [
                { rel: 'self', href: `${BASE_URL}/signup`, method: 'POST' }
            ]
        });
    }

    try {
        const user = new User({ 
            username, 
            email, 
            password 
        });
        // console.log(user);
        await user.save();

        // Generate JWT
        // const token = jwt.sign({ userId: user._id, username: user.username }, 
        //                         JWT_SECRET, 
        //                         { expiresIn: '1h' });  

        res.status(201).json({ 
            success: true,
            message: `New user signed up successfully as: ${username}`,
            links: [
                { rel: 'self', href: `${BASE_URL}/signup`, method: 'POST' },
                { rel: 'login', href: `${BASE_URL}/login`, method: 'POST' }
            ]
        });
        
    } catch (error) {
        // console.log(error);
        // console.log(error.keyValue);    // { username: 'cryptic1' }
        // console.log(Object.keys(error.keyValue));   // [ 'username' ]
        // console.log(Object.keys(error.keyValue)[0], typeof Object.keys(error.keyValue)[0]);   // username typeof string
        // console.log(error.keyValue['username']);    // cryptic1

        // Handle duplicate key error (E11000)
        if (error.code === 11000) { 
            const duplicateField = Object.keys(error.keyValue)[0];
            return res.status(409).json({ 
                message: `Duplicate value detected for ${duplicateField}: ${error.keyValue[duplicateField]}`,
                links: [
                    { rel: 'self', href: `${BASE_URL}/signup`, method: 'POST' },
                    { rel: 'login', href: `${BASE_URL}/login`, method: 'POST' }
                ]
            });
        }

        console.error('Signup failed', error);

        res.status(500).json({ 
            message: 'Internal server error', 
            error: error.message,
            links: [
                { rel: 'self', href: `${BASE_URL}/signup`, method: 'POST' }
            ] 
        });
    }
});

// Route handler to login an existing user
// POST http://localhost:3333/api/auth/login

router.post('/login', async (req, res) => {
    
    const { username, password } = req.body;

    // Validate input using the validators schemas (with Joi library)
    const { error } = loginSchema.validate({ username, password });
    // console.log(error);

    if (error) {
        return res.status(400).json({ 
            message: error.details[0].message,
            links: [
                { rel: 'self', href: `${BASE_URL}/login`, method: 'POST' }
            ]
        });
    }

    try {
        const user = await User.findOne({ username });

        // Check if the user exists
        if (!user) {
            return res.status(401).json({ 
                message: 'Invalid username or password',
                links: [
                    { rel: 'self', href: `${BASE_URL}/login`, method: 'POST' }
                ]
            });
        }

        // Compare provided password with stored encrypted password
        const passwordMatch = await user.comparePassword(password);

        if (!passwordMatch) {
            return res.status(401).json({ 
                message: 'Invalid username or password',
                links: [
                    { rel: 'self', href: `${BASE_URL}/login`, method: 'POST' }
                ]
            });
        }

        // Generate JWT
        const token = jwt.sign({ userId: user._id, username: user.username }, 
                                JWT_SECRET, 
                                { expiresIn: '1h' });

        res.status(200).json({
            message: `Successful login for user: ${username}`,
            token,
            expiredIn: '1h',
            links: [
                { rel: 'self', href: `${BASE_URL}/login`, method: 'POST' },
                { rel: 'signup', href: `${BASE_URL}/signup`, method: 'POST' }
            ]
        });
        
    } catch (error) {
        console.error('Login failed', { username, error });

        res.status(500).json({ 
            message: 'Internal server error', 
            error: error.message,
            links: [
                { rel: 'self', href: `${BASE_URL}/login`, method: 'POST' }
            ]
        });
    }
});

export default router;
