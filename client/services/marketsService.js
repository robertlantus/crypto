
// client/services/marketsServices.js

import axios from "../axiosUtility/axiosConfig.js";

// Fetch all market data
export const fetchMarketData = () => {
    return axios.get('/api/coins/markets');
};

// Fetch data for a specific coin by ID
export const fetchCoinDataById = (id) => {
    return axios.get(`/api/coins/markets/${id}`);
};