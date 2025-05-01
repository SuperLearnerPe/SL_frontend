import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Send as SendIcon, Help as HelpIcon, Subject as SubjectIcon, Description as DescriptionIcon } from '@mui/icons-material';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '24px',
    backgroundColor: '#E3F2FD', // Fondo celeste claro
    overflow: 'hidden',
  },
}));

const StyledCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
}));

const StyledChip = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  backgroundColor: '#FFFFFF',
  borderRadius: '20px',
  padding: '12px 16px',
  margin: '8px 0',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
    marginTop: '4px',
    color: theme.palette.primary.main,
  },
}));

const SupportDialog = ({ open, onClose }) => {
  const [formData, setFormData] = useState({ subject: '', details: '' });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  const getHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
      'Accept': '*/*',
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const handleChange = (field, value) => setFormData({ ...formData, [field]: value });

  const handleSubmit = async () => {
    setLoading(true);
    const data = {
      subject: formData.subject,
      description: formData.details,
    };

    try {
      const response = await fetch('https://backend-superlearner-1083661745884.us-central1.run.app/api/suport/send_support/', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        
        setSnackbar({
          open: true,
          message: 'Reclamo enviado con éxito',
          severity: 'success'
        });
        onClose(); // Cierra el diálogo si el envío es exitoso
      } else {
        setSnackbar({
          open: true,
          message: 'Error al enviar el reclamo',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setSnackbar({
        open: true,
        message: 'Error en la red. No se pudo enviar el reclamo.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <StyledDialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <StyledCard>
          <DialogTitle>
            <Typography variant="h5" align="center" fontWeight="bold" color="primary">
              <HelpIcon fontSize="large" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              Soporte
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <StyledChip>
                  <SubjectIcon />
                  <TextField
                    value={formData.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    fullWidth
                    variant="standard"
                    placeholder="Asunto"
                    InputProps={{ style: { color: 'inherit' } }}
                  />
                </StyledChip>
              </Grid>
              <Grid item xs={12}>
                <StyledChip>
                  <DescriptionIcon />
                  <TextField
                    value={formData.details}
                    onChange={(e) => handleChange('details', e.target.value)}
                    fullWidth
                    variant="standard"
                    multiline
                    rows={4}
                    placeholder="Detalles de tu consulta"
                    InputProps={{ style: { color: 'inherit' } }}
                  />
                </StyledChip>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions style={{ justifyContent: 'space-between', padding: '16px' }}>
            <Button onClick={onClose} variant="outlined" color="primary" sx={{ borderRadius: '20px' }}>
              Cancelar
            </Button>
            <IconButton 
              onClick={handleSubmit} 
              size="large" 
              sx={{ 
                bgcolor: theme => theme.palette.primary.main, 
                color: 'white',
                '&:hover': {
                  bgcolor: theme => theme.palette.primary.dark,
                },
                borderRadius: '50%',
              }}
              disabled={loading} // Desactiva el botón mientras se envía
            >
              <SendIcon />
            </IconButton>
          </DialogActions>
        </StyledCard>
      </StyledDialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SupportDialog;
