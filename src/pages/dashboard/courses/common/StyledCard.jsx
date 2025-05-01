import { Card } from '@mui/material';
import { styled, alpha } from '@mui/system';

const StyledCard = styled(Card)(({ theme, bgcolor }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: `0 8px 40px -12px ${alpha(bgcolor || theme.palette.primary.main, 0.3)}`,
  },
  backgroundColor: alpha(bgcolor || theme.palette.primary.main, 0.05),
  border: `1px solid ${alpha(bgcolor || theme.palette.primary.main, 0.1)}`,
  borderRadius: theme.shape.borderRadius * 2,
}));

export default StyledCard;
