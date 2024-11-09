
// Index Routes
// index.js

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/index', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../public', 'index.html'));
});

router.get('/signup', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../public', 'signup.html'));
});

export default router;