// cronJobs.js

import cron from 'node-cron';
import { fetchAndCacheCryptoData } from '../services/cryptoDataService.js';

// Environment variables
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '*/55 * * * *'; 

// Set up the cron job to run every 5 minutes

export const scheduleCronJobs = () => {

    cron.schedule(CRON_SCHEDULE, () => {
        console.log('Fetching crypto data from CoinGecko...every 5 minutes');
        fetchAndCacheCryptoData();
    });
};


