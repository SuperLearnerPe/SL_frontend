
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';

import { useTheme } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import CardContent from '@mui/material/CardContent';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

import UserOutlined from '@ant-design/icons/UserOutlined';
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import avatar1 from 'assets/images/default.jpg';

import ProfileDialog from './ProfileDialog';
import SupportDialog from './SupportDialog';


export default function Profile() {
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [openSupportDialog, setOpenSupportDialog] = useState(false);

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const id_user = localStorage.getItem('id');
        const token = localStorage.getItem('access_token');
  
        const response = await axios.get('https://backend-superlearner-1083661745884.us-central1.run.app/api/user/Data_user/', {
          params: { id_user },
          headers: {
            Accept: '*/*',
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
  
        if (response.data.length > 0) {
          setUserData(response.data);
          
        } else {
          console.error('No user data found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, []);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleOpenProfileDialog = () => {
    setOpenProfileDialog(true);
    setOpen(false);
  };

  const handleOpenSupportDialog = () => {
    setOpenSupportDialog(true);
    setOpen(false);
  };

  const handleLogout = () => {

    localStorage.removeItem('id');
    localStorage.removeItem('access_token');
    localStorage.removeItem('login_time');
  

    window.location.href = '/login';
  };

  const iconBackColorOpen = 'grey.100';

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: open ? iconBackColorOpen : 'transparent',
          borderRadius: 1,
          '&:hover': { bgcolor: 'secondary.lighter' },
          '&:focus-visible': { outline: `2px solid ${theme.palette.secondary.dark}`, outlineOffset: 2 }
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ p: 0.5 }}>
          <Avatar
            alt="profile user"
            src={userData && userData[0] ? userData[0].photo : avatar1}
            size="sm"
            sx={{ width: 32, height: 32 }}
          />
          <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
            {userData && userData[0] ? `${userData[0].name} ${userData[0].last_name}` : 'Usuario'}
          </Typography>
        </Stack>
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position="top-right" in={open} {...TransitionProps}>
            <Paper sx={{ boxShadow: theme.customShadows.z1, width: 290, minWidth: 240, maxWidth: { xs: 250, md: 290 } }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard elevation={0} border={false} content={false}>
                  <CardContent sx={{ px: 2.5, pt: 3 }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Grid item>
                        <Stack direction="row" spacing={1.25} alignItems="center">
                          <Avatar 
                            alt="profile user" 
                            src={userData && userData[0] ? userData[0].photo : avatar1} 
                            sx={{ width: 32, height: 32 }} 
                          />
                          <Stack>
                            <Typography variant="h6">
                              {userData && userData[0] ? `${userData[0].name} ${userData[0].last_name}` : 'Usuario'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {userData && userData[0] ? userData[0].email: 'correo@ejemplo.com'}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>

                  <Box sx={{ borderTop: 1, borderColor: 'divider', mt: 1 }}>
                    <List>
                      <ListItem button onClick={handleOpenProfileDialog}>
                        <ListItemIcon>
                          <UserOutlined />
                        </ListItemIcon>
                        <ListItemText primary="Perfil" />
                      </ListItem>
                      <ListItem button onClick={handleOpenSupportDialog}>
                        <ListItemIcon>
                          <QuestionCircleOutlined />
                        </ListItemIcon>
                        <ListItemText primary="Soporte" />
                      </ListItem>
                      <ListItem button onClick={handleLogout}>
                        <ListItemIcon>
                          <LogoutOutlined />
                        </ListItemIcon>
                        <ListItemText primary="Salir" />
                      </ListItem>
                    </List>
                  </Box>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
      <ProfileDialog open={openProfileDialog} onClose={() => setOpenProfileDialog(false)} userData={userData} />
      <SupportDialog open={openSupportDialog} onClose={() => setOpenSupportDialog(false)} />
    </Box>
  );
}