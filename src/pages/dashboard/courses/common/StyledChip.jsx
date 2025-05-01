import { Chip } from '@mui/material';
import { styled, alpha } from '@mui/system';

const StyledChip = styled(Chip)(({ theme, bgcolor }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  backgroundColor: alpha(bgcolor || theme.palette.primary.main, 0.1),
  color: bgcolor || theme.palette.primary.main,
  '& .MuiChip-icon': {
    color: bgcolor || theme.palette.primary.main,
  },
}));

export default StyledChip;
