import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import { useUser } from 'context/UserContext';

export default function Navigation() {
  const { role } = useUser();
  
  const navGroups = menuItem(role).items.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
}