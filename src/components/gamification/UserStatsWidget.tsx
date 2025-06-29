'use client'

import { useState, useEffect } from 'react'
import { getBulkPublicUserInfo } from '@/lib/profiles'
import type { PublicUser } from '@/types/profile'

interface UserStats {
  totalPoints: number
  longestStreak: number
  currentStreak: number
  habitsCompleted: number
  habitsCreated: number
  habitsUsedByOthers: number
  daysSignedInStreak: number
  reflectionsCompleted: number
  tasksCompleted: number
  level: number
  rank: number
  totalUsers: number
}

interface LeaderboardEntry {
  id: string
  name: string
  points: number
  streak: number
  habitsCreated: number
  rank: number
  avatar?: string
  publicUser?: PublicUser
}

interface UserStatsWidgetProps {
  userStats: UserStats
  leaderboard: LeaderboardEntry[]
}

export default function UserStatsWidget({ userStats, leaderboard }: UserStatsWidgetProps) {
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [leaderboardTab, setLeaderboardTab] = useState<'points' | 'streaks' | 'creators'>('points')
  const [leaderboardWithUsers, setLeaderboardWithUsers] = useState<LeaderboardEntry[]>(leaderboard)
  const [loadingUsers, setLoadingUsers] = useState(false)

  // Load user information for leaderboard
  useEffect(() => {
    const loadUserInfo = async () => {
      if (!showLeaderboard || leaderboard.length === 0) return
      
      try {
        setLoadingUsers(true)
        const userIds = leaderboard.map(entry => entry.id).filter(id => id !== 'current-user')
        
        if (userIds.length > 0) {
          const publicUsers = await getBulkPublicUserInfo(userIds)
          
          const updatedLeaderboard = leaderboard.map(entry => ({
            ...entry,
            publicUser: publicUsers[entry.id] || undefined
          }))
          
          setLeaderboardWithUsers(updatedLeaderboard)
        }
      } catch (error) {
        console.error('Error loading user info:', error)
        setLeaderboardWithUsers(leaderboard)
      } finally {
        setLoadingUsers(false)
      }
    }

    loadUserInfo()
  }, [showLeaderboard, leaderboard])

  const getStreakEmoji = (streak: number) => {
    if (streak >= 50) return '🏆'
    if (streak >= 30) return '🔥'
    if (streak >= 14) return '⚡'
    if (streak >= 7) return '✨'
    if (streak >= 3) return '🌟'
    return '🌱'
  }

  const getLevelInfo = (level: number) => {
    const levels = [
      { name: 'Beginner', color: 'bg-gray-500', points: 0 },
      { name: 'Explorer', color: 'bg-green-500', points: 100 },
      { name: 'Builder', color: 'bg-blue-500', points: 500 },
      { name: 'Achiever', color: 'bg-purple-500', points: 1000 },
      { name: 'Master', color: 'bg-orange-500', points: 2500 },
      { name: 'Legend', color: 'bg-red-500', points: 5000 },
    ]
    return levels[Math.min(level, levels.length - 1)]
  }

  const levelInfo = getLevelInfo(userStats.level)
  const nextLevel = getLevelInfo(userStats.level + 1)
  const progressToNext = nextLevel ? ((userStats.totalPoints - levelInfo.points) / (nextLevel.points - levelInfo.points)) * 100 : 100

  const getLeaderboardData = () => {
    switch (leaderboardTab) {
      case 'points':
        return [...leaderboardWithUsers].sort((a, b) => b.points - a.points)
      case 'streaks':
        return [...leaderboardWithUsers].sort((a, b) => b.streak - a.streak)
      case 'creators':
        return [...leaderboardWithUsers].sort((a, b) => b.habitsCreated - a.habitsCreated)
      default:
        return leaderboardWithUsers
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Your Progress</h3>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${levelInfo.color}`}></div>
          <span className="text-sm font-medium text-gray-700">{levelInfo.name}</span>
        </div>
      </div>

      {/* Level Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Level {userStats.level}</span>
          <span className="text-sm text-gray-500">{userStats.totalPoints} points</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${levelInfo.color}`}
            style={{ width: `${Math.min(progressToNext, 100)}%` }}
          ></div>
        </div>
        {nextLevel && (
          <div className="text-xs text-gray-500 mt-1">
            {nextLevel.points - userStats.totalPoints} points to {nextLevel.name}
          </div>
        )}
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl">
          <div className="text-2xl font-bold text-teal-600">{userStats.currentStreak}</div>
          <div className="text-xs text-teal-700">Current Streak</div>
          <div className="text-lg">{getStreakEmoji(userStats.currentStreak)}</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
          <div className="text-2xl font-bold text-purple-600">#{userStats.rank}</div>
          <div className="text-xs text-purple-700">Global Rank</div>
          <div className="text-lg">🏅</div>
        </div>
      </div>

      {/* Achievement Stats */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span className="text-sm text-gray-700">Habits Completed</span>
          </div>
          <span className="font-semibold text-gray-900">{userStats.habitsCompleted}</span>
        </div>
        
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <span>🎯</span>
            <span className="text-sm text-gray-700">Habits Created</span>
          </div>
          <span className="font-semibold text-gray-900">{userStats.habitsCreated}</span>
        </div>
        
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <span>👥</span>
            <span className="text-sm text-gray-700">Habits Used by Others</span>
          </div>
          <span className="font-semibold text-gray-900">{userStats.habitsUsedByOthers}</span>
        </div>
        
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <span>📱</span>
            <span className="text-sm text-gray-700">Daily Login Streak</span>
          </div>
          <span className="font-semibold text-gray-900">{userStats.daysSignedInStreak}</span>
        </div>
      </div>

      {/* Leaderboard Toggle */}
      <button
        onClick={() => setShowLeaderboard(!showLeaderboard)}
        className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
      >
        <span>🏆</span>
        <span>{showLeaderboard ? 'Hide' : 'Show'} Leaderboard</span>
        <svg 
          className={`w-4 h-4 transition-transform ${showLeaderboard ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Leaderboard */}
      {showLeaderboard && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          {/* Leaderboard Tabs */}
          <div className="flex gap-2 mb-4">
            {['points', 'streaks', 'creators'].map((tab) => (
              <button
                key={tab}
                onClick={() => setLeaderboardTab(tab as any)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  leaderboardTab === tab
                    ? 'bg-teal-100 text-teal-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab === 'points' && '🏆 Points'}
                {tab === 'streaks' && '🔥 Streaks'}
                {tab === 'creators' && '🎯 Creators'}
              </button>
            ))}
          </div>

          {/* Leaderboard List */}
          <div className="space-y-2">
            {getLeaderboardData().slice(0, 5).map((entry, index) => (
              <div 
                key={entry.id} 
                className={`flex items-center justify-between p-3 rounded-lg ${
                  entry.id === 'current-user' ? 'bg-teal-50 border border-teal-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {entry.publicUser?.display_name || entry.name}
                    </div>
                    {entry.publicUser && (
                      <div className="text-xs text-gray-400">@{entry.publicUser.username}</div>
                    )}
                    <div className="text-xs text-gray-500">
                      {leaderboardTab === 'points' && `${entry.points} points`}
                      {leaderboardTab === 'streaks' && `${entry.streak} day streak`}
                      {leaderboardTab === 'creators' && `${entry.habitsCreated} habits created`}
                    </div>
                  </div>
                </div>
                <div className="text-lg">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && '🏅'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}