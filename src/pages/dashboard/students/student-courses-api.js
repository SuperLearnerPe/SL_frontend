const BASE_URL = "https://backend-superlearner-1083661745884.us-central1.run.app"

// Obtener todos los estudiantes con sus cursos
export const getAllStudentsWithCourses = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/students/all-students-courses-info`)

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
    const body = JSON.stringify({ class_id: classIds })
    console.log("Enviando datos al endpoint de asignar cursos:", body)

    const response = await fetch(`${BASE_URL}/api/students/assign-courses/?student_id=${studentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
    const body = JSON.stringify({ class_id: classIds })
    console.log("Enviando datos al endpoint de remover cursos:", body)

    const response = await fetch(`${BASE_URL}/api/students/remove-courses/?student_id=${studentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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