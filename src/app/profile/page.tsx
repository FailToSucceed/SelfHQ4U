'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  getCurrentUserProfile, 
  updateUserProfile, 
  isUsernameAvailable,
  getUserFriends,
  getPendingFriendRequests,
  respondToFriendRequest,
  inviteFriendByEmail,
  getSentInvitations
} from '@/lib/profiles'
import { 
  getUserChallenges,
  getPublicChallenges,
  getPendingChallengeInvitations
} from '@/lib/challenges'
import type { UserProfile, ProfileFormData, FriendConnection, FriendInvitation, Challenge } from '@/types/profile'
import ChallengeCard from '@/components/challenges/ChallengeCard'

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'friends' | 'invitations' | 'challenges'>('profile')
  const [message, setMessage] = useState('')
  
  // Form data
  const [formData, setFormData] = useState<ProfileFormData>({})
  const [usernameError, setUsernameError] = useState('')
  const [checkingUsername, setCheckingUsername] = useState(false)
  
  // Friends data
  const [friends, setFriends] = useState<any[]>([])
  const [pendingRequests, setPendingRequests] = useState<FriendConnection[]>([])
  const [sentInvitations, setSentInvitations] = useState<FriendInvitation[]>([])
  
  // Challenge data
  const [userChallenges, setUserChallenges] = useState<Challenge[]>([])
  const [publicChallenges, setPublicChallenges] = useState<Challenge[]>([])
  const [pendingChallengeInvites, setPendingChallengeInvites] = useState<Challenge[]>([])
  
  // Invitation form
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteMessage, setInviteMessage] = useState('')
  const [sendingInvite, setSendingInvite] = useState(false)

  useEffect(() => {
    if (authLoading) return
    
    if (!user) {
      router.push('/login')
      return
    }
    
    loadProfile()
  }, [user, authLoading, router])

  // Username validation
  useEffect(() => {
    const validateUsername = async () => {
      if (!formData.username || formData.username === profile?.username) {
        setUsernameError('')
        return
      }

      // Basic validation
      if (formData.username.length < 3) {
        setUsernameError('Username must be at least 3 characters')
        return
      }

      if (formData.username.length > 20) {
        setUsernameError('Username must be 20 characters or less')
        return
      }

      if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        setUsernameError('Username can only contain letters, numbers, and underscores')
        return
      }

      // Check availability
      try {
        setCheckingUsername(true)
        const available = await isUsernameAvailable(formData.username, user?.id)
        if (!available) {
          setUsernameError('Username is already taken')
        } else {
          setUsernameError('')
        }
      } catch (error) {
        console.error('Error checking username:', error)
      } finally {
        setCheckingUsername(false)
      }
    }

    const timeoutId = setTimeout(validateUsername, 500)
    return () => clearTimeout(timeoutId)
  }, [formData.username, profile?.username, user?.id])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const userProfile = await getCurrentUserProfile()
      
      if (userProfile) {
        setProfile(userProfile)
        setFormData({
          username: userProfile.username,
          first_name: userProfile.first_name || '',
          last_name: userProfile.last_name || '',
          bio: userProfile.bio || '',
          location: userProfile.location || '',
          website: userProfile.website || '',
          date_of_birth: userProfile.date_of_birth || '',
          is_public: userProfile.is_public,
          show_real_name: userProfile.show_real_name,
          show_location: userProfile.show_location,
          show_stats: userProfile.show_stats,
          theme_preference: userProfile.theme_preference,
          allow_friend_requests: userProfile.allow_friend_requests,
          allow_challenges: userProfile.allow_challenges,
          show_in_leaderboards: userProfile.show_in_leaderboards
        })
      }
      
      // Load friends and challenges data
      await Promise.all([loadFriendsData(), loadChallengesData()])
    } catch (error) {
      console.error('Error loading profile:', error)
      setMessage('Error loading profile')
    } finally {
      setLoading(false)
    }
  }

  const loadFriendsData = async () => {
    try {
      const [friendsList, requests, invitations] = await Promise.all([
        getUserFriends(),
        getPendingFriendRequests(),
        getSentInvitations()
      ])
      
      setFriends(friendsList)
      setPendingRequests(requests)
      setSentInvitations(invitations)
    } catch (error) {
      console.error('Error loading friends data:', error)
    }
  }

  const loadChallengesData = async () => {
    try {
      const [challenges, publicChallengesList, pendingInvites] = await Promise.all([
        getUserChallenges(),
        getPublicChallenges(),
        getPendingChallengeInvitations()
      ])
      
      setUserChallenges(challenges)
      setPublicChallenges(publicChallengesList)
      setPendingChallengeInvites(pendingInvites)
    } catch (error) {
      console.error('Error loading challenges data:', error)
    }
  }

  const handleSaveProfile = async () => {
    if (usernameError) {
      setMessage('Please fix the username error before saving')
      return
    }

    try {
      setSaving(true)
      setMessage('')
      
      const updatedProfile = await updateUserProfile(formData)
      setProfile(updatedProfile)
      setMessage('Profile updated successfully!')
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage('Error updating profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleRespondToRequest = async (connectionId: string, status: 'accepted' | 'declined') => {
    try {
      await respondToFriendRequest(connectionId, status)
      await loadFriendsData()
      setMessage(`Friend request ${status}`)
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error responding to friend request:', error)
      setMessage('Error responding to friend request')
    }
  }

  const handleSendInvitation = async () => {
    if (!inviteEmail.trim()) {
      setMessage('Please enter an email address')
      return
    }

    try {
      setSendingInvite(true)
      setMessage('')
      
      await inviteFriendByEmail({
        email: inviteEmail.trim(),
        message: inviteMessage.trim() || undefined
      })
      
      setInviteEmail('')
      setInviteMessage('')
      setMessage('Invitation sent successfully!')
      await loadFriendsData()
      
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error sending invitation:', error)
      setMessage('Error sending invitation. Please try again.')
    } finally {
      setSendingInvite(false)
    }
  }

  const updateFormData = (key: keyof ProfileFormData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600">There was an error loading your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
            
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${
            message.includes('Error') || message.includes('error')
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            {[
              { id: 'profile', label: 'Profile', icon: '👤' },
              { id: 'friends', label: 'Friends', icon: '👥' },
              { id: 'invitations', label: 'Invitations', icon: '📧' },
              { id: 'challenges', label: 'Challenges', icon: '🏆' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-b-2 border-teal-500 text-teal-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
                {tab.id === 'friends' && friends.length > 0 && (
                  <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full">
                    {friends.length}
                  </span>
                )}
                {tab.id === 'invitations' && pendingRequests.length > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    {pendingRequests.length}
                  </span>
                )}
                {tab.id === 'challenges' && (userChallenges.length > 0 || pendingChallengeInvites.length > 0) && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {userChallenges.length + pendingChallengeInvites.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
            
            <div className="space-y-6">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    value={formData.username || ''}
                    onChange={(e) => updateFormData('username', e.target.value.toLowerCase().replace(/[^a-zA-Z0-9_]/g, ''))}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                      usernameError 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-teal-500'
                    }`}
                  />
                  {checkingUsername && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                {usernameError && (
                  <p className="text-red-600 text-xs mt-1">{usernameError}</p>
                )}
              </div>

              {/* Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    value={formData.first_name || ''}
                    onChange={(e) => updateFormData('first_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    value={formData.last_name || ''}
                    onChange={(e) => updateFormData('last_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  value={formData.bio || ''}
                  onChange={(e) => updateFormData('bio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  placeholder="Tell others about yourself..."
                />
              </div>

              {/* Location and Website */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={formData.location || ''}
                    onChange={(e) => updateFormData('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="City, Country"
                  />
                </div>
                
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    value={formData.website || ''}
                    onChange={(e) => updateFormData('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="date_of_birth"
                  value={formData.date_of_birth || ''}
                  onChange={(e) => updateFormData('date_of_birth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Privacy Settings */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
                
                <div className="space-y-4">
                  {[
                    { key: 'is_public', label: 'Public Profile', description: 'Allow others to view your profile' },
                    { key: 'show_real_name', label: 'Show Real Name', description: 'Display your real name instead of username' },
                    { key: 'show_location', label: 'Show Location', description: 'Display your location on your profile' },
                    { key: 'show_stats', label: 'Show Stats', description: 'Display your statistics and achievements' },
                    { key: 'allow_friend_requests', label: 'Allow Friend Requests', description: 'Let others send you friend requests' },
                    { key: 'allow_challenges', label: 'Allow Challenges', description: 'Let friends challenge you' },
                    { key: 'show_in_leaderboards', label: 'Show in Leaderboards', description: 'Appear in public leaderboards' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{setting.label}</h4>
                        <p className="text-sm text-gray-500">{setting.description}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData[setting.key as keyof ProfileFormData] as boolean}
                        onChange={(e) => updateFormData(setting.key as keyof ProfileFormData, e.target.checked)}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Theme Preference */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
                
                <div>
                  <label htmlFor="theme_preference" className="block text-sm font-medium text-gray-700 mb-2">
                    Theme Preference
                  </label>
                  <select
                    id="theme_preference"
                    value={formData.theme_preference || 'system'}
                    onChange={(e) => updateFormData('theme_preference', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="system">System</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>

              {/* Save Button */}
              <div className="border-t border-gray-200 pt-6">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving || !!usernameError}
                  className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="space-y-6">
            {/* Invite Friend */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Invite a Friend</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="invite_email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="invite_email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="friend@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="invite_message" className="block text-sm font-medium text-gray-700 mb-2">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    id="invite_message"
                    rows={3}
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    placeholder="Join me on SelfHQ for personal development!"
                  />
                </div>
                
                <button
                  onClick={handleSendInvitation}
                  disabled={sendingInvite || !inviteEmail.trim()}
                  className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {sendingInvite ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Invitation
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Friends List */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Your Friends ({friends.length})
              </h2>
              
              {friends.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {friends.map((friend) => (
                    <div key={friend.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {friend.display_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{friend.display_name}</h3>
                          <p className="text-sm text-gray-500">@{friend.username}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">👥</div>
                  <p>No friends yet</p>
                  <p className="text-sm">Invite friends to join you on your development journey!</p>
                </div>
              )}
            </div>

            {/* Sent Invitations */}
            {sentInvitations.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Sent Invitations ({sentInvitations.length})
                </h2>
                
                <div className="space-y-3">
                  {sentInvitations.map((invitation) => (
                    <div key={invitation.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{invitation.email}</p>
                        <p className="text-sm text-gray-500">
                          Sent {new Date(invitation.created_at).toLocaleDateString()}
                          {invitation.expires_at && ` • Expires ${new Date(invitation.expires_at).toLocaleDateString()}`}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invitation.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : invitation.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {invitation.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'invitations' && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Friend Requests ({pendingRequests.length})
            </h2>
            
            {pendingRequests.length > 0 ? (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {request.requester_profile?.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {request.requester_profile?.show_real_name && request.requester_profile?.first_name
                            ? `${request.requester_profile.first_name} ${request.requester_profile.last_name || ''}`.trim()
                            : request.requester_profile?.username
                          }
                        </h3>
                        <p className="text-sm text-gray-500">@{request.requester_profile?.username}</p>
                        <p className="text-xs text-gray-400">
                          Sent {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRespondToRequest(request.id, 'accepted')}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRespondToRequest(request.id, 'declined')}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📧</div>
                <p>No pending friend requests</p>
                <p className="text-sm">Friend requests will appear here when someone wants to connect with you.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="space-y-6">
            {/* Pending Challenge Invitations */}
            {pendingChallengeInvites.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Challenge Invitations ({pendingChallengeInvites.length})
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingChallengeInvites.map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      userParticipation="pending"
                      onUpdate={loadChallengesData}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Your Challenges */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Your Challenges ({userChallenges.length})
              </h2>
              
              {userChallenges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userChallenges.map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      userParticipation="accepted" // User is participating if it's in their challenges
                      onUpdate={loadChallengesData}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🏆</div>
                  <p>No challenges yet</p>
                  <p className="text-sm">Join public challenges or create your own to get started!</p>
                </div>
              )}
            </div>

            {/* Public Challenges */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Discover Challenges ({publicChallenges.length})
              </h2>
              
              {publicChallenges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {publicChallenges.slice(0, 6).map((challenge) => {
                    // Check if user is already participating
                    const isParticipating = userChallenges.some(uc => uc.id === challenge.id)
                    const isPending = pendingChallengeInvites.some(pc => pc.id === challenge.id)
                    
                    let participation: 'none' | 'pending' | 'accepted' = 'none'
                    if (isParticipating) participation = 'accepted'
                    else if (isPending) participation = 'pending'
                    
                    return (
                      <ChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        userParticipation={participation}
                        onUpdate={loadChallengesData}
                      />
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🔍</div>
                  <p>No public challenges available</p>
                  <p className="text-sm">Check back later for new challenges!</p>
                </div>
              )}
              
              {publicChallenges.length > 6 && (
                <div className="mt-6 text-center">
                  <button className="text-teal-600 hover:text-teal-700 font-medium">
                    View All Challenges ({publicChallenges.length - 6} more)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}