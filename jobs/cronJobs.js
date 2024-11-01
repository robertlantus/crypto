
// cronJobs.js
// Automate fetching every 5 minutes and store data in both Redis and MongoDB

import cron from 'node-cron';
import { fetchData } from '../services/fetchData';
import { cacheDataInRedis } from '../services/redisService';

// Environment variables
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '*/5 * * * *'; 

// Redis key for caching the crypto data
export const COIN_MARKET_KEY = 'coins_markets';

// Set up the cron job to run every 5 minutes

cron.schedule(CRON_SCHEDULE, async () => {

    console.log('Fetching crypto data from CoinGecko...every 5 minutes');

    try {
        // Fetch data from the CoinGecko API and store it in MongoDB
        // fetchData also stores data in MongoDB by calling storeCryptoData

        const data = await fetchData();

        // If data was fetched successfully, store it in Redis with a 6-minute expiration
        if (data && data.length > 0) {
            await cacheDataInRedis(COIN_MARKET_KEY, data, 360);
            console.log('Data successfully cached in Redis');
        } else {
            console.log('No data fetched from CoinGecko API');
        }
    } catch (error) {
        console.error('Error in cron job fetching and storing data:', error);
    }
});

export default cron;