

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

import router from './routes/routes.js';
import auth from './routes/auth.js';
import index from './routes/index.js';

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

// Use the routes defined in index.js
app.use('/api', index);

// Use the routes defined in auth.js
app.use('/api/auth', auth);

// Use the routes defined in routes.js
app.use('/api', router);

// @route   GET http://localhost:3333/api
app.listen(PORT, console.log(`Server running on port: ${PORT}`));