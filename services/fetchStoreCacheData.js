
// fetchStoreCacheData.js
// Fetch data from CoinGecko API and store it in MongoDB

import axios from 'axios';
import { storeCryptoData } from './mongoService.js';
import { cacheDataInRedis } from './redisService.js';
import { COIN_MARKET_KEY } from '../jobs/cronJobs.js';

const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';

export const fetchStoreCacheData = async () => {
    try {
        // Fetch data from CoinGecko API

        const response = await axios.get(url);
        const data = response.data;

        // Check if data is valid

        if (!data || !Array.isArray(data) || data.length === 0) {
            throw new Error('Invalid format or empty data from CoinGecko API');
        }

        // Call the storeCryptoData function to handle MongoDB storage

        const result = await storeCryptoData(data);
        // console.log(`Data successfully stored in MongoDB: ${result.upsertedCount} new entries, ${result.modifiedCount} updated`);    // Works for Bulk write only

        // Cache data in Redis at start to keep in sync with MongoDB
        await cacheDataInRedis(COIN_MARKET_KEY, data, 360);

        // console.log(result);
        // console.log(data);
        return data;

    } catch (error) {
        console.error('Error fetching and storing data from CoinGecko:', error);
        throw error;
    }
};