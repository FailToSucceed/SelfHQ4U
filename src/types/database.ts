// TypeScript interfaces for SelfHQ database entities

export interface Category {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  created_at?: string
}

export interface Habit {
  id: string
  title: string
  description: string
  category_id?: string
  creator_id: string
  is_private: boolean
  price: number
  created_at?: string
  updated_at?: string
  // Joined fields
  category?: Category
  creator?: Profile
}

export interface UserHabit {
  id: string
  user_id: string
  habit_id: string
  adopted_at?: string
  is_active: boolean
  streak_count: number
  last_completed_at?: string
  // Joined fields
  habit?: Habit
}

export interface Challenge {
  id: string
  title: string
  description: string
  category_id?: string
  creator_id: string
  duration_days: number
  is_private: boolean
  price: number
  start_date?: string
  end_date?: string
  max_participants?: number
  created_at?: string
  updated_at?: string
  // Joined fields
  category?: Category
  creator?: Profile
}

export interface UserChallenge {
  id: string
  user_id: string
  challenge_id: string
  joined_at?: string
  completed_at?: string
  progress_percentage: number
  is_active: boolean
  // Joined fields
  challenge?: Challenge
}

export interface Event {
  id: string
  title: string
  description: string
  category_id?: string
  organizer_id: string
  event_type: 'workshop' | 'seminar' | 'coaching' | 'meetup' | 'webinar' | 'retreat'
  start_datetime: string
  end_datetime: string
  location?: string
  virtual_link?: string
  is_virtual: boolean
  max_attendees?: number
  price: number
  is_private: boolean
  created_at?: string
  updated_at?: string
  // Joined fields
  category?: Category
  organizer?: Profile
}

export interface EventAttendee {
  id: string
  user_id: string
  event_id: string
  registered_at?: string
  attended: boolean
  // Joined fields
  event?: Event
  user?: Profile
}

export interface AIAgent {
  id: string
  name: string
  description: string
  category_id?: string
  creator_id: string
  agent_type: 'coach' | 'mentor' | 'advisor' | 'specialist'
  specialization?: string
  personality_traits?: Record<string, any>
  pricing_model: 'free' | 'subscription' | 'per_session' | 'one_time'
  price: number
  is_active: boolean
  created_at?: string
  updated_at?: string
  // Joined fields
  category?: Category
  creator?: Profile
}

export interface UserAIAgent {
  id: string
  user_id: string
  agent_id: string
  subscribed_at?: string
  is_active: boolean
  // Joined fields
  agent?: AIAgent
}

export interface UserSubscription {
  id: string
  user_id: string
  subscription_type: 'basic' | 'premium' | 'elite'
  start_date?: string
  end_date?: string
  is_active: boolean
  stripe_subscription_id?: string
  created_at?: string
  updated_at?: string
}

export interface Purchase {
  id: string
  buyer_id: string
  seller_id: string
  item_type: 'habit' | 'challenge' | 'event' | 'ai_agent'
  item_id: string
  amount: number
  stripe_payment_intent_id?: string
  purchased_at?: string
  status: 'pending' | 'completed' | 'refunded'
  // Joined fields
  buyer?: Profile
  seller?: Profile
}

export interface Profile {
  id: string
  first_name?: string
  last_name?: string
  address?: string
  onboarding_completed?: boolean
  created_at?: string
  updated_at?: string
  // Computed fields
  display_name?: string
}

// Supabase Database type for better type checking
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category
        Insert: Omit<Category, 'id' | 'created_at'>
        Update: Partial<Omit<Category, 'id' | 'created_at'>>
      }
      habits: {
        Row: Habit
        Insert: Omit<Habit, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Habit, 'id' | 'created_at' | 'updated_at'>>
      }
      user_habits: {
        Row: UserHabit
        Insert: Omit<UserHabit, 'id' | 'adopted_at'>
        Update: Partial<Omit<UserHabit, 'id' | 'adopted_at'>>
      }
      challenges: {
        Row: Challenge
        Insert: Omit<Challenge, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Challenge, 'id' | 'created_at' | 'updated_at'>>
      }
      user_challenges: {
        Row: UserChallenge
        Insert: Omit<UserChallenge, 'id' | 'joined_at'>
        Update: Partial<Omit<UserChallenge, 'id' | 'joined_at'>>
      }
      events: {
        Row: Event
        Insert: Omit<Event, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Event, 'id' | 'created_at' | 'updated_at'>>
      }
      event_attendees: {
        Row: EventAttendee
        Insert: Omit<EventAttendee, 'id' | 'registered_at'>
        Update: Partial<Omit<EventAttendee, 'id' | 'registered_at'>>
      }
      ai_agents: {
        Row: AIAgent
        Insert: Omit<AIAgent, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<AIAgent, 'id' | 'created_at' | 'updated_at'>>
      }
      user_ai_agents: {
        Row: UserAIAgent
        Insert: Omit<UserAIAgent, 'id' | 'subscribed_at'>
        Update: Partial<Omit<UserAIAgent, 'id' | 'subscribed_at'>>
      }
      user_subscriptions: {
        Row: UserSubscription
        Insert: Omit<UserSubscription, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserSubscription, 'id' | 'created_at' | 'updated_at'>>
      }
      purchases: {
        Row: Purchase
        Insert: Omit<Purchase, 'id' | 'purchased_at'>
        Update: Partial<Omit<Purchase, 'id' | 'purchased_at'>>
      }
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}