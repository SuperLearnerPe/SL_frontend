import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Avatar,
  Typography,
  Box,
  Fade
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Person as PersonIcon, Email as EmailIcon, Phone as PhoneIcon, Work as WorkIcon } from '@mui/icons-material';

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
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  borderRadius: '20px',
  padding: '8px 16px',
  margin: '8px 0',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

const ProfileDialog = ({ open, onClose, userData }) => {
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    if (userData && userData.length > 0) {
      setProfileData(userData[0]);
    }
  }, [userData]);

  if (!profileData || Object.keys(profileData).length === 0) return null;

  const getIcon = (key) => {
    const icons = { name: PersonIcon, last_name: PersonIcon, email: EmailIcon, phone: PhoneIcon };
    const Icon = icons[key] || WorkIcon;
    return <Icon fontSize="small" />;
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <StyledCard>
        <DialogTitle>
          <Typography variant="h5" align="center" fontWeight="bold" color="primary">
            Perfil
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <Avatar
                alt={profileData.name}
                src={profileData.photo}
                sx={{ width: 100, height: 100, margin: 'auto', border: '4px solid #BBDEFB' }}
              />
            </Grid>
            {Object.entries(profileData).map(([key, value]) => (
              ['name', 'last_name', 'email', 'phone'].includes(key) && (
                <Grid item xs={12} key={key}>
                  <Fade in={true} timeout={500}>
                    <StyledChip>
                      {getIcon(key)}
                      <Typography variant="body2" style={{ flexGrow: 1 }}>{value}</Typography>
                    </StyledChip>
                  </Fade>
                </Grid>
              )
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" color="primary" sx={{ borderRadius: '20px' }}>
            Close
          </Button>
        </DialogActions>
      </StyledCard>
    </StyledDialog>
  );
};

export default ProfileDialog;
