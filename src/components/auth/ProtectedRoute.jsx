import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const location = useLocation();

    if (!isLoggedIn) {
        // Redirect them to the /screen1 page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/screen1" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
