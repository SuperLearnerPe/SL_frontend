const BASE_URL = import.meta.env.VITE_API_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Authorization': token ? `Token ${token}` : '',
    'Accept': '*/*',
  };
};

/**
 * Downloads management metrics Excel report
 * @param {Object} params - Report parameters
 * @param {string} params.tipo_reporte - Type of entity ('padres', 'estudiantes', 'voluntarios', 'cursos')
 * @param {string} [params.fecha_inicio] - Optional start date (YYYY-MM-DD). If omitted, no start date filter is applied
 * @param {string} [params.fecha_fin] - Optional end date (YYYY-MM-DD). If omitted, no end date filter is applied
 * @returns {Promise} - Promise that resolves to Blob for download
 */
export const downloadManagementExcel = async (params) => {
  try {
    // Build query string from params
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value);
      }
    });

    const url = `${BASE_URL}/metricas/management/excel-entidades/?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Error al descargar el reporte' }));
      throw new Error(errorData.error || 'Error al descargar el reporte');
    }

    return await response.blob();
  } catch (error) {
    console.error("Error downloading management Excel:", error);
    throw error;
  }
};

/**
 * Downloads impact metrics Excel report
 * @param {Object} params - Report parameters
 * @param {string} [params.periodo='mes'] - Period type
 * @param {number} [params.umbral=0.5] - Threshold value
 * @returns {Promise} - Promise that resolves to Blob for download
 */
export const downloadImpactExcel = async (params = {}) => {
  try {
    // Build query string with defaults
    const queryParams = new URLSearchParams();
    queryParams.append('periodo', params.periodo || 'mes');
    queryParams.append('umbral', params.umbral || 0.5);
    
    const url = `${BASE_URL}/metricas/impacto/excel/?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al descargar el reporte');
    }

    return await response.blob();
  } catch (error) {
    console.error("Error downloading impact Excel:", error);
    throw error;
  }
};