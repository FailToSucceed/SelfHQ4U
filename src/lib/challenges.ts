import { supabase } from './supabase'
import type { 
  Challenge, 
  CreateChallengeData, 
  ChallengeParticipant 
} from '@/types/profile'

// Create a new challenge
export async function createChallenge(data: CreateChallengeData): Promise<Challenge> {
  const { data: user } = await supabase.auth.getUser()
  
  if (!user.user) {
    throw new Error('User not authenticated')
  }

  const challengeData = {
    ...data,
    creator_id: user.user.id
  }

  const { data: created, error } = await supabase
    .from('challenges')
    .insert(challengeData)
    .select(`
      *,
      creator_profile:user_profiles!creator_id(*)
    `)
    .single()

  if (error) throw error

  // If there are invited friends, send them invitations
  if (data.invited_friends && data.invited_friends.length > 0) {
    const participantInvites = data.invited_friends.map(userId => ({
      challenge_id: created.id,
      user_id: userId,
      status: 'pending'
    }))

    await supabase
      .from('challenge_participants')
      .insert(participantInvites)
  }

  return created
}

// Get user's challenges (created and participating)
export async function getUserChallenges(): Promise<Challenge[]> {
  const { data: user } = await supabase.auth.getUser()
  
  if (!user.user) return []

  const { data, error } = await supabase
    .from('challenges')
    .select(`
      *,
      creator_profile:user_profiles!creator_id(*),
      participants:challenge_participants(
        *,
        user_profile:user_profiles!user_id(*)
      )
    `)
    .or(`creator_id.eq.${user.user.id},id.in.(${await getUserParticipatingChallengeIds()})`)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Get challenge IDs where user is participating
async function getUserParticipatingChallengeIds(): Promise<string> {
  const { data: user } = await supabase.auth.getUser()
  
  if (!user.user) return ''

  const { data, error } = await supabase
    .from('challenge_participants')
    .select('challenge_id')
    .eq('user_id', user.user.id)

  if (error || !data) return ''
  
  return data.map(p => p.challenge_id).join(',') || 'none'
}

// Get public challenges
export async function getPublicChallenges(limit: number = 20): Promise<Challenge[]> {
  const { data, error } = await supabase
    .from('challenges')
    .select(`
      *,
      creator_profile:user_profiles!creator_id(*),
      participant_count:challenge_participants(count)
    `)
    .eq('is_public', true)
    .gte('end_date', new Date().toISOString().split('T')[0]) // Only future/current challenges
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

// Join a challenge
export async function joinChallenge(challengeId: string): Promise<ChallengeParticipant> {
  const { data: user } = await supabase.auth.getUser()
  
  if (!user.user) {
    throw new Error('User not authenticated')
  }

  // Check if user is already participating
  const { data: existing } = await supabase
    .from('challenge_participants')
    .select('*')
    .eq('challenge_id', challengeId)
    .eq('user_id', user.user.id)
    .single()

  if (existing) {
    throw new Error('Already participating in this challenge')
  }

  // Get challenge details to check if approval is required
  const { data: challenge } = await supabase
    .from('challenges')
    .select('requires_approval, max_participants')
    .eq('id', challengeId)
    .single()

  if (!challenge) {
    throw new Error('Challenge not found')
  }

  // Check participant limit
  if (challenge.max_participants) {
    const { count } = await supabase
      .from('challenge_participants')
      .select('*', { count: 'exact', head: true })
      .eq('challenge_id', challengeId)
      .in('status', ['accepted', 'pending'])

    if (count && count >= challenge.max_participants) {
      throw new Error('Challenge is full')
    }
  }

  const status = challenge.requires_approval ? 'pending' : 'accepted'

  const { data: participant, error } = await supabase
    .from('challenge_participants')
    .insert({
      challenge_id: challengeId,
      user_id: user.user.id,
      status
    })
    .select(`
      *,
      user_profile:user_profiles!user_id(*)
    `)
    .single()

  if (error) throw error
  return participant
}

// Respond to challenge invitation
export async function respondToChallengeInvitation(
  challengeId: string, 
  status: 'accepted' | 'declined'
): Promise<ChallengeParticipant> {
  const { data: user } = await supabase.auth.getUser()
  
  if (!user.user) {
    throw new Error('User not authenticated')
  }

  const { data: updated, error } = await supabase
    .from('challenge_participants')
    .update({ status })
    .eq('challenge_id', challengeId)
    .eq('user_id', user.user.id)
    .select(`
      *,
      user_profile:user_profiles!user_id(*)
    `)
    .single()

  if (error) throw error
  return updated
}

// Update challenge progress
export async function updateChallengeProgress(
  challengeId: string, 
  progress: Record<string, any>
): Promise<ChallengeParticipant> {
  const { data: user } = await supabase.auth.getUser()
  
  if (!user.user) {
    throw new Error('User not authenticated')
  }

  const { data: updated, error } = await supabase
    .from('challenge_participants')
    .update({ progress })
    .eq('challenge_id', challengeId)
    .eq('user_id', user.user.id)
    .select(`
      *,
      user_profile:user_profiles!user_id(*)
    `)
    .single()

  if (error) throw error
  return updated
}

// Complete a challenge
export async function completeChallenge(challengeId: string): Promise<ChallengeParticipant> {
  const { data: user } = await supabase.auth.getUser()
  
  if (!user.user) {
    throw new Error('User not authenticated')
  }

  const { data: updated, error } = await supabase
    .from('challenge_participants')
    .update({ 
      status: 'completed',
      completed_at: new Date().toISOString()
    })
    .eq('challenge_id', challengeId)
    .eq('user_id', user.user.id)
    .select(`
      *,
      user_profile:user_profiles!user_id(*)
    `)
    .single()

  if (error) throw error
  return updated
}

// Get challenge participants
export async function getChallengeParticipants(challengeId: string): Promise<ChallengeParticipant[]> {
  const { data, error } = await supabase
    .from('challenge_participants')
    .select(`
      *,
      user_profile:user_profiles!user_id(*)
    `)
    .eq('challenge_id', challengeId)
    .order('joined_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Get pending challenge invitations for current user
export async function getPendingChallengeInvitations(): Promise<Challenge[]> {
  const { data: user } = await supabase.auth.getUser()
  
  if (!user.user) return []

  const { data, error } = await supabase
    .from('challenges')
    .select(`
      *,
      creator_profile:user_profiles!creator_id(*),
      my_participation:challenge_participants!challenge_id(status)
    `)
    .eq('challenge_participants.user_id', user.user.id)
    .eq('challenge_participants.status', 'pending')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Delete/cancel a challenge (only by creator)
export async function deleteChallenge(challengeId: string): Promise<void> {
  const { data: user } = await supabase.auth.getUser()
  
  if (!user.user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase
    .from('challenges')
    .delete()
    .eq('id', challengeId)
    .eq('creator_id', user.user.id)

  if (error) throw error
}