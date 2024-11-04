
// routes.js

import express from 'express';
// import { getAllCryptoData } from '../services/mongoService.js';
import { getCryptoData, getCryptoDataByIdFromRedis } from '../services/redisService.js';
import { COIN_MARKET_KEY } from '../jobs/cronJobs.js';
import { getCryptoDataById } from '../services/mongoService.js';

const router = express.Router();

// Route to get all cached coins from /coins/markets 
// GET http://localhost:3333/api/coins/markets --> OK

router.get('/coins/markets', async (req, res) => {
    try {

        const cachedKey = COIN_MARKET_KEY;

        // Fetch data from Redis or MongoDB

        const coinsData = await getCryptoData(cachedKey);
        
        if (!coinsData || coinsData.length === 0) {
            return res.status(404).json({ message: 'No data found in MongoDB', error });
        }

        return res.status(200).json(coinsData);     // Send data as JSON response

    } catch (error) {
        console.error('Error retrieving market data from MongoDB:', error);
        res.status(500).json({ message: 'Error retrieving market data', error });
    }
});

// Route to get coins by id(s) from /coins/markets/id(s) 
// GET http://localhost:3333/api/coins/markets/bitcoin,ethereum --> OK

router.get('/coins/markets/:ids', async (req, res) => {

    const { ids } = req.params;
    const idsArr = ids.split(',');

    try {
        const cachedKey = COIN_MARKET_KEY;

        const coinsData = await getCryptoDataByIdFromRedis(cachedKey, idsArr);

        if (!coinsData || coinsData.length === 0) {
            console.log('Error retrieving data from Redis');

            coinsData = await getCryptoDataById(idsArr);

            if (!coinsData || coinsData.length === 0) {
                console.log('Error retrieving data from MongoDB');
                return null;
            }
        }

        return res.status(200).json(coinsData);
        
    } catch (error) {
        console.error('Error retrieving market data from Redis or MongoDB:', error);
        res.status(500).json({ message: 'Error retrieving market data', error });
    }
});

export default router;