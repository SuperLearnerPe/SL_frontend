import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Función para cargar datos del usuario desde el backend
  const fetchUserData = async () => {
    const id_user = localStorage.getItem('id');
    const token = localStorage.getItem('access_token');

    if (!id_user || !token) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/`, {
        params: { id_user },
        headers: {
          Accept: '*/*',
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (response.data.length > 0) {
        setUserData(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos del usuario al montar el componente o cuando cambia el token
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token && !userData) {
      fetchUserData();
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'role') {
        setRole(e.newValue);
      }
      if (e.key === 'access_token' || e.key === 'id') {
        // Si cambia el token o el id, recargar datos del usuario
        fetchUserData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <UserContext.Provider value={{ role, setRole, userData, setUserData, loading, refreshUserData: fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);