

// server.js

import express from 'express';
import cors from 'cors';

import { connectDB } from './config/mongoConfig.js';
import { startApp } from './services/startApp.js';
import { cronJob } from './jobs/cronJobs.js';

import customMorganFormat from './config/morgan.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

import markets from './routes/markets.js';
import auth from './routes/auth.js';
import watchlists from './routes/watchlists.js';
import coins from './routes/coins.js';
import metaRoutes from './routes/metaRoutes.js';
import handleRoot from './routes/handleRoot.js';

const PORT = process.env.PORT || 3333;

const app = express();

app.use(cors());

// Connect to MongoDB
connectDB();

// Start the initial fetch and the cron job
startApp();
cronJob();

// JSON parsing middleware
app.use(express.json({ limit: '10kb' }));    // Limit JSON size to 10kb
app.use(express.urlencoded({ extended: true }));

// Use custom Morgan middleware for logging HTTP requests
app.use(customMorganFormat);

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// markets endpoints
app.use('/api/coins/markets', markets);

// authentication endpoints
app.use('/api/auth', auth);

// watchlists endpoints
app.use('/api/watchlists', watchlists);

// coins operations endpoints
app.use('/api/watchlists', coins);

// API links
app.use('/api', metaRoutes);

// handle root endpoint
app.use('/api', handleRoot);

// Start the server
app.listen(PORT, () => console.log(`👂 Server listening on port: ${PORT}`));

