import { createBrowserRouter, Navigate } from 'react-router-dom';

// project import
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';

// Helper to check if user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  const loginTime = localStorage.getItem('login_time');
  
  if (!token || !loginTime) return false;
  
  const currentTime = new Date().getTime();
  const elapsed = currentTime - loginTime;
  const fifteenMinutes = 15 * 60 * 1000;
  
  return elapsed <= fifteenMinutes;
};

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={isAuthenticated() ? "/home" : "/login"} replace />
  },
  ...LoginRoutes,
  ...MainRoutes,
]);

export default router;
