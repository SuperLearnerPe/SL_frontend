const BASE_URL = import.meta.env.VITE_API_URL;

// Función helper para obtener el token
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Token ${token}` })
  };
};

// Obtener todos los estudiantes con sus cursos
export const getAllStudentsWithCourses = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/students/`, {
      method: 'GET',
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error("Error al obtener los estudiantes")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching students with courses:", error)
    throw error
  }
}

// Asignar múltiples cursos a un estudiante
export const assignCoursesToStudent = async (studentId, classIds) => {
  try {
    const body = JSON.stringify({ course_ids: classIds })
    console.log("Enviando datos al endpoint de asignar cursos:", body)

    const response = await fetch(`${BASE_URL}/api/students/${studentId}/courses/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: body,
    })

    if (!response.ok) {
      throw new Error('Error al asignar los cursos')
    }

    return await response.json()
  } catch (error) {
    console.error("Error assigning courses to student:", error)
    throw error
  }
}

// Remover múltiples cursos de un estudiante
export const removeCoursesFromStudent = async (studentId, classIds) => {
  try {
    const body = JSON.stringify({ course_ids: classIds })
    console.log("Enviando datos al endpoint de remover cursos:", body)

    const response = await fetch(`${BASE_URL}/api/students/${studentId}/courses/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: body,
    })

    if (!response.ok) {
      throw new Error('Error al remover los cursos')
    }

    return await response.json()
  } catch (error) {
    console.error("Error removing courses from student:", error)
    throw error
  }
}