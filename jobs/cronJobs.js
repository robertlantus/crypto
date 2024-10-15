// cronJobs.js

import cron from 'node-cron';
import { fetchAndCacheCryptoData } from '../services/fetchCryptoData.js';

// Set up the cron job to run every 5 minutes

export const scheduleCronJobs = () => {

    cron.schedule('*/55 * * * *', () => {
        console.log('Fetching crypto data from CoinGecko...every 5 minutes');
        fetchAndCacheCryptoData();
    });
};


