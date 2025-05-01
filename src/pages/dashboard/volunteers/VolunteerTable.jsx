import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Avatar, Chip, IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Box } from '@mui/material';
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

export default function VolunteerTable({ volunteers, onEdit, onToggleStatus }) {
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = React.useState(null);

  const handleToggleStatusClick = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setOpenConfirm(true);
  };

  const handleConfirmToggleStatus = () => {
    setOpenConfirm(false);
    onToggleStatus(selectedVolunteer);
    setSelectedVolunteer(null);
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Foto</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Nacionalidad</TableCell>
            <TableCell>Género</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Cursos</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {volunteers.map((volunteer) => {
            const assignedCourses = volunteer.course_ids
              ? courses.filter(course => volunteer.course_ids.includes(course.id))
              : [];

            return (
              <TableRow key={volunteer.id}>
                <TableCell>
                  <Avatar src={volunteer.photo || '/placeholder.svg'} alt={`${volunteer.name} ${volunteer.last_name}`} />
                </TableCell>
                <TableCell>{`${volunteer.name} ${volunteer.last_name}`}</TableCell>
                <TableCell>{volunteer.email}</TableCell>
                <TableCell>{volunteer.phone}</TableCell>
                <TableCell>{volunteer.nationality}</TableCell>
                <TableCell>{volunteer.gender}</TableCell>
                <TableCell>
                  <Chip
                    label={volunteer.status ? 'Activo' : 'Inactivo'}
                    color={volunteer.status ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={volunteer.role === 1 ? 'Admin' : 'Profesor'}
                    color={volunteer.role === 1 ? 'error' : 'info'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {volunteer.role === 2 && assignedCourses.length > 0 ? (
                    <Box display="flex" flexDirection="column" alignItems="flex-start">
                      {assignedCourses.map(course => (
                        <Chip
                          key={course.id}
                          label={course.name}
                          size="small"
                          icon={<SchoolIcon />}
                          style={{ margin: '2px 0' }}
                        />
                      ))}
                    </Box>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => onEdit(volunteer)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={volunteer.status ? "Desactivar" : "Activar"}>
                    <IconButton onClick={() => handleToggleStatusClick(volunteer)}>
                      {volunteer.status ? <BlockIcon color="error" /> : <CheckCircleIcon color="success" />}
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Confirmar ${selectedVolunteer?.status ? 'desactivación' : 'activación'}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`¿Estás seguro de que quieres ${selectedVolunteer?.status ? 'desactivar' : 'activar'} a ${selectedVolunteer?.name} ${selectedVolunteer?.last_name}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmToggleStatus} color={selectedVolunteer?.status ? "error" : "success"} autoFocus>
            {selectedVolunteer?.status ? 'Desactivar' : 'Activar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}