
import express from 'express';
import { getCryptoData } from '../services/fetchCryptoData.js';

const router = express.Router();

// Define the routes to get cached crypto data

// Second -- Refactores first into 2 separate routes

// Route to get all coins
// GET http://localhost:3000/api/coins/markets

router.get('/coins/markets', async (req, res) => {
    try {
        const cachedData = await getCryptoData();

        if (cachedData) {
            return res.status(200).json(cachedData);
        } else {
            return res.status(404).json({ message: 'No data in Redis cache' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving data', error });
    }
});

// Route to get coins by query ids
// GET http://localhost:3000/api/coins/markets/query?ids=monero,solana,bitcoin

// Route to get coins by params ids
// GET http://localhost:3000/api/coins/markets/query/monero,solana,bitcoin

// router.get('/coins/markets/query/:ids', async (req, res) => {    // params
router.get('/coins/markets/query', async (req, res) => {    // query
    try {
        // const ids = req.params.ids;
        // const ids = req.query.ids;
        const ids = req.query.ids ? req.query.ids.split(',') : [];
        // console.log(ids);
        const cachedData = await getCryptoData();

        if (cachedData && ids.length > 0) {
            const filteredCoins = cachedData.filter(coin => ids.includes(coin.id));
            if (filteredCoins.length > 0) {
                return res.status(200).json(filteredCoins);
            } else {
                return res.status(404).json({ message: 'No coins found for the provided ids' });
            }
        } else {
            return res.status(400).json({ message: 'Invalid or missing coin ids' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving data', error });
    }
});



// First -- Get all coins and query selected

// router.get('/coins/markets', async (req, res) => {
//     try {
//         // Extract coin ids from query parameters (e.g., ?ids=solana,bitcoin)
//         const ids = req.query.ids ? req.query.ids.split(',') : [];

//         // Fetch from Redis or API
//         const cachedData = await getCryptoData();

//         if (cachedData) {
//             // console.log('Cached data retrieved:', cachedData);
//             if (ids.length > 0) {
//                 // Filter the cached data to only include coins with matching ids
//                 const filteredCoins = cachedData.filter(coin => ids.includes(coin.id));
//                 if (filteredCoins.length > 0) {
//                     return res.status(200).json(filteredCoins);
//                 } else {
//                     return res.status(404).json({ message: 'No coins found for the provided ids' });
//                 }
//             } else {
//                 // If no ids provided, return all data
//                 return res.status(200).json(cachedData);
//             }
//         } else {
//             return res.status(404).json({ message: 'No data in Redis cache' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Error retrieving data', error });
//         // next(error);
//     }
// });


export default router;