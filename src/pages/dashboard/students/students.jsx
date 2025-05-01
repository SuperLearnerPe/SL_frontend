"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  TextField,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Alert,
  Snackbar,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material"
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material"
import { getAllStudentsWithCourses, assignCoursesToStudent, removeCoursesFromStudent } from "./student-courses-api"

const courses = [
  { id: 1, name: "Inglés 5 - 7", dia: "Tuesday", horario: "2:30 pm - 4:30 pm" },
  { id: 2, name: "Biblioteca", dia: "Monday", horario: "2:30 pm - 4:30 pm" },
  { id: 3, name: "Arte", dia: "Wednesday", horario: "2:30 pm - 4:30 pm" },
  { id: 4, name: "Lectura y escritura", dia: "Thursday", horario: "2:30 pm - 4:30 pm" },
  { id: 5, name: "Juegos y deportes en la loza", dia: "Friday", horario: "2:30 pm - 4:30 pm" },
  { id: 6, name: "Inglés 8 - 12", dia: "Saturday", horario: "3:00 pm - 5:00 pm" },
  { id: 7, name: "Música", dia: "Sunday", horario: "2:00 pm - 4:00 pm" },
  { id: 8, name: "Matemáticas", dia: "Saturday", horario: "10:00 am - 12:00 pm" },
]

const StudentCoursesManager = () => {
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [openAssignDialog, setOpenAssignDialog] = useState(false)
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false)
  const [selectedCourses, setSelectedCourses] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })

  useEffect(() => {
    fetchStudentsWithCourses()
  }, [])

  const fetchStudentsWithCourses = async () => {
    try {
      const data = await getAllStudentsWithCourses()
      setStudents(data)
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al cargar los estudiantes",
        severity: "error",
      })
    }
  }

  // Filtrar estudiantes según término de búsqueda
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.document_id.includes(searchTerm),
  )

  // Obtener cursos disponibles (no asignados al estudiante)
  const getAvailableCourses = (studentId) => {
    const student = students.find((s) => s.id === studentId)
    if (!student) return courses
    return courses.filter((course) => !student.courses_info.some((c) => c.id === course.id))
  }

  // Obtener cursos asignados al estudiante
  const getAssignedCourses = (studentId) => {
    const student = students.find((s) => s.id === studentId)
    if (!student) return []
    return student.courses_info
  }

  // Asignar cursos a estudiante
  const assignCourses = async () => {
    if (!selectedStudent || selectedCourses.length === 0) return

    try {
      const classIds = selectedCourses.map((course) => course.id)
      await assignCoursesToStudent(selectedStudent.id, classIds)
      fetchStudentsWithCourses()
      setOpenAssignDialog(false)
      setSelectedCourses([])
      setSnackbar({
        open: true,
        message: `Cursos asignados correctamente a ${selectedStudent.name} ${selectedStudent.last_name}`,
        severity: "success",
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al asignar los cursos",
        severity: "error",
      })
    }
  }

  // Remover cursos de estudiante
  const removeCourses = async () => {
    if (!selectedStudent || selectedCourses.length === 0) return

    try {
      const classIds = selectedCourses.map((course) => course.id)
      await removeCoursesFromStudent(selectedStudent.id, classIds)
      fetchStudentsWithCourses()
      setOpenRemoveDialog(false)
      setSelectedCourses([])
      setSnackbar({
        open: true,
        message: `Cursos removidos correctamente de ${selectedStudent.name} ${selectedStudent.last_name}`,
        severity: "info",
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al remover los cursos",
        severity: "error",
      })
    }
  }

  // Renderizar tarjeta de estudiante
  const renderStudentCard = (student) => {
    const assignedCourses = getAssignedCourses(student.id)

    return (
      <Card key={student.id} sx={{ mb: 2, border: "1px solid #e0e0e0" }}>
        <CardContent>
          <Typography variant="h6" component="div">
            {student.name} {student.last_name}
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            DNI: {student.document_id}
          </Typography>

          <Divider sx={{ my: 1.5 }} />

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Cursos Asignados ({assignedCourses.length})
          </Typography>

          {assignedCourses.length > 0 ? (
            <List dense>
              {assignedCourses.map((course) => (
                <ListItem key={course.id} sx={{ bgcolor: "#f5f5f5", mb: 1, borderRadius: 1 }}>
                  <ListItemText
                    primary={course.name}
                    secondary={`Horario: ${course.horario} | Día: ${course.dia}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => {
                        setSelectedStudent(student)
                        setSelectedCourses([course])
                        setOpenRemoveDialog(true)
                      }}
                    >
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Alert severity="info" sx={{ mb: 2 }}>
              Este estudiante no tiene cursos asignados
            </Alert>
          )}
        </CardContent>
        <CardActions>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedStudent(student)
              setOpenAssignDialog(true)
            }}
            disabled={getAvailableCourses(student.id).length === 0}
          >
            Asignar Curso
          </Button>
          <Button
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => {
              setSelectedStudent(student)
              setOpenRemoveDialog(true)
            }}
            disabled={getAssignedCourses(student.id).length === 0}
          >
            Remover Curso
          </Button>
        </CardActions>
      </Card>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Gestión de Cursos por Estudiante
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Buscar estudiante"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: <SearchIcon color="action" />,
              }}
              placeholder="Buscar por nombre, apellido o DNI"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip label={`Total Estudiantes: ${students.length}`} color="primary" variant="outlined" />
              <Chip label={`Total Cursos: ${courses.length}`} color="secondary" variant="outlined" />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <Grid item xs={12} md={6} lg={4} key={student.id}>
              {renderStudentCard(student)}
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Alert severity="warning">No se encontraron estudiantes con el término de búsqueda: &quot;{searchTerm}&quot;</Alert>
          </Grid>
        )}
      </Grid>

      {/* Diálogo para asignar curso */}
      <Dialog open={openAssignDialog} onClose={() => setOpenAssignDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Asignar Curso a Estudiante</DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Estudiante: {selectedStudent.name} {selectedStudent.last_name}
              </Typography>

              <FormControl fullWidth margin="normal">
                <InputLabel id="select-multiple-courses-label">Seleccionar Cursos</InputLabel>
                <Select
                  labelId="select-multiple-courses-label"
                  multiple
                  value={selectedCourses}
                  onChange={(e) => setSelectedCourses(e.target.value)}
                  renderValue={(selected) => selected.map((course) => course.name).join(', ')}
                >
                  {getAvailableCourses(selectedStudent.id).map((course) => (
                    <MenuItem key={course.id} value={course}>
                      {course.name} ({course.dia}) - {course.horario}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedCourses.length > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                  <Typography variant="subtitle2">Información de los Cursos Seleccionados</Typography>
                  {selectedCourses.map((course) => (
                    <Box key={course.id} sx={{ mb: 1 }}>
                      <Typography variant="body2">Curso: {course.name}</Typography>
                      <Typography variant="body2">Día: {course.dia}</Typography>
                      <Typography variant="body2">Horario: {course.horario}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignDialog(false)}>Cancelar</Button>
          <Button onClick={assignCourses} variant="contained" color="primary" disabled={selectedCourses.length === 0}>
            Asignar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para remover curso */}
      <Dialog open={openRemoveDialog} onClose={() => setOpenRemoveDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Remover Curso de Estudiante</DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Estudiante: {selectedStudent.name} {selectedStudent.last_name}
              </Typography>

              <FormControl fullWidth margin="normal">
                <InputLabel id="select-multiple-courses-remove-label">Seleccionar Cursos</InputLabel>
                <Select
                  labelId="select-multiple-courses-remove-label"
                  multiple
                  value={selectedCourses}
                  onChange={(e) => setSelectedCourses(e.target.value)}
                  renderValue={(selected) => selected.map((course) => course.name).join(', ')}
                >
                  {getAssignedCourses(selectedStudent.id).map((course) => (
                    <MenuItem key={course.id} value={course}>
                      {course.name} ({course.dia}) - {course.horario}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedCourses.length > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                  <Typography variant="subtitle2">Información de los Cursos Seleccionados</Typography>
                  {selectedCourses.map((course) => (
                    <Box key={course.id} sx={{ mb: 1 }}>
                      <Typography variant="body2">Curso: {course.name}</Typography>
                      <Typography variant="body2">Día: {course.dia}</Typography>
                      <Typography variant="body2">Horario: {course.horario}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRemoveDialog(false)}>Cancelar</Button>
          <Button onClick={removeCourses} variant="contained" color="primary" disabled={selectedCourses.length === 0}>
            Remover
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default StudentCoursesManager