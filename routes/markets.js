
// /routes/markets.js

import express from 'express';
import { getAllCryptoData, getCryptoDataById } from '../services/redisService.js';
import { COIN_MARKET_KEY } from '../jobs/cronJobs.js';

// Get an instance of router
const router = express.Router();

// Route to get all cached coins from /coins/markets 
// GET http://localhost:3333/api/coins/markets --> OK

router.get('/coins/markets', async (req, res) => {
    try {

        const cachedKey = COIN_MARKET_KEY;

        // Fetch data from Redis or MongoDB

        const coinsData = await getAllCryptoData(cachedKey);
        
        if (!coinsData || coinsData.length === 0) {
            return res.status(404).json({ message: 'No data found in MongoDB', error });
        }

        return res.status(200).json(coinsData);     // Send data as JSON response

    } catch (error) {
        console.error('Error retrieving market data from MongoDB:', error);
        res.status(500).json({ message: 'Error retrieving market data', error });
    }
});

// Route to get coins by id(s) from /coins/markets/query?ids=bitcoin,ethereum,solana 
// GET http://localhost:3333/api/coins/markets/query?ids=bitcoin,ethereum,solana --> OK

router.get('/coins/markets/query', async (req, res) => {

    const { ids } = req.query;
    const idsArr = ids.split(',');

    try {
        const cachedKey = COIN_MARKET_KEY;

        // Attempt to fetch data from Redis
        const coinsData = await getCryptoDataById(cachedKey, idsArr);

        if (!coinsData || coinsData.length === 0) {
            return res.status(404).json({ message: `No data found for the provided ids: ${ids}` });
        }

        return res.status(200).json(coinsData);
        
    } catch (error) {
        console.error('Error retrieving data by ids from Redis or MongoDB:', error);
        res.status(500).json({ message: 'Error retrieving market data', error });
    }
});

// Route to get coins by id(s) from /coins/markets/id(s) 
// GET http://localhost:3333/api/coins/markets/bitcoin,ethereum --> OK

// router.get('/coins/markets/:ids', async (req, res) => {

//     const { ids } = req.params;
//     const idsArr = ids.split(',');

//     try {
//         const cachedKey = COIN_MARKET_KEY;

//         // Attempt to fetch data from Redis
//         let coinsData = await getCryptoDataById(cachedKey, idsArr);

//         if (!coinsData || coinsData.length === 0) {
//             return res.status(404).json({ message: `No data found for the provided ids: ${ids}` });
//         }

//         return res.status(200).json(coinsData);
        
//     } catch (error) {
//         console.error('Error retrieving data by ids from Redis or MongoDB:', error);
//         res.status(500).json({ message: 'Error retrieving market data', error });
//     }
// });

export default router;