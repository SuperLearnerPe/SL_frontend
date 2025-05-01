import { createBrowserRouter, Navigate } from 'react-router-dom';

// project import
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  ...LoginRoutes,
  ...MainRoutes,
]);

export default router;
