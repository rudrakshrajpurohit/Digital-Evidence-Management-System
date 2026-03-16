import React, { createContext, useState, useEffect, useCallback } from 'react'

export const AuthContext = createContext(null)

const ROLES = {
  ADMIN: 'Admin',
  INVESTIGATOR: 'Investigator',
  FORENSIC_ANALYST: 'Forensic Analyst',
  AUDITOR: 'Auditor',
}

export { ROLES }

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Restore session from localStorage on mount
    try {
      const storedToken = localStorage.getItem('dems_token')
      const storedUser = localStorage.getItem('dems_user')
      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    } catch (err) {
      console.error('Failed to restore session:', err)
      localStorage.removeItem('dems_token')
      localStorage.removeItem('dems_user')
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback((userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('dems_token', authToken)
    localStorage.setItem('dems_user', JSON.stringify(userData))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('dems_token')
    localStorage.removeItem('dems_user')
  }, [])

  const isAuthenticated = Boolean(token && user)

  const hasRole = useCallback(
    (allowedRoles) => {
      if (!user) return false
      if (!allowedRoles || allowedRoles.length === 0) return true
      return allowedRoles.includes(user.role)
    },
    [user]
  )

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole,
    ROLES,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
