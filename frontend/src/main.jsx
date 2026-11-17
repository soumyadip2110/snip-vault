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

configureApiInterceptors(store, {
	setAccessToken,
	clearCredentials
});

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</StrictMode>
);