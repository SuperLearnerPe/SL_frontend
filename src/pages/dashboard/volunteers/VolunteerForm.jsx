import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Autocomplete, Box, Avatar } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale';
import { isValid, parseISO } from 'date-fns';
import countryList from 'react-select-country-list';
import { getCourses } from './api';
import { CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons';

export default function VolunteerForm({ open, onClose, onSave, volunteer, setVolunteer }) {
  const [errors, setErrors] = useState({});
  const [showCourseSelect, setShowCourseSelect] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  
  // Obtener la lista completa de países usando useMemo para optimizar
  const countries = useMemo(() => countryList().getData(), []);

  useEffect(() => {
    if (open) {
      setErrors({});
      const isTeacher = volunteer?.role === 2;
      setShowCourseSelect(isTeacher);
      
      // Cargar cursos desde la API
      if (isTeacher) {
        fetchCourses();
      }
      
      // Cargar preview del avatar si existe
      if (volunteer?.avatar_url) {
        const avatarUrlWithCache = `${volunteer.avatar_url}?v=${encodeURIComponent(volunteer.avatar_updated_at || Date.now())}`;
        setAvatarPreview(avatarUrlWithCache);
      } else {
        setAvatarPreview(null);
      }
      
      // Resetear archivo y flag de eliminación al abrir el formulario
      setAvatarFile(null);
      setRemoveAvatar(false);
    }
  }, [open, volunteer]);

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const coursesData = await getCourses();
      setCourses(coursesData || []);
    } catch (error) {
      console.error('Error al cargar cursos:', error);
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

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
      // Convertir a string ISO y tomar solo la parte de la fecha (YYYY-MM-DD)
      const isoDate = newValue.toISOString().split('T')[0];
      
      setVolunteer(prev => ({
        ...prev,
        birthdate: isoDate
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

  // Manejar cambio de país usando el nuevo formato
  const handleCountryChange = (event, newValue) => {
    setVolunteer(prev => ({
      ...prev,
      nationality: newValue ? newValue.label : ''
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
    // Añadir el archivo avatar y la bandera de eliminación al objeto volunteer antes de guardar
    const volunteerWithAvatar = { ...volunteer, avatarFile, removeAvatar };
    onSave(volunteerWithAvatar).finally(() => {
      setIsSaving(false);
    });
  };
  
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ 
          ...prev, 
          avatar: 'Solo se permiten archivos JPG, PNG o WEBP' 
        }));
        return;
      }
      
      // Validar tamaño (1MB máximo)
      const maxSize = 1 * 1024 * 1024; // 1MB
      if (file.size > maxSize) {
        setErrors(prev => ({ 
          ...prev, 
          avatar: `Archivo muy grande. Máximo 1MB. Tamaño actual: ${(file.size / (1024 * 1024)).toFixed(2)}MB` 
        }));
        return;
      }
      
      // Limpiar error si existía
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.avatar;
        return newErrors;
      });
      
      // Guardar el archivo
      setAvatarFile(file);
      
      // Crear preview local
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setRemoveAvatar(true); // Marcar para eliminación en el backend
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.avatar;
      return newErrors;
    });
  };

  // Función para encontrar el objeto de país basado en su nombre
  const findCountryObject = (countryName) => {
    if (!countryName) return null;
    return countries.find(country => country.label === countryName) || null;
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
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={countries}
              value={findCountryObject(volunteer.nationality)}
              onChange={handleCountryChange}
              getOptionLabel={(option) => option.label}
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
                value={volunteer.birthdate ? parseISO(volunteer.birthdate) : null}
                onChange={handleDateChange}
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    variant: "outlined",
                    fullWidth: true,
                    required: true,
                    inputProps: {
                      placeholder: "DD/MM/YYYY",
                    }
                  }
                }}
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
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Foto de Perfil
              </Typography>
              
              {avatarPreview && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar
                    src={avatarPreview}
                    sx={{ width: 100, height: 100 }}
                  />
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteOutlined />}
                    onClick={handleRemoveAvatar}
                  >
                    Eliminar Foto
                  </Button>
                </Box>
              )}
              
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadOutlined />}
                fullWidth
              >
                {avatarPreview ? 'Cambiar Foto' : 'Subir Foto'}
                <input
                  type="file"
                  hidden
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleAvatarChange}
                />
              </Button>
              
              {errors.avatar && (
                <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                  {errors.avatar}
                </Typography>
              )}
              
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                Formatos permitidos: JPG, PNG, WEBP. Tamaño máximo: 1MB
              </Typography>
            </Box>
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