
// /client/services/authService.js

import axios from '../axiosUtility/axiosConfig.js';

export const signupUser = (userData) => {
    return axios.post('/api/auth/signup', userData);
};

export const loginUser = (userData) => {
    return axios.post('/api/auth/login', userData);
};