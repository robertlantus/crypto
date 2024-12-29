// /routes/addCoins.js

// Route to add coins by id to a selected watchlist

import express from 'express';
import Watchlist from '../models/watchlistModel.js';
import { getCryptoDataById } from '../services/redisService.js';
import { COIN_MARKET_KEY } from '../jobs/cronJobs.js';
import verifyToken from '../middleware/verifyToken.js';
import mongoose from 'mongoose';
import generateLinks from '../helpers/links.js';
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
        return sendErrorResponse(res, 400, 'Invalid watchlist ID format', generateLinks(watchlistId));
    }

    // Validate ids
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return sendErrorResponse(res, 400, "Please provide a list of coin IDs in the request body (ex: { ids: ['bitcoin', 'ethereum'] })", generateLinks(watchlistId));
    }

    // if (!watchlistId || watchlistId.trim() === '') {
    //     return res.status(400).json({
    //         message: 'Please provide a valid watchlist ID',
    //         links: [
    //             { rel: 'self', href: `${req.originalUrl}`, method: 'POST' }, 
    //             { rel: 'watchlists', href: `/api/watchlists`, method: 'GET' },
    //             { rel: 'get_watchlist', href: `/api/watchlists/${watchlistId}`, method: 'GET' }
    //         ]
    //     });
    // }

    // if (!mongoose.isValidObjectId(watchlistId)) {
    //     return res.status(404).json({
    //         message: 'Invalid watchlist ID format',
    //         links: [
    //             { rel: 'self', href: `${req.originalUrl}`, method: 'POST' }, 
    //             { rel: 'watchlists', href: `/api/watchlists`, method: 'GET' },
    //             { rel: 'get_watchlist', href: `/api/watchlists/${watchlistId}`, method: 'GET' }
    //         ]
    //     });
    // }

    // if (!ids || !Array.isArray(ids) || ids.length === 0) {
    //     return res.status(400).json({
    //         message: "Please provide a list of coin IDs in the request body (ex: { ids: ['bitcoin', 'ethereum'] })",
    //         links: [
    //             { rel: 'self', href: `${req.originalUrl}`, method: 'POST' }, 
    //             { rel: 'watchlists', href: `/api/watchlists`, method: 'GET' },
    //             { rel: 'get_watchlist', href: `/api/watchlists/${watchlistId}`, method: 'GET' }
    //         ]
    //     });
    // }

    try {
        // Ensure coin IDs are unique and trimmed
        const idsArr = [...new Set(ids.map(coin => coin.trim()))];
        
        // Fetch coins data from Redis/MongoDB
        const cachedKey = COIN_MARKET_KEY;
        const coinsData = await getCryptoDataById(cachedKey, idsArr);

        if (!coinsData || coinsData.length === 0) {
            // return res.status(404).json({ 
            //     message: `No data found for the provided ids: ${idsArr.join(', ')}`,
            //     links: [
            //         { rel: 'self', href: `${req.originalUrl}`, method: 'GET' },
            //         { rel: 'all_coins', href: `/api/coins/markets`, method: 'GET' }
            //     ]
            // });
            return sendErrorResponse(res, 404, `No data found for the provided ids: ${idsArr.join(', ')}`, generateLinks(watchlistId));
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
            // return res.status(404).json({ 
            //     message: "Watchlist not found for the provided user",
            //     links: [
            //         { rel: 'self', href: `${req.originalUrl}`, method: 'POST' },
            //         { rel: 'watchlists', href: `/api/watchlists`, method: 'GET' }
            //     ]
            // });

            return sendErrorResponse(res, 404, "Watchlist not found for the provided user", generateLinks(watchlistId));
        }

        res.status(200).json({
            message: 'Coin(s) added to the watchlist successfully',
            watchlist: updatedWatchlist,
            // links: [
            //     { rel: 'self', href: `${req.originalUrl}`, method: 'POST' },
            //     { rel: 'watchlists', href: `/api/watchlists`, method: 'GET' },
            //     { rel: 'get_watchlist', href: `/api/watchlists/${watchlistId}`, method: 'GET' },
            //     { rel: 'remove_coins', href: `/api/watchlists/${watchlistId}/remove-coins`, method: 'PATCH' }
            // ]
            links: generateLinks(watchlistId)
        });

    } catch (error) {
        console.error("Error adding coins to the watchlist:", error);

        // res.status(500).json({
        //     message: "An internal server error occurred while adding coins to the watchlist.",
        //     error: error.message,
        //     links: [
        //         { rel: 'self', href: `${req.originalUrl}`, method: 'POST' },
        //         { rel: 'watchlists', href: `/api/watchlists`, method: 'GET' },
        //         { rel: 'get_watchlist', href: `/api/watchlists/${watchlistId}`, method: 'GET' }
        //     ]
        // });

        sendErrorResponse(res, 500, 'An internal server error occurred while adding coins to the watchlist', generateLinks(watchlistId));
    }
});

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

// Route to remove coins by their Ids from a watchlist 
// PATCH/api/watchlists/{watchlist._id}/remove-coins/?ids=bitcoin,solana

router.patch('/:id/remove-coins', verifyToken, async (req, res) => {

    // Get the watchlist ID
    // const { id } = req.params;
    // const watchlistId = req.params.id;
    const { id: watchlistId } = req.params;

    // Get the user ID from the authenticated user
    const userId = req.user._id;

    // Coin IDs (comma-separeted)
    const { ids } = req.query;  

    if (!ids) {
        return res.status(400).json({ message: "Please provide coin IDs in the query (ex: ?ids=bitcoin,ethereum)." });
    }

    try {
        const idsArr = ids.split(',').map(coin => coin.trim());

        // Update the watchlist by removing the specified coin IDs
        const updatedWatchlist = await Watchlist.findOneAndUpdate(
                                                    { _id: watchlistId, userId },               // Match by watchlist ID and user ID
                                                    { $pull: { coins: { $in: idsArr } } },      // Remove the specified coin IDs
                                                    { new: true }                               // Return the updated watchlist
                                                );

        if (!updatedWatchlist) {
            return res.status(404).json({ message: "Watchlist not found." });
        }
    
        return res.status(200).json({
                                    message: 'Coin(s) removed from watchlist successfully',
                                    watchlist: updatedWatchlist
                                });
    } catch (error) {
        console.error("Error removing coins from the watchlist:", error);
        res.status(500).json({ message: "Error removing coins from the watchlist", error });
    }


})

// Retrieve watchlist by Id for authenticated user with full coins details
// GET /api/watchlists/:id

router.get('/:id', verifyToken, async (req, res) => {

    // Get the watchlist ID
    // const { id } = req.params;
    const watchlistId = req.params.id;
    // console.log(watchlistId);

    // Get the user ID from the authenticated user
    const userId = req.user._id;
    // console.log(userId);

    try {
        // Fetch the watchlist
        const watchlist = await Watchlist.findOne({ _id: watchlistId, userId });    // Match by watchlist ID and user ID

        if (!watchlist) {
            return res.status(404).json({ message: "Watchlist not found." });
        }

        // Fetch coins details based on coin IDs
        const cachedKey = COIN_MARKET_KEY;
        const coinDetails = await getCryptoDataById(cachedKey, watchlist.coins);

        return res.status(200).json({
                            name: watchlist.name,
                            coins: coinDetails,     // Full coin details
                            createdAt: watchlist.createdAt,
                            updatedAt: watchlist.updatedAt
        });
        
    } catch (error) {
        console.error("Error fetching watchlist:", error);
        res.status(500).json({ message: "Error fetching watchlist", error: error.message });
    }
});

export default router;