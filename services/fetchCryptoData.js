
// fetchCryptoData.js

import axios from 'axios';
import redisClient from '../config/redisConfig.js';

// CoinGecko API URLs

const coinsMarketsUrl = 'https://api.coingecko.com/api/v3/coins/markets';
const simplePriceUrl = 'https://api.coingecko.com/api/v3/simple/price';
const coinDetailsUrl = (id) => `https://api.coingecko.com/api/v3/coins/${id}`;

// Function to cache data in Redis

const cacheDataInRedis = async (key, data, expiration = 3600) => {
    try {
        await redisClient.set(key, JSON.stringify(data));
        await redisClient.expire(key, expiration);
        // console.log(`${key} cached successfully.`);
    } catch (error) {
        console.error(`Error caching ${key} in Redis:`, error);
    }
};

// Fetch data for top 100 coins from CoinGecko and store in Redis

export const fetchAndCacheCryptoData = async () => {
    try {
        // Fetch top coins by market cap
        const marketParams = {
            params: {
                vs_currency: 'usd',          
                order: 'market_cap_desc',
                per_page: 100,  // Fetch 100 coins
                page: 1,         // First page
            }
        };

        // Fetch data from /coins/markets for top 100 coins

        const marketsResponse = await axios.get(coinsMarketsUrl, marketParams);
        const marketData = marketsResponse.data;
        // console.log('Market Data: ', marketData);

        // Cache market data in Redis
        await cacheDataInRedis('cryptoMarketsData', marketData);

        console.log('Crypto market data cached successfully.');
    } catch (error) {
        console.error('Error fetching and caching market data from CoinGecko:', error);
    }
};

// Function to retrieve cached data from Redis by key and fallback to CoinGecko if not available

export const getCryptoData = async (key, fallbackUrl, fallbackParams) => {
    try {
        // Attempt to fetch data from Redis cache
        const cachedData = await redisClient.get(key);

        if (cachedData) {
            return JSON.parse(cachedData);
        }

        // If no data in Redis, fetch from CoinGecko as a fallback
        console.log(`No data in Redis for key: ${key}. Fetching from CoinGecko...`);

        const fallbackResponse = await axios.get(fallbackUrl, { params: fallbackParams });
        const fetchedData = fallbackResponse.data;

        // Cache the newly fetched data in Redis for future use
        await cacheDataInRedis(key, fetchedData);

        return fetchedData;

    } catch (error) {
        console.error(`Error retrieving or fetching ${key} from Redis or CoinGecko:`, error);
        throw error;
    }

};

// Fetch price details from /simple/price based on coin ids

export const fetchPriceData = async (ids) => {
    try {
        const priceParams = {
            params: {
                // ids: ids.join(','),     // Multiple Coin ids, dynamically passed
                ids: ids,
                vs_currencies: 'usd',    
                include_market_cap: true,
                include_24hr_vol: true,
                include_24hr_change: true,
                include_last_updated_at: true,
                precision: '2'
            }
        };

        const priceResponse = await axios.get(simplePriceUrl, priceParams);
        const priceData = priceResponse.data;
        // console.log('Price Data: ', priceData);
        return priceData;

    } catch (error) {
        console.error('Error fetching price data:', error);
        throw error;
    }
}

// Fetch detailed coin information from /coins/{id} for a specific coin

export const fetchCoinDetails = async (id) => {
    try {
        const detailResponse = await axios.get(coinDetailsUrl(id));
        const detailedCoinData = detailResponse.data;
        return detailedCoinData;

    } catch (error) {
        console.error(`Error fetching details for coin ${id}:`, error);
        throw error;
    }
}

