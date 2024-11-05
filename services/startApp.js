
// startApp.js

import { fetchStoreCacheData } from "./fetchStoreCacheData.js";

export const startApp = async () => {
    // Fetch crypto data 
    try {
        console.log('Initial fetch of crypto data from CoinGecko API');
        await fetchStoreCacheData();
    } catch (error) {
        console.error('Error during app startup:', error);
        throw error;
    }
};