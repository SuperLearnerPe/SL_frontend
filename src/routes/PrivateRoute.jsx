import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const isTokenExpired = () => {
  const loginTime = localStorage.getItem('login_time');
  if (loginTime) {
      const currentTime = new Date().getTime();
      const elapsed = currentTime - loginTime;
      const fifteenMinutes = 15 * 60 * 1000;
      return elapsed > fifteenMinutes; 
  }
  return true; 
};

const PrivateRoute = ({ children }) => {
  const { setRole } = useUser();
  const token = localStorage.getItem('access_token');
  const location = useLocation();

  useEffect(() => {
    const role = localStorage.getItem('role');
    setRole(role);
  }, [setRole]);

  if (!token || isTokenExpired()) {
    localStorage.removeItem('access_token'); 
    localStorage.removeItem('login_time');
    localStorage.removeItem('id');
    localStorage.removeItem('role');
    return <Navigate to="/login" replace />;
  }

  // Check if the route is '/volunteers' and the user's ID is not 1
  if (location.pathname === '/volunteers' && localStorage.getItem('role') !== '1') {
    return <Navigate to="/courses" replace />;
  }

  return children;
};

export default PrivateRoute;