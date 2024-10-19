
// coinGeckoService.js

import axios from 'axios';

// CoinGecko API URLs

const coinsMarketsUrl = 'https://api.coingecko.com/api/v3/coins/markets';
const simplePriceUrl = 'https://api.coingecko.com/api/v3/simple/price';
const coinDetailsUrl = (id) => `https://api.coingecko.com/api/v3/coins/${id}`;

// Fetch top 100 coins from CoinGecko

export const fetchMarketData = async () => {

    try {
        const marketParams = {
            params: {
                vs_currency: 'usd',          
                order: 'market_cap_desc',
                per_page: 100,  
                page: 1,         
            }
        };

        const marketsResponse = await axios.get(coinsMarketsUrl, marketParams);
        const marketData = marketsResponse.data;

        return marketData;

    } catch (error) {
        console.error('Error fetching ../coins/markets data from coinGecko', error);
        throw error;
    }
};

// Fetch price details from /simple/price based on coin ids

export const fetchPriceData = async (ids) => {
    try {
        const priceParams = {
            params: {
                // ids: ids.join(','),     // Multiple Coin ids, dynamically passed
                ids: ids,
                vs_currencies: 'usd',    
                include_market_cap: true,
                include_24hr_vol: true,
                include_24hr_change: true,
                include_last_updated_at: true,
                precision: '2'
            }
        };

        const priceResponse = await axios.get(simplePriceUrl, priceParams);
        const priceData = priceResponse.data;
        // console.log('Price Data: ', priceData);
        return priceData;

    } catch (error) {
        console.error('Error fetching ../simple/price data from coinGecko', error);
        throw error;
    }
};

// Fetch detailed coin information from /coins/{id} for a specific coin

export const fetchCoinDetails = async (id) => {
    try {
        const detailResponse = await axios.get(coinDetailsUrl(id));
        const detailedCoinData = detailResponse.data;

        return detailedCoinData;

    } catch (error) {
        console.error(`Error fetching details for coin ${id}:`, error);
        throw error;
    }
};