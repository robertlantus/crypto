

import express from 'express';
// Redis setup
// import redisClient from './config/redisConfig.js';
// startApp
import { startApp } from './services/startApp.js';
// Cron jobs
import { scheduleCronJobs } from './jobs/cronJobs.js';
// Routes
import cryptoRoutes from './routes/cryptoRoutes.js';


// Environment variables
const PORT = process.env.PORT || 3000;

// Initialize Express app
const app = express();

// Start the initial fetch and the cron job
startApp();
scheduleCronJobs(); 

// Middleware space


// Use the crypto routes
app.use('/api', cryptoRoutes);

// Start the Express server
app.listen(3000, () => {
    console.log(`Server running on port: ${PORT}`);
});

// @route   GET http://localhost:3000/api