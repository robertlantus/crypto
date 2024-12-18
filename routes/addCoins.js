// /routes/addCoins.js

// Route to add coins by id to a selected watchlist

import express from 'express';
import Watchlist from '../models/watchlistModel.js';
import { getCryptoDataById } from '../services/redisService.js';
import { COIN_MARKET_KEY } from '../jobs/cronJobs.js';

const router = express.Router();

// Route to fetch coins by IDs and add them to a watchlist
// PUT api/watchlists/675aa759ca531c3c0d5c22ae/add-coins?ids=bitcoin,solana,monero

router.put('/watchlists/:id/add-coins', async (req, res) => {

    const { id } = req.params;      // Watchlist ID
    const { ids } = req.query;      // Coin IDs (comma-separeted)

    if (!ids) {
        return res.status(400).json({ message: "Please provide coin IDs in the query (ex: ?ids=bitcoin,ethereum)." });
    }

    try {
        const idsArr = ids.split(',').map(coin => coin.trim());

        // Fetch coins data from Redis/MongoDB

        const cachedKey = COIN_MARKET_KEY;
        const coinsData = await getCryptoDataById(cachedKey, idsArr);

        // console.log("Fetched coinsData:", coinsData);

        if (!coinsData || coinsData.length === 0) {
            return res.status(404).json({ message: `No data found for the provided ids: ${ids}` });
        }

        // Extract valid coin IDs
        const validCoinIds = coinsData.map(coin => coin.id);

        // Add valid coins to the specified watchlist

        const updatedWatchlist = await Watchlist.findByIdAndUpdate(
                                                    id,
                                                    { $addToSet: { coins: { $each: validCoinIds } } },       // Add unique coins
                                                    { new: true }       // Return the updated watchlist
        );

        if (!updatedWatchlist) {
            return res.status(404).json({ message: "Watchlist not found." });
        }

        return res.status(200).json({
                                    message: 'Coins added to the watchlist successfully',
                                    watchlist: updatedWatchlist
        });
        
    } catch (error) {
        console.error("Error adding coins to the watchlist:", error);
        res.status(500).json({ message: "Error adding coins to the watchlist", error });
    }
});

// Retrieve watchlist for authenticated user with full coins details
// GET /api/watchlists/:id

router.get('/watchlists/:id', async (req, res) => {

    const { id } = req.params;

    try {
        // Fetch the watchlist
        const watchlist = await Watchlist.findById(id);

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