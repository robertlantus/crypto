
// cryptoDataService.js

import { getCryptoData, cacheDataInRedis } from './redisService.js';
import { fetchMarketData } from './coinGeckoService.js';

// Fetch and cache market data

export const fetchAndCacheCryptoData = async () => {

    try {
        const marketData = await fetchMarketData();
        await cacheDataInRedis('cryptoMarketsData', marketData);
        console.log('Crypto market data cached successfully.');

    } catch (error) {
        console.error('Error fetching and caching market data from CoinGecko:', error);
    }
};

// Fetch market data for selected coins by Ids

export const fetchMarketDataForCoins = async (ids) => {

    try {
        // Redis key for the top 100 coins
        // const redisKey = 'cryptoMarketsData';

        // Get the full market data from Redis
        // const cachedData = await getCryptoData(redisKey);

        const cachedData = await getCryptoData('cryptoMarketsData');

        if (cachedData) {
            
            // Handle multiple coin IDs, ex: 'bitcoin,ethereum'
            const requestedIds = ids.split(',');

            // Filter the cached data for the specific coin IDs requested
            const filteredData = cachedData.filter(coin => requestedIds.includes(coin.id));

            // Return filtered data or null if no matching data found
            if (filteredData.length > 0) {
                return filteredData;
            } else {
                console.log(`No market data found for the requested coin IDs: ${ids}`);
                return null;
            }
        } else {
            console.log(`No cached market data found in Redis.`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching data for coins ${ids} from Redis:`, error);
        throw error;
    }
}