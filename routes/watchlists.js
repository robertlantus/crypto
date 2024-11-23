// watchlists.js

// Route to handle the POST request to create a watchlist

import express from 'express';
import Watchlist from '../models/watchlistModel.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create new watchlist
// POST /api/watchlists 

router.post('/', verifyToken, async (req, res) => {

    // Get name from frontend
    const { name } = req.body;
    // Extract Firebase UID from token
    const { uid } = req.user;

    if (!name) {
        res.status(400).json({ message: 'Watchlist name is required' });
    }

    try {
        const newWatchlist = new Watchlist({ name, userId: uid });
        await newWatchlist.save();
        res.status(201).json(newWatchlist);

    } catch (error) {
        console.error('Error creating watchlist:', error);
        res.status(500).json({ message: 'Interbal server error.' });
    }
});

export default router;