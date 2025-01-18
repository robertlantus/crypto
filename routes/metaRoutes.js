// /rotes/metaRoutes.js -- returns a list of available API links

import express from 'express';

const router = express.Router();

// Base URL for watchlist-related routes
const WATCHLIST_BASE_URL = '/api/watchlists';

router.get('/', (req, res) => {

    const BASE_URL = req.protocol + '://' + req.get('host') + WATCHLIST_BASE_URL;

    res.status(200).json({
        message: 'API metadata',
        links: [
            { rel: 'create-watchlist', href: `${BASE_URL}`, method: 'POST' },
            { rel: 'get-all-watchlists', href: `${BASE_URL}`, method: 'GET' },
            { rel: 'get-watchlist-by-id', href: `${BASE_URL}/{id}`, method: 'GET' },
            { rel: 'update-watchlist', href: `${BASE_URL}/{id}`, method: 'PATCH' },
            { rel: 'delete-watchlist', href: `${BASE_URL}/{id}`, method: 'DELETE' },
        ]
    });
});

export default router;
