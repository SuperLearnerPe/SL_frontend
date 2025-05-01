// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';

// project import
import Profile from './Profile';
import MobileSection from './MobileSection';



// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <Box 
      sx={{
        display: 'flex',
        justifyContent: 'space-between', // Mantiene el contenido a los lados
        alignItems: 'center',
        width: '100%'
      }}
    >
    
      
      <Box 
        sx={{
          display: 'flex',
          alignItems: 'center', 
          ml: 'auto' // Mueve este contenido al lado derecho
        }}
      >
        
        {!downLG && <Profile />} 
        {downLG && <MobileSection />} 
      </Box>
    </Box>
  );
}
