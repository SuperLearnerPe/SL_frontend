"use client"

import { useState, useEffect } from "react"
import { Container, Paper, Box, Typography } from "@mui/material"
import SearchAndFilterBar from "./SearchAndFilterBar"
import ParentsList from "./ParentsList"
import ParentsForm from "./ParentsForm"
import { getParents, getParentById, createParent, updateParent, toggleParentStatus } from "./api-parents"
import CustomSnackbar from "./CustomSnackbar"
import Swal from "sweetalert2"

export default function ParentsCRUD() {
  const [parents, setParents] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState("card")
  const [openDialog, setOpenDialog] = useState(false)
  const [currentParent, setCurrentParent] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
  const [page, setPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    fetchParents()
  }, [])

  const fetchParents = async () => {
    setLoading(true)
    try {
      const data = await getParents()
      setParents(data)
    } catch (error) {
      setSnackbar({ open: true, message: "Error al cargar padres/madres", severity: "error" })
    } finally {
      setLoading(false)
    }
  }

  const handleAddEdit = async (parent = null) => {
    if (parent && parent.id) {
      try {
        const fullParentData = await getParentById(parent.id)
        setCurrentParent(fullParentData)
      } catch (error) {
        setSnackbar({ open: true, message: "Error al cargar los datos del padre/madre", severity: "error" })
        return
      }
    } else {
      setCurrentParent(null)
    }
    setOpenDialog(true)
  }

  const handleSave = async (parent) => {
    try {
      if (parent.id) {
        console.log("Actualizando padre/madre con ID:", parent.id)
        // Ensure email is handled consistently as null when empty
        const updateData = {
          name: parent.name,
          last_name: parent.last_name,
          document_id: parent.document_id, // AÑADIR ESTA LÍNEA
          email: parent.email, // The form will provide null if empty
          phone: parent.phone,
          address: parent.address,
          city: parent.city,
          country: parent.country,
          nationality: parent.nationality,
          birthdate: parent.birthdate,
          gender: parent.gender,
          document_type: parent.document_type,
          status: parent.status
        }
        await updateParent(parent.id, updateData)

        // Mostrar mensaje de éxito
        Swal.fire({
          title: "¡Éxito!",
          text: "Padre/Madre actualizado correctamente",
          icon: "success",
          confirmButtonText: "Ok",
        }).then(() => {
          // Recargar los datos después de cerrar el mensaje
          fetchParents()
        })
      } else {
        // Crear nuevo padre/madre - no need to modify, we'll let the form handle it
        await createParent(parent)

        // Mostrar mensaje de éxito
        Swal.fire({
          title: "¡Éxito!",
          text: "Padre/Madre creado correctamente",
          icon: "success",
          confirmButtonText: "Ok",
        }).then(() => {
          // Recargar los datos después de cerrar el mensaje
          fetchParents()
        })
      }
    } catch (error) {
      console.error("Error al guardar padre/madre:", error)
      Swal.fire({
        title: "Error",
        text: error.message || "Error al guardar padre/madre. Por favor, inténtelo de nuevo.",
        icon: "error",
        confirmButtonText: "Ok",
      })
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      // Usar el endpoint para cambiar el estado
      await toggleParentStatus(id)

      // Recargar los datos después de cambiar el estado
      fetchParents()

      // Mostrar mensaje de éxito
      const parentToToggle = parents.find((parent) => parent.id === id)
      const newStatus = !parentToToggle.status
      setSnackbar({
        open: true,
        message: `Padre/Madre ${newStatus ? "activado" : "desactivado"} correctamente`,
        severity: "success",
      })
    } catch (error) {
      console.error("Error al cambiar el estado del padre/madre:", error)
      setSnackbar({
        open: true,
        message: "Error al cambiar el estado del padre/madre",
        severity: "error",
      })
    }
  }

  const filteredParents = parents.filter(
    (parent) =>
      (parent?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent?.document_id?.includes(searchTerm) ||
        parent?.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "all" || parent?.status?.toString() === filterStatus),
  )

  const paginatedParents = filteredParents.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Padres/Madres
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Administre la información de los padres y madres de los estudiantes
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <SearchAndFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onAddNew={() => handleAddEdit()}
          entityName="Padre/Madre"
        />
      </Paper>

      <ParentsList
        parents={paginatedParents}
        loading={loading}
        viewMode={viewMode}
        onEdit={handleAddEdit}
        onToggleStatus={handleToggleStatus}
        page={page}
        totalPages={Math.ceil(filteredParents.length / itemsPerPage)}
        onPageChange={(event, value) => setPage(value)}
      />

      <ParentsForm
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        initialParent={currentParent}
        onReload={fetchParents}
      />

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Container>
  )
}

