
import axios from 'axios';
import redisClient from '../config/redisConfig.js';

// Coins List with Market Data 
const coinsMarkets = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc';

// Coins List with Market Data for Specific Coin(s) 
// const coinsMarketsByIds = 'https://api.coingecko.com/api/v3/coins/markets?ids=solana&vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';

// Fetch data from CoinGecko and store it in Redis

export const fetchAndCacheCryptoData = async () => {
    try {
        const response = await axios.get(coinsMarkets);
        // const response = await axios.get(coinsMarketsByIds);
        const cryptoData = response.data;
        // console.log(cryptoData);

        // Store data in Redis with a TTL (e.g., 1 hour)
        await redisClient.set('cryptoData', JSON.stringify(cryptoData));
        await redisClient.expire('cryptodata', 3600);

        console.log('Crypto data cached successfully');
    } catch (error) {
        console.error('Error fetching data from CoinGecko:', error);
    }
};

// Retrieve cached data from Redis

export const getCryptoData = async () => {

    const cachedData = await redisClient.get('cryptoData');
    return cachedData ? JSON.parse(cachedData) : null;  // Ternary operator
};