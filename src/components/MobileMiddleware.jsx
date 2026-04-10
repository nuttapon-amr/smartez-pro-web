import React from 'react';
import { Navigate } from 'react-router-dom';

const MobileMiddleware = ({ children }) => {
    // Simple check for mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // If not mobile, redirect to 404
    if (!isMobile) {
        return <Navigate to="/404" replace />;
    }

    return children;
};

export default MobileMiddleware;
