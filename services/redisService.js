
// redisService.js

import redisClient from '../config/redisConfig.js';
import { getAllCryptoDataFromMongo, getCryptoDataByIdFromMongo } from './mongoService.js';

// Function to cache data in Redis

export const cacheDataInRedis = async (key, data, expiration = 360) => {

    try {
        await redisClient.set(key, JSON.stringify(data));
        await redisClient.expire(key, expiration);
        // console.log(`${key} cached successfully.`);

    } catch (error) {
        console.error(`Error caching ${key} in Redis:`, error);
    }
};

// Function to retrieve cached data from Redis by key, with fallback to MongoDB if not found

export const getAllCryptoData = async (key) => {

    try {
        // Attempt to retrieve data from Redis
        const cachedData = await redisClient.get(key);

        if (cachedData) {
            console.log('Data fetched from Redis cache');
            return JSON.parse(cachedData);
        }
        
        // If data is not found in Redis, fetch from MongoDB
        console.log('No data in Redis, fetching from MongoDB');

        const dbData = await getAllCryptoDataFromMongo();

        if (dbData && dbData.length > 0) {
            // Cache the MongoDB data in Redis for future requests
            await cacheDataInRedis(key, dbData);
            console.log('Data cached in Redis');
            return dbData;
        }

        // Return null if no data found in MongoDB either
        return null;

    } catch (error) {
        console.error(`Error fetching ${key} from Redis:`, error);
        return null;
    }
};

// Function to retrieve specific coins by IDs from Redis

export const getCryptoDataById = async (key, ids) => {

    try {
        // Attempt to retrieve data from Redis
        const cachedData = await redisClient.get(key);

        if (cachedData) {
            console.log(`Data fetched from Redis cache for: ${ids}`);
            const allData = JSON.parse(cachedData);
            return allData.filter(coin => ids.includes(coin.id));
        }

        // If data is not found in Redis, fetch from MongoDB
        console.log('No data in Redis, fetching from MongoDB, by id');

        const dbDataById = await getCryptoDataByIdFromMongo(ids);

        if (dbDataById && dbDataById.length > 0) {
            await cacheDataInRedis(key, dbDataById);
            console.log('Data cached in Redis, by id');
            return dbDataById;
        }

        // Return null if no data found in MongoDB either
        return null;

    } catch (error) {
        console.error(`Error fetching ${key} by IDs from Redis:`, error);
        return null;
    }
}