import React, { useState } from 'react';
import {
  Typography,
  Container,
  Grid,
  Paper,
  Tabs,
  Tab,
  Box,
  Card,
  CardContent,
  IconButton,
  ThemeProvider,
  createTheme,
  CssBaseline,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  School,
  Book,
  PieChart as PieChartIcon,
  TrendingUp,
  Warning,
} from '@mui/icons-material';

// Datos de ejemplo (reemplazar con datos reales)
const dataEstudiantes = [
  { nombre: 'Estudiante 1', asistencias: 20, edad: 22, genero: 'M' },
  { nombre: 'Estudiante 2', asistencias: 18, edad: 24, genero: 'F' },
  { nombre: 'Estudiante 3', asistencias: 22, edad: 21, genero: 'M' },
  { nombre: 'Estudiante 4', asistencias: 19, edad: 23, genero: 'F' },
  { nombre: 'Estudiante 5', asistencias: 21, edad: 25, genero: 'M' },
];

const dataCursos = [
  { nombre: 'Curso A', estudiantes: 30, asistencia: 90 },
  { nombre: 'Curso B', estudiantes: 25, asistencia: 85 },
  { nombre: 'Curso C', estudiantes: 35, asistencia: 95 },
  { nombre: 'Curso D', estudiantes: 28, asistencia: 88 },
  { nombre: 'Curso E', estudiantes: 32, asistencia: 92 },
];

const dataAsistenciaDiaSemana = [
  { dia: 'Lunes', asistencia: 85 },
  { dia: 'Martes', asistencia: 88 },
  { dia: 'Miércoles', asistencia: 90 },
  { dia: 'Jueves', asistencia: 87 },
  { dia: 'Viernes', asistencia: 82 },
];

const dataTendenciaInscripcion = [
  { mes: 'Ene', estudiantes: 100 },
  { mes: 'Feb', estudiantes: 120 },
  { mes: 'Mar', estudiantes: 135 },
  { mes: 'Abr', estudiantes: 150 },
  { mes: 'May', estudiantes: 180 },
];

const COLORS = ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3'];

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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <Card sx={{ bgcolor: color, color: 'white' }}>
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
        <div>
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: 'rgba(255,255,255,0.9)' }}>{title}</Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>{value}</Typography>
        </div>
        <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 2 }}>
          {icon}
        </IconButton>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="xl">
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Total de Estudiantes" value="1,234" icon={<School />} color="#6a9eda" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Total de Cursos" value="56" icon={<Book />} color="#66c2a5" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Asistencia Promedio" value="87%" icon={<PieChartIcon />} color="#fc8d62" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Retención de Estudiantes" value="92%" icon={<TrendingUp />} color="#8da0cb" />
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ borderRadius: 2 }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  centered
                  sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                  <Tab label="Estudiantes" />
                  <Tab label="Cursos" />
                </Tabs>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Asistencias por Estudiante
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dataEstudiantes}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                          <XAxis dataKey="nombre" tick={{ fill: '#34495e' }} />
                          <YAxis tick={{ fill: '#34495e' }} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="asistencias" fill="#6a9eda" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Distribución por Género
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Hombres', value: dataEstudiantes.filter(e => e.genero === 'M').length },
                              { name: 'Mujeres', value: dataEstudiantes.filter(e => e.genero === 'F').length },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label
                          >
                            {dataEstudiantes.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Tendencia de Inscripción
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dataTendenciaInscripcion}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                          <XAxis dataKey="mes" tick={{ fill: '#34495e' }} />
                          <YAxis tick={{ fill: '#34495e' }} />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="estudiantes" stroke="#6a9eda" />
                        </LineChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Alertas de Faltas
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Warning sx={{ color: 'warning.main', mr: 1 }} />
                        <Typography variant="body1" color="warning.main">
                          5 estudiantes tienen 2 o más faltas
                        </Typography>
                      </Box>
                      <List>
                        {dataEstudiantes.filter(e => e.asistencias < 20).map(e => (
                          <ListItem key={e.nombre} sx={{ px: 0 }}>
                            <ListItemText 
                              primary={e.nombre} 
                              secondary={`${e.asistencias} asistencias`}
                              secondaryTypographyProps={{ color: 'warning.main' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Estudiantes por Curso
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dataCursos}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                          <XAxis dataKey="nombre" tick={{ fill: '#34495e' }} />
                          <YAxis tick={{ fill: '#34495e' }} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="estudiantes" fill="#66c2a5" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Asistencia por Día de la Semana
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={dataAsistenciaDiaSemana}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                          <XAxis dataKey="dia" tick={{ fill: '#34495e' }} />
                          <YAxis tick={{ fill: '#34495e' }} />
                          <Tooltip />
                          <Legend />
                          <Area type="monotone" dataKey="asistencia" fill="#fc8d62" stroke="#fc8d62" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Porcentaje de Asistencia por Curso
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={dataCursos}
                            dataKey="asistencia"
                            nameKey="nombre"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label
                          >
                            {dataCursos.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Typography variant="h6" gutterBottom align="center">
                        Promedio de Estudiantes por Curso
                      </Typography>
                      <Typography variant="h2" align="center" sx={{ fontWeight: 'bold', my: 2, color: 'primary.main' }}>
                        28
                      </Typography>
                      <Typography variant="body2" align="center" color="text.secondary">
                        estudiantes por curso en promedio
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </TabPanel>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}