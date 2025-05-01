import { Card } from '@mui/material';
import { styled, alpha } from '@mui/system';

const SessionCard = styled(Card)(({ theme, bgcolor }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease-in-out',
  backgroundColor: alpha(bgcolor || theme.palette.primary.main, 0.05),
  border: `1px solid ${alpha(bgcolor || theme.palette.primary.main, 0.1)}`,
  '&:hover': {
    backgroundColor: alpha(bgcolor || theme.palette.primary.main, 0.1),
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 20px -8px ${alpha(bgcolor || theme.palette.primary.main, 0.2)}`,
  },
  borderRadius: theme.shape.borderRadius * 1.5,
}));

export default SessionCard;
