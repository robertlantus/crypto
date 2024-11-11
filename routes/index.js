
// index.js --> Made Redundant by the use of the Static Folder (app.use(express.static(path.join(__dirname, 'public')));) to serve static files

// import express from 'express';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const router = express.Router();

// // Get the directory name
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// router.get('/index', (req, res) => {
//     res.status(200).sendFile(path.join(__dirname, '../public', 'index.html'));
// });

// router.get('/login', (req, res) => {
//     res.status(200).sendFile(path.join(__dirname, '../public', 'login.html'));
// });

// router.get('/signup', (req, res) => {
//     res.status(200).sendFile(path.join(__dirname, '../public', 'signup.html'));
// });

// router.get('/client', (req, res) => {
//     res.status(200).sendFile(path.join(__dirname, '../public', 'client.html'));
// });

// export default router;