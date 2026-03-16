import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

// Layout
import PageLayout from './components/layout/PageLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'

// Auth
import LoginPage from './components/auth/LoginPage'
import ResetPasswordPage from './components/auth/ResetPasswordPage'

// Dashboard
import DashboardPage from './components/dashboard/DashboardPage'

// Evidence
import EvidenceListPage from './components/evidence/EvidenceListPage'
import EvidenceUploadPage from './components/evidence/EvidenceUploadPage'

// Custody
import CustodyPage from './components/custody/CustodyPage'

// Logs
import AccessLogPage from './components/logs/AccessLogPage'
import SystemActivityPage from './components/logs/SystemActivityPage'

// Users
import UserListPage from './components/users/UserListPage'
import AddUserPage from './components/users/AddUserPage'

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected Routes — All Authenticated Users */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PageLayout>
                  <DashboardPage />
                </PageLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/evidence"
            element={
              <ProtectedRoute>
                <PageLayout>
                  <EvidenceListPage />
                </PageLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/evidence/upload"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Investigator']}>
                <PageLayout>
                  <EvidenceUploadPage />
                </PageLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/custody/:id"
            element={
              <ProtectedRoute>
                <PageLayout>
                  <CustodyPage />
                </PageLayout>
              </ProtectedRoute>
            }
          />

          {/* Logs — Admin and Auditor */}
          <Route
            path="/logs"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Auditor']}>
                <PageLayout>
                  <AccessLogPage />
                </PageLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/logs/system"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <PageLayout>
                  <SystemActivityPage />
                </PageLayout>
              </ProtectedRoute>
            }
          />

          {/* User Management — Admin Only */}
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <PageLayout>
                  <UserListPage />
                </PageLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/users/add"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <PageLayout>
                  <AddUserPage />
                </PageLayout>
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 catch-all */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center gap-4 text-center px-4">
                <h1 className="text-6xl font-bold text-gradient">404</h1>
                <p className="text-xl font-semibold text-white">Page Not Found</p>
                <p className="text-gray-400 text-sm">The page you're looking for doesn't exist.</p>
                <a href="/dashboard" className="btn-primary mt-2">Return to Dashboard</a>
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
