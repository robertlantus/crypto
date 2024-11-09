

// server.js

import express from 'express';
import cors from 'cors';
import { startApp } from './services/startApp.js';
import router from './routes/routes.js';
import auth from './routes/auth.js';
import index from './routes/index.js';
import signup from './routes/index.js';
import { connectDB } from './config/mongoConfig.js';
import { cronJob } from './jobs/cronJobs.js';
import customMorganFormat from './config/morgan.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

// import dotenv from 'dotenv';

// Load .env configuration
// dotenv.config();
// dotenv.config({ path: '.env' });

const PORT = process.env.PORT || 3333;

const app = express();

app.use(cors());

// Connect to MongoDB
connectDB();

// Start the initial fetch and the cron job
startApp();
cronJob();

// JSON parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use custom Morgan middleware for logging HTTP requests
app.use(customMorganFormat);

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static folder
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));

// Routes

// app.get('/api/index', (req, res) => {
//     res.status(200).sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// app.get('/api/auth/signup', (req, res) => {
//     res.status(200).sendFile(path.join(__dirname, 'public', 'signup.html'));
// });

// Use the routes defined in index.js
app.use('/api', index);
app.use('/api/auth', signup);

// Use the routes defined in routes.js
app.use('/api', router);

// Use the routes defined in auth.js
app.use('/api/auth', auth);

// @route   GET http://localhost:3333/api

// Check if the app is running in a test environment

// if (process.env.NODE_ENV !== 'test') {
//     // Start the Express server only if not in test mode
//     const server = app.listen(PORT, () => {
//         console.log(`Server running on port: ${PORT}`);
//     });
// }

app.listen(PORT, console.log(`Server running on port: ${PORT}`));