'use client'

import { useState, useEffect } from 'react'
import { signIn } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Animated welcome messages
  const welcomeMessages = [
    'Welcome back, champion!', 'Ready to continue your journey?', 'Your transformation awaits!', 
    'Time to elevate your potential!', 'Welcome back, leader!', 'Continue building excellence!',
    'Your growth continues here!', 'Ready to unlock more potential?', 'Welcome back, achiever!',
    'Let\'s continue your success story!', 'Your development journey continues!', 'Welcome back, visionary!'
  ]
  const [currentMessage, setCurrentMessage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % welcomeMessages.length)
    }, 3000) // Change every 3 seconds

    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signIn(email, password)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-8 p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50">
      {/* Premium Header */}
      <div className="text-center mb-8">
        {/* Logo */}
        <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <span className="text-white font-bold text-2xl">S</span>
        </div>

        {/* Welcome Title */}
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        
        {/* Animated Welcome Message */}
        <p className="text-lg text-gray-600 mb-2">
          <span 
            className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent font-semibold transition-all duration-500 ease-in-out"
            key={currentMessage}
          >
            {welcomeMessages[currentMessage]}
          </span>
        </p>
        
        <p className="text-gray-500 text-sm">
          Continue your personal development journey
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            placeholder="Enter your password"
          />
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <button 
            type="button" 
            className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
          >
            Forgot your password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Signing you in...</span>
            </div>
          ) : (
            'Access Your SelfHQ'
          )}
        </button>
      </form>

      {/* Premium Features Reminder */}
      <div className="mt-8 p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border border-teal-200">
        <div className="text-center">
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-semibold">🚀 Ready to continue?</span>
          </p>
          <p className="text-xs text-gray-600">
            Access your personalized dashboard, track your habits, and continue your transformation journey.
          </p>
        </div>
      </div>

      {/* New User Link */}
      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          New to SelfHQ?{' '}
          <a 
            href="/register" 
            className="text-teal-600 hover:text-teal-700 font-semibold transition-colors"
          >
            Apply for access
          </a>
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}
    </div>
  )
}