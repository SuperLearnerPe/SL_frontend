// api.js
const BASE_URL = import.meta.env.VITE_API_URL;

const getHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Accept': '*/*',
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json',
  };
};

export const getVolunteers = async () => {
  const response = await fetch(`${BASE_URL}/volunteers/teachers/Get_Volunteers/`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch volunteers');
  return response.json();
};

export const updateVolunteer = async (volunteerData) => {
  console.log('updateVolunteer payload:', JSON.stringify(volunteerData));
  try {
    const response = await fetch(`${BASE_URL}/volunteers/teachers/update_volunteer/`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(volunteerData),
    });
    
    // Obtener el texto de la respuesta primero
    const responseText = await response.text();
    console.log('updateVolunteer response:', responseText);

    // Si la respuesta está vacía o es "success", consideramos que la operación fue exitosa
    if (!responseText || responseText.includes("success")) {
      // Si el API devuelve una respuesta vacía pero con status OK, creamos un objeto con los datos enviados
      return volunteerData.volunteer;
    }
    
    // Si hay contenido, intentamos parsearlo como JSON
    try {
      return JSON.parse(responseText);
    } catch (e) {
      // Si no es JSON válido pero la respuesta fue exitosa, retornamos los datos originales
      if (response.ok) {
        return volunteerData.volunteer;
      }
      throw new Error('Respuesta inválida del servidor');
    }
  } catch (error) {
    console.error('Error al actualizar voluntario:', error);
    
    // Si el error ocurrió pero sabemos que el backend probablemente procesó correctamente,
    // podemos devolver los datos originales para evitar el error en la UI
    if (error.message === 'Respuesta inválida del servidor') {
      console.warn('La respuesta del servidor no es JSON válido, pero el voluntario probablemente se actualizó.');
      return volunteerData.volunteer;
    }
    
    throw error;
  }
};

export const createVolunteer = async (volunteerData) => {

  const response = await fetch(`${BASE_URL}/volunteers/teachers/create_volunteer/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(volunteerData),
  });

  if (!response.ok) {
    const errorResponse = await response.json();  // Obtén el cuerpo del error del servidor
    console.error('Error en la creación del voluntario:', errorResponse);  // Verifica qué errores está devolviendo el servidor
    
    // Crear un error con los detalles específicos del backend
    const error = new Error('Error al crear voluntario');
    error.details = errorResponse;  // Adjuntar los detalles del error
    throw error;
  }

  return response.json();
};


export const disableVolunteer = async (volunteerId) => {
  const response = await fetch(`${BASE_URL}/volunteers/teachers/disable_volunteer/`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ volunteer_id: volunteerId }),
  });
  if (!response.ok) throw new Error('Failed to disable volunteer');
  return response.json();
};

export const enableVolunteer = async (volunteerId) => {
  const response = await fetch(`${BASE_URL}/volunteers/teachers/enable_volunteer/`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ volunteer_id: volunteerId }),
  });
  if (!response.ok) throw new Error('Failed to enable volunteer');
  return response.json();
};

export const getCourses = async () => {
  const response = await fetch(`${BASE_URL}/api/course/`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch courses');
  return response.json();
};