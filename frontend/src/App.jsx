import { useState } from 'react';
import { useSelector } from 'react-redux';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
	const [showLogin, setShowLogin] = useState(true);

	const { user, isInitialized } = useSelector(
		(state) => state.auth
	);

	// Wait until authentication restoration finishes.
	if (!isInitialized) {
		return <p>Restoring your session...</p>;
	}

	// Show Home when the user is authenticated.
	if (user) {
		return <Home />;
	}

	// Otherwise, show Login or Register.
	return (
		<div>
			<h1>Welcome to SnipVault AI</h1>

			<button onClick={() => setShowLogin(true)}>
				Login
			</button>

			<button onClick={() => setShowLogin(false)}>
				Register
			</button>

			{showLogin ? <Login /> : <Register />}
		</div>
	);
}

export default App;