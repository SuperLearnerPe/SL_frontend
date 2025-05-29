import {
  PartitionOutlined,
  CalendarOutlined,
  BookOutlined,
  UsergroupAddOutlined,
  SnippetsOutlined,
  BarChartOutlined,
  LogoutOutlined,
  UserAddOutlined,
  TeamOutlined,
  SkinOutlined,
  FileExcelOutlined
} from "@ant-design/icons"
import { useUser } from '../context/UserContext';

// Definir los íconos
const icons = {
  CalendarOutlined,
  BookOutlined,
  UsergroupAddOutlined,
  SnippetsOutlined,
  BarChartOutlined,
  LogoutOutlined,
  PartitionOutlined,
  UserAddOutlined,
  TeamOutlined,
  SkinOutlined,
  FileExcelOutlined
};

// Manejar el cierre de sesión
const handleLogout = () => {
  localStorage.removeItem('id');
  localStorage.removeItem('access_token');
  localStorage.removeItem('login_time');
  localStorage.removeItem('role');
  window.location.href = '/login';
};

const Dashboard = () => {
  const { role } = useUser();

  const children = [
    {
      id: 'courses',
      title: 'Cursos',
      type: 'item',
      url: '/courses',
      icon: icons.BookOutlined,
      breadcrumbs: false,
    },
    ...(role !== '2'
      ? [{
          id: 'volunteers',
          title: 'Voluntarios',
          type: 'item',
          url: '/volunteers',
          icon: icons.PartitionOutlined,
          breadcrumbs: false,
        },
        {
          id: "registerStudent",
          title: "Registrar Estudiante",
          type: "item",
          url: "/register-student",
          icon: icons.UserAddOutlined,
          breadcrumbs: false,
        },
        {
          id: "registerParent",
          title: "Registrar Padres",
          type: "item",
          url: "/register-parents",
          icon: icons.SkinOutlined,
          breadcrumbs: false,
        },
        {
          id: 'students',
          title: 'Gestionar Estudiantes',
          type: 'item',
          url: '/students',
          icon: icons.UsergroupAddOutlined,
          breadcrumbs: false,
        },
        {
          id: 'excels',
          title: 'Reportes Excel',
          type: 'item',
          url: '/excels',
          icon: icons.FileExcelOutlined,
          breadcrumbs: false
        },
      ]
      : []), 
    {
      id: 'exit',
      title: 'Salir',
      type: 'item',
      icon: icons.LogoutOutlined,
      onClick: handleLogout,
      breadcrumbs: false,
    },
  ];

  return {
    id: 'group-dashboard',
    title: 'Navegación',
    type: 'group',
    children,
  };
};

export default Dashboard;