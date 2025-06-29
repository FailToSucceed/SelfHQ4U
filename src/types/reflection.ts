export interface Reflection {
  id: string
  user_id: string
  week_of: string // ISO date string for the Monday of the week
  
  // Values alignment (1-10 scale)
  values_alignment?: number
  values_reflection?: string
  
  // Mission progress (1-10 scale)
  mission_progress?: number
  mission_reflection?: string
  
  // Weekly progress reflection
  week_progress_reflection?: string
  week_challenges?: string
  week_wins?: string
  
  // Vision progress (1-10 scale)
  vision_progress?: number
  vision_reflection?: string
  
  // Gratitude
  gratitude_items?: string[]
  
  // Metadata
  is_draft: boolean
  submitted_at?: string
  created_at: string
  updated_at: string
}

export interface ReflectionFormData {
  values_alignment?: number
  values_reflection?: string
  mission_progress?: number
  mission_reflection?: string
  week_progress_reflection?: string
  week_challenges?: string
  week_wins?: string
  vision_progress?: number
  vision_reflection?: string
  gratitude_items?: string[]
}

export interface WeeklyReflectionStats {
  total_reflections: number
  average_values_alignment: number
  average_mission_progress: number
  average_vision_progress: number
  most_recent_reflection?: Reflection
}