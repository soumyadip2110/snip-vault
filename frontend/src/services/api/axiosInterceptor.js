
import api from './axios.js';
import { refreshAccessToken } from './authApi.js';

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
                // Reuse the shared refresh request from authApi.js.
                const response = await refreshAccessToken();

                const newAccessToken = response?.data?.accessToken;

                if (!newAccessToken) {
                    throw new Error(
                        'Access token missing from refresh response'
                    );
                }

                store.dispatch(
                    authActions.setAccessToken(newAccessToken)
                );

                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                // Retry the original request once.
                return api(originalRequest);

            } catch (refreshError) {
                // Clear credentials only when the refresh token
                // is rejected or expired.
                if (refreshError.response?.status === 401) {
                    store.dispatch(authActions.clearCredentials());
                }

                return Promise.reject(refreshError);
            }
        }
    );
};
