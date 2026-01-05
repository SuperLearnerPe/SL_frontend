const BASE_URL = import.meta.env.VITE_API_URL;

// Función para traducir nombres de campos al español
const translateFieldName = (fieldName) => {
  const translations = {
    'document_id': 'DNI del estudiante',
    'parent_dni': 'DNI del padre/madre',
    'name': 'Nombre',
    'last_name': 'Apellido',
    'nationality': 'Nacionalidad',
    'birthdate': 'Fecha de nacimiento',
    'gender': 'Género',
    'birth_city': 'Ciudad de nacimiento',
    'birth_country': 'País de nacimiento',
    'email': 'Email',
    'detail': 'Detalle',
  };
  return translations[fieldName] || fieldName;
};

// Función helper para obtener el token
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token'); // O donde guardes tu token
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Token ${token}` })
  };
};

export const getStudents = async (page = 1, pageSize = 10) => {
  try {
    const response = await fetch(`${BASE_URL}/api/students/?page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    return await response.json()
  } catch (error) {
    console.error("There was a problem fetching the students:", error)
    throw error
  }
}

export const getStudentById = async (studentId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/students/${studentId}/`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      let errorMessage = "Error al obtener estudiante por ID";
      if (data && data.detail) {
        errorMessage = data.detail;
      }
      throw new Error(errorMessage)
    }
    return data
  } catch (error) {
    console.error("There was a problem fetching the student:", error)
    throw error
  }
}

export const createStudent = async (studentData) => {
  try {
    const formattedData = {
      name: studentData.name,
      last_name: studentData.last_name,
      parent_dni: studentData.parent_dni,
      nationality: studentData.nationality,
      document_type: "dni",
      document_id: studentData.document_id,
      birthdate: studentData.birthdate,
      gender: studentData.gender,
      status: 1,
      birth_info: {
        city: studentData.birth_city || "",
        country: studentData.birth_country || "",
      },
    }

    console.log("Creating student:", JSON.stringify(formattedData, null, 2))

    const response = await fetch(`${BASE_URL}/api/students/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(formattedData),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Server error response:", data)
      
      // Extraer mensajes de error del backend
      let errorMessage = "Error al crear el estudiante";
      
      if (data) {
        // Si es el error específico del DNI del padre
        if (data.detail) {
          errorMessage = data.detail;
        } 
        // Si hay errores de validación de campos específicos
        else if (typeof data === 'object' && !data.detail) {
          const errorMessages = [];
          for (const [field, messages] of Object.entries(data)) {
            const fieldName = translateFieldName(field);
            if (Array.isArray(messages)) {
              errorMessages.push(`${fieldName}: ${messages.join(', ')}`);
            } else if (typeof messages === 'string') {
              errorMessages.push(`${fieldName}: ${messages}`);
            }
          }
          if (errorMessages.length > 0) {
            errorMessage = errorMessages.join('\n');
          }
        }
      }
      
      throw new Error(errorMessage)
    }

    const responseData = data
    const correctedData = {
      ...responseData,
      status: 1,
    }
    return correctedData
  } catch (error) {
    console.error("There was a problem creating the student:", error)
    throw error
  }
}

export const updateStudent = async (studentId, studentData) => {
  try {
    const formattedData = {
      name: studentData.name,
      last_name: studentData.last_name,
      parent_dni: studentData.parent_dni,
      gender: studentData.gender,
      nationality: studentData.nationality || "",
      document_id: studentData.document_id,
      birthdate: studentData.birthdate,
      birth_info: {
        city: studentData.birth_city || "",
        country: studentData.birth_country || "",
      },
      ...(studentData.email ? { email: studentData.email } : {}),
      ...(studentData.status !== undefined ? { status: studentData.status } : {})
    }

    console.log("Updating student with formatted data:", JSON.stringify(formattedData, null, 2))

    const response = await fetch(`${BASE_URL}/api/students/${studentId}/`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(formattedData),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Server error response for update:", data)
      
      // Extraer mensajes de error del backend
      let errorMessage = "Error al actualizar el estudiante";
      
      if (data) {
        if (data.detail) {
          errorMessage = data.detail;
        } else if (typeof data === 'object') {
          const errorMessages = [];
          for (const [field, messages] of Object.entries(data)) {
            const fieldName = translateFieldName(field);
            if (Array.isArray(messages)) {
              errorMessages.push(`${fieldName}: ${messages.join(', ')}`);
            } else if (typeof messages === 'string') {
              errorMessages.push(`${fieldName}: ${messages}`);
            }
          }
          if (errorMessages.length > 0) {
            errorMessage = errorMessages.join('\n');
          }
        }
      }
      
      throw new Error(errorMessage)
    }

    const responseData = data
    console.log("Update response:", responseData)

    const correctedData = {
      ...responseData,
      status: 1,
    }
    return correctedData
  } catch (error) {
    console.error("There was a problem updating the student:", error)
    throw error
  }
}

export const toggleStudentStatus = async (studentId) => {
  try {
    console.log("Toggling status for student ID:", studentId)
    
    // Primero obtener el estudiante actual para saber su status
    const currentStudent = await getStudentById(studentId);
    const newStatus = currentStudent.status === 1 ? 0 : 1;
    
    const response = await fetch(`${BASE_URL}/api/students/${studentId}/`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: newStatus })
    })

    const responseText = await response.text();
    console.log("Raw response:", responseText);
    
    if (!response.ok) {
      console.error("Server error response status:", response.status);
      console.error("Server error response text:", responseText);
      
      let errorMessage;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.detail || "Error al cambiar el estado del estudiante";
      } catch (parseError) {
        errorMessage = `Error del servidor: ${response.status} ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.warn("Could not parse response as JSON:", parseError);
      responseData = { success: true, message: "Estado cambiado correctamente" };
    }
    
    console.log("Toggle status response:", responseData);
    return responseData;
  } catch (error) {
    console.error("There was a problem toggling student status:", error);
    throw error;
  }
}

export const deleteStudent = async (studentId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/students/${studentId}/`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Server error response:", errorData)
      throw new Error(errorData.detail || "Error al eliminar el estudiante")
    }

    return studentId
  } catch (error) {
    console.error("There was a problem deleting the student:", error)
    throw error
  }
}