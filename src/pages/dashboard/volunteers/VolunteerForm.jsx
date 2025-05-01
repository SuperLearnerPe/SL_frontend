import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Autocomplete } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale';
import { format, isValid } from 'date-fns';

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

const countries = [
  "Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "Ecuador", "Paraguay", "Perú", "Uruguay", "Venezuela"
];

export default function VolunteerForm({ open, onClose, onSave, volunteer, setVolunteer }) {
  const [errors, setErrors] = useState({});
  const [showCourseSelect, setShowCourseSelect] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setErrors({});
      const isTeacher = volunteer?.role === 2;
      setShowCourseSelect(isTeacher);
    }
  }, [open, volunteer]);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
      case 'last_name':
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          error = 'Solo se permiten letras y espacios';
        }
        break;
      case 'personal_email':
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Email inválido';
        }
        break;
      case 'phone':
        if (!/^\d{9}$/.test(value)) {
          error = 'Debe contener 9 dígitos';
        }
        break;
      case 'document_id':
        if (!/^\d{8,12}$/.test(value)) {
          error = 'Debe contener entre 8 y 12 dígitos';
        }
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVolunteer(prev => ({ ...prev, [name]: value }));
    validateField(name, value);

    if (name === 'role') {
      const isTeacher = value === 2;
      setShowCourseSelect(isTeacher);
      if (!isTeacher) {
        setVolunteer(prev => ({ ...prev, course_ids: [] }));
      }
    }
  };

  const handleDateChange = (newValue) => {
    if (newValue && isValid(newValue)) {
      const formattedDate = format(newValue, 'yyyy-MM-dd');
      setVolunteer(prev => ({
        ...prev,
        birthdate: formattedDate
      }));
    } else {
      setVolunteer(prev => ({
        ...prev,
        birthdate: null
      }));
    }
  };

  const handleCourseChange = (event, newValue) => {
    const newCourseIds = newValue.map(course => course.id);
    setVolunteer(prev => ({
      ...prev,
      course_ids: newCourseIds
    }));
  };

  const isFormValid = () => {
    if (!volunteer) return false;
    const requiredFields = ['name', 'last_name', 'personal_email', 'email', 'phone', 'nationality', 'gender', 'document_type', 'document_id', 'birthdate', 'role'];
    if (volunteer.role === 2 && (!volunteer.course_ids || volunteer.course_ids.length === 0)) return false;
    return requiredFields.every(field => volunteer[field] && !errors[field]);
  };

  const handleSave = () => {
    setIsSaving(true);
    onSave(volunteer).finally(() => {
      setIsSaving(false);
    });
  };

  if (!volunteer) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h4" color="primary">
          {volunteer.id ? 'Editar Voluntario' : 'Añadir Voluntario'}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoFocus
              name="name"
              label="Nombre"
              fullWidth
              variant="outlined"
              value={volunteer.name || ''}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="last_name"
              label="Apellido"
              fullWidth
              variant="outlined"
              value={volunteer.last_name || ''}
              onChange={handleChange}
              error={!!errors.last_name}
              helperText={errors.last_name}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="personal_email"
              label="Email Personal"
              type="email"
              fullWidth
              variant="outlined"
              value={volunteer.personal_email || ''}
              onChange={handleChange}
              error={!!errors.personal_email}
              helperText={errors.personal_email}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="email"
              label="Email Institucional"
              type="email"
              fullWidth
              variant="outlined"
              value={volunteer.email || ''}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              required
              disabled={!!volunteer.id}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="phone"
              label="Teléfono"
              fullWidth
              variant="outlined"
              value={volunteer.phone || ''}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
              required
              inputProps={{ maxLength: 9 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={countries}
              value={volunteer.nationality || null}
              onChange={(event, newValue) => {
                setVolunteer(prev => ({ ...prev, nationality: newValue }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nacionalidad"
                  fullWidth
                  variant="outlined"
                  required
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Género</InputLabel>
              <Select
                name="gender"
                value={volunteer.gender || ''}
                onChange={handleChange}
              >
                <MenuItem value="Male">Masculino</MenuItem>
                <MenuItem value="Female">Femenino</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Tipo de Documento</InputLabel>
              <Select
                name="document_type"
                value={volunteer.document_type || ''}
                onChange={handleChange}
              >
                <MenuItem value="DNI">DNI</MenuItem>
                <MenuItem value="CARNET EX.">Carnet de Extranjería</MenuItem>
                <MenuItem value="PASAPORTE">Pasaporte</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="document_id"
              label="Número de Documento"
              fullWidth
              variant="outlined"
              value={volunteer.document_id || ''}
              onChange={handleChange}
              error={!!errors.document_id}
              helperText={errors.document_id}
              required
              inputProps={{ maxLength: 12 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <DatePicker
                label="Fecha de Nacimiento"
                value={volunteer.birthdate ? new Date(volunteer.birthdate) : null}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    required
                    inputProps={{
                      ...params.inputProps,
                      placeholder: "YYYY-MM-DD",
                      readOnly: true
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Rol</InputLabel>
              <Select
                name="role"
                value={volunteer.role || ''}
                onChange={handleChange}
              >
                <MenuItem value={1}>Admin</MenuItem>
                <MenuItem value={2}>Profesor</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {(showCourseSelect || volunteer.role === 2) && (
            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                options={courses}
                getOptionLabel={(option) => option.name}
                value={courses.filter(course => volunteer.course_ids?.includes(course.id))}
                onChange={handleCourseChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Cursos"
                    placeholder="Selecciona hasta 4 cursos"
                    required={volunteer.role === 2}
                  />
                )}
                limitTags={4}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.name}
                  </li>
                )}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              name="photo"
              label="URL de la Foto"
              fullWidth
              variant="outlined"
              value={volunteer.photo || ''}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary" disabled={!isFormValid() || isSaving}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}