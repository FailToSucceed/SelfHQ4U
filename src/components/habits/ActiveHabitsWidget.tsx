'use client'

import { useState } from 'react'

interface ActiveHabit {
  id: string
  title: string
  frequency: 'daily' | 'weekly' | 'monthly'
  streak: number
  lastCompleted?: string
  nextDue: string
  category: string
}

interface ActiveHabitsWidgetProps {
  habits: ActiveHabit[]
  onCompleteHabit: (habitId: string) => void
}

export default function ActiveHabitsWidget({ habits, onCompleteHabit }: ActiveHabitsWidgetProps) {
  const [completingHabit, setCompletingHabit] = useState<string | null>(null)

  const handleCompleteHabit = async (habitId: string) => {
    setCompletingHabit(habitId)
    await onCompleteHabit(habitId)
    setCompletingHabit(null)
  }

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🔥'
    if (streak >= 7) return '⚡'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const isHabitDueToday = (habit: ActiveHabit) => {
    const today = new Date().toDateString()
    const nextDue = new Date(habit.nextDue).toDateString()
    return today === nextDue
  }

  const wasCompletedToday = (habit: ActiveHabit) => {
    if (!habit.lastCompleted) return false
    const today = new Date().toDateString()
    const lastCompleted = new Date(habit.lastCompleted).toDateString()
    return today === lastCompleted
  }

  if (habits.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Habits</h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🌱</div>
          <p className="text-gray-500 text-sm">No active habits yet</p>
          <p className="text-gray-400 text-xs mt-1">Start building your first habit!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Active Habits</h3>
        <span className="text-sm text-gray-500">{habits.length} active</span>
      </div>
      
      <div className="space-y-3">
        {habits.map((habit) => {
          const isDue = isHabitDueToday(habit)
          const isCompleted = wasCompletedToday(habit)
          const isCompleting = completingHabit === habit.id
          
          return (
            <div key={habit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{getStreakEmoji(habit.streak)}</span>
                  <h4 className="font-medium text-gray-900 truncate">{habit.title}</h4>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                    {habit.category}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>🔥 {habit.streak} day streak</span>
                  <span>📅 {habit.frequency}</span>
                  {isDue && !isCompleted && (
                    <span className="text-orange-600 font-medium">Due today</span>
                  )}
                  {isCompleted && (
                    <span className="text-green-600 font-medium">✅ Completed today</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                {isDue && !isCompleted && (
                  <button
                    onClick={() => handleCompleteHabit(habit.id)}
                    disabled={isCompleting}
                    className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-1"
                  >
                    {isCompleting ? (
                      <>
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>...</span>
                      </>
                    ) : (
                      <>
                        <span>✅</span>
                        <span>Done</span>
                      </>
                    )}
                  </button>
                )}
                {isCompleted && (
                  <div className="text-green-600 px-3 py-2 text-sm font-medium">
                    ✅ Done
                  </div>
                )}
                {!isDue && !isCompleted && (
                  <div className="text-gray-400 px-3 py-2 text-sm">
                    Next: {new Date(habit.nextDue).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Progress Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-teal-600">
              {habits.filter(h => wasCompletedToday(h)).length}
            </div>
            <div className="text-xs text-gray-500">Completed Today</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-600">
              {habits.filter(h => isHabitDueToday(h) && !wasCompletedToday(h)).length}
            </div>
            <div className="text-xs text-gray-500">Due Today</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">
              {Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / habits.length) || 0}
            </div>
            <div className="text-xs text-gray-500">Avg Streak</div>
          </div>
        </div>
      </div>
    </div>
  )
}