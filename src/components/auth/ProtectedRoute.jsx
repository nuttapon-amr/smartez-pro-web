import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const location = useLocation();

    if (!isLoggedIn) {
        const cabinetId = localStorage.getItem('currentCabinetId') || localStorage.getItem('currentChargerId');
        const loginPath = cabinetId ? `/screen1?cabinetId=${cabinetId}` : '/screen1';
        return <Navigate to={loginPath} state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
