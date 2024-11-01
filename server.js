

// server.js

import express from 'express';
import { startApp } from './services/startApp.js';
import router from './routes/routes.js';
import { connectDB } from './config/mongoConfig.js';
import cron from './jobs/cronJobs.js';

const PORT = process.env.PORT || 3333;

const app = express();

// Connect to MongoDB
connectDB();

// Start the initial fetch and the cron job
startApp();
cron();

// JSON parsing middleware
app.use(express.json());

// Routes
app.use('/api', router);

// @route   GET http://localhost:3000/api

// Check if the app is running in a test environment

if (process.env.NODE_ENV !== 'test') {
    // Start the Express server only if not in test mode
    const server = app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
    });
}

