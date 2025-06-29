'use client'

import { useState } from 'react'
import { joinChallenge, respondToChallengeInvitation } from '@/lib/challenges'
import type { Challenge } from '@/types/profile'

interface ChallengeCardProps {
  challenge: Challenge
  userParticipation?: 'none' | 'pending' | 'accepted' | 'declined' | 'completed' | 'failed'
  onUpdate?: () => void
}

export default function ChallengeCard({ challenge, userParticipation = 'none', onUpdate }: ChallengeCardProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleJoinChallenge = async () => {
    try {
      setLoading(true)
      setMessage('')
      
      await joinChallenge(challenge.id)
      setMessage('Successfully joined challenge!')
      
      if (onUpdate) onUpdate()
      
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error joining challenge:', error)
      setMessage(error instanceof Error ? error.message : 'Error joining challenge')
    } finally {
      setLoading(false)
    }
  }

  const handleRespondToInvitation = async (status: 'accepted' | 'declined') => {
    try {
      setLoading(true)
      setMessage('')
      
      await respondToChallengeInvitation(challenge.id, status)
      setMessage(`Challenge invitation ${status}!`)
      
      if (onUpdate) onUpdate()
      
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error responding to invitation:', error)
      setMessage('Error responding to invitation')
    } finally {
      setLoading(false)
    }
  }

  const getChallengeTypeIcon = () => {
    switch (challenge.challenge_type) {
      case 'habit_streak': return '🔥'
      case 'custom_goal': return '🎯'
      case 'activity_count': return '📊'
      case 'duration_based': return '⏱️'
      default: return '🏆'
    }
  }

  const getStatusColor = () => {
    switch (userParticipation) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'declined': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'failed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const isExpired = new Date(challenge.end_date) < new Date()
  const daysLeft = Math.ceil((new Date(challenge.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{getChallengeTypeIcon()}</div>
          <div>
            <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
            <p className="text-sm text-gray-500">
              by {challenge.creator_profile?.show_real_name && challenge.creator_profile?.first_name
                ? `${challenge.creator_profile.first_name} ${challenge.creator_profile.last_name || ''}`.trim()
                : challenge.creator_profile?.username || 'Unknown'
              }
            </p>
          </div>
        </div>
        
        {userParticipation !== 'none' && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {userParticipation}
          </span>
        )}
      </div>

      {/* Description */}
      {challenge.description && (
        <p className="text-gray-700 mb-4 text-sm line-clamp-2">{challenge.description}</p>
      )}

      {/* Challenge Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Type</span>
          <span className="font-medium text-gray-900 capitalize">
            {challenge.challenge_type.replace('_', ' ')}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Duration</span>
          <span className="font-medium text-gray-900">
            {new Date(challenge.start_date).toLocaleDateString()} - {new Date(challenge.end_date).toLocaleDateString()}
          </span>
        </div>
        
        {challenge.participant_count !== undefined && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Participants</span>
            <span className="font-medium text-gray-900">
              {challenge.participant_count}
              {challenge.max_participants && ` / ${challenge.max_participants}`}
            </span>
          </div>
        )}
        
        {!isExpired && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Time left</span>
            <span className={`font-medium ${daysLeft <= 7 ? 'text-red-600' : 'text-gray-900'}`}>
              {daysLeft > 0 ? `${daysLeft} days` : 'Last day!'}
            </span>
          </div>
        )}
      </div>

      {/* Challenge Parameters */}
      {Object.keys(challenge.parameters).length > 0 && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Challenge Details</h4>
          <div className="space-y-1">
            {Object.entries(challenge.parameters).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between text-xs">
                <span className="text-gray-500 capitalize">{key.replace('_', ' ')}</span>
                <span className="text-gray-700">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className={`mb-4 p-2 rounded-lg text-xs font-medium ${
          message.includes('Error') || message.includes('error')
            ? 'bg-red-100 text-red-800'
            : 'bg-green-100 text-green-800'
        }`}>
          {message}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {userParticipation === 'none' && !isExpired && (
          <button
            onClick={handleJoinChallenge}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Joining...' : 'Join Challenge'}
          </button>
        )}
        
        {userParticipation === 'pending' && !isExpired && (
          <>
            <button
              onClick={() => handleRespondToInvitation('accepted')}
              disabled={loading}
              className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Accept
            </button>
            <button
              onClick={() => handleRespondToInvitation('declined')}
              disabled={loading}
              className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Decline
            </button>
          </>
        )}
        
        {userParticipation === 'accepted' && !isExpired && (
          <div className="flex-1 bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium text-center">
            Participating
          </div>
        )}
        
        {userParticipation === 'completed' && (
          <div className="flex-1 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium text-center">
            ✅ Completed
          </div>
        )}
        
        {isExpired && userParticipation === 'accepted' && (
          <div className="flex-1 bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium text-center">
            Challenge Ended
          </div>
        )}
      </div>
    </div>
  )
}