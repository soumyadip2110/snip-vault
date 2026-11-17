import api from './axios.js';

export const registerUser = async (userData) => {
    const response = await api.post('/auth/register', userData, {
        requiresAuth: false
    });
    return response.data;
};

export const loginUser = async (credentials) => {
    const response = await api.post('/auth/login', credentials, {
        requiresAuth: false
    });
    return response.data;
};

export const refreshAccessToken = async () => {
    const response = await api.post('/auth/refresh-token');
    return response.data;
};

export const logoutUser = async () => {
    const response = await api.post('/auth/logout');
    return response.data;
};