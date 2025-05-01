import React, { useState } from 'react';
import axios from 'axios';
import { CardContent, Box, Typography, IconButton, Menu } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaletteIcon from '@mui/icons-material/Palette';
import { StyledCard, StyledAvatar, StyledButton, StyledChip } from '../common';
import ColorOption from './ColorOption';
import CourseDialog from '../Dialogs/CourseDialog';

const colorOptions = ['#1976d2', '#388e3c', '#d32f2f', '#f57c00', '#7b1fa2', '#c2185b'];

export default function CourseCard({ courseId, courseName, day, time, initialColor = '#1976d2', initialImage = null }) {
  const [colorMenuAnchor, setColorMenuAnchor] = useState(null);
  const [cardColor, setCardColor] = useState(initialColor);
  const [courseImage, setCourseImage] = useState(initialImage);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleColorMenuOpen = (event) => setColorMenuAnchor(event.currentTarget);
  const handleColorMenuClose = () => setColorMenuAnchor(null);

  const updateCardColor = async (color) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.post(
        'https://backend-superlearner-1083661745884.us-central1.run.app/api/class/update_color/',
        {
          class_id: courseId,
          color: color
        },
        {
          headers: {
            'Accept': '*/*',
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setCardColor(color);
      }
    } catch (error) {
      console.error('Error updating card color:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleColorChange = (color) => {
    updateCardColor(color);
    handleColorMenuClose();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCourseImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <StyledCard bgcolor={cardColor}>
        <CardContent>
          <Box display="flex" alignItems="center" flexDirection="column" position="relative">
            <StyledAvatar alt={courseName} src={courseImage} bgcolor={cardColor}>
              {!courseImage && courseName.charAt(0)}
            </StyledAvatar>
            <Typography variant="h6" component="div" align="center" gutterBottom color={cardColor}>
              {courseName}
            </Typography>
            <StyledChip
              icon={<CalendarTodayIcon />}
              label={`${day}`}
              bgcolor={cardColor}
            />
            <StyledChip
              icon={<AccessTimeIcon />}
              label={`${time}`}
              bgcolor={cardColor}
            />
          </Box>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <StyledButton variant="contained" bgcolor={cardColor} fullWidth sx={{ ml: 1 }} onClick={handleClickOpen}>
              Sesiones
            </StyledButton>
          </Box>
          <Box display="flex" justifyContent="center" mt={2}>
            <IconButton onClick={handleColorMenuOpen} sx={{ color: cardColor }}>
              <PaletteIcon />
            </IconButton>
          </Box>
        </CardContent>
      </StyledCard>

      <Menu
        anchorEl={colorMenuAnchor}
        open={Boolean(colorMenuAnchor)}
        onClose={handleColorMenuClose}
      >
        <Box display="flex" flexWrap="wrap" p={1}>
          {colorOptions.map((color) => (
            <ColorOption
              key={color}
              color={color}
              onClick={() => handleColorChange(color)}
            />
          ))}
        </Box>
      </Menu>

      <CourseDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        courseId={courseId}
        courseName={courseName}
        cardColor={cardColor}
        courseImage={courseImage}
        day={day}
        time={time}
      />
    </>
  );
}