import api from './api'

export const custodyService = {
  getCustody: async (evidenceId) => {
    const response = await api.get(`/api/custody/${evidenceId}`)
    return response.data
  },

  addCustodyEntry: async (data) => {
    const response = await api.post('/api/custody', data)
    return response.data
  },
}
