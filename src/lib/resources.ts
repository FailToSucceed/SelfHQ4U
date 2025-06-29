import { supabase } from './supabase'
import type { 
  Resource, 
  ResourceFormData, 
  ResourceFilters, 
  ResourceStats, 
  VoteType 
} from '@/types/resource'

// Get all approved resources with filters
export async function getResources(filters: ResourceFilters = {}): Promise<Resource[]> {
  let query = supabase
    .from('resources')
    .select(`
      *,
      category:categories(id, name, icon, color),
      user:users!user_id(id, first_name, last_name)
    `)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  // Apply filters
  if (filters.resource_type) {
    query = query.eq('resource_type', filters.resource_type)
  }
  
  if (filters.category_id) {
    query = query.eq('category_id', filters.category_id)
  }
  
  if (filters.difficulty_level) {
    query = query.eq('difficulty_level', filters.difficulty_level)
  }
  
  if (filters.rating_min) {
    query = query.gte('rating', filters.rating_min)
  }
  
  if (filters.is_featured) {
    query = query.eq('is_featured', true)
  }
  
  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,author.ilike.%${filters.search}%`)
  }

  const { data, error } = await query

  if (error) throw error

  // Filter by tags if provided
  let resources = data || []
  if (filters.tags && filters.tags.length > 0) {
    resources = resources.filter(resource => 
      resource.tags && resource.tags.some((tag: string) => 
        filters.tags!.some((filterTag: string) => 
          tag.toLowerCase().includes(filterTag.toLowerCase())
        )
      )
    )
  }

  return resources
}

// Get featured resources
export async function getFeaturedResources(limit: number = 5): Promise<Resource[]> {
  const { data, error } = await supabase
    .from('resources')
    .select(`
      *,
      category:categories(id, name, icon, color),
      user:users!user_id(id, first_name, last_name)
    `)
    .eq('is_approved', true)
    .eq('is_featured', true)
    .order('upvotes', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

// Get popular resources (highest upvotes)
export async function getPopularResources(limit: number = 10): Promise<Resource[]> {
  const { data, error } = await supabase
    .from('resources')
    .select(`
      *,
      category:categories(id, name, icon, color),
      user:users!user_id(id, first_name, last_name)
    `)
    .eq('is_approved', true)
    .order('upvotes', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

// Get user's submitted resources
export async function getUserResources(): Promise<Resource[]> {
  const { data, error } = await supabase
    .from('resources')
    .select(`
      *,
      category:categories(id, name, icon, color)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Submit new resource
export async function submitResource(data: ResourceFormData): Promise<Resource> {
  const { data: user } = await supabase.auth.getUser()
  
  if (!user.user) {
    throw new Error('User not authenticated')
  }

  const resourceData = {
    ...data,
    user_id: user.user.id,
    is_approved: false, // Resources need approval by default
    is_featured: false,
    upvotes: 0,
    downvotes: 0,
    view_count: 0
  }

  const { data: created, error } = await supabase
    .from('resources')
    .insert(resourceData)
    .select(`
      *,
      category:categories(id, name, icon, color)
    `)
    .single()

  if (error) throw error
  return created
}

// Update resource
export async function updateResource(id: string, data: Partial<ResourceFormData>): Promise<Resource> {
  const { data: updated, error } = await supabase
    .from('resources')
    .update(data)
    .eq('id', id)
    .select(`
      *,
      category:categories(id, name, icon, color)
    `)
    .single()

  if (error) throw error
  return updated
}

// Delete resource
export async function deleteResource(id: string): Promise<void> {
  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Vote on resource
export async function voteOnResource(resourceId: string, voteType: VoteType): Promise<void> {
  const { data: user } = await supabase.auth.getUser()
  
  if (!user.user) {
    throw new Error('User not authenticated')
  }

  // Check if user has already voted
  const { data: existingVote } = await supabase
    .from('resource_votes')
    .select('id, vote_type')
    .eq('user_id', user.user.id)
    .eq('resource_id', resourceId)
    .single()

  if (existingVote) {
    if (existingVote.vote_type === voteType) {
      // Remove vote if same type
      const { error } = await supabase
        .from('resource_votes')
        .delete()
        .eq('id', existingVote.id)
      
      if (error) throw error
    } else {
      // Update vote if different type
      const { error } = await supabase
        .from('resource_votes')
        .update({ vote_type: voteType })
        .eq('id', existingVote.id)
      
      if (error) throw error
    }
  } else {
    // Create new vote
    const { error } = await supabase
      .from('resource_votes')
      .insert({
        user_id: user.user.id,
        resource_id: resourceId,
        vote_type: voteType
      })
    
    if (error) throw error
  }
}

// Get user's vote for a resource
export async function getUserVote(resourceId: string): Promise<VoteType | null> {
  const { data: user } = await supabase.auth.getUser()
  
  if (!user.user) return null

  const { data, error } = await supabase
    .from('resource_votes')
    .select('vote_type')
    .eq('user_id', user.user.id)
    .eq('resource_id', resourceId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data?.vote_type || null
}

// Record resource view
export async function recordResourceView(resourceId: string): Promise<void> {
  const { data: user } = await supabase.auth.getUser()
  
  const { error } = await supabase
    .from('resource_views')
    .insert({
      user_id: user.user?.id || null,
      resource_id: resourceId
    })

  if (error) throw error
}

// Get resource statistics
export async function getResourceStats(): Promise<ResourceStats> {
  // Get total count
  const { count: totalResources } = await supabase
    .from('resources')
    .select('*', { count: 'exact', head: true })
    .eq('is_approved', true)

  // Get counts by type
  const { data: typeData } = await supabase
    .from('resources')
    .select('resource_type')
    .eq('is_approved', true)

  const totalByType = typeData?.reduce((acc, resource: any) => {
    acc[resource.resource_type] = (acc[resource.resource_type] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  // Get counts by category
  const { data: categoryData } = await supabase
    .from('resources')
    .select('category_id, category:categories(name)')
    .eq('is_approved', true)
    .not('category_id', 'is', null)

  const totalByCategory = categoryData?.reduce((acc, resource: any) => {
    const categoryName = resource.category?.name || 'Other'
    acc[categoryName] = (acc[categoryName] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  // Get most popular resources
  const mostPopular = await getPopularResources(5)

  // Get recently added resources
  const { data: recentlyAdded } = await supabase
    .from('resources')
    .select(`
      *,
      category:categories(id, name, icon, color),
      user:users!user_id(id, first_name, last_name)
    `)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(5)

  return {
    total_resources: totalResources || 0,
    total_by_type: totalByType,
    total_by_category: totalByCategory,
    most_popular: mostPopular,
    recently_added: recentlyAdded || []
  }
}