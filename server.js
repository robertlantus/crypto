

// server.js

import express from 'express';
import { startApp } from './services/startApp.js';
import router from './routes/routes.js';
import { connectDB } from './config/mongoConfig.js';

const PORT = 3333;

const app = express();

// Connect to MongoDB
connectDB();

// Start the initial fetch
startApp();

// JSON parsing middleware
app.use(express.json());

// Routes
app.use('/api', router);

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});

