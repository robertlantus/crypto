
// client/services/marketsServices.js

import axios from "../axiosConfig.js";

export const fetchMarketData = () => {
    return axios.get('/api/coins/markets');
}