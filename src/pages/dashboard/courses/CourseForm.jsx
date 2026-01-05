import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const categories = ['Matemáticas', 'Inglés', 'Ciencias', 'Literatura', 'Historia', 'Arte', 'Música', 'Deportes', 'Tecnología', 'Otros'];

export default function CourseForm({ open, onClose, onSave, initialCourse }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    day: '',
    start_time: '',
    end_time: '',
    color: '#1976d2',
    status: 1,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialCourse && Object.keys(initialCourse).length > 0) {
      setFormData({
        name: initialCourse.name || '',
        category: initialCourse.category || '',
        day: initialCourse.day || '',
        start_time: initialCourse.start_time || '',
        end_time: initialCourse.end_time || '',
        color: initialCourse.color || '#1976d2',
        status: initialCourse.status !== undefined ? initialCourse.status : 1,
      });
    } else {
      setFormData({
        name: '',
        category: '',
        day: '',
        start_time: '',
        end_time: '',
        color: '#1976d2',
        status: 1,
      });
    }
    setErrors({});
  }, [initialCourse, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre del curso es requerido';
    if (!formData.category.trim()) newErrors.category = 'La categoría es requerida';
    if (!formData.day) newErrors.day = 'El día es requerido';
    if (!formData.start_time) newErrors.start_time = 'La hora de inicio es requerida';
    if (!formData.end_time) newErrors.end_time = 'La hora de fin es requerida';

    // Validar que la hora de fin sea después de la hora de inicio
    if (formData.start_time && formData.end_time && formData.start_time >= formData.end_time) {
      newErrors.end_time = 'La hora de fin debe ser después de la hora de inicio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      category: '',
      day: '',
      start_time: '',
      end_time: '',
      color: '#1976d2',
      status: 1,
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {initialCourse && initialCourse.id ? 'Editar Curso' : 'Agregar Nuevo Curso'}
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre del Curso"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Categoría"
              name="category"
              value={formData.category}
              onChange={handleChange}
              error={!!errors.category}
              helperText={errors.category}
              required
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Día de la Semana"
              name="day"
              value={formData.day}
              onChange={handleChange}
              error={!!errors.day}
              helperText={errors.day}
              required
            >
              {daysOfWeek.map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Hora Inicio"
              name="start_time"
              type="time"
              value={formData.start_time}
              onChange={handleChange}
              error={!!errors.start_time}
              helperText={errors.start_time}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Hora Fin"
              name="end_time"
              type="time"
              value={formData.end_time}
              onChange={handleChange}
              error={!!errors.end_time}
              helperText={errors.end_time}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Color"
              name="color"
              type="color"
              value={formData.color}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={handleClose} variant="outlined" color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {initialCourse && initialCourse.id ? 'Actualizar' : 'Crear Curso'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
