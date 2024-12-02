// watchlists.js

// Route to handle the POST request to create a watchlist

import express from 'express';
import Watchlist from '../models/watchlistModel.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// Retrieve watchlists for the authenticated user
// GET /api/watchlists 

router.get('/watchlists', verifyToken, async (req, res) => {
    try {
        // Get the user ID from the authenticated user
        const userId = req.user._id;

        // Find watchlists for the user
        const watchlists = await Watchlist.find({ userId });

        res.status(200).json(watchlists);
    } catch (error) {
        console.error('Error fetching watchlists:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Create new watchlist
// POST /api/watchlists 

router.post('/watchlists', verifyToken, async (req, res) => {

    // Get name from frontend
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Watchlist name is required' });
    }

    // Get the user ID from the authenticated user
    const userId = req.user._id;

    try {
        const newWatchlist = new Watchlist({ name, userId });
        await newWatchlist.save();
        return res.status(201).json({
            message: 'New watchlist successfully created',
            watchlist: newWatchlist
        });

    } catch (error) {
        console.error('Error creating watchlist:', error);
        res.status(500).json({ message: 'Interbal server error.' });
    }
});

export default router;