"use client"

import React from "react"
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TableContainer,
  Skeleton,
} from "@mui/material"
import {
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
} from "@mui/icons-material"

const StudentList = ({ students, loading, viewMode, onEdit, onToggleStatus, page, totalPages, onPageChange }) => {
  const [openConfirm, setOpenConfirm] = React.useState(false)
  const [studentToToggle, setStudentToToggle] = React.useState(null)

  const handleToggleStatusClick = (student) => {
    setStudentToToggle(student)
    setOpenConfirm(true)
  }

  const handleConfirmToggleStatus = () => {
    setOpenConfirm(false)
    if (studentToToggle) {
      onToggleStatus(studentToToggle.id)
    }
  }

  const renderPagination = () => (
    <Box mt={2} display="flex" justifyContent="center">
      <Pagination count={totalPages} page={page} onChange={onPageChange} color="primary" />
    </Box>
  )

  if (viewMode === "table") {
    return (
      <>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>DNI Estudiante</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Apellido</TableCell>
                  <TableCell>Fecha de Nacimiento</TableCell>
                  <TableCell>Nacionalidad</TableCell>
                  <TableCell>Género</TableCell>
                  <TableCell>Padre/Madre</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  [...Array(6)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell colSpan={9}>
                        <Skeleton variant="rectangular" height={40} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.document_id}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.last_name}</TableCell>
                      <TableCell>{student.birthdate}</TableCell>
                      <TableCell>{student.nationality}</TableCell>
                      <TableCell>{student.gender === "male" ? "Masculino" : "Femenino"}</TableCell>
                      <TableCell>{`${student.parent_info.parent_name} ${student.parent_info.parent_last_name}`}</TableCell>
                      <TableCell>{student.status ? "Activo" : "Inactivo"}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => onEdit(student)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleToggleStatusClick(student)}>
                          {student.status ? <BlockIcon /> : <CheckCircleIcon />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {renderPagination()}
        </Paper>
        <Dialog
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`Confirmar ${studentToToggle?.status ? "desactivación" : "activación"}`}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`¿Estás seguro de que quieres ${studentToToggle?.status ? "desactivar" : "activar"} a ${
                studentToToggle?.name
              } ${studentToToggle?.last_name}?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirm(false)} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleConfirmToggleStatus} color={studentToToggle?.status ? "error" : "success"} autoFocus>
              {studentToToggle?.status ? "Desactivar" : "Activar"}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }

  return (
    <>
      <Grid container spacing={2}>
        {loading
          ? [...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card elevation={3}>
                  <CardContent>
                    <Box display="flex" justifyContent="center" mb={2}>
                      <Skeleton variant="circular" width={100} height={100} />
                    </Box>
                    <Skeleton variant="text" height={30} width="80%" sx={{ mx: "auto" }} />
                    <Skeleton variant="text" height={20} width="60%" sx={{ mx: "auto" }} />
                    <Skeleton variant="text" height={20} width="40%" sx={{ mx: "auto" }} />
                    <Box mt={2} display="flex" justifyContent="center" flexWrap="wrap" gap={1}>
                      <Skeleton variant="rectangular" height={30} width="30%" />
                      <Skeleton variant="rectangular" height={30} width="30%" />
                      <Skeleton variant="rectangular" height={30} width="30%" />
                    </Box>
                    <Box mt={2}>
                      <Skeleton variant="text" height={20} width="80%" sx={{ mx: "auto" }} />
                    </Box>
                    <Skeleton variant="text" height={20} width="80%" sx={{ mx: "auto" }} />
                  </CardContent>
                  <CardContent>
                    <Skeleton variant="rectangular" height={36} width="100%" sx={{ mb: 1 }} />
                    <Skeleton variant="rectangular" height={36} width="100%" />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : students.map((student) => (
              <Grid item xs={12} sm={6} md={4} key={student.id}>
                <Card elevation={3}>
                  <CardContent>
                    <Box display="flex" justifyContent="center" mb={2}>
                      <Avatar
                        src={student.photo || "/placeholder.svg"}
                        alt={`${student.name} ${student.last_name}`}
                        sx={{ width: 100, height: 100 }}
                      />
                    </Box>
                    <Typography gutterBottom variant="h5" component="div" align="center">
                      {student.name} {student.last_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      DNI: {student.document_id}
                    </Typography>
                    <Box mt={2} display="flex" justifyContent="center" flexWrap="wrap" gap={1}>
                      <Chip label={student.nationality || "No especificada"} color="primary" variant="outlined" />
                      <Chip
                        label={student.gender === "male" ? "Masculino" : "Femenino"}
                        color="secondary"
                        variant="outlined"
                      />
                      <Chip label={student.status ? "Activo" : "Inactivo"} color={student.status ? "success" : "error"} />
                    </Box>
                    <Box mt={2}>
                      <Typography variant="subtitle2" align="center" gutterBottom>
                        <SchoolIcon fontSize="small" style={{ verticalAlign: "middle", marginRight: "4px" }} />
                        Fecha de Nacimiento: {student.birthdate}
                      </Typography>
                    </Box>
                    <Typography variant="body2" align="center">
                      Padre/Madre: {`${student.parent_info.parent_name} ${student.parent_info.parent_last_name}`}
                    </Typography>
                  </CardContent>
                  <CardContent>
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => onEdit(student)}
                      fullWidth
                      variant="outlined"
                      style={{ marginBottom: "8px" }}
                    >
                      Editar
                    </Button>
                    <Button
                      startIcon={student.status ? <BlockIcon /> : <CheckCircleIcon />}
                      color={student.status ? "error" : "success"}
                      onClick={() => handleToggleStatusClick(student)}
                      fullWidth
                      variant="outlined"
                    >
                      {student.status ? "Desactivar" : "Activar"}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
      </Grid>
      {renderPagination()}

      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Confirmar ${studentToToggle?.status ? "desactivación" : "activación"}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`¿Estás seguro de que quieres ${studentToToggle?.status ? "desactivar" : "activar"} a ${
              studentToToggle?.name
            } ${studentToToggle?.last_name}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmToggleStatus} color={studentToToggle?.status ? "error" : "success"} autoFocus>
            {studentToToggle?.status ? "Desactivar" : "Activar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default StudentList