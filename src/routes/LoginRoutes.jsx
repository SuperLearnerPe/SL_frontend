import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/login')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = [
  {
    path: '/login',
    element: <MinimalLayout />,
    children: [
      {
        path: '',
        element: <AuthLogin />
      }
    ]
  },
];

export default LoginRoutes;
