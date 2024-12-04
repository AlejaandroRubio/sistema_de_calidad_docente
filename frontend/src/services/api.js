import axios from 'axios';

// Obtiene la URL base de la API desde las variables de entorno
const API_URL = process.env.REACT_APP_API_URL;

export const api = axios.create({
    baseURL: API_URL, // Asigna la URL base a las solicitudes HTTP
});

// Configura un interceptor para las solicitudes de axios
api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token');
    // Si el token existe, lo agrega al encabezado 'x-auth-token'
    if (token) {
        config.headers["x-auth-token"] = token;
    }
    return config;  // Devuelve la configuración de la solicitud con los encabezados actualizados
}, (error) => {
    return Promise.reject(error);
});

export default api;