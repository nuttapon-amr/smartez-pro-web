import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import { getPostAuthSwapTarget } from '../utils/swapAccess';

export const useAuth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const publicScreens = ['/screen1', '/'];

        if (isLoggedIn && publicScreens.includes(location.pathname)) {
            const cabinetId = localStorage.getItem('currentCabinetId') || localStorage.getItem('currentChargerId');
            const target = getPostAuthSwapTarget(cabinetId);
            navigate(target.path, { replace: true, state: target.state });
        }
    }, [navigate, location.pathname]);

    const handleUsernameChange = useCallback((value) => {
        setUsername(value);
    }, []);

    const login = useCallback(async () => {
        setIsLoading(true);
        try {
            await authService.login(username);
        } finally {
            setIsLoading(false);
        }
    }, [username]);

    const logout = async () => {
        await authService.logout();
        navigate('/logout-success', { replace: true });
    };

    return {
        username,
        setUsername: handleUsernameChange,
        isLoading,
        login,
        logout
    };
};

export default useAuth;
