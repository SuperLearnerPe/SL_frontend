import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Swal from 'sweetalert2';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import AnimateButton from 'components/@extended/AnimateButton';

// context
import { useUser } from 'context/UserContext';

// ============================|| JWT - LOGIN ||============================ //

export default function AuthLogin({ isDemo = false }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  const { setRole } = useUser();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async (values, { setErrors }) => {
    try {
      const response = await axios.post(
        'https://backend-superlearner-1083661745884.us-central1.run.app/api/user/login/',
        // Send as JSON object instead of URLSearchParams
        {
          email: values.email,
          password: values.password,
        },
        {
          headers: {
            'Content-Type': 'application/json', 
          },
          withCredentials: true,
        }
      );

      // Log para inspeccionar la respuesta recibida

      const token = response.data?.token || '';
      const user = response.data?.user || {};
      const role = user.role ?? '0'; // Valor predeterminado en caso de que sea undefined
      const id = user.id ?? 'N/A';

      // Verificación extra

      if (!token || !id) {
        throw new Error('Datos incompletos recibidos del servidor.');
      }

      // Guarda los valores en localStorage
      const now = new Date().getTime();
      localStorage.setItem('access_token', token);
      localStorage.setItem('id', id);
      localStorage.setItem('login_time', now);
      localStorage.setItem('role', role.toString());

      // Update the role in the context
      setRole(role.toString());

      Swal.fire({
        title: 'Inicio de Sesión correcto',
        text: 'Has ingresado correctamente',
        icon: 'success',
        timer: 600,
        showConfirmButton: false,
      }).then(() => {
        navigate('/courses');
      });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      if (error.response && error.response.status === 403 && error.response.data.error === "This account is inactive.") {
        Swal.fire({
          title: 'Cuenta Inactiva',
          text: 'Esta cuenta está desactivada. Por favor, contacta al administrador.',
          icon: 'error',
        });
      } else {
        Swal.fire({
          title: 'Inicio de Sesión fallido',
          text: 'Inicio de sesión erróneo',
          icon: 'error',
        });
      }
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required'),
        })}
        onSubmit={handleLogin}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">Correo</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="voluntario@superlearnerperu.com"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Contraseña</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="********"
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="standard-weight-helper-text-password-login">
                    {errors.password}
                  </FormHelperText>
                )}
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Ingresar
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };