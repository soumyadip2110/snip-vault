
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authThunks.js';

function Login() {
    const dispatch = useDispatch();
    const { status, error } = useSelector((state) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await dispatch(loginUser({ email, password }));

        if (loginUser.fulfilled.match(result)) {
            console.log('Logged-in user:', result.payload.data.user);
            console.log('Access token received:', !!result.payload.data.accessToken);
        }
    };

    return (
        <div>
            <h2>Login to SnipVault AI</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Logging in...' : 'Login'}
                </button>
            </form>

            {error && <p>{error}</p>}
        </div>
    );
}

export default Login;
