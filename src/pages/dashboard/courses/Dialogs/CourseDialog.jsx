import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Grid,
  Typography,
  Button,
  Zoom,
  Slide,
  DialogActions,
  DialogTitle,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import StyledAvatar from '../common/StyledAvatar';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import CalendarToday from '@mui/icons-material/CalendarToday';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StyledSessionCard = styled(Box)(({ theme, color }) => ({
  background: alpha(color, 0.1),
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(2),
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: `0 10px 20px ${alpha(color, 0.2)}`
  }
}));

const AnimatedTypography = styled(Typography)(({ theme }) => ({
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)'
  }
}));

const ConfirmDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(2)
  }
}));

export default function CourseDialog({ open, onClose, courseId, courseName, cardColor, courseImage, day, time }) {
  const navigate = useNavigate();
  const [hoveredSession, setHoveredSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [newSessionData, setNewSessionData] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [loadingVolunteers, setLoadingVolunteers] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/api/course/${courseId}/sessions`, {
        headers: {
          Authorization: `Token ${token}`,
          Accept: '*/*',
          'Content-Type': 'application/json'
        }
      });

      const fetchedSessions = response.data.sessions;

      if (!fetchedSessions || fetchedSessions.length === 0) {
        setSessions([]);
      } else {
        setSessions(fetchedSessions);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setSessions([]);
        } else {
          console.error('Error fetching sessions:', error.response.data || error.message);
          toast.error('There was an issue fetching the sessions. Please try again.', { autoClose: 1500 });
        }
      } else {
        console.error('Network error:', error.message);
        toast.error('There was a network error. Please try again.', { autoClose: 1500 });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchSessions();
    }
  }, [open, courseId]);

  const handleAttendanceClick = (sessionNum) => {
    navigate(`attendance/${courseId}/${sessionNum}`);
  };

  const fetchVolunteers = async () => {
    setLoadingVolunteers(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/volunteers/teachers/Get_Volunteers/`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      // Filtrar solo voluntarios activos
      const activeVolunteers = response.data.filter((v) => v.status === 1);
      setVolunteers(activeVolunteers);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      toast.error('Error al cargar voluntarios', { autoClose: 1500 });
    } finally {
      setLoadingVolunteers(false);
    }
  };

  const handleAddSession = () => {
    const nextSessionNumber = sessions.length + 1;
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM

    setNewSessionData({
      num_session: nextSessionNumber,
      date: currentDate,
      time: currentTime,
      volunteer_id: ''
    });

    fetchVolunteers();
    setConfirmDialogOpen(true);
  };

  const handleSessionDataChange = (field, value) => {
    setNewSessionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfirmAddSession = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      // Combinar fecha y hora en formato ISO
      const sessionDateTime = `${newSessionData.date}T${newSessionData.time}:00`;
      
      const requestData = { date: sessionDateTime };
      
      // Agregar volunteer_id solo si se seleccionó uno
      if (newSessionData.volunteer_id) {
        requestData.volunteer_id = parseInt(newSessionData.volunteer_id);
      }
      
      const response = await axios.post(
        `${API_URL}/api/course/${courseId}/session/`,
        requestData,
        {
          headers: {
            Accept: '*/*',
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const { session } = response.data;

      // Validación de sesión
      if (!session || !session.num_session) {
        throw new Error('Error: No se pudo obtener la ID de la nueva sesión');
      }

      setNewSessionData(session);

      toast.success('The session was created successfully!', { autoClose: 1500 });

      // Cerramos el diálogo de confirmación
      setConfirmDialogOpen(false);

      // Navegar con el número de sesión en lugar del id
      setTimeout(() => {
        navigate(`/courses/attendance/${courseId}/${session.num_session}`); // Cambiar a num_session
      }, 500);
    } catch (error) {
      console.error('Error creating session:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || 'There was an issue creating the session. Please try again.';
      toast.error(errorMessage, { autoClose: 3000 });
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden',
            bgcolor: 'background.default'
          }
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            '&::-webkit-scrollbar': { width: 0, height: 0 },
            scrollbarWidth: 'none',
            overflowY: 'auto'
          }}
        >
          {isLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                p: 5
              }}
            >
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${alpha(cardColor, 0.8)} 0%, ${alpha(cardColor, 0.4)} 100%)`,
                  p: { xs: 3, sm: 5 },
                  color: '#fff',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Zoom in={true} style={{ transitionDelay: '300ms' }}>
                  <StyledAvatar
                    alt={courseName}
                    src={courseImage}
                    sx={{
                      width: { xs: 80, sm: 120, md: 150 },
                      height: { xs: 80, sm: 120, md: 150 },
                      position: 'absolute',
                      top: { xs: -40, sm: -60, md: -75 },
                      right: { xs: -40, sm: -60, md: -75 },
                      border: '4px solid #fff',
                      boxShadow: `0 0 0 4px ${alpha('#fff', 0.2)}`,
                      zIndex: 1
                    }}
                    bgcolor={cardColor}
                  >
                    {!courseImage && courseName.charAt(0)}
                  </StyledAvatar>
                </Zoom>
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <AnimatedTypography variant="h3" component="div" fontWeight="bold" gutterBottom>
                    {courseName}
                  </AnimatedTypography>
                  <AnimatedTypography variant="h6" gutterBottom>
                    {day} | {time}
                  </AnimatedTypography>
                </Box>
              </Box>

              <Box sx={{ p: { xs: 3, sm: 5 } }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                  <AnimatedTypography variant="h4" component="div" fontWeight="bold" color={cardColor}>
                    Sesiones
                  </AnimatedTypography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddCircleOutline />}
                    onClick={handleAddSession}
                    sx={{
                      bgcolor: cardColor,
                      '&:hover': {
                        bgcolor: alpha(cardColor, 0.8)
                      }
                    }}
                  >
                    Crear Sesion
                  </Button>
                </Box>

                <Grid container spacing={3}>
                  {sessions.map((session) => (
                    <Grid item xs={12} sm={6} md={3} key={session.num_session}>
                      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                        <StyledSessionCard
                          color={cardColor}
                          onClick={() => handleAttendanceClick(session.num_session)}
                          onMouseEnter={() => setHoveredSession(session.num_session)}
                          onMouseLeave={() => setHoveredSession(null)}
                        >
                          <Typography variant="h5" component="div" fontWeight="bold" color={cardColor} gutterBottom>
                            Session {session.num_session}
                          </Typography>
                          <Box display="flex" alignItems="center">
                            <CalendarToday sx={{ mr: 1, color: alpha(cardColor, 0.7) }} />
                            <Typography variant="body1" color="text.secondary">
                              {session.date}
                            </Typography>
                          </Box>
                          <Zoom in={hoveredSession === session.num_session}>
                            <Typography
                              variant="body2"
                              sx={{
                                mt: 2,
                                color: cardColor,
                                fontWeight: 'bold',
                                opacity: hoveredSession === session.num_session ? 1 : 0
                              }}
                            >
                              Click to view attendance
                            </Typography>
                          </Zoom>
                        </StyledSessionCard>
                      </Slide>
                    </Grid>
                  ))}
                </Grid>

                {sessions.length === 0 && (
                  <Box textAlign="center" mt={4}>
                    <Typography variant="body1" color="text.secondary">
                      No hay sesiones disponibles, intenta crear una
                    </Typography>
                  </Box>
                )}
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} aria-labelledby="confirm-dialog-title">
        <DialogTitle id="confirm-dialog-title">
          <Typography variant="h6" component="div" fontWeight="bold" color={cardColor}>
            Confirmar Nueva Sesión
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" gutterBottom>
              Configura los detalles de la nueva sesión:
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Número de Sesión"
                value={newSessionData?.num_session || ''}
                disabled
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Fecha de Sesión"
                type="date"
                value={newSessionData?.date || ''}
                onChange={(e) => handleSessionDataChange('date', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Hora de Sesión"
                type="time"
                value={newSessionData?.time || ''}
                onChange={(e) => handleSessionDataChange('time', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <FormControl fullWidth variant="outlined">
                <InputLabel id="volunteer-select-label">Voluntario Asignado</InputLabel>
                <Select
                  labelId="volunteer-select-label"
                  value={newSessionData?.volunteer_id || ''}
                  onChange={(e) => handleSessionDataChange('volunteer_id', e.target.value)}
                  label="Voluntario Asignado"
                  disabled={loadingVolunteers}
                >
                  <MenuItem value="">
                    <em>Sin asignar</em>
                  </MenuItem>
                  {volunteers.map((volunteer) => (
                    <MenuItem key={volunteer.id} value={volunteer.id}>
                      {volunteer.name} {volunteer.last_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Typography variant="body1" sx={{ mt: 3 }}>
              ¿Estás seguro de crear esta nueva sesión?
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialogOpen(false)}
            sx={{
              color: cardColor,
              '&:hover': {
                bgcolor: alpha(cardColor, 0.1),
                color: cardColor
              }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmAddSession}
            variant="contained"
            sx={{
              bgcolor: cardColor,
              '&:hover': {
                bgcolor: alpha(cardColor, 0.8)
              }
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </ConfirmDialog>
    </>
  );
}
