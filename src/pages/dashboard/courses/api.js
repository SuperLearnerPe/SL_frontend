const BASE_URL = import.meta.env.VITE_API_URL;

const getHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Accept': '*/*',
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json',
  };
};

export const getCourses = async () => {
  const response = await fetch(`${BASE_URL}/api/course/`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch courses');
  return response.json();
};

export const createCourse = async (courseData) => {
  const response = await fetch(`${BASE_URL}/api/course/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(courseData),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    console.error('Error en la creación del curso:', errorResponse);
    throw new Error('Failed to create course');
  }

  return response.json();
};

export const updateCourse = async (courseId, courseData) => {
  const response = await fetch(`${BASE_URL}/api/course/${courseId}/`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(courseData),
  });

  if (!response.ok) throw new Error('Failed to update course');
  return response.json();
};

export const deleteCourse = async (courseId) => {
  const response = await fetch(`${BASE_URL}/api/course/${courseId}/`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  
  if (!response.ok) throw new Error('Failed to delete course');
  return response.json();
};
