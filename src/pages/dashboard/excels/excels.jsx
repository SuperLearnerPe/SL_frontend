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
import { downloadManagementExcel } from './api';
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
  const [reportType, setReportType] = useState('estudiantes');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = async () => {
    // Validar que al menos se haya seleccionado un tipo de reporte
    if (!reportType) {
      toast.error('Por favor, seleccione un tipo de reporte');
      return;
    }
    
    // Validar que si hay ambas fechas, fecha inicio sea menor que fecha fin
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      toast.error('La fecha de inicio debe ser anterior a la fecha de fin');
      return;
    }
    
    try {
      setLoading(true);
      
      const params = {
        tipo_reporte: reportType
      };
      
      // Solo agregar las fechas si están definidas
      if (startDate) {
        params.fecha_inicio = startDate;
      }
      if (endDate) {
        params.fecha_fin = endDate;
      }
      
      const blob = await downloadManagementExcel(params);
      
      // Generate appropriate filename
      const tipoNombres = {
        'padres': 'Padres',
        'estudiantes': 'Estudiantes',
        'voluntarios': 'Voluntarios',
        'cursos': 'Cursos'
      };
      
      let filename;
      if (startDate && endDate) {
        filename = `Reporte_${tipoNombres[reportType]}_${startDate}_a_${endDate}.xlsx`;
      } else if (startDate) {
        filename = `Reporte_${tipoNombres[reportType]}_desde_${startDate}.xlsx`;
      } else if (endDate) {
        filename = `Reporte_${tipoNombres[reportType]}_hasta_${endDate}.xlsx`;
      } else {
        filename = `Reporte_${tipoNombres[reportType]}_completo.xlsx`;
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
              <MenuItem value="padres">Padres</MenuItem>
              <MenuItem value="estudiantes">Estudiantes</MenuItem>
              <MenuItem value="voluntarios">Voluntarios</MenuItem>
              <MenuItem value="cursos">Cursos</MenuItem>
            </Select>
          </FormControl>

          {/* Campos de fecha de inicio y fin */}
          <TextField
            label="Fecha de Inicio (opcional)"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            margin="normal"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            helperText="Sin fecha = todos los registros. Con fecha = desde esta fecha en adelante"
          />

          <TextField
            label="Fecha de Fin (opcional)"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            margin="normal"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            helperText="Sin fecha = todos los registros. Con fecha = hasta esta fecha"
          />
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

export default function Excels() {
  const [dialogOpen, setDialogOpen] = useState(null);

  const reportTypes = [
    {
      key: 'management',
      title: 'Reporte de Gestión',
      description: 'Descarga datos completos de padres, estudiantes, voluntarios o cursos filtrados por fecha de registro.',
      icon: <BarChartOutlined style={{ fontSize: 24 }} />,
      color: '#6a9eda'
    }
  ];

  const handleDownload = (reportKey) => {
    switch (reportKey) {
      case 'management':
        setDialogOpen('management');
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
    </ThemeProvider>
  );
}