import { supabase } from './supabase'
import type { 
  UserProfile, 
  ProfileFormData, 
  FriendConnection, 
  FriendInvitation, 
  InviteFriendData,
  PublicUser 
} from '@/types/profile'

// Get current user's profile
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const { data: user } = await supabase.auth.getUser()
  
  if (!user.user) return null

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.user.id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

// Get profile by username
export async function getProfileByUsername(username: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

// Get profile by user ID
export async function getProfileByUserId(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

// Update user profile
export async function updateUserProfile(data: ProfileFormData): Promise<UserProfile> {
  const { data: user } = await supabase.auth.getUser()
  
  if (!user.user) {
    throw new Error('User not authenticated')
  }

  const { data: updated, error } = await supabase
    .from('user_profiles')
    .update(data)
    .eq('user_id', user.user.id)
    .select()
    .single()

  if (error) throw error
  return updated
}

// Check if username is available
export async function isUsernameAvailable(username: string, currentUserId?: string): Promise<boolean> {
  let query = supabase
    .from('user_profiles')
    .select('id')
    .eq('username', username)

  if (currentUserId) {
    query = query.neq('user_id', currentUserId)
  }

  const { data, error } = await query

  if (error) throw error
  return data.length === 0
}

// Search users by username or name
export async function searchUsers(query: string, limit: number = 10): Promise<PublicUser[]> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('user_id, username, first_name, last_name, avatar_url, is_public, show_real_name')
    .eq('is_public', true)
    .or(`username.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
    .limit(limit)

  if (error) throw error

  return data.map(profile => ({
    id: profile.user_id,
    username: profile.username,
    display_name: profile.show_real_name && profile.first_name 
      ? `${profile.first_name} ${profile.last_name || ''}`.trim()
      : profile.username,
    avatar_url: profile.avatar_url,
    is_public: profile.is_public
  }))
}

// Get user's friends
export async function getUserFriends(): Promise<PublicUser[]> {
  const { data: user } = await supabase.auth.getUser()
  
  if (!user.user) return []

  const { data, error } = await supabase
    .from('friend_connections')
    .select(`
      *,
      requester_profile:user_profiles!requester_id(user_id, username, first_name, last_name, avatar_url, show_real_name),
      addressee_profile:user_profiles!addressee_id(user_id, username, first_name, last_name, avatar_url, show_real_name)
    `)
    .eq('status', 'accepted')
    .or(`requester_id.eq.${user.user.id},addressee_id.eq.${user.user.id}`)

  if (error) throw error

  return data.map(connection => {
    const friendProfile = connection.requester_id === user.user!.id 
      ? connection.addressee_profile 
      : connection.requester_profile

    return {
      id: friendProfile.user_id,
      username: friendProfile.username,
      display_name: friendProfile.show_real_name && friendProfile.first_name 
        ? `${friendProfile.first_name} ${friendProfile.last_name || ''}`.trim()
        : friendProfile.username,
      avatar_url: friendProfile.avatar_url,
      is_public: true
    }
  })
}

// Send friend request
export async function sendFriendRequest(userId: string): Promise<FriendConnection> {
  const { data: user } = await supabase.auth.getUser()
  
  if (!user.user) {
    throw new Error('User not authenticated')
  }

  // Check if connection already exists
  const { data: existing } = await supabase
    .from('friend_connections')
    .select('*')
    .or(`and(requester_id.eq.${user.user.id},addressee_id.eq.${userId}),and(requester_id.eq.${userId},addressee_id.eq.${user.user.id})`)

  if (existing && existing.length > 0) {
    throw new Error('Friend connection already exists')
  }

  const { data, error } = await supabase
    .from('friend_connections')
    .insert({
      requester_id: user.user.id,
      addressee_id: userId
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Respond to friend request
export async function respondToFriendRequest(
  connectionId: string, 
  status: 'accepted' | 'declined'
): Promise<FriendConnection> {
  const { data, error } = await supabase
    .from('friend_connections')
    .update({ status })
    .eq('id', connectionId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Get pending friend requests
export async function getPendingFriendRequests(): Promise<FriendConnection[]> {
  const { data: user } = await supabase.auth.getUser()
  
  if (!user.user) return []

  const { data, error } = await supabase
    .from('friend_connections')
    .select(`
      *,
      requester_profile:user_profiles!requester_id(*)
    `)
    .eq('addressee_id', user.user.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Invite friend by email
export async function inviteFriendByEmail(data: InviteFriendData): Promise<FriendInvitation> {
  const { data: user } = await supabase.auth.getUser()
  
  if (!user.user) {
    throw new Error('User not authenticated')
  }

  const { data: invitation, error } = await supabase
    .from('friend_invitations')
    .insert({
      inviter_id: user.user.id,
      email: data.email,
      message: data.message
    })
    .select()
    .single()

  if (error) throw error

  // TODO: Send email invitation (integrate with email service)
  
  return invitation
}

// Get sent invitations
export async function getSentInvitations(): Promise<FriendInvitation[]> {
  const { data: user } = await supabase.auth.getUser()
  
  if (!user.user) return []

  const { data, error } = await supabase
    .from('friend_invitations')
    .select('*')
    .eq('inviter_id', user.user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Accept invitation by code (for new users)
export async function acceptInvitationByCode(invitationCode: string): Promise<FriendInvitation> {
  const { data: user } = await supabase.auth.getUser()
  
  if (!user.user) {
    throw new Error('User not authenticated')
  }

  // Get invitation
  const { data: invitation, error: inviteError } = await supabase
    .from('friend_invitations')
    .select('*')
    .eq('invitation_code', invitationCode)
    .eq('status', 'pending')
    .single()

  if (inviteError || !invitation) {
    throw new Error('Invalid or expired invitation')
  }

  // Check if invitation is expired
  if (new Date(invitation.expires_at) < new Date()) {
    throw new Error('Invitation has expired')
  }

  // Mark invitation as accepted
  const { data: updated, error: updateError } = await supabase
    .from('friend_invitations')
    .update({ status: 'accepted' })
    .eq('id', invitation.id)
    .select()
    .single()

  if (updateError) throw updateError

  // Create friend connection
  await supabase
    .from('friend_connections')
    .insert({
      requester_id: invitation.inviter_id,
      addressee_id: user.user.id,
      status: 'accepted'
    })

  return updated
}

// Get public user info for displays (leaderboards, etc.)
export async function getPublicUserInfo(userId: string): Promise<PublicUser | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('user_id, username, first_name, last_name, avatar_url, is_public, show_real_name')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  if (!data) return null

  return {
    id: data.user_id,
    username: data.username,
    display_name: data.show_real_name && data.first_name 
      ? `${data.first_name} ${data.last_name || ''}`.trim()
      : data.username,
    avatar_url: data.avatar_url,
    is_public: data.is_public
  }
}

// Bulk get public user info
export async function getBulkPublicUserInfo(userIds: string[]): Promise<Record<string, PublicUser>> {
  if (userIds.length === 0) return {}

  const { data, error } = await supabase
    .from('user_profiles')
    .select('user_id, username, first_name, last_name, avatar_url, is_public, show_real_name')
    .in('user_id', userIds)

  if (error) throw error

  const result: Record<string, PublicUser> = {}
  
  data.forEach(profile => {
    result[profile.user_id] = {
      id: profile.user_id,
      username: profile.username,
      display_name: profile.show_real_name && profile.first_name 
        ? `${profile.first_name} ${profile.last_name || ''}`.trim()
        : profile.username,
      avatar_url: profile.avatar_url,
      is_public: profile.is_public
    }
  })

  return result
}