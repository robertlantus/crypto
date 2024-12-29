// /routes/addCoins.js

// Route to add coins by id to a selected watchlist

import express from 'express';
import Watchlist from '../models/watchlistModel.js';
import { getCryptoDataById } from '../services/redisService.js';
import { COIN_MARKET_KEY } from '../jobs/cronJobs.js';
import verifyToken from '../middleware/verifyToken.js';
import mongoose from 'mongoose';
import { generateLinksAdd, generateLinksGet, generateLinksRemove } from '../helpers/links.js';
import sendErrorResponse from '../helpers/errors.js';

const router = express.Router();

// Route to fetch coins by IDs and add them to a watchlist
// PATCH /api/watchlists/{675aa759ca531c3c0d5c22ae}/add-coins
// in req.body "ids":["bitcoin", "solana"]

router.post('/:id/add-coins', verifyToken, async (req, res) => {
    // Get the watchlist ID
    const watchlistId = req.params.id;

    // Get the user ID from the authenticated user
    const userId = req.user._id;

    // Get coin IDs from the request body
    const { ids } = req.body;

    // Validate watchlistId
    if (!watchlistId || !mongoose.isValidObjectId(watchlistId)) {
        return sendErrorResponse(res, 400, 'Invalid watchlist ID format', generateLinksAdd(watchlistId));
    }

    // Validate ids
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return sendErrorResponse(res, 400, "Please provide a list of coin IDs in the request body (ex: { ids: ['bitcoin', 'ethereum'] })", generateLinksAdd(watchlistId));
    }

    try {
        // Ensure coin IDs are unique and trimmed
        const idsArr = [...new Set(ids.map(coin => coin.trim()))];
        
        // Fetch coins data from Redis/MongoDB
        const cachedKey = COIN_MARKET_KEY;
        const coinsData = await getCryptoDataById(cachedKey, idsArr);

        if (!coinsData || coinsData.length === 0) {
            return sendErrorResponse(res, 404, `No data found for the provided ids: ${idsArr.join(', ')}`, generateLinksAdd(watchlistId));
        }

        // Extract valid coin IDs
        const validCoinIds = coinsData.map(coin => coin.id);

        // Add valid coins to the specified watchlist
        const updatedWatchlist = await Watchlist.findOneAndUpdate(
            { _id: watchlistId, userId },                            // Match by watchlist ID and user ID
            { $addToSet: { coins: { $each: validCoinIds } } },       // Add unique coins
            { new: true }                                            // Return the updated watchlist
        );

        if (!updatedWatchlist) {
            return sendErrorResponse(res, 404, "Watchlist not found for the provided user", generateLinksAdd(watchlistId));
        }

        res.status(200).json({
            message: 'Coin(s) added to the watchlist successfully',
            watchlist: updatedWatchlist,
            links: generateLinksAdd(watchlistId)
        });

    } catch (error) {
        console.error("Error adding coins to the watchlist:", error);
        sendErrorResponse(res, 500, 'An internal server error occurred while adding coins to the watchlist', generateLinksAdd(watchlistId));
    }
});

// Route to remove coins by their Ids from a watchlist 
// PATCH/api/watchlists/{watchlist._id}/remove-coins/?ids=bitcoin,solana

router.patch('/:id/remove-coins', verifyToken, async (req, res) => {

    // Get the watchlist ID
    // const { id } = req.params;
    // const watchlistId = req.params.id;
    const { id: watchlistId } = req.params;

    // Get the user ID from the authenticated user
    const userId = req.user._id;

    // Coin IDs from the request body
    const { ids } = req.body;  

    // Validate watchlistId
    if (!watchlistId || !mongoose.isValidObjectId(watchlistId)) {
        return sendErrorResponse(res, 400, 'Invalid watchlist ID format', generateLinksRemove(watchlistId));
    }

    // Validate ids
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return sendErrorResponse(res, 400, "Please provide a list of coin IDs in the request body (ex: { ids: ['bitcoin', 'ethereum'] })", generateLinksRemove(watchlistId));
    }

    try {
        // Ensure coin IDs are unique and trimmed
        const idsArr = [...new Set(ids.map(coin => coin.trim()))];

        // Fetch coins data from Redis/MongoDB
        const cachedKey = COIN_MARKET_KEY;
        const coinsData = await getCryptoDataById(cachedKey, idsArr);

        if (!coinsData || coinsData.length === 0) {
            return sendErrorResponse(res, 404, `No data found for the provided ids: ${idsArr.join(', ')}`, generateLinksRemove(watchlistId));
        }

        // Extract valid coin IDs
        const validCoinIds = coinsData.map(coin => coin.id);

        // Update the watchlist by removing the specified coin IDs
        const updatedWatchlist = await Watchlist.findOneAndUpdate(
            { _id: watchlistId, userId },               // Match by watchlist ID and user ID
            { $pull: { coins: { $in: idsArr } } },      // Remove the specified coin IDs
            { new: true }                               // Return the updated watchlist
        );

        if (!updatedWatchlist) {
            return sendErrorResponse(res, 404, "Watchlist not found for the provided user", generateLinksRemove(watchlistId));
        }
    
        res.status(200).json({
            message: 'Coin(s) removed from watchlist successfully',
            watchlist: updatedWatchlist,
            links: generateLinksRemove(watchlistId)
        });

    } catch (error) {
        console.error("Error removing coins from the watchlist:", error);
        sendErrorResponse(res, 500, 'An internal server error occurred while removing coins from the watchlist', generateLinksRemove(watchlistId));
    }
});

// Retrieve watchlist by Id for authenticated user with full coins details
// GET /api/watchlists/:id

router.get('/:id', verifyToken, async (req, res) => {

    // Get the watchlist ID
    // const { id } = req.params;
    const watchlistId = req.params.id;

    // Get the user ID from the authenticated user
    const userId = req.user._id;

    // Validate watchlistId
    if (!watchlistId || !mongoose.isValidObjectId(watchlistId)) {
        return sendErrorResponse(res, 400, 'Invalid watchlist ID format', generateLinksGet(watchlistId));
    }

    try {
        // Fetch the watchlist
        const watchlist = await Watchlist.findOne({ _id: watchlistId, userId });    // Match by watchlist ID and user ID

        if (!watchlist) {
            return sendErrorResponse(res, 404, "Watchlist not found for the provided user", generateLinksGet(watchlistId));
        }

        // Fetch coins details based on coin IDs
        const cachedKey = COIN_MARKET_KEY;
        const coinDetails = await getCryptoDataById(cachedKey, watchlist.coins);

        res.status(200).json({
            name: watchlist.name,
            coins: coinDetails,     // Full coin details
            createdAt: watchlist.createdAt,
            updatedAt: watchlist.updatedAt,
            links: generateLinksGet(watchlistId)
        });
        
    } catch (error) {
        console.error("Error fetching watchlist:", error);
        sendErrorResponse(res, 500, 'An internal server error occurred', generateLinksGet(watchlistId));
    }
});

export default router;

// Older version

// Route to fetch coins by IDs and add them to a watchlist
// PATCH /api/watchlists/{675aa759ca531c3c0d5c22ae}/add-coins?ids=bitcoin,solana,monero

// router.patch('/:id/add-coins', verifyToken, async (req, res) => {

//     // Get the watchlist ID
//     const watchlistId = req.params.id;     
//     // console.log(watchlistId); 

//     // Get the user ID from the authenticated user
//     const userId = req.user._id;
//     // console.log(userId);

//     // Coin IDs (comma-separeted)
//     const { ids } = req.query;      
//     // console.log(ids);

//     if (!ids) {
//         return res.status(400).json({ message: "Please provide coin IDs in the query (ex: ?ids=bitcoin,ethereum)." });
//     }

//     try {
//         const idsArr = ids.split(',').map(coin => coin.trim());

//         // Fetch coins data from Redis/MongoDB
//         const cachedKey = COIN_MARKET_KEY;
//         const coinsData = await getCryptoDataById(cachedKey, idsArr);

//         // console.log("Fetched coinsData:", coinsData);

//         if (!coinsData || coinsData.length === 0) {
//             return res.status(404).json({ message: `No data found for the provided ids: ${ids}` });
//         }

//         // Extract valid coin IDs
//         const validCoinIds = coinsData.map(coin => coin.id);

//         // Add valid coins to the specified watchlist
//         const updatedWatchlist = await Watchlist.findOneAndUpdate(
//             { _id: watchlistId, userId },                            // Match by watchlist ID and user ID
//             { $addToSet: { coins: { $each: validCoinIds } } },       // Add unique coins
//             { new: true }                                            // Return the updated watchlist
//         );

//         if (!updatedWatchlist) {
//             return res.status(404).json({ message: "Watchlist not found." });
//         }

//         res.status(200).json({
//             message: 'Coin(s) added to the watchlist successfully',
//             watchlist: updatedWatchlist
//         });
        
//     } catch (error) {
//         console.error("Error adding coins to the watchlist:", error);
//         res.status(500).json({ message: "Error adding coins to the watchlist", error });
//     }
// });