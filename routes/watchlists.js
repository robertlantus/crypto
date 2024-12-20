// watchlists.js

// Route to handle the POST request to create a watchlist

import express from 'express';
import Watchlist from '../models/watchlistModel.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// Retrieve watchlists for the authenticated user
// GET /api/watchlists 

router.get('/', verifyToken, async (req, res) => {
    try {
        // Get the user ID from the authenticated user
        const userId = req.user._id;

        // Find watchlists for the user
        const watchlists = await Watchlist.find({ userId });

        if (!watchlists || watchlists.length === 0) {
            return res.status(404).json({ message: 'No watchlist found for this user' });
        }

        res.status(200).json(watchlists);

    } catch (error) {
        console.error('Error fetching watchlists:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Create new watchlist
// POST /api/watchlists 

router.post('/', verifyToken, async (req, res) => {

    // Get name from frontend
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Watchlist name is required' });
    }

    // Get the user ID from the authenticated user
    // Authenticated user ID from the authorization middleware (verifyToken.js)
    const userId = req.user._id;

    try {
        // Check for an existing watchlist with the same name for this user
        const existingWatchlist = await Watchlist.findOne({ name, userId });

        if (existingWatchlist) {
            return res.status(409).json({ message: `A watchlist with the name: ${name} already exists for this user` });
        }

        const newWatchlist = new Watchlist({ name, userId });
        await newWatchlist.save();
        
        res.status(201).json({
            message: 'New watchlist successfully created',
            watchlist: newWatchlist
        });

    } catch (error) {
        console.error('Error creating watchlist:', error);
        // Handle MongoDB unique constraint violation
        if (error.code === 11000) {
            return res.status(409).json({ message: `A watchlist with the name: ${name} already exists for this user` });
        }
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// `PUT` is typically not used with collection resources(unless you want to replace the entire collection). 
// which is why we'll treat this as an invalid route.

router.put('/', async (req, res) => {
    // set `Allow` header to indicate which HTTP methods are allowed for this resource
    res.setHeader('Allow', 'GET, POST');
    // return 405 Method Not Allowed
    res.status(405).send();     
})

// Remove watchlist by watchlist id and user id
// DELETE /api/watchlists/:id

router.delete('/:id', verifyToken, async (req, res) => {

    const watchlistId = req.params.id;
    // console.log('Received ID:', watchlistId);

    // Get the user ID from the authenticated user
    const userId = req.user._id;

    try {
        // Find and delete the watchlist owned by the user
        const deletedWatchlist = await Watchlist.findOneAndDelete({ _id: watchlistId, userId });

        if (!deletedWatchlist) {
            return res.status(404).json({ message: 'Watchlist not found or not authorized to delete.' });
        }

        res.status(200).json({ 
            message: 'Watchlist deleted successfully', 
            watchlist: deletedWatchlist 
        });

    } catch (error) {
        console.error('Error deleting watchlist:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Patch watchlist name by watchlist id and user id
// PATCH /api/watchlists/:id

router.patch('/:id', verifyToken, async (req, res) => {

    const watchlistId = req.params.id;
    const { name } = req.body;
    // Get the user ID from the authenticated user
    const userId = req.user._id;

    try {
        // Find and update the watchlist name owned by the user
        const updatedWatchlist = await Watchlist.findOneAndUpdate(
                                                        { _id: watchlistId, userId },   // Match by watchlist ID and user ID
                                                        { name },                       // Update the name field
                                                        { new: true }                   // Return the updated document
                                                    );

        if (!updatedWatchlist) {
            return res.status(404).json({ message: 'Watchlist not found or not authorized to update' });
        }

        res.status(200).json({
            message: 'Watchlist name updated successfully',
            watchlist: updatedWatchlist
        });

    } catch (error) {
        console.error('Error updating watchlist name:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

export default router;