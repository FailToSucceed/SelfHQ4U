import { supabase } from './supabase'
import type { Reflection, ReflectionFormData, WeeklyReflectionStats } from '@/types/reflection'

// Get the Monday of the current week
export function getWeekMonday(date: Date = new Date()): string {
  const monday = new Date(date)
  const day = monday.getDay()
  const diff = monday.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  monday.setDate(diff)
  monday.setHours(0, 0, 0, 0)
  return monday.toISOString().split('T')[0] // Return just the date part
}

// Get reflection for a specific week
export async function getReflectionForWeek(weekOf: string): Promise<Reflection | null> {
  const { data, error } = await supabase
    .from('reflections')
    .select('*')
    .eq('week_of', weekOf)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
    throw error
  }

  return data
}

// Get current week's reflection
export async function getCurrentWeekReflection(): Promise<Reflection | null> {
  const weekOf = getWeekMonday()
  return getReflectionForWeek(weekOf)
}

// Save or update reflection
export async function saveReflection(
  data: ReflectionFormData, 
  isDraft: boolean = true
): Promise<Reflection> {
  const weekOf = getWeekMonday()
  const { data: user } = await supabase.auth.getUser()
  
  if (!user.user) {
    throw new Error('User not authenticated')
  }

  const reflectionData = {
    week_of: weekOf,
    user_id: user.user.id,
    ...data,
    is_draft: isDraft,
    submitted_at: isDraft ? null : new Date().toISOString()
  }

  // Try to update existing reflection first
  const { data: existing } = await supabase
    .from('reflections')
    .select('id')
    .eq('week_of', weekOf)
    .eq('user_id', user.user.id)
    .single()

  if (existing) {
    // Update existing reflection
    const { data: updated, error } = await supabase
      .from('reflections')
      .update(reflectionData)
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw error
    return updated
  } else {
    // Create new reflection
    const { data: created, error } = await supabase
      .from('reflections')
      .insert(reflectionData)
      .select()
      .single()

    if (error) throw error
    return created
  }
}

// Get user's reflection history
export async function getUserReflections(limit: number = 10): Promise<Reflection[]> {
  const { data, error } = await supabase
    .from('reflections')
    .select('*')
    .order('week_of', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

// Get reflection statistics
export async function getReflectionStats(): Promise<WeeklyReflectionStats> {
  const { data: reflections, error } = await supabase
    .from('reflections')
    .select('values_alignment, mission_progress, vision_progress, created_at')
    .eq('is_draft', false)
    .order('created_at', { ascending: false })

  if (error) throw error

  const stats: WeeklyReflectionStats = {
    total_reflections: reflections.length,
    average_values_alignment: 0,
    average_mission_progress: 0,
    average_vision_progress: 0
  }

  if (reflections.length > 0) {
    const valuesSum = reflections.reduce((sum, r) => sum + (r.values_alignment || 0), 0)
    const missionSum = reflections.reduce((sum, r) => sum + (r.mission_progress || 0), 0)
    const visionSum = reflections.reduce((sum, r) => sum + (r.vision_progress || 0), 0)

    stats.average_values_alignment = valuesSum / reflections.length
    stats.average_mission_progress = missionSum / reflections.length
    stats.average_vision_progress = visionSum / reflections.length
  }

  // Get most recent reflection
  const { data: recent } = await supabase
    .from('reflections')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (recent) {
    stats.most_recent_reflection = recent
  }

  return stats
}

// Delete reflection
export async function deleteReflection(id: string): Promise<void> {
  const { error } = await supabase
    .from('reflections')
    .delete()
    .eq('id', id)

  if (error) throw error
}