import api from './api'

export const evidenceService = {
  getEvidence: async (params = {}) => {
    const response = await api.get('/api/evidence', { params })
    return response.data
  },

  getEvidenceById: async (id) => {
    const response = await api.get(`/api/evidence/${id}`)
    return response.data
  },

  uploadEvidence: async (formData) => {
    const response = await api.post('/api/evidence/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  deleteEvidence: async (id) => {
    const response = await api.delete(`/api/evidence/${id}`)
    return response.data
  },
}
