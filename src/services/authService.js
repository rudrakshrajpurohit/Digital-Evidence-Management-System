import api from './api'

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/api/login', { email, password })
    return response.data
  },

  resetPassword: async (email) => {
    const response = await api.post('/api/auth/reset', { email })
    return response.data
  },

  setNewPassword: async (token, password) => {
    const response = await api.post('/api/auth/reset/confirm', { token, password })
    return response.data
  },
}
