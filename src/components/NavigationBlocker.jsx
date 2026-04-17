import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Middleware component to block browser's back and forward button navigation.
 * It works by ensuring the browser is always at the "end" of a dummy history state,
 * and forces it forward if a back/forward action is detected.
 */
const NavigationBlocker = ({ children }) => {
    const location = useLocation();

    useEffect(() => {
        // Push a dummy state to history so there's always a "future" to go back from
        window.history.pushState(null, null, window.location.href);

        const handlePopState = () => {
            // Prevent the default behavior and force the browser forward
            window.history.go(1);
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [location]); // Re-run whenever the location changes

    return <>{children}</>;
};

export default NavigationBlocker;
