// api.js
const BASE_URL = 'https://backend-superlearner-1083661745884.us-central1.run.app/volunteers/teachers';

const getHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Accept': '*/*',
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json',
  };
};

export const getVolunteers = async () => {
  const response = await fetch(`${BASE_URL}/Get_Volunteers/`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch volunteers');
  return response.json();
};

export const updateVolunteer = async (volunteerData) => {
  const response = await fetch(`${BASE_URL}/update_volunteer/`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(volunteerData),
  });
  if (!response.ok) throw new Error('Failed to update volunteer');
  return response.json();
};

export const createVolunteer = async (volunteerData) => {

  const response = await fetch(`${BASE_URL}/create_volunteer/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(volunteerData),
  });

  if (!response.ok) {
    const errorResponse = await response.json();  // Obtén el cuerpo del error del servidor
    console.error('Error en la creación del voluntario:', errorResponse);  // Verifica qué errores está devolviendo el servidor
    throw new Error('Failed to create volunteer');
  }

  return response.json();
};


export const disableVolunteer = async (volunteerId) => {
  const response = await fetch(`${BASE_URL}/disable_volunteer/`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ volunteer_id: volunteerId }),
  });
  if (!response.ok) throw new Error('Failed to disable volunteer');
  return response.json();
};

export const enableVolunteer = async (volunteerId) => {
  const response = await fetch(`${BASE_URL}/enable_volunteer/`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ volunteer_id: volunteerId }),
  });
  if (!response.ok) throw new Error('Failed to enable volunteer');
  return response.json();
};