"use client"

import React, { useState, useEffect } from "react"
import { Container, Paper, Snackbar } from "@mui/material"
import MuiAlert from "@mui/material/Alert"
import SearchAndFilterBar from "./SearchAndFilterBar"
import StudentList from "./StudentList"
import StudentForm from "./StudentForm"
import { getStudents, getStudentById, createStudent, updateStudent, toggleStudentStatus } from "./api"
import Swal from "sweetalert2"

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export default function StudentCRUD() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState("card")
  const [openDialog, setOpenDialog] = useState(false)
  const [currentStudent, setCurrentStudent] = useState({})
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterGender, setFilterGender] = useState("all")
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
  const [page, setPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    fetchStudents(page, itemsPerPage)
  }, [page])

  const fetchStudents = async (page, pageSize) => {
    setLoading(true)
    try {
      // Add cache-busting parameter to prevent cached responses
      const timestamp = new Date().getTime()
      const data = await getStudents(page, pageSize, timestamp)
      
      // Log the received data to check if document_id is correct
      console.log("Datos recibidos después de actualización:", data)
      
      setStudents(data)
    } catch (error) {
      setSnackbar({ open: true, message: "Error al cargar estudiantes", severity: "error" })
    } finally {
      setLoading(false)
    }
  }

  const handleAddEdit = async (student = null) => {
    if (student && student.id) {
      try {
        const fullStudentData = await getStudentById(student.id)
        setCurrentStudent(fullStudentData)
      } catch (error) {
        setSnackbar({ open: true, message: "Error al cargar los datos del estudiante", severity: "error" })
        return
      }
    } else {
      setCurrentStudent(null)
    }
    setOpenDialog(true)
  }

  const handleSave = async (student) => {
    try {
      if (student.id) {
        console.log("Actualizando estudiante con ID:", student.id)
        // Incluir todos los campos editables incluyendo document_id
        const updateData = {
          name: student.name,
          last_name: student.last_name,
          gender: student.gender,
          nationality: student.nationality || "",
          document_id: student.document_id,
          birthdate: student.birthdate,
          birth_city: student.birth_city || "",
          birth_country: student.birth_country || "", 
          status: student.status
        }
        
        // Log the data being sent for update
        console.log("Datos enviados para actualización:", updateData)
        
        const updatedStudent = await updateStudent(student.id, updateData)
        
        // Log the response to check if document_id is updated in the response
        console.log("Respuesta de actualización:", updatedStudent)

        // Mostrar mensaje de éxito
        Swal.fire({
          title: "¡Éxito!",
          text: "Estudiante actualizado correctamente",
          icon: "success",
          confirmButtonText: "Ok",
        }).then(() => {
          // Forzar una recarga completa de datos después de cerrar el mensaje
          fetchStudents(page, itemsPerPage)
        })
      } else {
        // Crear nuevo estudiante
        await createStudent(student)

        // Mostrar mensaje de éxito
        Swal.fire({
          title: "¡Éxito!",
          text: "Estudiante creado correctamente",
          icon: "success",
          confirmButtonText: "Ok",
        }).then(() => {
          // Recargar los datos después de cerrar el mensaje
          fetchStudents(page, itemsPerPage)
        })
      }
    } catch (error) {
      console.error("Error al guardar estudiante:", error)
      Swal.fire({
        title: "Error",
        text: "Error al guardar estudiante. Por favor, inténtelo de nuevo.",
        icon: "error",
        confirmButtonText: "Ok",
      })
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      // Usar el nuevo endpoint para cambiar el estado
      await toggleStudentStatus(id)

      // Recargar los datos después de cambiar el estado
      fetchStudents(page, itemsPerPage)

      // Mostrar mensaje de éxito
      const studentToToggle = students.find((student) => student.id === id)
      const newStatus = !studentToToggle.status
      setSnackbar({
        open: true,
        message: `Estudiante ${newStatus ? "activado" : "desactivado"} correctamente`,
        severity: "success",
      })
    } catch (error) {
      console.error("Error al cambiar el estado del estudiante:", error)
      setSnackbar({
        open: true,
        message: "Error al cambiar el estado del estudiante",
        severity: "error",
      })
    }
  }

  const filteredStudents = students.filter(
    (student) =>
      (student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student?.document_id?.includes(searchTerm)) &&
      (filterStatus === "all" || student?.status?.toString() === filterStatus) &&
      (filterGender === "all" || student?.gender?.toLowerCase() === filterGender.toLowerCase()),
  )

  const paginatedStudents = filteredStudents.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
        <SearchAndFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterGender={filterGender}
          setFilterGender={setFilterGender}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onAddNew={() => handleAddEdit()}
        />
      </Paper>

      <StudentList
        students={paginatedStudents}
        loading={loading}
        viewMode={viewMode}
        onEdit={handleAddEdit}
        onToggleStatus={handleToggleStatus}
        page={page}
        totalPages={Math.ceil(filteredStudents.length / itemsPerPage)}
        onPageChange={(event, value) => setPage(value)}
      />

      <StudentForm
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        initialStudent={currentStudent}
        onReload={() => fetchStudents(page, itemsPerPage)}
      />

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}