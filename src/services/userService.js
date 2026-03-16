import api from './api'

export const userService = {
  getUsers: async () => {
    const response = await api.get('/api/users')
    return response.data
  },

  createUser: async (data) => {
    const response = await api.post('/api/users', data)
    return response.data
  },

  updateRole: async (userId, role) => {
    const response = await api.patch(`/api/users/${userId}/role`, { role })
    return response.data
  },

  deactivateUser: async (userId) => {
    const response = await api.patch(`/api/users/${userId}/deactivate`)
    return response.data
  },
}
