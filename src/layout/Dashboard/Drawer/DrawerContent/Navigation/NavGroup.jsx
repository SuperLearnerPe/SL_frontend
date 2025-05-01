import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NavGroup = ({ item }) => {
  const navigate = useNavigate();

  const handleClick = (item) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.url) {
      navigate(item.url);
    }
  };

  return (
    <List>
      {item.children.map((child) => (
        <ListItem button key={child.id} onClick={() => handleClick(child)}>
          {child.icon && <ListItemIcon>{<child.icon />}</ListItemIcon>}
          <ListItemText primary={child.title} />
        </ListItem>
      ))}
    </List>
  );
};

export default NavGroup;
