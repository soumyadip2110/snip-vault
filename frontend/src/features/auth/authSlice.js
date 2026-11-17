
import { createSlice } from '@reduxjs/toolkit';

import {
    registerUser,
    loginUser,
    logoutUser
} from './authThunks.js';

const initialState = {
    user: null,
    accessToken: null,
    status: 'idle',
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,

    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
        },

        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },

        clearCredentials: (state) => {
            state.user = null;
            state.accessToken = null;
        }
    },

    extraReducers: (builder) => {
        builder
            // Registration
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Login
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.data.user;
                state.accessToken = action.payload.data.accessToken;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Logout
            .addCase(logoutUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.accessToken = null;
                state.status = 'succeeded';
            })
            .addCase(logoutUser.rejected, (state, action) => {
                // Clear local credentials even if the API request fails.
                state.user = null;
                state.accessToken = null;
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { setCredentials, setAccessToken, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
