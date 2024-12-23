
// /routes/markets.js

import express, { query } from 'express';
import { getAllCryptoData, getCryptoDataById } from '../services/redisService.js';
import { COIN_MARKET_KEY } from '../jobs/cronJobs.js';
// import { all } from 'axios';

// Get an instance of router
const router = express.Router();

// Base URL for this resource
const BASE_URL = '/api/coins/markets';

// Route to get all cached coins from /coins/markets 
// GET http://localhost:3333/api/coins/markets --> OK

router.get('/', async (req, res) => {
    try {
        // Get the Redis key for caching the crypto data (coins_markets)
        const cachedKey = COIN_MARKET_KEY;

        // Fetch data from Redis or MongoDB
        const coinsData = await getAllCryptoData(cachedKey);
        
        if (!coinsData || coinsData.length === 0) {
            return res.status(404).json({ 
                message: 'No data found in MongoDB',
                links: {
                    self: `${BASE_URL}`,
                    query: `${BASE_URL}/query?ids=bitcoin,ethereum`
                }
                // links: [
                //     {
                //     rel: 'self',
                //     href: `${BASE_URL}`,
                //     method: 'GET'
                //     },
                //     {
                //         rel: 'query',
                //         href: `${BASE_URL}/query?ids=bitcoin,ethereum`,
                //         method: 'GET'
                //     }
                // ]
            });
        }

        // Add HATEOAS links to the response
        const response = {
            data: coinsData,
            links: {
                self: `${BASE_URL}`,
                query: `${BASE_URL}/query?ids=bitcoin,ethereum`
            }
        };

        // return res.status(200).json(coinsData);     
        return res.status(200).json(response);     

    } catch (error) {
        console.error('Error retrieving market data from MongoDB:', error);
        res.status(500).json({ 
            message: 'Error retrieving market data', 
            error,
            links: {
                self: `${BASE_URL}`
            }
        });
    }
});

// Route to get coins by id(s) from /coins/markets/query
// GET http://localhost:3333/api/coins/markets/query?ids=bitcoin,ethereum,solana --> OK

router.get('/query', async (req, res) => {

    const { ids } = req.query;

    if (!ids) {
        return res.status(400).json({
            message: 'Please provide coin IDs in the query (ex: ?ids=bitcoin,ethereum).',
            links: {
                self: `${BASE_URL}/query`,
                all: `${BASE_URL}`
            }
        });
    }

    const idsArr = ids.split(',');

    try {
        const cachedKey = COIN_MARKET_KEY;

        // Attempt to fetch data from Redis
        const coinsData = await getCryptoDataById(cachedKey, idsArr);

        if (!coinsData || coinsData.length === 0) {
            return res.status(404).json({ 
                message: `No data found for the provided ids: ${ids}`, 
                links: {
                    self: `${BASE_URL}/query?ids=${ids}`,
                    all: `${BASE_URL}`
                }
            });
        }

        // Add HATEOAS links to the response
        const response = {
            data: coinsData,
            links: {
                self: `${BASE_URL}/query?ids=${ids}`,
                all: `${BASE_URL}`,
                single: idsArr.map((id) => `${BASE_URL}/${id}`)
            }
        }

        // return res.status(200).json(coinsData);
        return res.status(200).json(response);
        
    } catch (error) {
        console.error('Error retrieving data by ids from Redis or MongoDB:', error);
        res.status(500).json({ 
            message: 'Error retrieving market data', 
            error,
            links: {
                self: `${BASE_URL}/query`
            }
        });
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