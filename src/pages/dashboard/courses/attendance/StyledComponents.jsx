import { TableContainer, TableCell, Radio } from '@mui/material';
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
