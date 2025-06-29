export interface UserProfile {
  id: string
  user_id: string
  username: string
  first_name?: string
  last_name?: string
  email?: string
  bio?: string
  location?: string
  website?: string
  date_of_birth?: string
  is_public: boolean
  show_real_name: boolean
  show_location: boolean
  show_stats: boolean
  avatar_url?: string
  theme_preference: 'light' | 'dark' | 'system'
  allow_friend_requests: boolean
  allow_challenges: boolean
  show_in_leaderboards: boolean
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export interface FriendConnection {
  id: string
  requester_id: string
  addressee_id: string
  status: 'pending' | 'accepted' | 'declined' | 'blocked'
  created_at: string
  updated_at: string
  requester_profile?: UserProfile
  addressee_profile?: UserProfile
}

export interface FriendInvitation {
  id: string
  inviter_id: string
  email: string
  invitation_code: string
  message?: string
  status: 'pending' | 'accepted' | 'expired'
  expires_at: string
  created_at: string
  inviter_profile?: UserProfile
}

export type ChallengeType = 'habit_streak' | 'custom_goal' | 'activity_count' | 'duration_based'

export interface Challenge {
  id: string
  creator_id: string
  title: string
  description?: string
  challenge_type: ChallengeType
  parameters: Record<string, any>
  start_date: string
  end_date: string
  is_public: boolean
  max_participants?: number
  requires_approval: boolean
  created_at: string
  updated_at: string
  creator_profile?: UserProfile
  participants?: ChallengeParticipant[]
  participant_count?: number
}

export interface ChallengeParticipant {
  id: string
  challenge_id: string
  user_id: string
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'failed'
  progress: Record<string, any>
  joined_at: string
  completed_at?: string
  user_profile?: UserProfile
}

export interface ProfileFormData {
  username?: string
  first_name?: string
  last_name?: string
  bio?: string
  location?: string
  website?: string
  date_of_birth?: string
  is_public?: boolean
  show_real_name?: boolean
  show_location?: boolean
  show_stats?: boolean
  theme_preference?: 'light' | 'dark' | 'system'
  allow_friend_requests?: boolean
  allow_challenges?: boolean
  show_in_leaderboards?: boolean
}

export interface InviteFriendData {
  email: string
  message?: string
}

export interface CreateChallengeData {
  title: string
  description?: string
  challenge_type: ChallengeType
  parameters: Record<string, any>
  start_date: string
  end_date: string
  is_public: boolean
  max_participants?: number
  requires_approval: boolean
  invited_friends?: string[] // User IDs to invite
}

export interface PublicUser {
  id: string
  username: string
  display_name: string // Either username or real name based on preferences
  avatar_url?: string
  is_public: boolean
}