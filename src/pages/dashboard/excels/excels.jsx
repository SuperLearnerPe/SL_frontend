import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress
} from '@mui/material';
import {
  FileExcelOutlined,
  DownloadOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { downloadManagementExcel, downloadImpactExcel } from './api';
import axios from 'axios';

// Helper function to format dates for API
const formatDateForAPI = (dateString) => {
  if (!dateString) return '';
  return dateString; // HTML date inputs already use YYYY-MM-DD format
};

// Helper function to format current date for filenames
const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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

// Helper function to download blob as file
const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// Component for the report cards
function ReportCard({ report, onDownload }) {
  const { title, description, icon, color, key } = report;

  const handleDownloadClick = () => {
    onDownload(key);
  };

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      borderTop: `4px solid ${color}`,
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.12)'
      }
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Box mr={2} sx={{ color, fontSize: 32 }}>
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
          onClick={handleDownloadClick}
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

// Management Report Dialog
function ManagementReportDialog({ open, onClose, onDownload }) {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('completo');
  const [specificDate, setSpecificDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [classId, setClassId] = useState('');

  // Array estático de cursos
  const courses = [
    { id: 1, name: "Inglés 5 - 7", dia: "Tuesday", horario: "2:30 pm - 4:30 pm" },
    { id: 2, name: "Biblioteca", dia: "Monday", horario: "2:30 pm - 4:30 pm" },
    { id: 3, name: "Arte", dia: "Wednesday", horario: "2:30 pm - 4:30 pm" },
    { id: 4, name: "Lectura y escritura", dia: "Thursday", horario: "2:30 pm - 4:30 pm" },
    { id: 5, name: "Juegos y deportes en la loza", dia: "Friday", horario: "2:30 pm - 4:30 pm" },
    { id: 6, name: "Inglés 8 - 12", dia: "Saturday", horario: "3:00 pm - 5:00 pm" },
    { id: 7, name: "Música", dia: "Sunday", horario: "2:00 pm - 4:00 pm" },
    { id: 8, name: "Matemáticas", dia: "Saturday", horario: "10:00 am - 12:00 pm" },
  ];

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const params = {
        tipo: reportType,
        clase_id: classId || undefined
      };
      
      // Add parameters based on report type
      if (reportType === 'diario' && specificDate) {
        params.fecha = formatDateForAPI(specificDate);
      } else if (reportType === 'semanal' && startDate) {
        params.fecha_inicio = formatDateForAPI(startDate);
      } else if (reportType === 'mensual') {
        params.mes = month;
        params.anio = year;
      }
      
      const blob = await downloadManagementExcel(params);
      
      // Generate appropriate filename
      let filename = 'Reporte_Gestion_';
      if (reportType === 'diario') {
        filename += `Diario_${params.fecha || 'SinFecha'}.xlsx`;
      } else if (reportType === 'semanal') {
        filename += `Semanal_${params.fecha_inicio || 'SinFecha'}.xlsx`;
      } else if (reportType === 'mensual') {
        filename += `Mensual_${params.mes}_${params.anio}.xlsx`;
      } else {
        filename += `Completo_${getCurrentDate()}.xlsx`;
      }
      
      downloadBlob(blob, filename);
      onClose();
      toast.success('¡Reporte descargado con éxito!');
      
    } catch (error) {
      toast.error('Error al descargar el reporte: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <BarChartOutlined style={{ marginRight: 10, color: '#6a9eda' }} />
          Configurar Reporte de Gestión
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box py={1}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="report-type-label">Tipo de Reporte</InputLabel>
            <Select
              labelId="report-type-label"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              label="Tipo de Reporte"
            >
              <MenuItem value="completo">Reporte Completo</MenuItem>
              <MenuItem value="diario">Reporte Diario</MenuItem>
              <MenuItem value="semanal">Reporte Semanal</MenuItem>
              <MenuItem value="mensual">Reporte Mensual</MenuItem>
            </Select>
          </FormControl>

          {/* Campos de fecha según el tipo de reporte */}
          {reportType === 'diario' && (
            <TextField
              label="Fecha Específica"
              type="date"
              value={specificDate}
              onChange={(e) => setSpecificDate(e.target.value)}
              margin="normal"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}

          {reportType === 'semanal' && (
            <TextField
              label="Fecha de Inicio"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              margin="normal"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}

          {reportType === 'mensual' && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="month-label">Mes</InputLabel>
                <Select
                  labelId="month-label"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  label="Mes"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                    <MenuItem key={m} value={m}>
                      {new Date(2023, m-1).toLocaleString('es', { month: 'long' })}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Año"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                margin="normal"
                fullWidth
              />
            </Box>
          )}

          {/* Dropdown para seleccionar clase (curso) */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="class-select-label">Clase (Opcional)</InputLabel>
            <Select
              labelId="class-select-label"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              label="Clase (Opcional)"
            >
              <MenuItem value="">Todas las clases</MenuItem>
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name} ({course.dia}) - {course.horario}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary" 
          startIcon={loading ? <CircularProgress size={20} /> : <DownloadOutlined />}
          disabled={loading}
        >
          {loading ? 'Descargando...' : 'Descargar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Impact Report Dialog
function ImpactReportDialog({ open, onClose, onDownload }) {
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('mes');
  const [threshold, setThreshold] = useState(0.5);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const params = {
        periodo: period,
        umbral: threshold
      };
      
      const blob = await downloadImpactExcel(params);
      
      // Generate filename
      const filename = `Reporte_Impacto_${period}_${getCurrentDate()}.xlsx`;
      
      downloadBlob(blob, filename);
      onClose();
      toast.success('¡Reporte descargado con éxito!');
      
    } catch (error) {
      toast.error('Error al descargar el reporte: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <BarChartOutlined style={{ marginRight: 10, color: '#f4a582' }} />
          Configurar Reporte de Impacto
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box py={1}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="period-label">Periodo</InputLabel>
            <Select
              labelId="period-label"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              label="Periodo"
            >
              <MenuItem value="mes">Mensual</MenuItem>
              <MenuItem value="trimestre">Trimestral</MenuItem>
              <MenuItem value="semestre">Semestral</MenuItem>
              <MenuItem value="anual">Anual</MenuItem>
            </Select>
          </FormControl>

          <Box mt={2}>
            <Typography gutterBottom>Umbral: {threshold}</Typography>
            <TextField
              type="range"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              inputProps={{
                min: 0,
                max: 1,
                step: 0.1
              }}
              fullWidth
            />
            <Typography variant="body2" color="text.secondary">
              El umbral determina el punto de corte para considerar un impacto significativo (0-1)
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="secondary" 
          startIcon={loading ? <CircularProgress size={20} /> : <DownloadOutlined />}
          disabled={loading}
        >
          {loading ? 'Descargando...' : 'Descargar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Excels() {
  const [dialogOpen, setDialogOpen] = useState(null);

  const reportTypes = [
    {
      key: 'management',
      title: 'Reporte de Gestión',
      description: 'Métricas de gestión con indicadores clave de rendimiento. Permite filtrar por periodo, fecha y clase.',
      icon: <BarChartOutlined style={{ fontSize: 24 }} />,
      color: '#6a9eda'
    },
    {
      key: 'impact',
      title: 'Reporte de Impacto',
      description: 'Análisis del impacto en estudiantes y comunidad. Configurable por periodo y umbral de significancia.',
      icon: <BarChartOutlined style={{ fontSize: 24 }} />,
      color: '#f4a582'
    }
  ];

  const handleDownload = (reportKey) => {
    switch (reportKey) {
      case 'management':
        setDialogOpen('management');
        break;
      case 'impact':
        setDialogOpen('impact');
        break;
      default:
        toast.error('Reporte no disponible');
    }
  };

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
                  report={report}
                  onDownload={handleDownload}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <ToastContainer position="bottom-right" />
      <ManagementReportDialog open={dialogOpen === 'management'} onClose={() => setDialogOpen(null)} />
      <ImpactReportDialog open={dialogOpen === 'impact'} onClose={() => setDialogOpen(null)} />
    </ThemeProvider>
  );
}