import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Paper,
  Stack,
  Divider,
  alpha
} from '@mui/material';
import {
  DashboardOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  BookOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// ==============================|| HOME/DASHBOARD ||============================== //

export default function Home() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: 'Usuario',
    role: '0',
    lastLogin: null
  });

  useEffect(() => {
    // Obtener datos del usuario desde localStorage
    const loginTime = localStorage.getItem('login_time');
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('id');

    setUserData({
      name: 'Usuario',
      role: role || '0',
      lastLogin: loginTime ? new Date(parseInt(loginTime)) : new Date()
    });
  }, []);

  const getRoleLabel = (role) => {
    switch (role) {
      case '1':
        return 'Administrador';
      case '2':
        return 'Profesor';
      default:
        return 'Usuario';
    }
  };

  const quickAccess = [
    {
      title: 'Cursos',
      description: 'Gestión de cursos y clases',
      icon: <BookOutlined style={{ fontSize: 32 }} />,
      path: '/courses',
      color: '#1890ff',
      show: true
    },
    {
      title: 'Estudiantes',
      description: 'Gestión de alumnos',
      icon: <TeamOutlined style={{ fontSize: 32 }} />,
      path: '/students',
      color: '#52c41a',
      show: true
    },
    {
      title: 'Métricas',
      description: 'Visualiza estadísticas',
      icon: <DashboardOutlined style={{ fontSize: 32 }} />,
      path: '/dashboard',
      color: '#fa8c16',
      show: true
    },
    {
      title: 'Voluntarios',
      description: 'Gestión de voluntarios',
      icon: <UserOutlined style={{ fontSize: 32 }} />,
      path: '/volunteers',
      color: '#722ed1',
      show: userData.role === '1'
    },
    {
      title: 'Registrar Estudiante',
      description: 'Alta de nuevos alumnos',
      icon: <FileTextOutlined style={{ fontSize: 32 }} />,
      path: '/register-student',
      color: '#eb2f96',
      show: true
    },
    {
      title: 'Registrar Padre',
      description: 'Alta de padres/tutores',
      icon: <UserOutlined style={{ fontSize: 32 }} />,
      path: '/register-parents',
      color: '#13c2c2',
      show: true
    }
  ].filter(item => item.show);

  const formatLastLogin = (date) => {
    if (!date) return 'No disponible';
    return format(date, "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es });
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 3, mb: 4 }}>
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 2
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: alpha('#ffffff', 0.3),
                  fontSize: 32
                }}
              >
                <UserOutlined />
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                ¡Bienvenido de nuevo!
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <Chip
                  label={getRoleLabel(userData.role)}
                  sx={{
                    bgcolor: alpha('#ffffff', 0.3),
                    color: 'white',
                    fontWeight: 600
                  }}
                />
                <Stack direction="row" spacing={1} alignItems="center">
                  <ClockCircleOutlined />
                  <Typography variant="body2">
                    Última sesión: {formatLastLogin(userData.lastLogin)}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Quick Access Section */}
        <Box mb={4}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Accesos Rápidos
          </Typography>
          <Grid container spacing={3}>
            {quickAccess.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 8,
                      borderColor: item.color
                    },
                    border: '2px solid transparent'
                  }}
                  onClick={() => navigate(item.path)}
                >
                  <CardContent>
                    <Stack spacing={2}>
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: alpha(item.color, 0.1),
                          color: item.color
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Box>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Info Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha('#1890ff', 0.1),
                        color: '#1890ff'
                      }}
                    >
                      <CalendarOutlined style={{ fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Sesión Actual
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha('#52c41a', 0.1),
                        color: '#52c41a'
                      }}
                    >
                      <BookOutlined style={{ fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Sistema Activo
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Todos los servicios operativos
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
