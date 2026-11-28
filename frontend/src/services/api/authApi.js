import api from './axios.js';
let refreshPromise = null;

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
    if (!refreshPromise) {
        refreshPromise = api
            .post('/auth/refresh-token', null, {
                requiresAuth: false
            })
            .then((response) => response.data)
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
};

export const logoutUser = async () => {
    const response = await api.post('/auth/logout');
    return response.data;
};