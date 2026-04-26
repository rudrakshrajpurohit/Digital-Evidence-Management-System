import api from './api'

export const authService = {
  login: async (email, password) => {
    // FastAPI OAuth2 requires form data, and uses 'username' field for authentication
    const formData = new URLSearchParams()
    formData.append('username', email) // Mapping email to username for OAuth2
    formData.append('password', password)

    const response = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    
    // JWT token is returned, but we need to decode it to get the user payload
    const token = response.data.access_token
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    const payload = JSON.parse(jsonPayload)

    return {
      token: token,
      user: { name: payload.sub, role: payload.role, email: payload.sub }
    }
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
