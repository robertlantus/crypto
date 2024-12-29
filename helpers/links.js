
// helpers/links.js

export const generateLinksAdd = (watchlistId) => [
    { rel: 'self', href: `/api/watchlists/${watchlistId}/add-coins`, method: 'POST' },
    { rel: 'watchlists', href: `/api/watchlists`, method: 'GET' },
    { rel: 'get_watchlist', href: `/api/watchlists/${watchlistId}`, method: 'GET' },
    { rel: 'remove_coins', href: `/api/watchlists/${watchlistId}/remove-coins`, method: 'PATCH' }
];

export const generateLinksRemove = (watchlistId) => [
    { rel: 'self', href: `/api/watchlists/${watchlistId}/remove-coins`, method: 'PATCH' },
    { rel: 'watchlists', href: `/api/watchlists`, method: 'GET' },
    { rel: 'get_watchlist', href: `/api/watchlists/${watchlistId}`, method: 'GET' },
    { rel: 'add_coins', href: `/api/watchlists/${watchlistId}/add-coins`, method: 'POST' }
];

export const generateLinksGet = (watchlistId) => [
    { rel: 'self', href: `/api/watchlists/${watchlistId}`, method: 'GET' },
    { rel: 'watchlists', href: `/api/watchlists`, method: 'GET' },
    { rel: 'add_coins', href: `/api/watchlists/${watchlistId}/add-coins`, method: 'POST' },
    { rel: 'remove_coins', href: `/api/watchlists/${watchlistId}/remove-coins`, method: 'PATCH' }
];
