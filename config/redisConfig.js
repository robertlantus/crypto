// redisConfig.js

import redis from 'redis';

const REDIS_PORT = process.env.PORT || 6379;

// Setup Redis client
const redisClient = redis.createClient(REDIS_PORT);

redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('error', err => console.error('Redis Client Error', err));

// Connect to Redis
await redisClient.connect();

export default redisClient;