import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { LoginPage } from './pages/LoginPage';
import Profile from './components/Profile/Profile';
import Game from './components/Game/Game';

export const router = createBrowserRouter([
    {
        path: '/auth/login',
        element: <LoginPage />,
    },
    {
        path: '/auth/callback',
        element: <AuthCallbackPage />,
    },
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                path: '/profile',
                element: <Profile />,
            },
            {
                path: '/friends',
                element: <Profile />,
            },
            {
                path: '/game',
                element: <Game className="gameCanvas" width={800} height={600} />,
            },
        ],
    },
]);
