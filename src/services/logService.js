import api from './api'

export const logService = {
  getAccessLogs: async (params = {}) => {
    const response = await api.get('/api/logs/access', { params })
    return response.data
  },

  getSystemLogs: async (params = {}) => {
    const response = await api.get('/api/logs/system', { params })
    return response.data
  },
}
