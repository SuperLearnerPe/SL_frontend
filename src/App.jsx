import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Project import
import router from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { UserProvider } from './context/UserContext';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <UserProvider>
      <ThemeCustomization>
        <ScrollTop>
          <RouterProvider router={router} />
          <ToastContainer />
        </ScrollTop>
      </ThemeCustomization>
    </UserProvider>
  );
}