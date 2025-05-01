import React from 'react';
import { Card, CardContent, Typography, Button, Box, Avatar, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Edit as EditIcon, Block as BlockIcon, CheckCircle as CheckCircleIcon, School as SchoolIcon } from '@mui/icons-material';

const courses = [
  { id: 1, name: 'Inglés 5 - 7' },
  { id: 2, name: 'Biblioteca' },
  { id: 3, name: 'Arte' },
  { id: 4, name: 'Lectura y Escritura' },
  { id: 5, name: 'Juegos y deportes en la loza' },
  { id: 6, name: 'Inglés 8 - 12' },
  { id: 7, name: 'Música' },
  { id: 8, name: 'Matematicas' },
];

export default function VolunteerCard({ volunteer, onEdit, onToggleStatus }) {
  const [openConfirm, setOpenConfirm] = React.useState(false);

  const handleToggleStatusClick = () => {
    setOpenConfirm(true);
  };

  const handleConfirmToggleStatus = () => {
    setOpenConfirm(false);
    onToggleStatus(volunteer);
  };

  const assignedCourses = volunteer.course_ids
    ? courses.filter(course => volunteer.course_ids.includes(course.id))
    : [];

  return (
    <Card elevation={3}>
      <CardContent>
        <Box display="flex" justifyContent="center" mb={2}>
          <Avatar
            src={volunteer.photo || '/placeholder.svg'}
            alt={`${volunteer.name} ${volunteer.last_name}`}
            sx={{ width: 100, height: 100 }}
          />
        </Box>
        <Typography gutterBottom variant="h5" component="div" align="center">
          {volunteer.name} {volunteer.last_name}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {volunteer.email}
        </Typography>
        <Box mt={2} display="flex" justifyContent="center" flexWrap="wrap" gap={1}>
          <Chip label={volunteer.nationality} color="primary" variant="outlined" />
          <Chip label={volunteer.gender} color="secondary" variant="outlined" />
          <Chip 
            label={volunteer.status ? 'Activo' : 'Inactivo'} 
            color={volunteer.status ? 'success' : 'error'} 
          />
          <Chip 
            label={volunteer.role === 1 ? 'Admin' : 'Profesor'} 
            color={volunteer.role === 1 ? 'error' : 'info'}
          />
        </Box>
        {volunteer.role === 2 && assignedCourses.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle2" align="center" gutterBottom>
              <SchoolIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Cursos asignados:
            </Typography>
            <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1}>
              {assignedCourses.map(course => (
                <Chip key={course.id} label={course.name} size="small" />
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
      <CardContent>
        <Button
          startIcon={<EditIcon />}
          onClick={() => onEdit(volunteer)}
          fullWidth
          variant="outlined"
          style={{ marginBottom: '8px' }}
        >
          Editar
        </Button>
        <Button
          startIcon={volunteer.status ? <BlockIcon /> : <CheckCircleIcon />}
          color={volunteer.status ? "error" : "success"}
          onClick={handleToggleStatusClick}
          fullWidth
          variant="outlined"
        >
          {volunteer.status ? 'Desactivar' : 'Activar'}
        </Button>
      </CardContent>

      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Confirmar ${volunteer.status ? 'desactivación' : 'activación'}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`¿Estás seguro de que quieres ${volunteer.status ? 'desactivar' : 'activar'} a ${volunteer.name} ${volunteer.last_name}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmToggleStatus} color={volunteer.status ? "error" : "success"} autoFocus>
            {volunteer.status ? 'Desactivar' : 'Activar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}