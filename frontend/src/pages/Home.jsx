import { useDispatch, useSelector } from 'react-redux';

import { logoutUser } from '../features/auth/authThunks.js';
import SnippetList from '../features/snippets/SnippetList.jsx';

function Home() {
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <div>
            <header>
                <h1>Welcome to SnipVault AI</h1>

                <p>Your personal code snippet manager.</p>

                {user && <p>Hello, {user.firstName}!</p>}

                <button onClick={handleLogout}>
                    Logout
                </button>
            </header>

            <hr />

            <main>
                <SnippetList />
            </main>
        </div>
    );
}

export default Home;
