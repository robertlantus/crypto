// authMiddleware.js

import admin from 'firebase-admin';

export const verifyToken = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        res.status(401).json({ message: 'Authorization token missing or invalid.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = { uid: decodedToken.uid };
        next();
    } catch (error) {
        console.error('Error verifyng token:', error);
        res.status(403).json({ message: 'Invalid or expired token.' });
    }
};