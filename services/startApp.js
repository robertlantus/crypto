// startApp.js

// import { fetchAndCacheCryptoData } from './fetchCryptoData.js';
import { fetchAndCacheCryptoData } from "./cryptoDataService.js";

export const startApp = async () => {
    try {
        // Fetch crypto data and cache it to Redis after it starts
        console.log('Initial fetch of crypto data...');
        await fetchAndCacheCryptoData();
        
    } catch (err) {
        console.error('Error during app startup:', err);
    }
}
