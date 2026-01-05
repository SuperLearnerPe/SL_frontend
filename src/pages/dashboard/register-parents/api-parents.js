const BASE_URL = import.meta.env.VITE_API_URL;

// Función para traducir nombres de campos al español
const translateFieldName = (fieldName) => {
  const translations = {
    'document_id': 'DNI',
    'name': 'Nombre',
    'last_name': 'Apellido',
    'email': 'Email',
    'phone': 'Teléfono',
    'address': 'Dirección',
    'city': 'Ciudad',
    'country': 'País',
    'nationality': 'Nacionalidad',
    'birthdate': 'Fecha de nacimiento',
    'gender': 'Género',
    'document_type': 'Tipo de documento',
  };
  return translations[fieldName] || fieldName;
};

// Función helper para obtener el token
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Token ${token}` })
  };
};

// Obtener todos los padres
export const getParents = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/parents/`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    return await response.json()
  } catch (error) {
    console.error("Error al obtener padres:", error)
    throw new Error("Error al cargar los padres")
  }
}

// Obtener un padre por ID
export const getParentById = async (parentId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/parents/${parentId}/`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      let errorMessage = "Error al obtener padre por ID";
      if (data && data.detail) {
        errorMessage = data.detail;
      }
      throw new Error(errorMessage)
    }
    return data
  } catch (error) {
    console.error("Error al obtener padre por ID:", error)
    throw error
  }
}

// Crear un nuevo padre
export const createParent = async (parentData) => {
  try {
    const formattedData = {
      ...parentData,
      email: parentData.email ? parentData.email : null
    };
    
    const response = await fetch(`${BASE_URL}/api/parents/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(formattedData),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      // Extraer mensajes de error del backend
      let errorMessage = "Error al crear el padre";
      
      if (data) {
        // Si hay errores de validación de campos específicos
        if (typeof data === 'object') {
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
        } else if (typeof data === 'string') {
          errorMessage = data;
        } else if (data.detail) {
          errorMessage = data.detail;
        }
      }
      
      throw new Error(errorMessage)
    }
    return data
  } catch (error) {
    console.error("Error al crear padre:", error)
    throw error
  }
}

// Actualizar un padre existente
export const updateParent = async (parentId, parentData) => {
  try {
    console.log("API update - parentId:", parentId);
    console.log("API update - parentData:", parentData);
    
    const formattedData = {
      name: parentData.name,
      last_name: parentData.last_name,
      document_id: parentData.document_id,
      email: parentData.email ? parentData.email : null,
      phone: parentData.phone || "",
      gender: parentData.gender,
      address: parentData.address || "",
      city: parentData.city || "",
      country: parentData.country || "",
      nationality: parentData.nationality || "",
      birthdate: parentData.birthdate,
      document_type: parentData.document_type || "DNI",
      ...(parentData.status !== undefined ? { status: parentData.status } : {})
    };
    
    console.log("Formatted data for API:", formattedData);
    
    const response = await fetch(`${BASE_URL}/api/parents/${parentId}/`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(formattedData),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      console.error("API error response:", data);
      
      // Extraer mensajes de error del backend
      let errorMessage = "Error al actualizar el padre";
      
      if (data) {
        // Si hay errores de validación de campos específicos
        if (typeof data === 'object') {
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
        } else if (typeof data === 'string') {
          errorMessage = data;
        } else if (data.detail) {
          errorMessage = data.detail;
        }
      }
      
      throw new Error(errorMessage)
    }
    return data;
  } catch (error) {
    console.error("Error al actualizar padre:", error);
    throw error;
  }
}

// Cambiar el estado de un padre (activar/desactivar)
export const toggleParentStatus = async (parentId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/parents/toggle-status/?parent_id=${parentId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      let errorMessage = "Error al cambiar el estado";
      if (data && data.detail) {
        errorMessage = data.detail;
      }
      throw new Error(errorMessage)
    }
    return data
  } catch (error) {
    console.error("Error al cambiar estado del padre:", error)
    throw error
  }
}

// Eliminar un padre (endpoint no disponible en el backend)
export const deleteParent = async (parentId) => {
  // Este endpoint no está implementado en el backend
  // Para "eliminar" un padre, use toggleParentStatus para desactivarlo
  console.warn('Delete endpoint not implemented. Use toggleParentStatus to deactivate.');
  throw new Error("Delete endpoint not implemented in backend");
  
  /* try {
    const response = await fetch(`${BASE_URL}/api/parents/${parentId}/`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    return await response.json()
  } catch (error) {
    console.error("Error al eliminar padre:", error)
    throw error
  } */
}