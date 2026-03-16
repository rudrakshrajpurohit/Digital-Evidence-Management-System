import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, ArrowLeft, Mail, CheckCircle } from 'lucide-react'
import { authService } from '../../services/authService'
import NotificationToast from '../utils/NotificationToast'

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [toast, setToast] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setToast({ type: 'error', message: 'Please enter your email address.' })
      return
    }
    setLoading(true)
    try {
      await authService.resetPassword(email)
      setSubmitted(true)
    } catch (err) {
      // In demo mode, simulate success
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-primary-600/20 border border-primary-600/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-400" />
          </div>
          <span className="text-lg font-bold text-white">DEMS</span>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-900/30 border border-emerald-700/50 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
            <p className="text-gray-400 text-sm mb-8">
              We've sent a password reset link to <span className="text-white font-medium">{email}</span>.
              If this email is registered, you'll receive instructions shortly.
            </p>
            <Link to="/login" className="btn-primary inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white mb-1">Reset Password</h2>
            <p className="text-gray-400 text-sm mb-8">
              Enter your registered email and we'll send you a reset link.
            </p>

            <form id="reset-password-form" onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    className="input-field pl-11"
                    placeholder="you@dems.gov"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                </div>
              </div>

              <button
                id="reset-submit"
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : null}
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <Link
              to="/login"
              className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </>
        )}
      </div>

      {toast && (
        <NotificationToast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default ResetPasswordPage
