import { Typography } from '@mui/material';
import { styled, alpha } from '@mui/system';

const SessionLabel = styled(Typography)(({ theme, bgcolor }) => ({
  display: 'inline-block',
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(bgcolor || theme.palette.primary.main, 0.1),
  color: bgcolor || theme.palette.primary.main,
  fontWeight: 'bold',
  marginBottom: theme.spacing(1),
}));

export default SessionLabel;
