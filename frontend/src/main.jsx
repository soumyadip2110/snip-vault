import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App.jsx';
import { store } from './app/store.js';
import './index.css';
import { configureApiInterceptors } from './services/api/axiosInterceptor.js';

import {
	setAccessToken,
	clearCredentials
} from './features/auth/authSlice.js';

import { initializeAuth } from './features/auth/authThunks.js';

configureApiInterceptors(store, {
	setAccessToken,
	clearCredentials
});

// Restore authentication before the app renders.
store.dispatch(initializeAuth());

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</StrictMode>
);