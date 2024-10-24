// server.js

import express from 'express';
// Morgan logging
import customMorganFormat from './config/morgan.mjs';
// startApp
import { startApp } from './services/startApp.js';
// Cron jobs
import { scheduleCronJobs } from './jobs/cronJobs.js';
// Routes
import cryptoRoutes from './routes/cryptoRoutes.js';


// Environment variables
const PORT = process.env.PORT || 3000;

// Initialize Express app
export const app = express();

// Start the initial fetch and the cron job
startApp();
scheduleCronJobs(); 

// Middleware space

// Use custom Morgan middleware for logging HTTP requests
app.use(customMorganFormat);


// Use the crypto routes
app.use('/api', cryptoRoutes);

// @route   GET http://localhost:3000/api

// Check if the app is running in a test environment

if (process.env.NODE_ENV !== 'test') {
    // Start the Express server only if not in test mode
    const server = app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
    });
}




