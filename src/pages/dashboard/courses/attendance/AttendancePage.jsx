import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Card, CardHeader, CardContent, Button, ThemeProvider, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
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
    students.forEach(student => {
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

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoading(true);

    const fetchStudents = axios.get(
      `https://backend-superlearner-1083661745884.us-central1.run.app/api/student/getStudents_by_session_class/`,
      {
        params: {
          class_id: courseId,
          session_class: sessionNum,
        },
        headers: {
          Accept: '*/*',
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );

    const fetchCourseInfo = axios.get(
      `https://backend-superlearner-1083661745884.us-central1.run.app/api/class/get_Courses_id/?course_id=${courseId}`,
      {
        headers: {
          'Accept': '*/*',
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );

    Promise.all([fetchStudents, fetchCourseInfo])
      .then(([studentsResponse, courseInfoResponse]) => {
        // Verificar si la respuesta tiene la propiedad 'students'
        const studentsData = studentsResponse.data.students || studentsResponse.data;
        
        if (studentsData && studentsData.length > 0) {
          // Mapear los datos para adaptarlos a la estructura esperada
          const formattedStudents = studentsData.map(student => ({
            id: student.id,
            name: student.nombre_completo?.split(' ')[0] || '',        // Extraer nombre
            last_name: student.nombre_completo?.split(' ').slice(1).join(' ') || '',  // Extraer apellido
            birthdate: student.fecha_nacimiento,
            attendance: student.asistencia || '',
            // Añadir otros campos necesarios
          }));
          
          setStudents(formattedStudents);
          const initialAttendance = formattedStudents.reduce((acc, student) => {
            acc[student.id] = mapAttendanceToRadioValue(student.attendance);
            return acc;
          }, {});
          setSelectedOption(initialAttendance);
          
          const allMarked = formattedStudents.every(student => student.attendance !== '');
          setIsInitiallyMarked(allMarked);
        } else {
          setStudents([]);
          setError("No hay estudiantes registrados en esta sesión.");
        }
        setCourseInfo(courseInfoResponse.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        if (error.response && error.response.status === 404) {
          setError("No se encontraron estudiantes para esta sesión.");
        } else {
          setError("Error al cargar los datos. Por favor, intenta de nuevo.");
        }
        toast.error('Error al cargar los datos. Por favor, intenta de nuevo.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [courseId, sessionNum]);

  const handleOptionChange = (studentId, value) => {
    if (!isInitiallyMarked || isModifying) {
      setSelectedOption(prevState => ({
        ...prevState,
        [studentId]: value,
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
      attendance: 
        status === 'P' ? 'PRESENT' : 
        status === 'T' ? 'TARDY' : 
        status === 'A' ? 'ABSENT' : 
        status === 'J' ? 'JUSTIFIED' : '',
    }));
  
    const dataToSend = {
      num_session: parseInt(sessionNum), 
      id_class: parseInt(courseId),     
      attendances,
    };
  
    axios.put(
      'https://backend-superlearner-1083661745884.us-central1.run.app/api/student/update_statuses_students/',
      dataToSend, 
      {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    )
    .then(response => {
      toast.success(isModifying 
        ? '¡Asistencia modificada exitosamente!' 
        : '¡Asistencia actualizada exitosamente!');
      setIsInitiallyMarked(true);
      setIsModifying(false);
    })
    .catch(error => {
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

  const filteredStudents = students.filter(student =>
    (`${student.name} ${student.last_name}`).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAllStudentsMarked = students.length > 0 && students.every(student => selectedOption[student.id] !== '');
  const isButtonDisabled = (isInitiallyMarked && !isModifying) || !isAllStudentsMarked || isSubmitting;

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
      <Container maxWidth="lg" sx={{marginTop:0}}>
        <Box my={4} sx={{marginTop:0}}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            sx={{ mb: 2 }}
          >
            VOLVER
          </Button>
          <Card elevation={3}>
            <CardHeader
              title={courseInfo ? courseInfo.name : 'Cargando curso...'}
              subheader={courseInfo ? `${courseInfo.day} - ${courseInfo.start_time} - ${courseInfo.end_time}` : ''}
              action={
                isInitiallyMarked && !isModifying && (
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
                  />
                  <StudentsTable
                    students={filteredStudents}
                    courseInfo={courseInfo}
                    selectedOption={selectedOption}
                    handleOptionChange={handleOptionChange}
                    isInitiallyMarked={isInitiallyMarked && !isModifying}
                  />
                  <Box mt={2} display="flex" justifyContent="flex-end">
                    {((!isInitiallyMarked || isModifying) && isAllStudentsMarked) && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Enviando...' : isModifying ? 'Guardar Modificaciones' : 'Enviar Asistencia'}
                      </Button>
                    )}
                  </Box>
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
          {isModifying ? "Confirmar modificación de asistencia" : "Confirmar envío de asistencia"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {isModifying 
              ? "¿Estás seguro de que deseas modificar la asistencia? Esta acción sobrescribirá los registros anteriores."
              : "¿Estás seguro de que deseas enviar la asistencia? Esta acción no se puede deshacer."
            }
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
      <ToastContainer />
    </ThemeProvider>
  );
}