// redisConfig.js

import redis from 'redis';

const REDIS_PORT = process.env.PORT || 6379;

// Setup Redis client
// const redisClient = redis.createClient(REDIS_PORT);

//  Redis Connection Timeout and Retry

const redisClient = redis.createClient({
    host: 'localhost',
    port: REDIS_PORT,
    retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            // End reconnecting after a specific number of retries.
            if (options.attempt > 10) {
                return new Error('The server is down');
            }
            // Reconnect after
            return Math.min(options.attempt * 100, 3000);  // Exponential backoff
        }
    }
});

redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('error', err => console.error('Redis Client Error', err));

// Connect to Redis
await redisClient.connect();

export default redisClient;