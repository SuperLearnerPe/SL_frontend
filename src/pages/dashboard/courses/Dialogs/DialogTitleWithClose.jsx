import React from 'react';
import { DialogTitle, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function DialogTitleWithClose({ onClose, title, color }) {
  return (
    <DialogTitle sx={{ backgroundColor: color, color: 'white' }}>
      <Typography variant="h6" component="span">
        {title}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}
