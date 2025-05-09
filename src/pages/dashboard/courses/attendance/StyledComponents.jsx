import { TableContainer, TableCell, Radio, Box, Typography, Chip } from '@mui/material';
import { styled } from '@mui/system';

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(3),
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: theme.shape.borderRadius,
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
}));

export const StyledRadio = styled(Radio)(({ theme }) => ({
  '&.Mui-checked': {
    color: theme.palette.primary.main,
  },
}));

// Add a new component for the legend

export const AttendanceLegend = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        my: 2,
        p: 2,
        backgroundColor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1,
      }}
    >
      <Typography variant="subtitle2" sx={{ width: '100%', mb: 1 }}>
        Leyenda de Asistencia:
      </Typography>
      <Chip 
        label="P - PRESENT (Presente)" 
        sx={{ backgroundColor: 'success.light', color: 'success.contrastText' }}
      />
      <Chip 
        label="T - TARDY (Tarde)" 
        sx={{ backgroundColor: 'warning.light', color: 'warning.contrastText' }}
      />
      <Chip 
        label="A - ABSENT (Ausente)" 
        sx={{ backgroundColor: 'error.light', color: 'error.contrastText' }}
      />
      <Chip 
        label="J - JUSTIFIED (Justificado)" 
        sx={{ backgroundColor: 'info.light', color: 'info.contrastText' }}
      />
    </Box>
  );
};
