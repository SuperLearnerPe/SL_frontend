// material-ui
import { useTheme } from '@mui/material/styles';
import logo from '../../assets/images/SL.svg'; // Importa la imagen

// ==============================|| LOGO IMAGE ||============================== //

const Logo = () => {
  const theme = useTheme();

  return (
    // Usando <img> para mostrar el logo
    <img src={logo} alt="Superlearner logo" width='190' />
  );
};

export default Logo;
