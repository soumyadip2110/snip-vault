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
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
                <div>
                    <h1 className="text-xl font-semibold">
                        SnipVault AI
                    </h1>

                    <p className="text-sm text-slate-500">
                        Your personal code snippet manager.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {user && (
                        <p className="text-sm">
                            Hello, {user.firstName}!
                        </p>
                    )}

                    <button
                        onClick={handleLogout}
                        className="rounded-md bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-8">
                <SnippetList />
            </main>
        </div>
    );
}

export default Home;
