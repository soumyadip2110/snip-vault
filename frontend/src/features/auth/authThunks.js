
import { createAsyncThunk } from '@reduxjs/toolkit';

import {
    registerUser as registerUserApi,
    loginUser as loginUserApi,
    logoutUser as logoutUserApi
} from '../../services/api/authApi.js';

// Extract a useful error message from failed API requests.
const getErrorMessage = (error) => {
    return error.response?.data?.message || error.message || 'Something went wrong';
};

// Register a new user.
export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            return await registerUserApi(userData);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

// Log in an existing user.
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            return await loginUserApi(credentials);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

// Log out the current user.
export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            return await logoutUserApi();
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);
