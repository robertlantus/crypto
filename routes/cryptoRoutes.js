// cryptoRoutes.js

import express from 'express';
import { getCryptoData, fetchPriceData, fetchCoinDetails } from '../services/fetchCryptoData.js';

const router = express.Router();

// Route to get all cached coins from /coins/markets
// GET http://localhost:3000/api/coins/markets

router.get('/coins/markets', async (req, res) => {
    try {
        const fallbackUrl = 'https://api.coingecko.com/api/v3/coins/markets';
        const fallbackParams = {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 100,
            page: 1,
        };
        const marketData = await getCryptoData('cryptoMarketsData', fallbackUrl, fallbackParams);

        return res.status(200).json(marketData);

    } catch (error) {
        res.status(500).json({ message: 'Error retrieving market data', error });
    }
});

// Route to fetch price data from /simple/price based on coin ids by query
// GET http://localhost:3000/api/simple/price

router.get('/simple/price', async (req, res) => {    
    try {
        // const ids = req.query.ids ? req.query.ids.split(',') : [];   // Multiple coins
        const ids = req.query.ids;

        if (ids.length === 0) {
            return res.status(400).json({ message: 'Please provide coin ids' });
        }

        const fallbackUrl = 'https://api.coingecko.com/api/v3/simple/price';
        const fallbackParams = {
            ids,
            vs_currencies: 'usd',
            include_market_cap: true,
            include_24hr_vol: true,
            include_24hr_change: true,
            include_last_updated_at: true,
            precision: '2'
        };
        
        const priceData = await getCryptoData(`priceData:${ids}`, fallbackUrl, fallbackParams);
        return res.status(200).json(priceData);

    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving price data', error });
    }
});

// Route to fetch price data from /simple/price based on coin ids by param
// GET http://localhost:3000/api/simple/price?ids=bitcoin

// router.get('/simple/price/:ids', async (req, res) => {    
//     try {
//         // const ids = req.query.ids ? req.query.ids.split(',') : [];   // Multiple coins
//         const ids = req.params.ids;

//         if (ids.length === 0) {
//             return res.status(400).json({ message: 'Please provide coin ids' });
//         }
        
//         const priceData = await fetchPriceData(ids)
//         return res.status(200).json(priceData);

//     } catch (error) {
//         return res.status(500).json({ message: 'Error retrieving price data', error });
//     }
// });

// // Route to get detailed coin info from /coins/{id} by params
// GET http://localhost:3000/api/coins/id

router.get('/coins/:id', async (req, res) => {
    try {
        const coinId = req.params.id;

        // Define the CoinGecko URL and parameters for fetching the coin details
        const fallbackUrl = `https://api.coingecko.com/api/v3/coins/${coinId}`;
        const fallbackParams = {}; // No additional params required for this endpoint

        // Attempt to fetch from Redis or fallback to CoinGecko if Redis fails
        const coinDetails = await getCryptoData(`coinDetails:${coinId}`, fallbackUrl, fallbackParams);
        
        return res.status(200).json(coinDetails);

    } catch (error) {
        return res.status(500).json({ message: `Error retrieving details for coin ${req.params.id}`, error });
    }
});

// // Route to get detailed coin info from /coins/{id} by query
// GET http://localhost:3000/api/coins?id=bitcoin

// router.get('/coins', async (req, res) => {
//     try {
//         const coinId = req.query.id;
//         const coinDetails = await fetchCoinDetails(coinId);
//         return res.status(200).json(coinDetails);
//     } catch (error) {
//         return res.status(500).json({ message: 'Error retrieving coin details', error });
//     }
// });

export default router;