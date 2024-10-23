// cryptoRoutes.js

import express from 'express';
import { getCryptoData } from '../services/redisService.js';
import { fetchMarketDataForCoins } from '../services/cryptoDataService.js';
import { fetchPriceData, fetchCoinDetails } from '../services/coinGeckoService.js';

const router = express.Router();

// Route to get all cached coins from /coins/markets 
// GET http://localhost:3000/api/coins/markets --> OK

router.get('/coins/markets', async (req, res) => {

    try {
        const cachedData = await getCryptoData('cryptoMarketsData');

        if (cachedData) {
            return res.status(200).json(cachedData);
        } else {
            return res.status(404).json({ message: 'No cached market data in Redis cache' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Error retrieving market data', error });
    }
});

// Route to get selected cached coins from /coins/markets by params
// GET http://localhost:3000/api/coins/markets/bitcoin,solana --> OK

router.get('/coins/markets/:ids', async (req, res) => {

    const ids = req.params.ids;
    console.log(ids, typeof ids);
    
    // Check if ids are provided and valid (non-empty and trimmed)
    if (!ids || !ids.trim()) {
        return res.status(400).json({ message: 'Please provide valid coin ids in the URL parameters' }); // Bad request
    }

    try {
        // Split and trim the coin ids from the URL
        const coinIds = ids.split(',').map(id => id.trim()).filter(id => id);
        console.log(coinIds);

        // If no valid ids after trimming and filtering, return 400
        if (coinIds.length === 0) {
            return res.status(400).json({ message: 'Please provide valid coin ids in the URL parameters' });
        }

        // Fetch data for the provided coin ids from Redis
        const marketData = await fetchMarketDataForCoins(coinIds);

        // If no valid data returned, it's likely the coin ids are invalid
        if (!marketData || marketData.length === 0) {
            // If no data is found for valid coins, return 404
            return res.status(400).json({ message: `No data found for the provided coin ids: ${ids}` });
        } 
        // Return the valid market data
        return res.status(200).json(marketData);

    } catch (error) {
        res.status(500).json({ message: 'Error retrieving coin market data', error });
    }
});

// Route to fetch price data from /simple/price based on coin ids by params
// GET http://localhost:3000/api/simple/price/bitcoin --> OK

router.get('/simple/price/:ids', async (req, res) => {    

    try {
        const ids = req.params.ids ? req.params.ids.split(',') : [];   // Supports multiple coins

        if (ids.length === 0) {
            return res.status(400).json({ message: 'Please provide coin ids' });
        }
        
        const priceData = await fetchPriceData(ids)
        return res.status(200).json(priceData);

    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving price data', error });
    }
});

// Route to fetch detailed coin info from /coins/{id} by params
// GET http://localhost:3000/api/coins/id --> OK

router.get('/coins/:id', async (req, res) => {

    try {
        const coinId = req.params.id;
        const coinDetails = await fetchCoinDetails(coinId);

        return res.status(200).json(coinDetails);

    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving coin details', error });
    }
});

export default router;