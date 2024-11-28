import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers["x-auth-token"] = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;