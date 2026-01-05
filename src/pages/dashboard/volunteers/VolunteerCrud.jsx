import React, { useState, useEffect } from 'react';
import { Container, Paper } from '@mui/material';
import { useUser } from 'context/UserContext';
import VolunteerList from './VolunteerList';
import VolunteerForm from './VolunteerForm';
import SearchAndFilterBar from './SearchAndFilterBar';
import ConfirmDialog from './ConfirmDialog';
import CustomSnackbar from './CustomSnackbar';
import { getVolunteers, updateVolunteer, createVolunteer, disableVolunteer, enableVolunteer, getCourses } from './api';

export default function Component() {
  const { refreshUserData } = useUser(); // Para refrescar datos del usuario después de actualizar
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('card');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentVolunteer, setCurrentVolunteer] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGender, setFilterGender] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const [isSaving, setIsSaving] = useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchVolunteers();
    fetchCourses();
  }, []);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const data = await getVolunteers();
      setVolunteers(data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al cargar voluntarios', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data || []);
    } catch (error) {
      console.error('Error al cargar cursos:', error);
      setCourses([]);
    }
  };

  const handleAddEdit = (volunteer = null) => {
    setCurrentVolunteer(
      volunteer || {
        name: '',
        last_name: '',
        personal_email: '',
        email: '',
        phone: '',
        photo: '',
        nationality: '',
        document_type: '',
        document_id: '',
        birthdate: '',
        gender: '',
        status: 1,
        role: 0,
        course_ids: []
      }
    );
    setOpenDialog(true);
  };

  const generatePassword = (volunteer) => {
    const { name, last_name, document_id } = volunteer;
    const namePart = name.substring(0, 2).toLowerCase();
    const lastNamePart = last_name.substring(0, 2).toLowerCase();
    const documentPart = document_id.substring(document_id.length - 4);
    return `${namePart}${lastNamePart}${documentPart}`;
  };

  const handleToggleStatus = async (volunteer) => {
    try {
      const toggleFunction = volunteer.status ? disableVolunteer : enableVolunteer;
      await toggleFunction(volunteer.id);
      const updatedVolunteers = volunteers.map((v) => (v.id === volunteer.id ? { ...v, status: !v.status } : v));
      setVolunteers(updatedVolunteers);
      setSnackbar({
        open: true,
        message: `Voluntario ${volunteer.status ? 'desactivado' : 'activado'} con éxito`,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error al ${volunteer.status ? 'desactivar' : 'activar'} voluntario`,
        severity: 'error'
      });
    }
  };

  const handleSave = async (volunteer) => {
    try {
      setIsSaving(true);

      // Crear FormData para soportar subida de archivos
      const formData = new FormData();
      
      // Datos del usuario
      const userData = {
        username: volunteer.name,
        email: volunteer.email,
        first_name: volunteer.name,
        last_name: volunteer.last_name
      };
      
      // Datos del voluntario
      const volunteerData = {
        name: volunteer.name,
        last_name: volunteer.last_name,
        personal_email: volunteer.personal_email,
        phone: volunteer.phone,
        nationality: volunteer.nationality,
        document_type: volunteer.document_type,
        document_id: volunteer.document_id,
        birthdate: volunteer.birthdate,
        gender: volunteer.gender,
        status: volunteer.status,
        role: volunteer.role
      };
      
      const courseIds = volunteer.role === 2 ? volunteer.course_ids : [];

      if (volunteer.id) {
        // Actualizar voluntario existente
        formData.append('volunteer_id', volunteer.id);
        formData.append('user_id', volunteer.user);
        formData.append('user', JSON.stringify(userData));
        formData.append('volunteer', JSON.stringify(volunteerData));
        formData.append('course_ids', JSON.stringify(courseIds));
        
        // Agregar avatar si existe
        if (volunteer.avatarFile) {
          formData.append('avatar', volunteer.avatarFile);
        }
        
        // Agregar flag para eliminar avatar si se marcó
        if (volunteer.removeAvatar) {
          formData.append('remove_avatar', 'true');
        }

        try {
          const updatedVolunteer = await updateVolunteer(formData);

          setVolunteers(
            volunteers.map((v) =>
              v.id === volunteer.id
                ? {
                    ...volunteer,
                    ...updatedVolunteer
                  }
                : v
            )
          );

          // Si el voluntario actualizado es el usuario actual, refrescar contexto
          const currentUserId = localStorage.getItem('id');
          if (volunteer.user && volunteer.user == currentUserId) {
            refreshUserData();
          }

          setSnackbar({ open: true, message: 'Voluntario actualizado con éxito', severity: 'success' });
          setOpenDialog(false);
        } catch (error) {
          console.error('Error específico al actualizar:', error);

          // Si el error es de comunicación pero probablemente se procesó correctamente
          if (error.message === 'Failed to fetch' || error.message === 'NetworkError') {
            setVolunteers(
              volunteers.map((v) =>
                v.id === volunteer.id
                  ? {
                      ...volunteer
                    }
                  : v
              )
            );
            setSnackbar({ open: true, message: 'Voluntario actualizado con éxito', severity: 'success' });
            setOpenDialog(false);
          } else {
            throw error;
          }
        }
      } else {
        // Crear nuevo voluntario
        userData.password = generatePassword(volunteer);
        
        formData.append('user', JSON.stringify(userData));
        formData.append('volunteer', JSON.stringify(volunteerData));
        formData.append('course_ids', JSON.stringify(courseIds));
        
        // Agregar avatar si existe
        if (volunteer.avatarFile) {
          formData.append('avatar', volunteer.avatarFile);
        }

        const newVolunteer = await createVolunteer(formData);
        setVolunteers([...volunteers, newVolunteer]);
        setSnackbar({ open: true, message: 'Voluntario añadido con éxito', severity: 'success' });
        setOpenDialog(false);
      }

      // Recargar los voluntarios para asegurar datos actualizados
      fetchVolunteers();
    } catch (error) {
      console.error('Error al guardar voluntario:', error);

      // Extraer mensajes de error específicos del backend
      let errorMessage = 'Error al guardar voluntario';

      if (error.details) {
        // Buscar el primer campo con error y mostrar su mensaje
        const errorFields = Object.keys(error.details);
        if (errorFields.length > 0) {
          const firstField = errorFields[0];
          const fieldErrors = error.details[firstField];

          // Traducir nombres de campos técnicos a español
          const fieldNames = {
            username: 'Nombre de usuario',
            email: 'Correo electrónico',
            document_id: 'Número de documento',
            password: 'Contraseña',
            phone: 'Teléfono',
            personal_email: 'Correo personal',
            role: 'Rol',
            course_ids: 'Cursos',
            avatar: 'Foto de perfil'
          };

          const fieldName = fieldNames[firstField] || firstField;
          const errorText = Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors;

          errorMessage = `${fieldName}: ${errorText}`;
        }
      }

      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredVolunteers = volunteers.filter(
    (volunteer) =>
      (volunteer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer?.personal_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer?.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === 'all' || volunteer?.status?.toString() === filterStatus) &&
      (filterGender === 'all' || volunteer?.gender?.toLowerCase() === filterGender.toLowerCase())
  );

  const paginatedVolunteers = filteredVolunteers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
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

      <VolunteerList
        volunteers={paginatedVolunteers}
        loading={loading}
        viewMode={viewMode}
        onEdit={handleAddEdit}
        onToggleStatus={handleToggleStatus}
        page={page}
        totalPages={Math.ceil(filteredVolunteers.length / itemsPerPage)}
        onPageChange={(event, value) => setPage(value)}
        courses={courses}
      />

      <VolunteerForm
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        volunteer={currentVolunteer}
        setVolunteer={setCurrentVolunteer}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={() => handleDelete(currentVolunteer?.id, currentVolunteer?.user)}
        title="Confirmar Eliminación"
        content={`¿Estás seguro de que quieres eliminar a ${currentVolunteer?.name} ${currentVolunteer?.last_name}? Esta acción no se puede deshacer.`}
      />

      <CustomSnackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Container>
  );
}
