
import { useState } from 'react';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
	const [showLogin, setShowLogin] = useState(true);

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
