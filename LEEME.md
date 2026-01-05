**Documentación Completa del Frontend**

## 📋 Tabla de Contenidos

- 1. Introducción
- 2. Arquitectura del Sistema
- 3. Estructura del Proyecto
- 4. Configuración y Requisitos
- 5. Funcionalidades Principales
- 6. Componentes Clave
- 7. Flujos de Trabajo
- 8. Integración con API
- 9. Estado Global y Contextos
- 10. Despliegue
- 11. Problemas Conocidos y Soluciones
- 12. Recomendaciones para Futuros Desarrolladores

## 1. Introducción

El **Sistema de Gestión de Cursos SuperlearnerPeru** es una aplicación web diseñada para facilitar la administración de cursos, estudiantes, voluntarios y procesos administrativos para la ONG SuperlearnerPeru. El objetivo principal es mejorar la experiencia educativa mediante un sistema intuitivo y eficiente.

### Propósito

Esta aplicación sirve como una herramienta integral para gestionar:

- Estudiantes y sus información personal
- Padres/Madres de los estudiantes
- Voluntarios y profesores
- Cursos y asistencias
- Reportes y análisis de datos

### Audiencia Objetivo

- Administradores de la ONG SuperlearnerPeru
- Profesores y voluntarios
- Personal administrativo

## 2. Arquitectura del Sistema

### Frontend

- **Framework**: React.js con Vite como bundler
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router DOM v6
- **Estado Global**: Contextos de React
- **Formularios**: Formularios controlados por React
- **Notificaciones**: React-Toastify y SweetAlert2

### Backend

- **Framework**: Python FastAPI
- **Hosting**: Google Cloud Run
- **URL Base**: `https://backend-superlearner-1083661745884.us-central1.run.app/`

### Infraestructura

- **Contenedorización**: Docker con Nginx
- **Despliegue**: Google Cloud Run
- **URL Frontend**: `https://front-as-sl-426148382897.southamerica-west1.run.app/`

### Diagrama de Arquitectura

```
┌────────────────────┐      ┌─────────────────┐      ┌────────────────┐
│                    │      │                 │      │                │
│  React Frontend    │─────►│  FastAPI        │─────►│  Database      │
│  (Material-UI)     │◄─────│  Backend        │◄─────│  (MySQL)       │
│                    │      │                 │      │                │
└────────────────────┘      └─────────────────┘      └────────────────┘
         ▲
         │
         ▼
┌────────────────────┐
│                    │
│  Nginx             │
│  (Servidor Web)    │
│                    │
└────────────────────┘
         ▲
         │
         ▼
┌────────────────────┐
│                    │
│  Docker Container  │
│                    │
└────────────────────┘
         ▲
         │
         ▼
┌────────────────────┐
│                    │
│  Google Cloud Run  │
│                    │
└────────────────────┘
```

## 3. Estructura del Proyecto

```
SL_frontend/
├── public/               # Archivos públicos estáticos
├── src/                  # Código fuente principal
│   ├── api/              # Servicios y configuración de API
│   ├── assets/           # Imágenes y recursos estáticos
│   │   ├── images/
│   │   └── third-party/
│   ├── components/       # Componentes reutilizables
│   ├── context/          # Contextos globales (Ej: UserContext)
│   ├── contexts/         # Contextos adicionales (auth-reducer)
│   ├── hooks/            # Custom hooks (Ej: handleLogout)
│   ├── layout/           # Componentes de layout (Dashboard, MinimalLayout)
│   ├── menu-items/       # Configuración de menús de navegación
│   ├── pages/            # Páginas principales y rutas
│   │   ├── authentication/
│   │   ├── dashboard/
│   │   │   ├── courses/
│   │   │   │   └── attendance/
│   │   │   ├── excels/
│   │   │   ├── metrics/
│   │   │   ├── register-parents/
│   │   │   ├── register-student/
│   │   │   ├── students/
│   │   │   └── volunteers/
│   ├── routes/           # Configuración de rutas
│   ├── themes/           # Configuración de temas y estilos
│   ├── utils/            # Utilidades y funciones helper
│   ├── App.jsx           # Componente principal de la aplicación
│   ├── config.js         # Configuración global
│   ├── index.jsx         # Punto de entrada de la aplicación
│   └── vite-env.d.js     # Tipos para Vite
├── .env                  # Variables de entorno
├── Dockerfile            # Configuración de Docker
├── nginx.conf            # Configuración de Nginx
├── package.json          # Dependencias y scripts
├── README.md             # Documentación básica
└── vite.config.mjs       # Configuración de Vite
```

## 4. Configuración y Requisitos

### Requisitos Previos

- Node.js 18.x o superior
- npm 9.x o superior
- Docker (para despliegue)

### Instalación y Configuración Local

1. **Clonar el repositorio**:

   ```bash
   git clone <repository-url>
   cd SL_frontend
   ```

2. **Instalar dependencias**:

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   Revisar el archivo .env y ajustar según sea necesario:

   ```
   VITE_APP_VERSION=v1.3.0
   GENERATE_SOURCEMAP=false
   PUBLIC_URL=https://front-as-sl-426148382897.southamerica-west1.run.app/
   VITE_APP_BASE_NAME=/
   VITE_API_URL=https://backend-superlearner-1083661745884.us-central1.run.app/
   ```

4. **Iniciar servidor de desarrollo**:

   ```bash
   npm run dev
   ```

5. **Construir para producción**:

   ```bash
   npm run build
   ```

6. **Vista previa de producción**:

   ```bash
   npm run preview
   ```

### Configuración de Docker

1. **Construir imagen**:

   ```bash
   docker build -t superlearner-frontend .
   ```

2. **Ejecutar contenedor**:

   ```bash
   docker run -p 8080:8080 superlearner-frontend
   ```

## 5. Funcionalidades Principales

### Gestión de Estudiantes

- **Registro de estudiantes**: Crear, actualizar y eliminar registros de estudiantes
- **Asignación de cursos**: Asociar estudiantes a cursos específicos
- **Filtrado y búsqueda**: Buscar estudiantes por nombre, apellido o documento de identidad
- **Administración de estado**: Activar o desactivar estudiantes

**Ubicación del código**:

- register-student
- students

### Gestión de Padres/Madres

- **CRUD completo**: Crear, leer, actualizar y eliminar registros de padres/madres
- **Validación de datos**: Verificación de campos obligatorios y formatos correctos
- **Asociación con estudiantes**: Vinculación con registros de estudiantes

**Ubicación del código**:

- register-parents

### Gestión de Voluntarios

- **Registro de voluntarios**: Crear, actualizar y eliminar perfiles de voluntarios
- **Asignación de roles**: Definir roles como administrador o profesor
- **Asignación de cursos**: Para voluntarios con rol de profesor
- **Gestión de estado**: Activar o desactivar voluntarios

**Ubicación del código**:

- volunteers

### Gestión de Asistencia

- **Registro de asistencia**: Marcar asistencia de estudiantes por sesión
- **Modificación de registros**: Actualizar registros de asistencia existentes
- **Exportación de datos**: Generar informes de asistencia en formato Excel
- **Múltiples estados**: Presente (P), Tarde (T), Ausente (A), Justificado (J)

**Ubicación del código**:

- attendance

### Reportes Excel

- **Reportes de gestión**: Diarios, semanales, mensuales o completos
- **Reportes de impacto**: Con configuración de umbral y período
- **Filtrado por curso**: Posibilidad de filtrar reportes por curso específico
- **Descarga automática**: Generación y descarga de archivos Excel

**Ubicación del código**:

- excels

### Métricas y Dashboard

- **Visualización de datos**: Gráficos y estadísticas sobre asistencia y cursos
- **Indicadores clave**: Promedio de estudiantes por curso y otras métricas relevantes

**Ubicación del código**:

- metrics

### Autenticación y Autorización

- **Login/Logout**: Sistema de autenticación basado en tokens
- **Control de acceso**: Diferentes niveles de acceso según rol
- **Persistencia de sesión**: Almacenamiento de token en localStorage

**Ubicación del código**:

- authentication
- auth-reducer

## 6. Componentes Clave

### Formularios

#### Formulario de Estudiante (StudentForm.jsx)

Componente para crear y editar información de estudiantes con validación completa.

**Características principales**:

- Validación de campos requeridos y formatos
- Soporte para edición y creación
- Gestión de estado de envío
- Manejo de errores
- Interfaz con Material-UI

**Ejemplo de uso**:

```jsx
<StudentForm 
  open={openDialog}
  onClose={() => setOpenDialog(false)}
  onSave={handleSave}
  student={currentStudent || initialStudentState}
  isEditing={Boolean(currentStudent && currentStudent.id)}
/>
```

#### Formulario de Padres/Madres (ParentsForm.jsx)

Componente similar para gestión de información de padres/madres.

#### Formulario de Voluntarios (VolunteerForm.jsx)

Gestión completa de voluntarios con validación y selección de roles.

**Características distintivas**:

- Selección de cursos condicionada al rol de profesor
- Validación específica para email y documento de identidad
- Selección de nacionalidad con Autocomplete

### Tablas y Listados

#### Tabla de Estudiantes (StudentsTable.jsx)

Visualización responsiva de estudiantes y su asistencia.

**Características principales**:

- Diseño responsivo con vista móvil y desktop
- Animaciones de transición
- Selección de asistencia con opciones visuales

#### Tabla de Voluntarios (VolunteerTable.jsx)

Listado de voluntarios con acciones de edición y cambio de estado.

### Componentes de Diálogo

#### Diálogos de Reportes (excels.jsx)

Configuración de parámetros para generación de reportes.

**Ejemplo**:

```jsx
<ManagementReportDialog 
  open={openManagementDialog}
  onClose={() => setOpenManagementDialog(false)}
  onDownload={handleDownloadManagementReport}
/>
```

### Componentes de Cabecera

#### Cabecera de Asistencia (AttendanceHeader.jsx)

Controles para gestionar asistencia y exportar datos.

**Características principales**:

- Búsqueda de estudiantes
- Botón para marcar todos presentes
- Exportación a Excel
- Modo de modificación

## 7. Flujos de Trabajo

### Flujo de Gestión de Estudiantes

1. **Lista de Estudiantes**: Visualización de todos los estudiantes
2. **Búsqueda y Filtrado**: Encontrar estudiantes específicos
3. **Añadir/Editar**: Abrir formulario para crear o modificar
4. **Validación**: Verificar campos requeridos y formatos
5. **Guardado**: Enviar datos al servidor y actualizar lista
6. **Cambio de Estado**: Activar/desactivar estudiantes según necesidad
7. **Asignación de Cursos**: Vincular estudiantes a cursos específicos

### Flujo de Registro de Asistencia

1. **Selección de Curso y Sesión**: Navegar a la página de asistencia
2. **Carga de Estudiantes**: Visualizar estudiantes del curso seleccionado
3. **Marcado de Asistencia**: Seleccionar estado para cada estudiante
4. **Guardar Asistencia**: Enviar datos al servidor
5. **Modificación (si es necesario)**: Habilitar modo de modificación
6. **Exportación**: Generar reporte Excel de asistencia

### Flujo de Generación de Reportes

1. **Selección de Tipo**: Elegir entre reporte de gestión o impacto
2. **Configuración de Parámetros**: Definir período, fecha, curso, etc.
3. **Generación**: Solicitar datos al servidor
4. **Descarga**: Recibir archivo Excel y guardarlo localmente

## 8. Integración con API

### URLs Base

- **Backend Principal**: `https://backend-superlearner-1083661745884.us-central1.run.app/`

### Endpoints Principales

#### Autenticación

- **Login**: `/api/user/login`

  ```javascript
  // Ejemplo de llamada
  const response = await fetch(`${BASE_URL}/api/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  ```

#### Estudiantes

- **Listar estudiantes**: `/api/students/` (GET con parámetros opcionales `?page=1&pageSize=10`)
- **Crear estudiante**: `/api/students/` (POST)
- **Detalles de estudiante**: `/api/students/{id}/` (GET)
- **Actualizar estudiante**: `/api/students/{id}/` (PUT - completo) o PATCH (parcial)
- **Cambiar estado**: `/api/students/{id}/` (PATCH con `{status: 0 o 1}`)
- **Asignar cursos**: `/api/students/{id}/courses/` (POST con `{course_ids: [1,2,3]}`)
- **Remover cursos**: `/api/students/{id}/courses/` (DELETE con `{course_ids: [1,2,3]}`)
- **Eliminar estudiante**: `/api/students/{id}/` (DELETE)

#### Padres/Madres

- **Listar padres**: `/api/parents/` (GET)
- **Crear padre**: `/api/parents/` (POST)
- **Detalles de padre**: `/api/parents/{id}/` (GET)
- **Actualizar padre**: `/api/parents/{id}/` (PUT)
- **Cambiar estado**: `/api/parents/toggle-status/` (PUT con `?parent_id=`)

#### Voluntarios

- **Listar voluntarios**: `/get_volunteers/`
- **Crear voluntario**: `/create_volunteer/`
- **Actualizar voluntario**: `/update_volunteer/`
- **Activar/desactivar**: `/disable_volunteer/` y `/enable_volunteer/`

#### Cursos y Asistencia

- **Listar cursos**: `/api/class/get_Courses`
- **Detalle de curso**: `/api/class/get_Courses_id/`
- **Asistencia**: `/api/student/create_session`

#### Reportes Excel

- **Reporte de gestión**: `/metricas/gestion/excel/`
- **Reporte de impacto**: `/metricas/impacto/excel/`

### Estructura de Autenticación

El sistema utiliza autenticación basada en token JWT:

```javascript
// Función helper para obtener headers con autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Token ${token}` })
  };
};
```

### Gestión de Errores

El manejo de errores sigue un patrón consistente:

```javascript
try {
  // Realizar petición
  const response = await fetch(url, options);
  
  if (!response.ok) {
    // Obtener detalles del error
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error en la operación");
  }
  
  return await response.json();
} catch (error) {
  console.error("Error:", error);
  // Mostrar notificación o manejar el error según el contexto
  throw error;
}
```

## 9. Estado Global y Contextos

### UserContext

Este contexto mantiene la información del usuario autenticado disponible a nivel global.

**Ubicación**: UserContext.jsx

**Uso**:

```jsx
import { useUser } from 'context/UserContext';

function MyComponent() {
  const { user, setUser } = useUser();
  // Usar user.name, user.role, etc.
}
```

### Auth Reducer

Sistema de reducers para manejar acciones relacionadas con autenticación.

**Ubicación**: auth-reducer

## 10. Despliegue

### Proceso de Build

1. **Generar build de producción**:

   ```bash
   npm run build
   ```

   Esto genera archivos optimizados en el directorio `dist/`.

2. **Construcción de imagen Docker**:

   ```bash
   docker build -t superlearner-frontend .
   ```

3. **Despliegue en Google Cloud Run**:
   Se configura en la consola de Google Cloud o mediante comandos gcloud.

### Configuración de Nginx

El archivo nginx.conf define:

- Puerto 8080 para servir la aplicación
- Configuración de caché y headers
- Tipos MIME para diferentes archivos
- Manejo de SPA con redirección a index.html

### Variables de Entorno para Producción

- `VITE_API_URL`: URL del backend API
- `PUBLIC_URL`: URL pública del frontend
- `VITE_APP_VERSION`: Versión de la aplicación

## 11. Problemas Conocidos y Soluciones

### Problemas con Actualización de Documentos

**Problema**: En algunos casos, la actualización de IDs de documentos puede no reflejarse inmediatamente.

**Solución**: Forzar una recarga completa de datos después de la operación:

```javascript
await updateStudent(student.id, updateData);
// Forzar una recarga completa de datos
fetchStudents(page, itemsPerPage);
```

### Respuestas Vacías del Servidor

**Problema**: En ocasiones, el servidor puede devolver respuestas vacías aunque la operación fue exitosa.

**Solución**: Manejo especial para respuestas vacías pero con status OK:

```javascript
if (!responseText || responseText.includes("success")) {
  // Si el API devuelve una respuesta vacía pero con status OK, consideramos que la operación fue exitosa
  return volunteerData.volunteer;
}
```

### Problemas de Responsividad en Tablas

**Problema**: Las tablas pueden no visualizarse correctamente en dispositivos móviles.

**Solución**: Implementación de vista alternativa para móviles:

```jsx
// Usar MediaQuery para detectar dispositivos móviles
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

// Renderizar componente apropiado
return isMobile ? <MobileView /> : <TableView />;
```

## 12. Recomendaciones para Futuros Desarrolladores

### Mejoras Prioritarias

1. **Refactorización de Formularios**: Implementar una librería como Formik o React Hook Form para simplificar la gestión de formularios y validaciones.

2. **Estado Global**: Considerar migrar a Redux Toolkit o Zustand para un manejo de estado más estructurado y predecible.

3. **Gestión de Errores**: Implementar un sistema centralizado de manejo de errores con errores tipados.

4. **Testing**: Añadir pruebas unitarias y de integración con Jest y React Testing Library.

5. **Optimización de Rendimiento**: Implementar memoización con `useMemo` y `useCallback` en componentes pesados.

### Buenas Prácticas a Seguir

1. **Componentes Atómicos**: Seguir descomponiendo componentes grandes en unidades más pequeñas y reutilizables.

2. **TypeScript**: Considerar migrar progresivamente a TypeScript para mejorar la seguridad de tipos y documentación en código.

3. **Documentación de Componentes**: Documentar props y comportamiento de componentes con JSDoc o Storybook.

4. **Manejo de Datos**: Implementar react-query o SWR para gestión de estado del servidor y caché.

5. **Arquitectura de Archivos**: Reorganizar hacia una estructura basada en características (feature-based) en lugar de tipos.

## Conclusión

El Sistema de Gestión de Cursos SuperlearnerPeru es una herramienta robusta que cubre las necesidades principales de administración educativa de la ONG. Si bien hay áreas que pueden mejorarse, el sistema proporciona una base sólida con un conjunto completo de funcionalidades para la gestión efectiva de estudiantes, voluntarios, cursos y reportes.

Esta documentación se proporciona como guía para futuros desarrolladores, facilitando la comprensión del sistema y su mantenimiento continuo.

---

**Fecha de última actualización**: 31 de mayo de 2025
**Versión de la documentación**: 1.0.0

Similar code found with 1 license type
