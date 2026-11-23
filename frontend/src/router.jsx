import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';

import { useSelector } from 'react-redux';

import App from './App.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

// Protect pages that require authentication.
function ProtectedRoute() {
    const { user, isInitialized } = useSelector(
        (state) => state.auth
    );

    if (!isInitialized) {
        return <p>Restoring your session...</p>;
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
}

// Prevent authenticated users from visiting login/register.
function PublicRoute({ children }) {
    const { user, isInitialized } = useSelector(
        (state) => state.auth
    );

    if (!isInitialized) {
        return <p>Restoring your session...</p>;
    }

    return user ? <Navigate to="/" replace /> : children;
}

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        index: true,
                        element: <Home />
                    }
                ]
            },
            {
                path: 'login',
                element: (
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                )
            },
            {
                path: 'register',
                element: (
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                )
            }
        ]
    }
]);

export default router;
