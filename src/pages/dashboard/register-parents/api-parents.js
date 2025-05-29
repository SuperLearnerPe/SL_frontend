const BASE_URL = "https://backend-superlearner-1083661745884.us-central1.run.app"

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
    const response = await fetch(`${BASE_URL}/api/parents/get/`, {
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
    const response = await fetch(`${BASE_URL}/api/parents/get-id/?parent_id=${parentId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    return await response.json()
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
    
    const response = await fetch(`${BASE_URL}/api/parents/create/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(formattedData),
    })
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    return await response.json()
  } catch (error) {
    console.error("Error al crear padre:", error)
    throw new Error("Error al crear el padre")
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
    
    const response = await fetch(`${BASE_URL}/api/parents/update/?parent_id=${parentId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(formattedData),
    })
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error("API error response:", errorData);
      throw new Error("Network response was not ok");
    }
    return await response.json();
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
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    return await response.json()
  } catch (error) {
    console.error("Error al cambiar estado del padre:", error)
    throw error
  }
}

// Eliminar un padre
export const deleteParent = async (parentId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/parents/delete/?parent_id=${parentId}`, {
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
  }
}