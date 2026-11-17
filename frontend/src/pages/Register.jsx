
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../features/auth/authThunks.js';

function Register() {
    const dispatch = useDispatch();
    const { status, error } = useSelector((state) => state.auth);

    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');

        const result = await dispatch(
            registerUser({ firstName, email, password })
        );

        if (registerUser.fulfilled.match(result)) {
            setSuccessMessage('Registration successful! You can now log in.');
            setFirstName('');
            setEmail('');
            setPassword('');
        }
    };

    return (
        <div>
            <h2>Create your SnipVault AI account</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />

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
                    {status === 'loading' ? 'Registering...' : 'Register'}
                </button>
            </form>

            {error && <p>{error}</p>}
            {successMessage && <p>{successMessage}</p>}
        </div>
    );
}

export default Register;
