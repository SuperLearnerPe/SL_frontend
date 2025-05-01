import { Button } from '@mui/material';
import { styled, alpha } from '@mui/system';

const StyledButton = styled(Button)(({ theme, bgcolor }) => ({
  backgroundColor: bgcolor || theme.palette.primary.main,
  color: theme.palette.getContrastText(bgcolor || theme.palette.primary.main),
  '&:hover': {
    backgroundColor: alpha(bgcolor || theme.palette.primary.main, 0.8),
  },
}));

export default StyledButton;
