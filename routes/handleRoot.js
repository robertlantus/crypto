
// /routes/handleRoot.js

import express from 'express';

// Get an instance of router
const router = express.Router();

// Handle root API endpoint
// GET http://localhost:3333/api

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Gecko API ' });
});

export default router;