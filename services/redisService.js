
// redisService.js

import redisClient from '../config/redisConfig.js';

// Function to cache data in Redis

export const cacheDataInRedis = async (key, data, expiration = 600) => {

    try {
        await redisClient.set(key, JSON.stringify(data));
        await redisClient.expire(key, expiration);
        // console.log(`${key} cached successfully.`);

    } catch (error) {
        console.error(`Error caching ${key} in Redis:`, error);
    }
};

// Function to retrieve cached data from Redis by key

export const getCryptoData = async (key) => {

    try {
        const cachedData = await redisClient.get(key);
        return cachedData ? JSON.parse(cachedData) : null;

    } catch (error) {
        console.error(`Error fetching ${key} from Redis:`, error);
        return null;
    }
};