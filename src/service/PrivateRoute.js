import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = sessionStorage.getItem('access_token'); 
    if (!token) {
        return <Navigate to="/sign-in" />;
    }
    return children;
};

export default PrivateRoute;
