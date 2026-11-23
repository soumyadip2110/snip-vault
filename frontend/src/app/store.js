import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice.js';
import snippetReducer from '../features/snippets/snippetSlice.js';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        snippets: snippetReducer
    }
});
