export type ResourceType = 'book' | 'audiobook' | 'podcast' | 'video' | 'article' | 'course' | 'tool' | 'other'
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'
export type VoteType = 'upvote' | 'downvote'

export interface Resource {
  id: string
  user_id: string
  
  // Resource details
  title: string
  description?: string
  author?: string // For books/audiobooks
  host?: string // For podcasts
  resource_type: ResourceType
  category_id?: string
  
  // External links
  url?: string
  affiliate_link?: string
  
  // User ratings and engagement
  rating?: number // 1-5 scale
  difficulty_level?: DifficultyLevel
  estimated_time?: string
  
  // Tags for categorization
  tags?: string[]
  
  // Moderation and quality control
  is_approved: boolean
  is_featured: boolean
  admin_notes?: string
  
  // Statistics
  upvotes: number
  downvotes: number
  view_count: number
  
  // Metadata
  created_at: string
  updated_at: string
  
  // Joined data
  category?: {
    id: string
    name: string
    icon: string
    color: string
  }
  user?: {
    id: string
    first_name: string
    last_name: string
  }
  user_vote?: VoteType
}

export interface ResourceVote {
  id: string
  user_id: string
  resource_id: string
  vote_type: VoteType
  created_at: string
}

export interface ResourceView {
  id: string
  user_id?: string
  resource_id: string
  viewed_at: string
}

export interface ResourceFormData {
  title: string
  description?: string
  author?: string
  host?: string
  resource_type: ResourceType
  category_id?: string
  url?: string
  rating?: number
  difficulty_level?: DifficultyLevel
  estimated_time?: string
  tags?: string[]
}

export interface ResourceFilters {
  resource_type?: ResourceType
  category_id?: string
  difficulty_level?: DifficultyLevel
  rating_min?: number
  is_featured?: boolean
  search?: string
  tags?: string[]
}

export interface ResourceStats {
  total_resources: number
  total_by_type: Record<ResourceType, number>
  total_by_category: Record<string, number>
  most_popular: Resource[]
  recently_added: Resource[]
}