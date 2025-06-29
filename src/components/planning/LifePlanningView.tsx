'use client'

import { useState } from 'react'

interface TimeFrame {
  id: string
  label: string
  period: string
  icon: string
  color: string
  description: string
}

const timeFrames: TimeFrame[] = [
  {
    id: 'decades',
    label: 'Decades',
    period: '10+ years',
    icon: '🏔️',
    color: 'bg-purple-500',
    description: 'Long-term vision and legacy goals'
  },
  {
    id: 'years',
    label: 'Years',
    period: '1-5 years',
    icon: '🌟',
    color: 'bg-blue-500',
    description: 'Major life milestones and achievements'
  },
  {
    id: 'months',
    label: 'Months',
    period: '1-12 months',
    icon: '🎯',
    color: 'bg-green-500',
    description: 'Seasonal goals and projects'
  },
  {
    id: 'weeks',
    label: 'Weeks',
    period: '1-4 weeks',
    icon: '📅',
    color: 'bg-yellow-500',
    description: 'Sprint goals and focus areas'
  },
  {
    id: 'days',
    label: 'Days',
    period: '1-7 days',
    icon: '☀️',
    color: 'bg-orange-500',
    description: 'Daily tasks and priorities'
  },
  {
    id: 'hours',
    label: 'Hours',
    period: 'Today',
    icon: '⏰',
    color: 'bg-red-500',
    description: 'Time blocks and focused work'
  },
  {
    id: 'minutes',
    label: 'Minutes',
    period: 'Now',
    icon: '⚡',
    color: 'bg-teal-500',
    description: 'Current focus and immediate actions'
  }
]

interface LifePlanningViewProps {
  isExpanded: boolean
}

export default function LifePlanningView({ isExpanded }: LifePlanningViewProps) {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<'timeline' | 'planning'>('timeline')

  if (!isExpanded) return null

  return (
    <div className="mt-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Life Planning & Timeline</h3>
          <p className="text-sm text-gray-600">Plan and observe your life across different time horizons</p>
        </div>
        
        {/* View Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveView('timeline')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeView === 'timeline' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setActiveView('planning')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeView === 'planning' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Planning
          </button>
        </div>
      </div>

      {/* Timeline View */}
      {activeView === 'timeline' && (
        <div className="space-y-4">
          {/* Time Frame Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {timeFrames.map((timeFrame) => (
              <button
                key={timeFrame.id}
                onClick={() => setSelectedTimeFrame(
                  selectedTimeFrame === timeFrame.id ? null : timeFrame.id
                )}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedTimeFrame === timeFrame.id
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 ${timeFrame.color} rounded-lg flex items-center justify-center text-white text-sm`}>
                    {timeFrame.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{timeFrame.label}</h4>
                    <p className="text-xs text-gray-500">{timeFrame.period}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">{timeFrame.description}</p>
              </button>
            ))}
          </div>

          {/* Selected Time Frame Details */}
          {selectedTimeFrame && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              {(() => {
                const timeFrame = timeFrames.find(t => t.id === selectedTimeFrame)
                if (!timeFrame) return null

                return (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 ${timeFrame.color} rounded-xl flex items-center justify-center text-white`}>
                        {timeFrame.icon}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{timeFrame.label} Planning</h4>
                        <p className="text-sm text-gray-600">{timeFrame.description}</p>
                      </div>
                    </div>

                    {/* Content based on time frame */}
                    <div className="space-y-4">
                      {timeFrame.id === 'decades' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-purple-50 rounded-lg p-4">
                            <h5 className="font-medium text-purple-900 mb-2">Legacy Goals</h5>
                            <p className="text-sm text-purple-700">What do you want to be remembered for?</p>
                            <div className="mt-2 text-xs text-purple-600">
                              • Impact on others • Personal legacy • Life's work
                            </div>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-4">
                            <h5 className="font-medium text-purple-900 mb-2">Vision Board</h5>
                            <p className="text-sm text-purple-700">Your ultimate life vision</p>
                            <div className="mt-2 text-xs text-purple-600">
                              • Values alignment • Major achievements • Relationships
                            </div>
                          </div>
                        </div>
                      )}

                      {timeFrame.id === 'years' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h5 className="font-medium text-blue-900 mb-2">Career & Skills</h5>
                            <div className="text-xs text-blue-600 space-y-1">
                              <div>• Professional development</div>
                              <div>• Skill acquisition</div>
                              <div>• Career transitions</div>
                            </div>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h5 className="font-medium text-blue-900 mb-2">Relationships</h5>
                            <div className="text-xs text-blue-600 space-y-1">
                              <div>• Family milestones</div>
                              <div>• Friend connections</div>
                              <div>• Community building</div>
                            </div>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h5 className="font-medium text-blue-900 mb-2">Health & Wellness</h5>
                            <div className="text-xs text-blue-600 space-y-1">
                              <div>• Fitness goals</div>
                              <div>• Health milestones</div>
                              <div>• Lifestyle changes</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {timeFrame.id === 'months' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-green-50 rounded-lg p-4">
                            <h5 className="font-medium text-green-900 mb-2">Quarterly Goals</h5>
                            <div className="text-xs text-green-600 space-y-1">
                              <div>• Project milestones</div>
                              <div>• Skill development</div>
                              <div>• Habit formation</div>
                            </div>
                          </div>
                          <div className="bg-green-50 rounded-lg p-4">
                            <h5 className="font-medium text-green-900 mb-2">Seasonal Planning</h5>
                            <div className="text-xs text-green-600 space-y-1">
                              <div>• Seasonal activities</div>
                              <div>• Event planning</div>
                              <div>• Travel & experiences</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {timeFrame.id === 'weeks' && (
                        <div className="bg-yellow-50 rounded-lg p-4">
                          <h5 className="font-medium text-yellow-900 mb-2">Weekly Sprint Planning</h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-yellow-700">
                            <div>Monday: Planning</div>
                            <div>Tuesday: Deep Work</div>
                            <div>Wednesday: Collaboration</div>
                            <div>Thursday: Review</div>
                            <div>Friday: Preparation</div>
                            <div>Saturday: Personal</div>
                            <div>Sunday: Reflection</div>
                          </div>
                        </div>
                      )}

                      {timeFrame.id === 'days' && (
                        <div className="bg-orange-50 rounded-lg p-4">
                          <h5 className="font-medium text-orange-900 mb-2">Daily Structure</h5>
                          <div className="grid grid-cols-3 gap-2 text-xs text-orange-700">
                            <div>Morning: Habits & Planning</div>
                            <div>Afternoon: Focused Work</div>
                            <div>Evening: Reflection & Rest</div>
                          </div>
                        </div>
                      )}

                      {timeFrame.id === 'hours' && (
                        <div className="bg-red-50 rounded-lg p-4">
                          <h5 className="font-medium text-red-900 mb-2">Time Blocking</h5>
                          <div className="text-xs text-red-700 space-y-1">
                            <div>• 2-hour deep work blocks</div>
                            <div>• 30-minute focused sessions</div>
                            <div>• 15-minute breaks</div>
                          </div>
                        </div>
                      )}

                      {timeFrame.id === 'minutes' && (
                        <div className="bg-teal-50 rounded-lg p-4">
                          <h5 className="font-medium text-teal-900 mb-2">Current Focus</h5>
                          <div className="text-xs text-teal-700 space-y-1">
                            <div>• Present moment awareness</div>
                            <div>• Immediate priorities</div>
                            <div>• Quick wins</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      )}

      {/* Planning View */}
      {activeView === 'planning' && (
        <div className="space-y-6">
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🚧</div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Planning Tools Coming Soon</h4>
            <p className="text-gray-600 mb-4">
              Interactive planning tools for each time frame will be available soon.
            </p>
            <p className="text-sm text-gray-500">
              This will include goal setting, progress tracking, and integration with your habits and challenges.
            </p>
          </div>
        </div>
      )}

      {/* Calendar Sync Button */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Sync with my calendar - Coming Soon</span>
        </button>
      </div>
    </div>
  )
}