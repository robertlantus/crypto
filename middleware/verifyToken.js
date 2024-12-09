// verifyToken.js

import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'BNdfp2DpDyiTFzGpJ9nQlzNrAj/yusBJS3kP52rH0/rM2xLpZrSiaNGFo3q9O74UIJ3P9p2YoFmmQ/m1l7kqrg==';

const verifyToken = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        res.status(401).json({ message: 'Authorization token missing or invalid.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(400).json({ message: 'Authentication token missing' });
    }

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        // console.log(decodedToken);
        // console.log(decodedToken.userId);
        const user = await User.findById(decodedToken.userId);
        // console.log(user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Attach the user to the request object
        // The req.user property is set to the authenticated user's data
        req.user = user;
        next();

    } catch (error) {
        console.error('Error verifyng token:', error);
        res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

export default verifyToken;