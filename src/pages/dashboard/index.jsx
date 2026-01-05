import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Grid,
  Grow,
  TextField,
  InputAdornment,
  CircularProgress,
  Typography,
  Button,
  Snackbar,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import CourseCard from './courses/courseCard/CourseCard';
import CourseForm from './courses/CourseForm';
import { getCourses, createCourse } from './courses/api';
import { formatTime } from '../../utils/formatTime';

export default function DashboardDefault() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [viewMode, setViewMode] = useState('card');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getCourses();
      setCourses(data);
      setFilteredCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Error al cargar los cursos. Por favor, intente de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchTerm(value);

    const filtered = courses.filter((course) => course.name.toLowerCase().includes(value.toLowerCase()));
    setFilteredCourses(filtered);
  };

  const handleAddCourse = () => {
    setCurrentCourse(null);
    setOpenDialog(true);
  };

  const handleSaveCourse = async (courseData) => {
    try {
      if (currentCourse && currentCourse.id) {
        // Actualizar curso existente (para futuro)
        // await updateCourse(currentCourse.id, courseData);
        setSnackbar({ open: true, message: 'Curso actualizado exitosamente', severity: 'success' });
      } else {
        // Crear nuevo curso
        await createCourse(courseData);
        setSnackbar({ open: true, message: 'Curso creado exitosamente', severity: 'success' });
      }
      fetchCourses(); // Recargar la lista
    } catch (error) {
      console.error('Error saving course:', error);
      setSnackbar({ open: true, message: 'Error al guardar el curso', severity: 'error' });
    }
  };

  return (
    <Container maxWidth="lg">
      <Box my={4} marginTop={0}>
        {/* Barra de búsqueda, botón agregar y selector de vista */}
        <Box display="flex" gap={2} alignItems="center" mb={3}>
          <TextField
            label="Buscar cursos"
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              )
            }}
          />
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newMode) => newMode && setViewMode(newMode)}
            size="small"
            sx={{ whiteSpace: 'nowrap' }}
          >
            <ToggleButton value="card">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="table">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddCourse}
            sx={{ whiteSpace: 'nowrap', minWidth: 'auto' }}
          >
            Agregar Curso
          </Button>
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <Typography color="error">{error}</Typography>
          </Box>
        ) : viewMode === 'card' ? (
          <Grid container spacing={3}>
            {filteredCourses.map((course, index) => (
              <Grow in={true} style={{ transformOrigin: '0 0 0' }} {...{ timeout: 1000 + index * 200 }} key={course.id || index}>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <CourseCard
                    courseId={course.id}
                    courseName={course.name}
                    day={course.day}
                    time={course.start_time && course.end_time ? formatTime(course.start_time, course.end_time) : 'N/A'}
                    initialColor={course.color || '#1976d2'}
                  />
                </Grid>
              </Grow>
            ))}
          </Grid>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Nombre</strong></TableCell>
                  <TableCell><strong>Categoría</strong></TableCell>
                  <TableCell><strong>Día</strong></TableCell>
                  <TableCell><strong>Horario</strong></TableCell>
                  <TableCell><strong>Estado</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id} hover sx={{ cursor: 'pointer' }}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: course.color || '#1976d2'
                          }}
                        />
                        {course.name}
                      </Box>
                    </TableCell>
                    <TableCell>{course.category || 'N/A'}</TableCell>
                    <TableCell>{course.day || 'N/A'}</TableCell>
                    <TableCell>
                      {course.start_time && course.end_time 
                        ? formatTime(course.start_time, course.end_time) 
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={course.status === 1 ? 'Activo' : 'Inactivo'} 
                        color={course.status === 1 ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Modal para crear/editar curso */}
      <CourseForm
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveCourse}
        initialCourse={currentCourse}
      />

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
