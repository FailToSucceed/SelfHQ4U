'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { signOut } from '@/lib/auth'
import { useRouter } from 'next/navigation'

const developmentModules = [
  {
    id: 1,
    title: 'Values, Vision, Mission',
    description: 'Define your core values, craft a compelling vision, and establish your life mission.',
    progress: 25,
    icon: '⭐',
    color: 'bg-purple-500'
  },
  {
    id: 2,
    title: 'Body & Physique',
    description: 'Build strength, flexibility, and overall physical wellbeing through tailored practices.',
    progress: 40,
    icon: '❤️',
    color: 'bg-red-500'
  },
  {
    id: 3,
    title: 'Mind & Mental',
    description: 'Develop cognitive abilities, emotional intelligence, and mental resilience.',
    progress: 60,
    icon: '🧠',
    color: 'bg-blue-500'
  },
  {
    id: 4,
    title: 'Rest & Sleep',
    description: 'Optimize your rest patterns for recovery, rejuvenation, and peak performance.',
    progress: 30,
    icon: '🌙',
    color: 'bg-indigo-500'
  },
  {
    id: 5,
    title: 'Nutrition & Hydration',
    description: 'Fuel your body with intentional nutrition and proper hydration habits.',
    progress: 45,
    icon: '🥗',
    color: 'bg-green-500'
  },
  {
    id: 6,
    title: 'Social Interaction',
    description: 'Cultivate meaningful relationships and enhance your social intelligence.',
    progress: 35,
    icon: '👥',
    color: 'bg-yellow-500'
  },
  {
    id: 7,
    title: 'Time & Environment',
    description: 'Master time management and design environments that support your goals.',
    progress: 20,
    icon: '⏰',
    color: 'bg-teal-500'
  },
  {
    id: 8,
    title: 'Finance & Business',
    description: 'Build financial literacy and develop sustainable wealth creation strategies.',
    progress: 50,
    icon: '💰',
    color: 'bg-green-600'
  },
  {
    id: 9,
    title: 'Skills, Characteristics & Beliefs',
    description: 'Acquire valuable skills and develop empowering beliefs and characteristics.',
    progress: 15,
    icon: '🎯',
    color: 'bg-orange-500'
  }
]

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-lg">S</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-900">SelfHQ</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
              <a href="/dashboard" className="text-gray-900 font-medium">Dashboard</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
            </nav>
            
            {/* Desktop Profile & Actions */}
            <div className="hidden sm:flex items-center gap-3">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <span className="text-sm">👤 Profile</span>
              </button>
              <button
                onClick={handleSignOut}
                className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Sign Out
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              <nav className="flex flex-col space-y-4">
                <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
                <a href="/dashboard" className="text-gray-900 font-medium">Dashboard</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-3">
                    <span className="text-sm">👤 Profile</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Sign Out
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 lg:mb-12">Development Modules</h1>
        
        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {developmentModules.map((module) => (
            <div key={module.id} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              {/* Icon and Progress */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${module.color} rounded-xl flex items-center justify-center text-white text-lg sm:text-xl`}>
                  {module.icon}
                </div>
                <span className="text-xs sm:text-sm text-gray-500 font-medium">{module.progress}% Complete</span>
              </div>
              
              {/* Title and Description */}
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">{module.title}</h3>
              <p className="text-gray-600 text-sm mb-4 sm:mb-6 leading-relaxed">{module.description}</p>
              
              {/* Progress Bar */}
              <div className="mb-4 sm:mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-teal-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${module.progress}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Continue Button */}
              <button className="w-full flex items-center justify-between text-gray-900 font-medium hover:text-teal-600 transition-colors group py-2">
                <span className="text-sm sm:text-base">Continue</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}