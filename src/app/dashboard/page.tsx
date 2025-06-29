'use client'

import { useState, useEffect } from 'react'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'
import { useAuth } from '@/contexts/AuthContext'
import { signOut } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import WelcomePopup from '@/components/onboarding/WelcomePopup'
import HabitModal from '@/components/habits/HabitModal'
import ActiveHabitsWidget from '@/components/habits/ActiveHabitsWidget'
import UserStatsWidget from '@/components/gamification/UserStatsWidget'
import ReflectionForm from '@/components/reflection/ReflectionForm'
import ResourceSuggestionForm from '@/components/resources/ResourceSuggestionForm'
import ResourcesList from '@/components/resources/ResourcesList'
import { getCurrentUserProfile } from '@/lib/profiles'
import type { UserProfile } from '@/types/profile'
import LifePlanningView from '@/components/planning/LifePlanningView'

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
  const [expandedModule, setExpandedModule] = useState<number | null>(null)
  const [showWelcomePopup, setShowWelcomePopup] = useState(false)
  const [isFirstTime, setIsFirstTime] = useState(false)
  const [showHabitModal, setShowHabitModal] = useState(false)
  const [selectedHabitCategory, setSelectedHabitCategory] = useState('general')
  const [activeTab, setActiveTab] = useState('overview')
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showLifePlanning, setShowLifePlanning] = useState(false)

  // Load user profile and check first-time visitor
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return
      
      try {
        const profile = await getCurrentUserProfile()
        setUserProfile(profile)
        
        // Check if first-time user
        if (!profile?.onboarding_completed) {
          setIsFirstTime(true)
          setShowWelcomePopup(true)
        }
      } catch (error) {
        console.error('Error loading user profile:', error)
        // Fallback to check onboarding status from old table structure
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', user.id)
            .single()

          if (error) {
            console.error('Error checking onboarding status:', error)
            return
          }

          // If onboarding_completed is null or false, show welcome popup
          if (!data?.onboarding_completed) {
            setIsFirstTime(true)
            setShowWelcomePopup(true)
          }
        } catch (fallbackError) {
          console.error('Error in checkFirstTimeUser:', fallbackError)
        }
      }
    }

    loadUserProfile()
  }, [user])


  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleStartAssessment = async () => {
    // Mark onboarding as completed
    await markOnboardingCompleted()
    setShowWelcomePopup(false)
    // Navigate to Values, Vision, Mission module
    setExpandedModule(1)
  }

  const handleSkipAssessment = async () => {
    // Mark onboarding as completed
    await markOnboardingCompleted()
    setShowWelcomePopup(false)
  }

  const markOnboardingCompleted = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user?.id)

      if (error) {
        console.error('Error updating onboarding status:', error)
      }
    } catch (error) {
      console.error('Error in markOnboardingCompleted:', error)
    }
  }

  const handleOpenHabitModal = (category: string = 'general') => {
    setSelectedHabitCategory(category)
    setShowHabitModal(true)
  }

  // Mock active habits data - replace with real data from Supabase
  const activeHabits = [
    {
      id: '1',
      title: 'Daily Meditation',
      frequency: 'daily' as const,
      streak: 7,
      lastCompleted: '2025-06-28',
      nextDue: '2025-06-29',
      category: 'Mind & Mental'
    },
    {
      id: '2',
      title: 'Morning Workout',
      frequency: 'daily' as const,
      streak: 3,
      nextDue: '2025-06-29',
      category: 'Body & Physique'
    },
    {
      id: '3',
      title: 'Weekly Review',
      frequency: 'weekly' as const,
      streak: 2,
      nextDue: '2025-07-01',
      category: 'Values, Vision, Mission'
    }
  ]

  const handleCompleteHabit = async (habitId: string) => {
    // TODO: Implement habit completion logic with Supabase
    console.log('Completing habit:', habitId)
    // Update streak, last_completed_at, next_due in database
  }

  // Mock user stats and leaderboard data
  const userStats = {
    totalPoints: 1250,
    longestStreak: 21,
    currentStreak: 7,
    habitsCompleted: 34,
    habitsCreated: 5,
    habitsUsedByOthers: 12,
    daysSignedInStreak: 14,
    reflectionsCompleted: 8,
    tasksCompleted: 23,
    level: 3,
    rank: 127,
    totalUsers: 2845
  }

  const leaderboard = [
    { id: 'user1', name: 'Sarah Chen', points: 3450, streak: 45, habitsCreated: 15, rank: 1 },
    { id: 'user2', name: 'Alex Johnson', points: 3200, streak: 38, habitsCreated: 12, rank: 2 },
    { id: 'user3', name: 'Maria Garcia', points: 2980, streak: 42, habitsCreated: 18, rank: 3 },
    { id: 'current-user', name: 'You', points: userStats.totalPoints, streak: userStats.currentStreak, habitsCreated: userStats.habitsCreated, rank: userStats.rank },
    { id: 'user4', name: 'David Kim', points: 2750, streak: 28, habitsCreated: 9, rank: 4 },
    { id: 'user5', name: 'Lisa Wang', points: 2600, streak: 35, habitsCreated: 14, rank: 5 }
  ]

  // Get next due habit/task
  const getNextDueItem = () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const dueTodayHabits = activeHabits.filter(h => new Date(h.nextDue).toDateString() === today.toDateString())
    if (dueTodayHabits.length > 0) {
      return { type: 'habit', title: dueTodayHabits[0].title, time: 'Due today' }
    }
    
    const upcomingHabits = activeHabits.filter(h => new Date(h.nextDue) > today)
    if (upcomingHabits.length > 0) {
      const next = upcomingHabits.sort((a, b) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime())[0]
      return { type: 'habit', title: next.title, time: new Date(next.nextDue).toLocaleDateString() }
    }
    
    return { type: 'task', title: 'Complete module assessment', time: 'Due in 2 days' }
  }

  const nextDueItem = getNextDueItem()

  const renderTabContent = (tab: string, currentModule: any) => {
    switch (tab) {
      case 'overview':
        return (
          <>
            {/* Module Overview */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Module Overview</h3>
              <p className="text-gray-600 mb-4">Key concepts and goals for this development area</p>
              <p className="text-gray-700 mb-6">
                This module focuses on helping you develop your {currentModule.title.toLowerCase()} through structured lessons, 
                assessments, and practical exercises. By the end, you'll have a clear understanding of how to 
                integrate these concepts into your daily life.
              </p>
              <h4 className="font-semibold text-gray-900 mb-3">What You'll Learn:</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Understand the importance of {currentModule.title.toLowerCase()} in your overall development</li>
                <li>• Learn practical techniques to improve in this area</li>
                <li>• Create an action plan tailored to your personal situation</li>
                <li>• Track your progress and adapt as you grow</li>
              </ul>
            </div>

            {/* Your Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Your Progress</h3>
              <p className="text-gray-600 mb-6">Current status and next steps</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Lessons Completed</span>
                  <span className="font-medium">2 / 4</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-teal-500 to-purple-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Assessment</span>
                  <span className="text-orange-600 font-medium">Incomplete</span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Recommended Next Steps:</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Complete the module assessment to establish your baseline and receive personalized recommendations.
                  </p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenHabitModal(currentModule.title)}
                      className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Habit
                    </button>
                    <button
                      onClick={() => handleOpenHabitModal(currentModule.title)}
                      className="bg-white border border-teal-500 text-teal-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-teal-50 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Browse
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )

      case 'habits':
        return (
          <>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Habits for {currentModule.title}</h3>
              <p className="text-gray-600 mb-6">Build lasting habits in this development area</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => handleOpenHabitModal(currentModule.title)}
                  className="p-4 border-2 border-dashed border-teal-300 rounded-xl hover:border-teal-500 transition-colors flex flex-col items-center justify-center gap-2 text-center"
                >
                  <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="font-medium text-teal-600">Create Habit</span>
                  <span className="text-xs text-gray-500">Build a custom habit</span>
                </button>
                
                <button
                  onClick={() => handleOpenHabitModal(currentModule.title)}
                  className="p-4 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 transition-colors flex flex-col items-center justify-center gap-2 text-center"
                >
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="font-medium text-blue-600">Search Habits</span>
                  <span className="text-xs text-gray-500">Find existing habits</span>
                </button>
                
                <button className="p-4 border-2 border-dashed border-purple-300 rounded-xl hover:border-purple-500 transition-colors flex flex-col items-center justify-center gap-2 text-center">
                  <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span className="font-medium text-purple-600">AI Suggest</span>
                  <span className="text-xs text-gray-500">Get AI recommendations</span>
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Active Habits</h3>
              <div className="space-y-3">
                {activeHabits.filter(h => h.category === currentModule.title).map(habit => (
                  <div key={habit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{habit.title}</h4>
                      <p className="text-sm text-gray-500">🔥 {habit.streak} day streak</p>
                    </div>
                    <button className="bg-teal-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-teal-600">
                      ✅ Done
                    </button>
                  </div>
                ))}
                {activeHabits.filter(h => h.category === currentModule.title).length === 0 && (
                  <p className="text-gray-500 text-center py-8">No active habits in this category yet</p>
                )}
              </div>
            </div>
          </>
        )

      case 'reflection':
        return (
          <>
            <ReflectionForm />
          </>
        )

      case 'tasks':
        return (
          <>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tasks for {currentModule.title}</h3>
              <p className="text-gray-600 mb-6">Action items and next steps</p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <input type="checkbox" className="w-4 h-4 text-teal-600 rounded" />
                  <span className="flex-1 text-gray-900">Complete module assessment</span>
                  <span className="text-xs text-gray-500 bg-orange-100 px-2 py-1 rounded-full">High Priority</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <input type="checkbox" className="w-4 h-4 text-teal-600 rounded" />
                  <span className="flex-1 text-gray-900">Review lesson materials</span>
                  <span className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded-full">Medium</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <input type="checkbox" className="w-4 h-4 text-teal-600 rounded" />
                  <span className="flex-1 text-gray-900">Practice daily habit for 7 days</span>
                  <span className="text-xs text-gray-500 bg-green-100 px-2 py-1 rounded-full">Low Priority</span>
                </div>
              </div>
              
              <button className="mt-4 w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:opacity-90">
                + Add New Task
              </button>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming Deadlines</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border-l-4 border-red-500 bg-red-50">
                  <div>
                    <h4 className="font-medium text-gray-900">Module Assessment</h4>
                    <p className="text-sm text-gray-600">Due in 2 days</p>
                  </div>
                  <span className="text-red-600 font-medium">Urgent</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border-l-4 border-yellow-500 bg-yellow-50">
                  <div>
                    <h4 className="font-medium text-gray-900">Weekly Review</h4>
                    <p className="text-sm text-gray-600">Due in 5 days</p>
                  </div>
                  <span className="text-yellow-600 font-medium">Soon</span>
                </div>
              </div>
            </div>
          </>
        )

      case 'resources':
        return (
          <>
            <ResourceSuggestionForm />
            <ResourcesList />
          </>
        )

      default:
        // For challenges, ai-assistant, mentors, courses, events
        return (
          <>
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 capitalize">{tab.replace('-', ' ')}</h3>
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🚀</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Feature Coming Soon</h4>
                <p className="text-gray-600 mb-6">
                  We're working hard to bring you amazing {tab.replace('-', ' ')} features that will enhance your personal development journey.
                </p>
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-4 border border-teal-200">
                  <p className="text-sm text-gray-700">
                    <strong>What to expect:</strong> Personalized recommendations, expert guidance, and tools designed specifically for your {currentModule.title.toLowerCase()} development.
                  </p>
                </div>
              </div>
            </div>
          </>
        )
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
              <button 
                onClick={() => router.push('/profile')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
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
                  <button 
                    onClick={() => router.push('/profile')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-3"
                  >
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
        {expandedModule ? (
          // Expanded Module View
          <div className="space-y-6">
            {/* Back Button */}
            <button
              onClick={() => setExpandedModule(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>

            {/* Module Header */}
            {(() => {
              const currentModule = developmentModules.find(m => m.id === expandedModule)
              if (!currentModule) return null
              
              return (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50 p-8">
                  <div className="flex items-center gap-6 mb-6">
                    <div className={`w-16 h-16 ${currentModule.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg`}>
                      {currentModule.icon}
                    </div>
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentModule.title}</h1>
                      <p className="text-gray-600 mb-4">{currentModule.description}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-teal-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${currentModule.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-500">{currentModule.progress}% Complete</span>
                        <button className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:opacity-90">
                          Continue Learning
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tab Navigation */}
                  <div className="border-b border-gray-200 mb-8">
                    <nav className="flex flex-wrap gap-2 md:gap-4 lg:gap-8">
                      {['overview', 'habits', 'challenges', 'ai-assistant', 'reflection', 'resources', 'mentors', 'courses', 'events', 'tasks'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`py-2 px-1 font-medium text-sm transition-colors ${
                            activeTab === tab
                              ? 'border-b-2 border-teal-500 text-teal-600'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Content Area */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {renderTabContent(activeTab, currentModule)}
                  </div>
                </div>
              )
            })()}
          </div>
        ) : (
          // Main Dashboard View
          <div className="space-y-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              {userProfile?.username ? `${userProfile.username}'s SelfHQ` : 'Your SelfHQ'}
            </h1>
            
            {/* Overview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
              {/* Main Overview Stats */}
              <div className="lg:col-span-5 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
                  <button
                    onClick={() => setShowLifePlanning(!showLifePlanning)}
                    className="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors"
                  >
                    <svg className={`w-4 h-4 transition-transform ${showLifePlanning ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="text-sm font-medium">Life Planning</span>
                  </button>
                </div>
                
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl">
                    <h3 className="font-semibold text-teal-800 mb-1">Active Habits</h3>
                    <div className="text-3xl font-bold text-teal-600">{activeHabits.length}</div>
                    <p className="text-teal-700 text-xs">Building momentum</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                    <h3 className="font-semibold text-purple-800 mb-1">Points</h3>
                    <div className="text-3xl font-bold text-purple-600">{userStats.totalPoints}</div>
                    <p className="text-purple-700 text-xs">Level {userStats.level}</p>
                  </div>
                </div>

                {/* Next Due Item */}
                <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-orange-600">⏰</span>
                    Next Due
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{nextDueItem.title}</p>
                      <p className="text-sm text-gray-600">{nextDueItem.time}</p>
                    </div>
                    <div className="text-2xl">
                      {nextDueItem.type === 'habit' ? '🎯' : '📝'}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleOpenHabitModal('general')}
                    className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Habit
                  </button>
                  <button
                    onClick={() => handleOpenHabitModal('general')}
                    className="bg-white border-2 border-teal-500 text-teal-600 px-4 py-3 rounded-xl font-medium hover:bg-teal-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Find Habits
                  </button>
                </div>
                
                {/* Life Planning View */}
                <LifePlanningView isExpanded={showLifePlanning} />
              </div>

              {/* Active Habits Widget */}
              <div className="lg:col-span-4">
                <ActiveHabitsWidget 
                  habits={activeHabits} 
                  onCompleteHabit={handleCompleteHabit} 
                />
              </div>

              {/* User Stats & Gamification */}
              <div className="lg:col-span-3">
                <UserStatsWidget 
                  userStats={userStats}
                  leaderboard={leaderboard}
                />
              </div>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {developmentModules.map((module) => (
            <div 
              key={module.id} 
              onClick={() => setExpandedModule(module.id)}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all duration-300 cursor-pointer group"
            >
              {/* Icon and Progress */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${module.color} rounded-xl flex items-center justify-center text-white text-lg sm:text-xl group-hover:scale-105 transition-transform`}>
                  {module.icon}
                </div>
                <span className="text-xs sm:text-sm text-gray-500 font-medium">{module.progress}% Complete</span>
              </div>
              
              {/* Title and Description */}
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight group-hover:text-teal-600 transition-colors">{module.title}</h3>
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
              
              {/* Expand Button */}
              <div className="w-full flex items-center justify-between text-gray-900 font-medium group-hover:text-teal-600 transition-colors py-2">
                <span className="text-sm sm:text-base">Expand</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
            </div>
          </div>
        )}
      </main>

      {/* Welcome Popup for First-Time Users */}
      <WelcomePopup
        isOpen={showWelcomePopup}
        onClose={() => setShowWelcomePopup(false)}
        onStartAssessment={handleStartAssessment}
        onSkipAssessment={handleSkipAssessment}
      />

      {/* Habit Modal */}
      <HabitModal
        isOpen={showHabitModal}
        onClose={() => setShowHabitModal(false)}
        selectedCategory={selectedHabitCategory}
        userIsPremium={false} // TODO: Replace with actual premium status
      />
    </div>
  )
}