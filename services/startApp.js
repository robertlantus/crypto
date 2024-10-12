
// import cron from 'node-cron';
import { fetchAndCacheCryptoData } from './fetchCryptoData.js';

export const startApp = async () => {
    try {
        // Fetch crypto data and cache it to Redis after it starts
        console.log('Initial fetch of crypto data...');
        await fetchAndCacheCryptoData();
        
    } catch (err) {
        console.error('Error during app startup:', err);
    }
}
