import React from 'react';
import {
  Typography,
  Container,
  Grid,
  Paper,
  Box,
  Button,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  FileExcelOutlined,
  DownloadOutlined,
  BarChartOutlined,
  TeamOutlined,
  BookOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6a9eda',
    },
    secondary: {
      main: '#f4a582',
    },
    background: {
      default: '#f0f4f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#34495e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

// Componente para las tarjetas de reporte
function ReportCard({ title, description, icon, color }) {
  const handleDownload = () => {
    // Aquí iría la lógica para descargar el reporte
    toast.info(`Descargando reporte: ${title}...`);
    // Simulación de descarga
    setTimeout(() => {
      toast.success(`Reporte ${title} descargado con éxito!`);
    }, 2000);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderTop: `4px solid ${color}` }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Box mr={2} sx={{ color }}>
            {icon}
          </Box>
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button 
          variant="contained" 
          startIcon={<DownloadOutlined />} 
          onClick={handleDownload}
          fullWidth
          sx={{ 
            backgroundColor: color,
            '&:hover': {
              backgroundColor: color,
              opacity: 0.9
            }
          }}
        >
          Descargar
        </Button>
      </CardActions>
    </Card>
  );
}

export default function Excels() {
  const reportTypes = [
    {
      title: 'Reporte de Asistencia',
      description: 'Descarga un reporte detallado de asistencia por curso y sesión',
      icon: <CalendarOutlined style={{ fontSize: 24 }} />,
      color: '#66c2a5'
    },
    {
      title: 'Reporte de Estudiantes',
      description: 'Listado completo de estudiantes con información de contacto',
      icon: <TeamOutlined style={{ fontSize: 24 }} />,
      color: '#fc8d62'
    },
    {
      title: 'Reporte de Cursos',
      description: 'Información de todos los cursos y sus horarios',
      icon: <BookOutlined style={{ fontSize: 24 }} />,
      color: '#8da0cb'
    },
    {
      title: 'Reporte de Métricas',
      description: 'Estadísticas de participación y rendimiento',
      icon: <BarChartOutlined style={{ fontSize: 24 }} />,
      color: '#e78ac3'
    },
    {
      title: 'Reporte de Voluntarios',
      description: 'Información completa de todos los voluntarios',
      icon: <TeamOutlined style={{ fontSize: 24 }} />,
      color: '#a6d854'
    },
    {
      title: 'Reporte Consolidado',
      description: 'Todos los datos en un solo archivo de Excel',
      icon: <FileExcelOutlined style={{ fontSize: 24 }} />,
      color: '#1976d2'
    }
  ];

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="xl">
          <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <FileExcelOutlined style={{ fontSize: 28, marginRight: 12, color: '#107C41' }} />
              <Typography variant="h5" component="h1">
                Reportes Excel
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              Descarga reportes en formato Excel para analizar datos fuera de la plataforma. 
              Selecciona el tipo de reporte que necesitas.
            </Typography>
          </Paper>
          
          <Grid container spacing={3}>
            {reportTypes.map((report, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <ReportCard 
                  title={report.title}
                  description={report.description}
                  icon={report.icon}
                  color={report.color}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <ToastContainer position="bottom-right" />
    </ThemeProvider>
  );
}