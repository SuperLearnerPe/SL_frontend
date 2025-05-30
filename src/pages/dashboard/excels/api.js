const BASE_URL = "https://backend-superlearner-1083661745884.us-central1.run.app";

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
 * @param {string} params.tipo - Type of report ('diario', 'semanal', 'mensual', 'completo')
 * @param {string} [params.fecha] - Specific date (for daily reports)
 * @param {string} [params.fecha_inicio] - Start date (for weekly reports)
 * @param {number} [params.mes] - Month number (for monthly reports)
 * @param {number} [params.anio] - Year (for monthly reports)
 * @param {number} [params.clase_id] - Class ID (optional filter)
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

    // Default tipo parameter if not provided
    if (!params.tipo) {
      queryParams.append('tipo', 'completo');
    }

    const url = `${BASE_URL}/metricas/gestion/excel/?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al descargar el reporte');
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