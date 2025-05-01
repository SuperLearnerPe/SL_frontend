import { lazy } from 'react';
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import PrivateRoute from 'routes/PrivateRoute';
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const AttendancePage = Loadable(lazy(() => import('pages/dashboard/courses/attendance/AttendancePage')));
const MisAlumnos = Loadable(lazy(() => import('pages/dashboard/students/students')));
const MetricsPage = Loadable(lazy(() => import('pages/dashboard/metrics/metrics')));
const CrudVolunteers = Loadable(lazy(() => import('pages/dashboard/volunteers/VolunteerCrud')));
const RegisterStudent = Loadable(lazy(() => import('pages/dashboard/register-student/StudentsCRUD')));
const RegisterParent = Loadable(lazy(() => import('pages/dashboard/register-parents/ParentsCRUD')));
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = [
  {
    path: '/',
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      {
        path: '',
        element: <DashboardDefault />
      },
      {
        path: 'dashboard',
        element: <MetricsPage />
      },
      {
        path: 'students',
        element: (
          <PrivateRoute>
            <MisAlumnos />
          </PrivateRoute>
        )
      },
      {
        path: 'register-student',
        element: (
          <PrivateRoute>
            <RegisterStudent />
          </PrivateRoute>
        )
      },
      {
        path: 'register-parents',
        element: (
          <PrivateRoute>
            <RegisterParent />
          </PrivateRoute>
        )
      },
      {
        path: 'volunteers',
        element: (
          <PrivateRoute>
            <CrudVolunteers/>
          </PrivateRoute>
        )
      },
      {
        path: 'courses',
        children: [
          {
            path: '',
            element: <DashboardDefault />
          },
          {
            path: 'attendance/:courseId/:sessionNum',
            element: <AttendancePage />
          }
        ]
      }
    ]
  }
];

export default MainRoutes;