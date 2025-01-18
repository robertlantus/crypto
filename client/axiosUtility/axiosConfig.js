import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3333', // My backend server URL
  headers: {
    'Content-Type': 'application/json'
  }
});

export default instance;
