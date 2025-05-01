const BASE_URL = "https://backend-superlearner-1083661745884.us-central1.run.app"

export const getStudents = async (page = 1, pageSize = 10) => {
  try {
    const response = await fetch(`${BASE_URL}/api/students/get/?page=${page}&pageSize=${pageSize}`)
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
    const response = await fetch(`${BASE_URL}/api/students/get-id/?student_id=${studentId}`)
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    const data = await response.json()
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

    const response = await fetch(`${BASE_URL}/api/students/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Server error response:", errorData)
      if (errorData.detail === "No existe un padre con el DNI proporcionado.") {
        throw new Error("No existe un padre con el DNI proporcionado.")
      }
      throw new Error(errorData.detail || "Error al crear el estudiante")
    }

    const responseData = await response.json()
    // Asegurar que el status sea 1 en la respuesta
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
    // Siempre incluir document_id en los datos formateados
    const formattedData = {
      name: studentData.name,
      last_name: studentData.last_name,
      gender: studentData.gender,
      nationality: studentData.nationality || "",
      document_id: studentData.document_id,  // Always include document_id
      birthdate: studentData.birthdate,
      birth_info: {
        city: studentData.birth_city || "",
        country: studentData.birth_country || "",
      },
      // El email será opcional
      ...(studentData.email ? { email: studentData.email } : {}),
      // Conservar status si está presente
      ...(studentData.status !== undefined ? { status: studentData.status } : {})
    }

    console.log("Updating student with formatted data:", JSON.stringify(formattedData, null, 2))

    const response = await fetch(`${BASE_URL}/api/students/update/?student_id=${studentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Server error response for update:", errorData)
      throw new Error(errorData.detail || "Error al actualizar el estudiante")
    }

    const responseData = await response.json()
    console.log("Update response:", responseData)

    // Asegurar que el status sea 1 en la respuesta
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

// Update the toggleStudentStatus function to better handle the error
export const toggleStudentStatus = async (studentId) => {
  try {
    console.log("Toggling status for student ID:", studentId)
    
    const response = await fetch(`${BASE_URL}/api/students/toggle-status/?student_id=${studentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Log the raw response for debugging
    const responseText = await response.text();
    console.log("Raw response:", responseText);
    
    if (!response.ok) {
      console.error("Server error response status:", response.status);
      console.error("Server error response text:", responseText);
      
      // Try to parse as JSON if possible, otherwise use the text
      let errorMessage;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.detail || "Error al cambiar el estado del estudiante";
      } catch (parseError) {
        errorMessage = `Error del servidor: ${response.status} ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    // Try to parse the response as JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.warn("Could not parse response as JSON:", parseError);
      // Return a basic success object if we can't parse the response
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
    const response = await fetch(`${BASE_URL}/api/students/delete/?student_id=${studentId}`, {
      method: "DELETE",
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