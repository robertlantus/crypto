
// cronJobs.js
// Automate fetching every 5 minutes and store data in both Redis and MongoDB

import cron from 'node-cron';
import { fetchStoreCacheData } from '../services/fetchStoreCacheData.js';

// Environment variables
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '*/5 * * * *'; 

// Redis key for caching the crypto data
export const COIN_MARKET_KEY = 'coins_markets';

// Set up the cron job to run every 5 minutes

export const cronJob = () => {

    cron.schedule(CRON_SCHEDULE, async () => {

        console.log('Fetching crypto data from CoinGecko...every 5 minutes');
    
        try {
            // Fetch data from the CoinGecko API and store it in MongoDB and cache it in Redis
    
            const data = await fetchStoreCacheData();
    
            // if (data && data.length > 0) {
            //     console.log('Data successfully stored in MongoDB and cached in Redis');
            // } else {
            //     console.log('No data fetched from CoinGecko API');
            // }
        } catch (error) {
            console.error('Error in cron job fetching and storing data:', error);
        }
    });
};

