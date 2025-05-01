"use client"

import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, MenuItem, Typography } from "@mui/material"
import { useState, useEffect, useCallback } from "react"
import Swal from "sweetalert2"

const StudentForm = ({ open, onClose, onSave, initialStudent }) => {
  const [student, setStudent] = useState({
    name: "",
    last_name: "",
    parent_dni: "",
    nationality: "",
    document_id: "",
    birthdate: "",
    gender: "",
    status: 1,
    birth_city: "",
    birth_country: "",
  })

  const [errors, setErrors] = useState({
    name: "",
    last_name: "",
    parent_dni: "",
    document_id: "",
    birthdate: "",
    gender: "",
    birth_city: "",
    birth_country: "",
  })

  const [touched, setTouched] = useState({
    name: false,
    last_name: false,
    parent_dni: false,
    document_id: false,
    birthdate: false,
    gender: false,
    birth_city: false,
    birth_country: false,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = useCallback((name, value) => {
    switch (name) {
      case "name":
      case "last_name":
        if (!value.trim()) {
          return "Este campo es requerido"
        }
        if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/.test(value)) {
          return "Solo se permiten letras"
        }
        return ""
      case "parent_dni":
      case "document_id":
        if (!value.trim()) {
          return "Este campo es requerido"
        }
        if (!/^\d{8}$/.test(value)) {
          return "El DNI debe tener 8 dígitos"
        }
        return ""
      case "birthdate":
        if (!value) {
          return "Este campo es requerido"
        }
        {
          const date = new Date(value)
          const today = new Date()
          if (date > today) {
            return "La fecha no puede ser futura"
          }
        }
        return ""
      case "gender":
        if (!value) {
          return "Este campo es requerido"
        }
        return ""
      case "birth_city":
      case "birth_country":
        if (!value.trim()) {
          return "Este campo es requerido"
        }
        return ""
      default:
        return ""
    }
  }, [])

  const validateForm = useCallback(() => {
    const newErrors = {}
    let isValid = true

    // En modo edición, validamos todos los campos editables incluyendo document_id
    if (isEditing) {
      const fieldsToValidate = ["name", "last_name", "gender", "birthdate", "birth_city", "birth_country", "document_id"]
      fieldsToValidate.forEach((field) => {
        const error = validateField(field, student[field])
        newErrors[field] = error
        if (error) {
          isValid = false
        }
      })
    } else {
      // En modo creación, validamos todos los campos excepto nationality y status
      Object.keys(student).forEach((field) => {
        if (field !== "nationality" && field !== "status") {
          const error = validateField(field, student[field])
          newErrors[field] = error
          if (error) {
            isValid = false
          }
        }
      })
    }

    setErrors(newErrors)
    return isValid
  }, [student, validateField, isEditing])

  const resetStudentState = useCallback(() => {
    setStudent({
      name: "",
      last_name: "",
      parent_dni: "",
      nationality: "",
      document_id: "",
      birthdate: "",
      gender: "",
      status: 1,
      birth_city: "",
      birth_country: "",
    })
    setErrors({})
    setTouched({})
    setIsEditing(false)
    setIsSubmitting(false)
  }, [])

  useEffect(() => {
    if (initialStudent) {
      setIsEditing(true)
      setStudent({
        ...initialStudent,
        name: initialStudent.name || "",
        last_name: initialStudent.last_name || "",
        parent_dni: initialStudent.parent_info?.dni || "",
        nationality: initialStudent.nationality || "",
        document_id: initialStudent.document_id || "",
        birthdate: initialStudent.birthdate || "",
        gender: initialStudent.gender || "",
        status: initialStudent.status || 1,
        birth_city: initialStudent.birth_info?.city || "",
        birth_country: initialStudent.birth_info?.country || "",
      })
    } else {
      resetStudentState()
    }
  }, [initialStudent, resetStudentState])

  const handleChange = (e) => {
    const { name, value } = e.target
    setStudent((prev) => ({ ...prev, [name]: value }))

    // Validate field on change
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))

    // Validate field on blur
    const error = validateField(name, student[name])
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleSave = async () => {
    // Evitar múltiples envíos
    if (isSubmitting) return
    setIsSubmitting(true)

    // Mark all fields as touched
    const newTouched = {}
    if (isEditing) {
      // En modo edición, marcamos como tocados los campos editables
      ["name", "last_name", "gender", "birthdate", "birth_city", "birth_country", "document_id"].forEach((field) => {
        newTouched[field] = true
      })
    } else {
      // En modo creación, marcamos todos los campos como tocados
      Object.keys(student).forEach((field) => {
        newTouched[field] = true
      })
    }
    setTouched(newTouched)

    // Validate all fields
    if (!validateForm()) {
      setIsSubmitting(false)
      Swal.fire({
        title: "Error",
        text: "Por favor, complete todos los campos requeridos correctamente",
        icon: "error",
        confirmButtonText: "Ok",
      })
      return
    }

    try {
      if (isEditing) {
        console.log("Preparando datos para actualizar estudiante con ID:", initialStudent.id)
        // Incluir todos los campos editables incluyendo document_id
        const updateData = {
          id: initialStudent.id,
          name: student.name,
          last_name: student.last_name,
          gender: student.gender,
          nationality: student.nationality,
          document_id: student.document_id,
          birthdate: student.birthdate,
          birth_city: student.birth_city,
          birth_country: student.birth_country,
          status: student.status
        }
        // Llamar a onSave con los datos para actualizar
        await onSave(updateData)
      } else {
        // Llamar a onSave con todos los datos para crear
        await onSave(student)
      }

      // Cerrar el formulario y resetear el estado
      onClose()
      resetStudentState()

      // Mostrar mensaje de éxito (ahora manejado por el componente padre)
    } catch (error) {
      console.error("Error en el formulario:", error)
      setIsSubmitting(false)

      // Mostrar mensaje de error
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al guardar el estudiante. Por favor, inténtelo de nuevo.",
        icon: "error",
        confirmButtonText: "Ok",
      })
    }
  }

  const isFormValid = useCallback(() => {
    // Check if any field has an error
    if (Object.values(errors).some((error) => error !== "")) {
      return false
    }

    // En modo edición, solo verificamos los campos editables
    if (isEditing) {
      const requiredFields = ["name", "last_name", "gender"]
      return requiredFields.every((field) => student[field].toString().trim() !== "")
    } else {
      // En modo creación, verificamos todos los campos requeridos
      const requiredFields = [
        "name",
        "last_name",
        "parent_dni",
        "document_id",
        "birthdate",
        "gender",
        "birth_city",
        "birth_country",
      ]
      return requiredFields.every((field) => student[field].toString().trim() !== "")
    }
  }, [errors, student, isEditing])

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!isSubmitting) {
          onClose()
          resetStudentState()
        }
      }}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: "1px solid #e0e0e0",
          padding: "16px 24px",
          fontSize: "1.1rem",
          fontWeight: 500,
        }}
      >
        {isEditing ? "Editar Estudiante" : "Añadir Estudiante"}
      </DialogTitle>
      <DialogContent sx={{ padding: "24px", paddingTop: "24px !important" }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Nombre"
              name="name"
              value={student.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiInputBase-root": { background: "#fff" } }}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Apellido"
              name="last_name"
              value={student.last_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.last_name && Boolean(errors.last_name)}
              helperText={touched.last_name && errors.last_name}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiInputBase-root": { background: "#fff" } }}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="DNI del Padre/Madre"
              name="parent_dni"
              value={student.parent_dni}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.parent_dni && Boolean(errors.parent_dni)}
              helperText={
                (touched.parent_dni && errors.parent_dni) ||
                (isEditing && initialStudent?.parent_info?.parent_name
                  ? `Padre/Madre: ${initialStudent.parent_info.parent_name} ${initialStudent.parent_info.parent_last_name}`
                  : "Ingrese el DNI de un padre ya registrado en el sistema")
              }
              disabled={isEditing || isSubmitting}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiInputBase-root": { background: "#fff" } }}
              FormHelperTextProps={{
                sx: {
                  color: touched.parent_dni && errors.parent_dni 
                    ? "error.main" 
                    : isEditing 
                      ? "text.secondary" 
                      : "info.main", // Changed from "error.main" to "info.main"
                  fontStyle: isEditing ? "normal" : "italic",
                  fontSize: "0.75rem",
                  marginTop: "3px"
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Nacionalidad"
              name="nationality"
              value={student.nationality}
              onChange={handleChange}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiInputBase-root": { background: "#fff" } }}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="DNI del Estudiante"
              name="document_id"
              value={student.document_id}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.document_id && Boolean(errors.document_id)}
              helperText={touched.document_id && errors.document_id}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiInputBase-root": { background: "#fff" } }}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Fecha de Nacimiento"
              name="birthdate"
              type="date"
              value={student.birthdate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.birthdate && Boolean(errors.birthdate)}
              helperText={touched.birthdate && errors.birthdate}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiInputBase-root": { background: "#fff" } }}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              select
              label="Género"
              name="gender"
              value={student.gender}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.gender && Boolean(errors.gender)}
              helperText={touched.gender && errors.gender}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiInputBase-root": { background: "#fff" } }}
              disabled={isSubmitting}
            >
              <MenuItem value="male">Masculino</MenuItem>
              <MenuItem value="female">Femenino</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Ciudad de Nacimiento"
              name="birth_city"
              value={student.birth_city}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.birth_city && Boolean(errors.birth_city)}
              helperText={touched.birth_city && errors.birth_city}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiInputBase-root": { background: "#fff" } }}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="País de Nacimiento"
              name="birth_country"
              value={student.birth_country}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.birth_country && Boolean(errors.birth_country)}
              helperText={touched.birth_country && errors.birth_country}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiInputBase-root": { background: "#fff" } }}
              disabled={isSubmitting} // Remove "isEditing ||" to make it editable in edit mode
            />
          </Grid>
          {student.updated_at && (
            <Typography variant="body2" color="text.secondary">
              Actualizado: {new Date(student.updated_at).toLocaleDateString()}
            </Typography>
          )}
          {/* Add updated_at information if available */}
          {initialStudent?.updated_at && (
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Última actualización: {new Date(initialStudent.updated_at).toLocaleString()}
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          borderTop: "1px solid #e0e0e0",
          padding: "16px 24px",
          gap: "8px",
        }}
      >
        <Button
          onClick={() => {
            if (!isSubmitting) {
              onClose()
              resetStudentState()
            }
          }}
          variant="outlined"
          sx={{
            textTransform: "none",
            minWidth: "100px",
          }}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={!isFormValid() || isSubmitting}
          sx={{
            textTransform: "none",
            minWidth: "100px",
          }}
        >
          {isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default StudentForm