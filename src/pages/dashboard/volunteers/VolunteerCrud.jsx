import React, { useState, useEffect } from 'react';
import { Container, Paper } from '@mui/material';
import VolunteerList from './VolunteerList';
import VolunteerForm from './VolunteerForm';
import SearchAndFilterBar from './SearchAndFilterBar';
import ConfirmDialog from './ConfirmDialog';
import CustomSnackbar from './CustomSnackbar';
import { getVolunteers, updateVolunteer, createVolunteer, disableVolunteer, enableVolunteer } from './api';

export default function Component() {
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

  useEffect(() => {
    fetchVolunteers();
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

  const handleAddEdit = (volunteer = null) => {
    setCurrentVolunteer(volunteer || {
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
    });
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
      const updatedVolunteers = volunteers.map(v => 
        v.id === volunteer.id ? { ...v, status: !v.status } : v
      );
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


      const commonData = {
        user: {
          username: volunteer.name,
          email: volunteer.email,
          first_name: volunteer.name,
          last_name: volunteer.last_name,
          is_superuser: volunteer.role === 1,
          is_staff: volunteer.role === 1,
          is_active: 1
        },
        volunteer: {
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
          photo: volunteer.photo || "",
          role: volunteer.role
        },
        course_ids: volunteer.role === 2 ? volunteer.course_ids : []
      };

      if (volunteer.id) {
        const updatedData = {
          volunteer_id: volunteer.id,
          user_id: volunteer.user,
          ...commonData
        };

        const updatedVolunteer = await updateVolunteer(updatedData);

        setVolunteers(volunteers.map(v => v.id === volunteer.id ? updatedVolunteer : v));
        setSnackbar({ open: true, message: 'Voluntario actualizado con éxito', severity: 'success' });
      } else {
        const newVolunteerData = {
          ...commonData,
          user: {
            ...commonData.user,
            password: generatePassword(volunteer)
          }
        };

        const newVolunteer = await createVolunteer(newVolunteerData);

        setVolunteers([...volunteers, newVolunteer]);
        setSnackbar({ open: true, message: 'Voluntario añadido con éxito', severity: 'success' });
      }
      setOpenDialog(false);
      fetchVolunteers(); 
    } catch (error) {
      console.error('Error al guardar voluntario:', error);
      setSnackbar({ open: true, message: 'Error al guardar voluntario', severity: 'error' });
    }
  };

  const filteredVolunteers = volunteers.filter(volunteer =>
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