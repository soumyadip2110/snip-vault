import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../features/auth/authThunks.js';

function Home() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <div>
            <h1>Welcome to SnipVault AI</h1>

            <p>Your personal code snippet manager.</p>

            {user && <p>Hello, {user.firstName}!</p>}

            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}

export default Home;