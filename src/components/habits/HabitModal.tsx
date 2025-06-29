'use client'

import { useState } from 'react'

interface Habit {
  id: string
  title: string
  description: string
  category: string
  category_id?: string
  creator_id: string
  user_id?: string
  is_private: boolean
  price?: number
  difficulty?: string
  frequency?: string
  estimated_time?: number
  tags?: string[]
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

interface HabitModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCategory?: string
  userIsPremium?: boolean
}

export default function HabitModal({ isOpen, onClose, selectedCategory = 'general', userIsPremium = false }: HabitModalProps) {
  const [activeTab, setActiveTab] = useState<'search' | 'create'>('search')
  const [searchQuery, setSearchQuery] = useState('')
  const [newHabit, setNewHabit] = useState({
    title: '',
    description: '',
    category: selectedCategory,
    is_private: false,
    price: 0,
    difficulty: 'medium',
    frequency: 'daily',
    estimated_time: 15
  })

  // Mock habit data - replace with real data from Supabase
  const publicHabits: Habit[] = [
    {
      id: '1',
      title: 'Daily Meditation',
      description: '10 minutes of mindfulness meditation every morning',
      category: 'Mind & Mental',
      creator_id: '00000000-0000-0000-0000-000000000000',
      is_private: false,
      price: 0,
      difficulty: 'easy',
      frequency: 'daily',
      estimated_time: 10
    },
    {
      id: '2',
      title: 'Gratitude Journal',
      description: 'Write 3 things you\'re grateful for each evening',
      category: 'Mind & Mental',
      creator_id: '00000000-0000-0000-0000-000000000000',
      is_private: false,
      price: 0,
      difficulty: 'easy',
      frequency: 'daily',
      estimated_time: 5
    },
    {
      id: '3',
      title: 'Morning Workout',
      description: '30-minute strength training session',
      category: 'Body & Physique',
      creator_id: '00000000-0000-0000-0000-000000000000',
      is_private: false,
      price: 0,
      difficulty: 'medium',
      frequency: 'daily',
      estimated_time: 30
    }
  ]

  const filteredHabits = publicHabits.filter(habit => 
    habit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    habit.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateHabit = () => {
    // TODO: Implement habit creation logic
    console.log('Creating habit:', newHabit)
    onClose()
  }

  const handleAdoptHabit = (habitId: string) => {
    // TODO: Implement habit adoption logic
    console.log('Adopting habit:', habitId)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/50 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Habits for {selectedCategory}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'search'
                ? 'border-b-2 border-teal-500 text-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Search & Adopt Habits
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'create'
                ? 'border-b-2 border-teal-500 text-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Create New Habit
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'search' ? (
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search habits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Habits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredHabits.map((habit) => (
                  <div key={habit.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-900 mb-2">{habit.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{habit.description}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">
                        {habit.difficulty} • {habit.frequency} • {habit.estimated_time} min
                      </span>
                      {habit.price && habit.price > 0 && (
                        <span className="text-xs text-green-600 font-medium">${habit.price}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">SelfHQ Community</span>
                      <button
                        onClick={() => handleAdoptHabit(habit.id)}
                        className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
                      >
                        Adopt Habit
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredHabits.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No habits found matching your search.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Create Habit Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Habit Title
                  </label>
                  <input
                    type="text"
                    value={newHabit.title}
                    onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="e.g., Daily Morning Walk"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newHabit.description}
                    onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    placeholder="Describe your habit and how to implement it..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newHabit.category}
                    onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="Values, Vision, Mission">Values, Vision, Mission</option>
                    <option value="Body & Physique">Body & Physique</option>
                    <option value="Mind & Mental">Mind & Mental</option>
                    <option value="Rest & Sleep">Rest & Sleep</option>
                    <option value="Nutrition & Hydration">Nutrition & Hydration</option>
                    <option value="Social Interaction">Social Interaction</option>
                    <option value="Time & Environment">Time & Environment</option>
                    <option value="Finance & Business">Finance & Business</option>
                    <option value="Skills, Characteristics & Beliefs">Skills, Characteristics & Beliefs</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={newHabit.difficulty}
                      onChange={(e) => setNewHabit({ ...newHabit, difficulty: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency
                    </label>
                    <select
                      value={newHabit.frequency}
                      onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Time (minutes)
                    </label>
                    <input
                      type="number"
                      value={newHabit.estimated_time}
                      onChange={(e) => setNewHabit({ ...newHabit, estimated_time: Number(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="15"
                      min="1"
                      max="480"
                    />
                  </div>
                </div>

                {/* Premium Features */}
                {userIsPremium && (
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-purple-600">👑</span>
                      Premium Features
                    </h3>
                    
                    <div className="space-y-4">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={newHabit.is_private}
                          onChange={(e) => setNewHabit({ ...newHabit, is_private: e.target.checked })}
                          className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <span className="text-sm text-gray-700">
                          Make this habit private (only you can see it)
                        </span>
                      </label>

                      {newHabit.is_private && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price (if you want to sell this habit)
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-gray-500">$</span>
                            <input
                              type="number"
                              value={newHabit.price}
                              onChange={(e) => setNewHabit({ ...newHabit, price: Number(e.target.value) })}
                              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Set to $0 if you don't want to sell this habit
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {!userIsPremium && (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Upgrade to Premium</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Create private habits and earn money by selling habit cards to other users.
                    </p>
                    <button className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90">
                      Upgrade Now
                    </button>
                  </div>
                )}
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreateHabit}
                disabled={!newHabit.title || !newHabit.description}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                Create Habit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}