// Archivo preparado para integrar endpoints reales en el futuro

// Obtener todos los cursos
export const getCourses = async () => {
    // Implementación futura con fetch real
    // Por ahora retornamos datos estáticos
    return [
      {
        id: 1,
        name: "Matemáticas",
        code: "MAT101",
        description: "Curso básico de matemáticas",
        capacity: 30,
        enrolled: 15,
      },
      {
        id: 2,
        name: "Lenguaje",
        code: "LEN101",
        description: "Curso de comunicación y lenguaje",
        capacity: 25,
        enrolled: 20,
      },
      {
        id: 3,
        name: "Ciencias",
        code: "CIE101",
        description: "Introducción a las ciencias naturales",
        capacity: 28,
        enrolled: 18,
      },
      {
        id: 4,
        name: "Historia",
        code: "HIS101",
        description: "Historia del Perú y el mundo",
        capacity: 35,
        enrolled: 25,
      },
      { id: 5, name: "Inglés", code: "ING101", description: "Inglés básico", capacity: 20, enrolled: 15 },
    ]
  }
  
  // Obtener un curso por ID
  export const getCourseById = async (courseId) => {
    const courses = await getCourses()
    return courses.find((course) => course.id === courseId)
  }
  
  // Asignar un curso a un estudiante
  export const assignCourseToStudent = async (studentId, courseId) => {
    // Implementación futura con fetch real
    console.log(`Asignando curso ${courseId} al estudiante ${studentId}`)
    return { success: true }
  }
  
  // Remover un curso de un estudiante
  export const removeCourseFromStudent = async (studentId, courseId) => {
    // Implementación futura con fetch real
    console.log(`Removiendo curso ${courseId} del estudiante ${studentId}`)
    return { success: true }
  }
  
  // Mover un estudiante de un curso a otro
  export const moveStudentBetweenCourses = async (studentId, fromCourseId, toCourseId) => {
    // Implementación futura con fetch real
    console.log(`Moviendo estudiante ${studentId} del curso ${fromCourseId} al curso ${toCourseId}`)
    return { success: true }
  }
  
  