import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Card, CardHeader, CardContent, Button, ThemeProvider, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
  const [error, setError] = useState(null);

  const mapAttendanceToRadioValue = (attendance) => {
    switch (attendance) {
      case 'ONTIME':
        return 'A';
      case 'LATE':
        return 'T';
      case 'FAIL':
        return 'F';
      default:
        return '';
    }
  };

  const handleMarkAllPresent = () => {
    if (isInitiallyMarked) {
      toast.info('La asistencia ya ha sido marcada y no se puede modificar.');
      return;
    }

    const newSelectedOption = {};
    students.forEach(student => {
      newSelectedOption[student.id] = 'A';
    });
    setSelectedOption(newSelectedOption);
    toast.success('Todos los estudiantes han sido marcados como presentes.');
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
        if (studentsResponse.data && studentsResponse.data.length > 0) {
          setStudents(studentsResponse.data);
          const initialAttendance = studentsResponse.data.reduce((acc, student) => {
            acc[student.id] = mapAttendanceToRadioValue(student.attendance);
            return acc;
          }, {});
          setSelectedOption(initialAttendance);
          
          const allMarked = studentsResponse.data.every(student => student.attendance !== '');
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
    if (!isInitiallyMarked) {
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
      attendance: status === 'A' ? 'ONTIME' : status === 'T' ? 'LATE' : 'FAIL',
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
      toast.success('¡Asistencia actualizada exitosamente!');
      setIsInitiallyMarked(true);
    })
    .catch(error => {
      console.error('Error updating attendance:', error.response.data);
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
  const isButtonDisabled = isInitiallyMarked || !isAllStudentsMarked || isSubmitting;

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
                  />
                  <StudentsTable
                    students={filteredStudents}
                    courseInfo={courseInfo}
                    selectedOption={selectedOption}
                    handleOptionChange={handleOptionChange}
                    isInitiallyMarked={isInitiallyMarked}
                  />
                  <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      disabled={isButtonDisabled}
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar Asistencia'}
                    </Button>
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
        <DialogTitle id="alert-dialog-title">{"Confirm Attendance Submission"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          ¿Estás seguro de que deseas enviar la asistencia? Esta acción no se puede deshacer.
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