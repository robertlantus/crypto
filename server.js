

// server.js

import express from 'express';
import { startApp } from './services/startApp.js';
import router from './routes/routes.js';
import { connectDB } from './config/mongoConfig.js';
import { cronJob } from './jobs/cronJobs.js';
import customMorganFormat from './config/morgan.mjs';
import 'dotenv/config';
// import dotenv from 'dotenv';

// Load .env configuration
// dotenv.config();
// dotenv.config({ path: '.env' });

const PORT = process.env.PORT || 3333;

const app = express();

// Connect to MongoDB
connectDB();

// Start the initial fetch and the cron job
startApp();
cronJob();

// JSON parsing middleware
app.use(express.json());

// Use custom Morgan middleware for logging HTTP requests
app.use(customMorganFormat);

// Routes
app.use('/api', router);

// @route   GET http://localhost:3333/api

// Check if the app is running in a test environment

// if (process.env.NODE_ENV !== 'test') {
//     // Start the Express server only if not in test mode
//     const server = app.listen(PORT, () => {
//         console.log(`Server running on port: ${PORT}`);
//     });
// }

app.listen(PORT, console.log(`Server running on port: ${PORT}`));