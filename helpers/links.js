
// helpers/links.js

const generateLinks = (watchlistId) => [
    { rel: 'self', href: `/api/watchlists/${watchlistId}`, method: 'POST' },
    { rel: 'watchlists', href: `/api/watchlists`, method: 'GET' },
    { rel: 'get_watchlist', href: `/api/watchlists/${watchlistId}`, method: 'GET' },
    { rel: 'remove_coins', href: `/api/watchlists/${watchlistId}/remove-coins`, method: 'PATCH' }
];

export default generateLinks;