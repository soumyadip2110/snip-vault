import axios from 'axios';
import api from './axios.js';

const baseURL = import.meta.env.VITE_API_BASE_URL;

let refreshPromise = null;
let interceptorsConfigured = false;

export const configureApiInterceptors = (store, authActions) => {
    if (interceptorsConfigured) return;

    interceptorsConfigured = true;

    // Attach the access token to protected requests.
    api.interceptors.request.use((config) => {
        const accessToken = store.getState().auth.accessToken;

        if (accessToken && config.requiresAuth !== false) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    });

    // Handle expired access tokens.
    api.interceptors.response.use(
        (response) => response,

        async (error) => {
            const originalRequest = error.config;

            if (
                error.response?.status !== 401 ||
                !originalRequest ||
                originalRequest._retry ||
                originalRequest.requiresAuth === false
            ) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            try {
                // Reuse an ongoing refresh request if one exists.
                if (!refreshPromise) {
                    refreshPromise = axios.post(
                        `${baseURL}/auth/refresh-token`,
                        null,
                        { withCredentials: true }
                    )
                        .then((response) => {
                            const newAccessToken = response.data?.data?.accessToken;

                            if (!newAccessToken) {
                                throw new Error('Access token missing from refresh response');
                            }

                            store.dispatch(
                                authActions.setAccessToken(newAccessToken)
                            );

                            return newAccessToken;
                        })
                        .catch((refreshError) => {
                            store.dispatch(authActions.clearCredentials());
                            throw refreshError;
                        })
                        .finally(() => {
                            refreshPromise = null;
                        });
                }

                const newAccessToken = await refreshPromise;

                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                // Retry the original request once.
                return api(originalRequest);

            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
    );
};
