"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, MenuItem } from "@mui/material"
import Swal from "sweetalert2"

const ParentsForm = ({ open, onClose, onSave, initialParent }) => {
  const [parent, setParent] = useState({
    name: "",
    last_name: "",
    document_id: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    nationality: "",
    document_type: "DNI",
    birthdate: "",
    gender: "",
    status: 1,
  })

  const [errors, setErrors] = useState({
    name: "",
    last_name: "",
    document_id: "",
    email: "",
    phone: "",
    birthdate: "",
    gender: "",
  })

  const [touched, setTouched] = useState({
    name: false,
    last_name: false,
    document_id: false,
    email: false,
    phone: false,
    address: false,
    city: false,
    birthdate: false,
    gender: false,
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
      case "document_id":
        if (!value.trim()) {
          return "Este campo es requerido"
        }
        if (!/^\d{8}$/.test(value)) {
          return "El DNI debe tener 8 dígitos"
        }
        return ""
      case "email":
        // Permitir email vacío o con valor "-"
        if (!value.trim() || value.trim() === "-") {
          return ""
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Formato de email inválido"
        }
        return ""
      case "phone":
        if (value.trim() && !/^\d{9}$/.test(value)) {
          return "El teléfono debe tener 9 dígitos"
        }
        return ""
      case "birthdate":
        if (!value.trim()) {
          return "Este campo es requerido"
        }
        return ""
      case "gender":
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

    // En modo edición, validamos todos los campos incluyendo DNI
    if (isEditing) {
      const fieldsToValidate = [
        "name", "last_name", "document_id", "email", "phone", 
        "address", "city", "country", "nationality", 
        "birthdate", "gender"
      ]
      fieldsToValidate.forEach((field) => {
        const error = validateField(field, parent[field])
        newErrors[field] = error
        if (error) {
          isValid = false
        }
      })
    } else {
      // En modo creación, verificamos todos los campos excepto status
      Object.keys(parent).forEach((field) => {
        if (field !== "status" && field !== "address" && field !== "city") {
          const error = validateField(field, parent[field])
          newErrors[field] = error
          if (error) {
            isValid = false
          }
        }
      })
    }

    setErrors(newErrors)
    return isValid
  }, [parent, validateField, isEditing])

  const resetParentState = useCallback(() => {
    setParent({
      name: "",
      last_name: "",
      document_id: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      nationality: "",
      document_type: "DNI",
      birthdate: "",
      gender: "",
      status: 1,
    })
    setErrors({})
    setTouched({})
    setIsEditing(false)
    setIsSubmitting(false)
  }, [])

  useEffect(() => {
    if (initialParent) {
      setIsEditing(true)
      setParent({
        id: initialParent.id,
        name: initialParent.name || "",
        last_name: initialParent.last_name || "",
        document_id: initialParent.document_id || "",
        email: initialParent.email || "",
        phone: initialParent.phone || "",
        address: initialParent.address || "",
        city: initialParent.city || "",
        country: initialParent.country || "",
        nationality: initialParent.nationality || "",
        document_type: initialParent.document_type || "DNI",
        birthdate: initialParent.birthdate || "",
        gender: initialParent.gender || "",
        status: initialParent.status || 1,
      })
    } else {
      resetParentState()
    }
  }, [initialParent, resetParentState])

  const handleChange = (e) => {
    const { name, value } = e.target
    setParent((prev) => ({ ...prev, [name]: value }))

    // Validate field on change
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))

    // Validate field on blur
    const error = validateField(name, parent[name])
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  // Fix the handleSave function to properly handle email as null
  const handleSave = async () => {
    // Evitar múltiples envíos
    if (isSubmitting) return
    setIsSubmitting(true)

    // Mark all fields as touched
    const newTouched = {}
    if (isEditing) {
      // En modo edición, marcamos como tocados todos los campos incluyendo document_id
      Object.keys(parent).forEach((field) => {
        if (field !== "status") {
          newTouched[field] = true
        }
      })
    } else {
      // En modo creación, marcamos todos los campos como tocados
      Object.keys(parent).forEach((field) => {
        if (field !== "status") {
          newTouched[field] = true
        }
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
      // Email should be null when empty (for both create and update)
      const emailValue = parent.email && parent.email.trim() !== "" ? parent.email : null;
      
      if (isEditing) {
        console.log("Preparando datos para actualizar padre/madre con ID:", initialParent.id)
        
        // Incluir todos los campos en la actualización, incluyendo document_id
        const updateData = {
          name: parent.name,
          last_name: parent.last_name,
          document_id: parent.document_id, // Include document_id in update
          email: emailValue,
          phone: parent.phone || "",
          gender: parent.gender,
          address: parent.address || "",
          city: parent.city || "",
          country: parent.country || "",
          nationality: parent.nationality || "",
          birthdate: parent.birthdate,
          document_type: parent.document_type || "DNI",
          status: parent.status // Include status to preserve it
        }
        
        // Add this logging right before the onSave call to debug
        console.log("Sending update data:", {...updateData, id: initialParent.id});

        // Llamar a onSave con los datos y el ID para actualizar
        await onSave({id: initialParent.id, ...updateData})
      } else {
        // En modo creación, no modificamos email con "-"
        const newParentData = {
          ...parent,
          email: emailValue
        };
        
        // Llamar a onSave con todos los datos para crear
        await onSave(newParentData)
      }

      // Cerrar el formulario y resetear el estado
      onClose()
      resetParentState()

    } catch (error) {
      console.error("Error en el formulario:", error)
      setIsSubmitting(false)

      // Mostrar mensaje de error
      Swal.fire({
        title: "Error",
        text: error.message || "Hubo un problema al guardar. Por favor, inténtelo de nuevo.",
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

    // En modo edición, verificamos todos los campos requeridos incluyendo document_id
    if (isEditing) {
      const requiredFields = ["name", "last_name", "document_id", "phone", "gender", "birthdate"]
      return requiredFields.every((field) => parent[field].toString().trim() !== "")
    } else {
      // En modo creación, verificamos todos los campos requeridos
      const requiredFields = ["name", "last_name", "document_id", "birthdate", "gender"] // Email no es requerido
      return requiredFields.every((field) => parent[field].toString().trim() !== "")
    }
  }, [errors, parent, isEditing])

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!isSubmitting) {
          onClose()
          resetParentState()
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
        {isEditing ? "Editar Padre/Madre" : "Añadir Padre/Madre"}
      </DialogTitle>
      <DialogContent sx={{ padding: "24px", paddingTop: "24px !important" }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Nombre"
              name="name"
              value={parent.name}
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
              value={parent.last_name}
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
              label="DNI"
              name="document_id"
              value={parent.document_id}
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
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={parent.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiInputBase-root": { background: "#fff" } }}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Teléfono"
              name="phone"
              value={parent.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.phone && Boolean(errors.phone)}
              helperText={touched.phone && errors.phone}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiInputBase-root": { background: "#fff" } }}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Dirección"
              name="address"
              value={parent.address}
              onChange={handleChange}
              onBlur={handleBlur}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiInputBase-root": { background: "#fff" } }}
              disabled={isSubmitting}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Ciudad"
              name="city"
              value={parent.city}
              onChange={handleChange}
              onBlur={handleBlur}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiInputBase-root": { background: "#fff" } }}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="País"
              name="country"
              value={parent.country}
              onChange={handleChange}
              onBlur={handleBlur}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiInputBase-root": { background: "#fff" } }}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nacionalidad"
              name="nationality"
              value={parent.nationality}
              onChange={handleChange}
              onBlur={handleBlur}
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
              value={parent.birthdate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.birthdate && Boolean(errors.birthdate)}
              helperText={touched.birthdate && errors.birthdate}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiInputBase-root": { background: "#fff" } }}
              disabled={isSubmitting}
              InputProps={{
                inputProps: {
                  max: new Date().toISOString().split("T")[0], // No permitir fechas futuras
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              select
              label="Género"
              name="gender"
              value={parent.gender}
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
              resetParentState()
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
          {isSubmitting ? "Guardando..." : "Guardar"}        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ParentsForm