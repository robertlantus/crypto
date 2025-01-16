// watchlists.js

// Route to handle the POST request to create a watchlist

import express from 'express';
import Watchlist from '../models/watchlistModel.js';
import verifyToken from '../middleware/verifyToken.js';
import mongoose from 'mongoose';

const router = express.Router();

const BASE_URL = '/api/watchlists';

// Retrieve watchlists for the authenticated user
// GET /api/watchlists 

router.get('/', verifyToken, async (req, res) => {
    try {
        // Get the user ID from the authenticated user
        const userId = req.user._id;

        // Find watchlists for the user
        const watchlists = await Watchlist.find({ userId });

        if (!watchlists || watchlists.length === 0) {
            return res.status(200).json({ 
                message: 'No watchlist found for this user. Create a new watchlist to get started.',
                watchlists: [],
                links: [
                    { rel: 'self', href: `${BASE_URL}`, method: 'GET' },
                    { rel: 'create', href: `${BASE_URL}`, method: 'POST' }
                ]
            });
        }

        res.status(200).json({
            message: 'Watchlists retrieved successfully',
            watchlists,
            links: [
                { rel: 'self', href: `${BASE_URL}`, method: 'GET' },
                { rel: 'create', href: `${BASE_URL}`, method: 'POST' }
            ]
        });

    } catch (error) {
        console.error('Error fetching watchlists:', error);

        res.status(500).json({ 
            message: 'Internal server error',
            links: [
                { rel: 'self', href: `${BASE_URL}`, method: 'GET' }
            ]
        });
    }
});

// Create new watchlist
// POST /api/watchlists 

router.post('/', verifyToken, async (req, res) => {

    // Get name from frontend
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ 
            message: 'Watchlist name is required',
            links: [
                { rel: 'self', href: `${BASE_URL}`, method: 'POST' } 
            ]
        });
    }

    // Get the user ID from the authenticated user
    // Authenticated user ID from the authorization middleware (verifyToken.js)
    const userId = req.user._id;

    try {
        // Check for an existing watchlist with the same name for this user
        const existingWatchlist = await Watchlist.findOne({ name, userId });

        if (existingWatchlist) {
            return res.status(409).json({ 
                message: `A watchlist with the name: ${name} already exists for this user`,
                links: [
                    { rel: 'self', href: `${BASE_URL}`, method: 'POST' },
                    { rel: 'get-all', href: `${BASE_URL}`, method: 'GET'}
                ]
            });
        }

        const newWatchlist = new Watchlist({ name, userId });
        await newWatchlist.save();
        
        res.status(201).json({
            message: 'New watchlist successfully created',
            watchlist: newWatchlist,
            links: [
                { rel: 'self', href: `${BASE_URL}`, method: 'POST' },
                { rel: 'get-all', href: `${BASE_URL}`, method: 'GET'}
            ]
        });

    } catch (error) {
        console.error('Error creating watchlist:', error);
        // Handle MongoDB unique constraint violation
        if (error.code === 11000) {
            return res.status(409).json({ message: `A watchlist with the name: ${name} already exists for this user` });
        }

        res.status(500).json({ 
            message: 'Internal server error',
            links: [
                { rel: 'self', href: `${BASE_URL}`, method: 'POST' } 
            ]
        });
    }
});

// `PUT` is typically not used with collection resources(unless you want to replace the entire collection). 
// which is why we'll treat this as an invalid route.

router.put('/', async (req, res) => {
    // set `Allow` header to indicate which HTTP methods are allowed for this resource
    res.setHeader('Allow', 'GET, POST');
    // return 405 Method Not Allowed
    res.status(405).json({
        message: 'Method not allowed', 
        links: [
            { rel: 'get-all', href: `${BASE_URL}`, method: 'GET'},
            { rel: 'create', href: `${BASE_URL}`, method: 'POST' },
        ]
    });     
})

// Remove watchlist by watchlist id and user id
// DELETE /api/watchlists/:id

router.delete('/:id?', verifyToken, async (req, res) => {

    const watchlistId = req.params.id;
    // console.log('Received ID:', watchlistId);

    // Get the user ID from the authenticated user
    const userId = req.user._id;

    if (!watchlistId || watchlistId.trim() === '') {
        return res.status(400).json({
            message: 'Please provide a valid watchlist ID',
            links: [
                { rel: 'get-all', href: `${BASE_URL}`, method: 'GET' }
            ]
        });
    }

    if (!mongoose.isValidObjectId(watchlistId)) {
        return res.status(404).json({
            message: 'Invalid watchlist ID format',
            links: [
                { rel: 'get-all', href: `${BASE_URL}`, method: 'GET' }
            ]
        });
    }

    try {
        // Find and delete the watchlist owned by the user
        const deletedWatchlist = await Watchlist.findOneAndDelete({ _id: watchlistId, userId });

        if (!deletedWatchlist) {
            return res.status(404).json({ 
                message: 'Watchlist not found or not authorized to delete',
                links: [
                    { rel: 'get-all', href: `${BASE_URL}`, method: 'GET' },
                    { rel: 'create', href: `${BASE_URL}`, method: 'POST' }
                ]
            });
        }

        res.status(200).json({ 
            message: 'Watchlist deleted successfully', 
            watchlist: deletedWatchlist,
            links: [
                { rel: 'get-all', href: `${BASE_URL}`, method: 'GET' },
                { rel: 'create', href: `${BASE_URL}`, method: 'POST' }
            ] 
        });

    } catch (error) {
        console.error('Error deleting watchlist:', error);

        res.status(500).json({ 
            message: 'Internal server error',
            links: [
                { rel: 'get-all', href: `${BASE_URL}`, method: 'GET' }
            ]
        });
    }
});

// Change watchlist name by watchlist id and user id
// PATCH /api/watchlists/:id?

router.patch('/:id?', verifyToken, async (req, res) => {

    const watchlistId = req.params.id;
    // console.log(watchlistId);
    const { name } = req.body;
    // Get the user ID from the authenticated user
    const userId = req.user._id;

    if (!watchlistId || watchlistId.trim() === '') {
        return res.status(400).json({
            message: 'Please provide a valid watchlist ID',
            links: [
                { rel: 'get-all', href: `${BASE_URL}`, method: 'GET' }
            ]
        });
    }

    if (!mongoose.isValidObjectId(watchlistId)) {
        return res.status(400).json({
            message: 'Invalid watchlist ID format',
            links: [
                { rel: 'get-all', href: `${BASE_URL}`, method: 'GET' }
            ]
        });
    }

    if (!name) {
        return res.status(400).json({
            message: 'Watchlist name is required',
            links: [
                { rel: 'self', href: `${BASE_URL}/${watchlistId}`, method: 'PATCH' }
            ]
        });
    }

    try {
        // Ensure the watchlist exists and belongs to the user
        const watchlist = await Watchlist.findOne({ _id: watchlistId });

        if (!watchlist) {
            return res.status(404).json({
                message: 'Watchlist not found',
                links: [
                    { rel: 'get-all', href: `${BASE_URL}`, method: 'GET' }
                ]
            });
        }

        if (String(watchlist.userId) !== String(userId)) {
            return res.status(403).json({
                message: 'Not authorized to modify this watchlist',
                links: [
                    { rel: 'get-all', href: `${BASE_URL}`, method: 'GET' }
                ]
            });
        }

        // Check for an existing watchlist with the same name for this user
        const existingWatchlist = await Watchlist.findOne({ name, userId });

        if (existingWatchlist) {
            return res.status(409).json({ 
                message: `A watchlist with the name: ${name} already exists for this user`,
                links: [
                    { rel: 'self', href: `${BASE_URL}`, method: 'POST' },
                    { rel: 'get-all', href: `${BASE_URL}`, method: 'GET'}
                ]
            });
        }

        watchlist.name = name;
        await watchlist.save();

        // // Find and update the watchlist name owned by the user
        // const updatedWatchlist = await Watchlist.findOneAndUpdate(
        //     { _id: watchlistId, userId },   // Match by watchlist ID and user ID
        //     { name },                       // Update the name field
        //     { new: true }                   // Return the updated document
        // );

        // if (!updatedWatchlist) {
        //     return res.status(404).json({ 
        //         message: 'Watchlist not found or not authorized to update',
        //         links: [
        //             { rel: 'get-all', href: `${BASE_URL}`, method: 'GET' },
        //             { rel: 'create', href: `${BASE_URL}`, method: 'POST' }
        //         ] 
        //     });
        // }

        res.status(200).json({
            message: 'Watchlist name updated successfully',
            watchlist,
            links: [
                { rel: 'self', href: `${BASE_URL}/${watchlistId}`, method: 'PATCH' },
                { rel: 'get-all', href: `${BASE_URL}`, method: 'GET' }
            ]
        });

    } catch (error) {
        console.error('Error updating watchlist name:', error);

        res.status(500).json({ 
            message: 'Internal server error',
            links: [
                { rel: 'get-all', href: `${BASE_URL}`, method: 'GET' }
            ] 
        });
    }
});

export default router;