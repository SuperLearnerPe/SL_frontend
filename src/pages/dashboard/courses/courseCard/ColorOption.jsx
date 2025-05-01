import { styled } from '@mui/system';

const ColorOption = styled('div')(({ color }) => ({
  width: 24,
  height: 24,
  borderRadius: '50%',
  backgroundColor: color,
  cursor: 'pointer',
  margin: 4,
  border: '2px solid white',
  boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.2)',
  },
}));

export default ColorOption;
