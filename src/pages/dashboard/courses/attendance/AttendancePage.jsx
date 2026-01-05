import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardHeader,
  CardContent,
  Button,
  ThemeProvider,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Avatar,
  Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { Search as SearchIcon } from '@mui/icons-material';
import { theme } from '../../../../themes/theme';
import StudentsTable from './StudentsTable';
import AttendanceHeader from './AttendanceHeader';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AttendancePage() {
  const { courseId, sessionNum } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [courseInfo, setCourseInfo] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitiallyMarked, setIsInitiallyMarked] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados para agregar estudiantes
  const [openAddStudentDialog, setOpenAddStudentDialog] = useState(false);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [addingStudent, setAddingStudent] = useState(false);

  const mapAttendanceToRadioValue = (attendance) => {
    switch (attendance) {
      case 'PRESENT':
        return 'P';
      case 'TARDY':
        return 'T';
      case 'ABSENT':
        return 'A';
      case 'JUSTIFIED':
        return 'J';
      default:
        return '';
    }
  };

  const handleMarkAllPresent = () => {
    if (isInitiallyMarked && !isModifying) {
      toast.info('La asistencia ya ha sido marcada. Habilite el modo de modificación primero.');
      return;
    }

    const newSelectedOption = {};
    students.forEach((student) => {
      newSelectedOption[student.id] = 'P';
    });
    setSelectedOption(newSelectedOption);
    toast.success('Todos los estudiantes han sido marcados como presentes.');
  };

  // Enable modification mode
  const handleEnableModification = () => {
    setIsModifying(true);
    toast.info('Modo de modificación activado. Ahora puede modificar la asistencia.');
  };

  // Función para abrir el diálogo de agregar estudiantes
  const handleOpenAddStudentDialog = () => {
    setOpenAddStudentDialog(true);
    fetchAvailableStudents();
  };

  // Función para cerrar el diálogo
  const handleCloseAddStudentDialog = () => {
    setOpenAddStudentDialog(false);
    setStudentSearchTerm('');
  };

  // Obtener todos los estudiantes disponibles
  const fetchAvailableStudents = async () => {
    setLoadingStudents(true);
    const token = localStorage.getItem('access_token');
    
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/students/`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      // La respuesta es directamente un array
      const allStudents = Array.isArray(response.data) ? response.data : [];
      
      // Filtrar estudiantes que ya están en la sesión
      const currentStudentIds = students.map(s => s.id);
      const available = allStudents.filter(s => !currentStudentIds.includes(s.id) && s.status === 1);
      setAvailableStudents(available);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Error al cargar los estudiantes disponibles');
    } finally {
      setLoadingStudents(false);
    }
  };

  // Función para agregar un estudiante a la sesión
  const handleAddStudentToSession = async (studentId) => {
    setAddingStudent(true);
    const token = localStorage.getItem('access_token');
    
    try {
      // Obtener el session_id real de la sesión
      const sessionResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/course/${courseId}/sessions/`,
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      
      // La respuesta tiene formato {sessions: [...], total: ...}
      const sessions = sessionResponse.data.sessions || sessionResponse.data;
      const session = sessions.find(s => s.num_session === parseInt(sessionNum));
      
      if (!session) {
        toast.error('No se encontró la sesión');
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/course/add_student_to_session/`,
        {
          student_id: studentId,
          session_id: session.id_session
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      toast.success('Estudiante agregado exitosamente');
      handleCloseAddStudentDialog();
      
      // Recargar los datos de estudiantes
      fetchStudentsData();
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error(error.response?.data?.detail || 'Error al agregar el estudiante');
    } finally {
      setAddingStudent(false);
    }
  };

  // Función para cargar los datos de estudiantes y curso
  const fetchStudentsData = useCallback(() => {
    const token = localStorage.getItem('access_token');
    setIsLoading(true);

    const fetchStudents = axios.get(`${import.meta.env.VITE_API_URL}/api/class/getStudents_by_session_class/`, {
      params: {
        class_id: courseId,
        session_class: sessionNum
      },
      headers: {
        Accept: '*/*',
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });

    const fetchCourseInfo = axios.get(`${import.meta.env.VITE_API_URL}/api/course/${courseId}`, {
      headers: {
        Accept: '*/*',
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });

    Promise.all([fetchStudents, fetchCourseInfo])
      .then(([studentsResponse, courseInfoResponse]) => {
        // Verificar si la respuesta tiene la propiedad 'students'
        const studentsData = studentsResponse.data.students || studentsResponse.data;

        if (studentsData && studentsData.length > 0) {
          // Mapear los datos para adaptarlos a la estructura esperada
          const formattedStudents = studentsData.map((student) => ({
            id: student.id,
            name: student.nombre_completo?.split(' ')[0] || '', // Extraer nombre
            last_name: student.nombre_completo?.split(' ').slice(1).join(' ') || '', // Extraer apellido
            birthdate: student.fecha_nacimiento,
            attendance: student.asistencia || ''
            // Añadir otros campos necesarios
          }));

          setStudents(formattedStudents);
          const initialAttendance = formattedStudents.reduce((acc, student) => {
            acc[student.id] = mapAttendanceToRadioValue(student.attendance);
            return acc;
          }, {});
          setSelectedOption(initialAttendance);

          const allMarked = formattedStudents.every((student) => student.attendance !== '');
          setIsInitiallyMarked(allMarked);
        } else {
          setStudents([]);
          // No establecer error, solo inicializar vacío
        }
        setCourseInfo(courseInfoResponse.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        // Si hay error 404, significa que no hay estudiantes pero el curso existe
        if (error.response && error.response.status === 404) {
          // No mostrar error, solo dejar la lista vacía
          setStudents([]);
        } else {
          setError('Error al cargar los datos. Por favor, intenta de nuevo.');
          toast.error('Error al cargar los datos. Por favor, intenta de nuevo.');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [courseId, sessionNum]);

  useEffect(() => {
    fetchStudentsData();
  }, [fetchStudentsData]);

  const handleOptionChange = (studentId, value) => {
    if (!isInitiallyMarked || isModifying) {
      setSelectedOption((prevState) => ({
        ...prevState,
        [studentId]: value
      }));
    }
  };

  const handleSubmit = () => {
    setOpenConfirmDialog(true);
  };

  const handleConfirmSubmit = () => {
    setOpenConfirmDialog(false);
    if (isSubmitting) return;

    setIsSubmitting(true);
    const token = localStorage.getItem('access_token');

    const attendances = Object.entries(selectedOption).map(([id, status]) => ({
      id: parseInt(id),
      attendance: status === 'P' ? 'PRESENT' : status === 'T' ? 'TARDY' : status === 'A' ? 'ABSENT' : status === 'J' ? 'JUSTIFIED' : ''
    }));

    const dataToSend = {
      num_session: parseInt(sessionNum),
      id_class: parseInt(courseId),
      attendances
    };

    axios
      .put(`${import.meta.env.VITE_API_URL}/api/course/update_statuses_students/`, dataToSend, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
      .then(() => {
        toast.success(isModifying ? '¡Asistencia modificada exitosamente!' : '¡Asistencia actualizada exitosamente!');
        setIsInitiallyMarked(true);
        setIsModifying(false);
      })
      .catch((error) => {
        console.error('Error updating attendance:', error.response?.data || error);
        toast.error('Error al actualizar la asistencia. Intenta de nuevo.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleCancelSubmit = () => {
    setOpenConfirmDialog(false);
  };

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAllStudentsMarked = students.length > 0 && students.every((student) => selectedOption[student.id] !== '');

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ marginTop: 0 }}>
        <Box my={4} sx={{ marginTop: 0 }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleGoBack} sx={{ mb: 2 }}>
            VOLVER
          </Button>
          <Card elevation={3}>
            <CardHeader
              title={courseInfo ? courseInfo.name : 'Cargando curso...'}
              subheader={courseInfo ? `${courseInfo.day} - ${courseInfo.start_time} - ${courseInfo.end_time}` : ''}
              action={
                isInitiallyMarked &&
                !isModifying && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<EditIcon />}
                    onClick={handleEnableModification}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Modificar Asistencia
                  </Button>
                )
              }
            />
            <CardContent>
              {error ? (
                <Typography variant="h6" color="error" align="center">
                  {error}
                </Typography>
              ) : (
                <>
                  <AttendanceHeader
                    courseInfo={courseInfo}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    students={filteredStudents}
                    selectedOption={selectedOption}
                    onMarkAllPresent={handleMarkAllPresent}
                    isModifying={isModifying}
                    onAddStudent={handleOpenAddStudentDialog}
                  />
                  {students.length === 0 ? (
                    <Box textAlign="center" py={4}>
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        No hay estudiantes registrados en esta sesión.
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Puedes agregar estudiantes usando el botón "Agregar Alumno" en la parte superior.
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <StudentsTable
                        students={filteredStudents}
                        courseInfo={courseInfo}
                        selectedOption={selectedOption}
                        handleOptionChange={handleOptionChange}
                        isInitiallyMarked={isInitiallyMarked && !isModifying}
                      />
                      <Box mt={2} display="flex" justifyContent="flex-end">
                        {(!isInitiallyMarked || isModifying) && isAllStudentsMarked && (
                          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? 'Enviando...' : isModifying ? 'Guardar Modificaciones' : 'Enviar Asistencia'}
                          </Button>
                        )}
                      </Box>
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Box>
      </Container>
      <Dialog
        open={openConfirmDialog}
        onClose={handleCancelSubmit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {isModifying ? 'Confirmar modificación de asistencia' : 'Confirmar envío de asistencia'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {isModifying
              ? '¿Estás seguro de que deseas modificar la asistencia? Esta acción sobrescribirá los registros anteriores.'
              : '¿Estás seguro de que deseas enviar la asistencia? Esta acción no se puede deshacer.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelSubmit} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmSubmit} color="primary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo para agregar estudiantes */}
      <Dialog
        open={openAddStudentDialog}
        onClose={handleCloseAddStudentDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Agregar Estudiante a la Sesión</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Buscar estudiante por nombre..."
              value={studentSearchTerm}
              onChange={(e) => setStudentSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" />,
              }}
              sx={{ mb: 2 }}
            />
            
            {loadingStudents ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : (
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {availableStudents
                  .filter(student => 
                    `${student.name} ${student.last_name}`.toLowerCase().includes(studentSearchTerm.toLowerCase())
                  )
                  .map((student) => (
                    <ListItem key={student.id} disablePadding>
                      <ListItemButton 
                        onClick={() => handleAddStudentToSession(student.id)}
                        disabled={addingStudent}
                      >
                        <Avatar sx={{ mr: 2 }}>
                          {student.name.charAt(0)}
                        </Avatar>
                        <ListItemText
                          primary={`${student.name} ${student.last_name}`}
                          secondary={
                            <Box component="span" display="flex" alignItems="center" gap={1}>
                              <span>{student.document_id}</span>
                              {student.birthdate && (
                                <Chip 
                                  label={new Date(student.birthdate).toLocaleDateString()} 
                                  size="small" 
                                />
                              )}
                            </Box>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                {availableStudents.filter(student => 
                  `${student.name} ${student.last_name}`.toLowerCase().includes(studentSearchTerm.toLowerCase())
                ).length === 0 && (
                  <Box textAlign="center" py={3}>
                    <Typography variant="body2" color="text.secondary">
                      {studentSearchTerm ? 'No se encontraron estudiantes' : 'No hay estudiantes disponibles'}
                    </Typography>
                  </Box>
                )}
              </List>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddStudentDialog} disabled={addingStudent}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      
      <ToastContainer />
    </ThemeProvider>
  );
}
