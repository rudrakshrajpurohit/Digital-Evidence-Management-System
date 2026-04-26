import api from './api'

export const evidenceService = {
  getEvidence: async (params = {}) => {
    const response = await api.get('/evidence', { params })
    return response.data
  },

  getEvidenceById: async (id) => {
    const response = await api.get(`/evidence/${id}`)
    return response.data
  },

  uploadEvidence: async (formData) => {
    const response = await api.post('/evidence/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  deleteEvidence: async (id) => {
    // Delete is prohibited on backend natively, but maintaining method structure
    const response = await api.delete(`/evidence/${id}`)
    return response.data
  },

  verifyEvidence: async (id) => {
    const response = await api.post(`/evidence/${id}/verify`)
    return response.data
  },
}
