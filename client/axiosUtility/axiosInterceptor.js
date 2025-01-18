
import axios from "axios";
import router from "../src/router/index.js";

// Create an Axios Instance

const axiosInterceptor = axios.create({
    baseURL: 'http://localhost:3333',
    timeout: 10000          // Set a timeout for requests
});

// Request interceptor (optional for attaching tokens)

// axiosInstance.interceptors.request.use(
//     (config) => {
//       const token = localStorage.getItem("authToken");
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
// );

// Response interceptor

axiosInterceptor.interceptors.response.use(
    (response) => {
        return response;        // Pass successful responses
    },

    (error) => {
        if (error.response.status === 401) {
            // Token is invalid or expired
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            router.push('/');       // Redirect to homepage
        }
        return Promise.reject(error);
    }
);

export default axiosInterceptor;