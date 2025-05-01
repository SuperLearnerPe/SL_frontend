import { Avatar } from '@mui/material';
import { styled, alpha } from '@mui/system';

const StyledAvatar = styled(Avatar)(({ theme, bgcolor }) => ({
  width: 80,
  height: 80,
  marginBottom: theme.spacing(2),
  backgroundColor: bgcolor || theme.palette.primary.main,
  boxShadow: `0 8px 20px -12px ${alpha(bgcolor || theme.palette.primary.main, 0.5)}`,
}));

export default StyledAvatar;
