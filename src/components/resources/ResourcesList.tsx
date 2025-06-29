'use client'

import { useState, useEffect } from 'react'
import { getResources, getFeaturedResources, voteOnResource, getUserVote, recordResourceView } from '@/lib/resources'
import type { Resource, ResourceFilters, ResourceType } from '@/types/resource'

export default function ResourcesList() {
  const [resources, setResources] = useState<Resource[]>([])
  const [featuredResources, setFeaturedResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<ResourceFilters>({})
  const [activeFilter, setActiveFilter] = useState<'all' | 'featured'>('featured')

  const resourceTypes: { value: ResourceType; label: string; icon: string }[] = [
    { value: 'book', label: 'Books', icon: '📚' },
    { value: 'audiobook', label: 'Audiobooks', icon: '🎧' },
    { value: 'podcast', label: 'Podcasts', icon: '🎙️' },
    { value: 'video', label: 'Videos', icon: '🎥' },
    { value: 'article', label: 'Articles', icon: '📰' },
    { value: 'course', label: 'Courses', icon: '🎓' },
    { value: 'tool', label: 'Tools', icon: '🛠️' },
    { value: 'other', label: 'Other', icon: '📋' }
  ]

  // Load resources
  useEffect(() => {
    const loadResources = async () => {
      try {
        setLoading(true)
        
        if (activeFilter === 'featured') {
          const featured = await getFeaturedResources(10)
          setFeaturedResources(featured)
        } else {
          const allResources = await getResources(filters)
          setResources(allResources)
        }
      } catch (error) {
        console.error('Error loading resources:', error)
      } finally {
        setLoading(false)
      }
    }

    loadResources()
  }, [filters, activeFilter])

  const handleVote = async (resourceId: string, voteType: 'upvote' | 'downvote') => {
    try {
      await voteOnResource(resourceId, voteType)
      
      // Refresh the resource list to show updated vote counts
      if (activeFilter === 'featured') {
        const featured = await getFeaturedResources(10)
        setFeaturedResources(featured)
      } else {
        const allResources = await getResources(filters)
        setResources(allResources)
      }
    } catch (error) {
      console.error('Error voting on resource:', error)
    }
  }

  const handleResourceClick = async (resource: Resource) => {
    try {
      await recordResourceView(resource.id)
      
      // Open URL if available
      if (resource.url) {
        window.open(resource.url, '_blank')
      }
    } catch (error) {
      console.error('Error recording resource view:', error)
    }
  }

  const handleFilterChange = (filterType: keyof ResourceFilters, value: any) => {
    setFilters(prev => ({ ...prev, [filterType]: value }))
  }

  const clearFilters = () => {
    setFilters({})
  }

  const displayedResources = activeFilter === 'featured' ? featuredResources : resources

  const getResourceIcon = (type: ResourceType) => {
    const resourceType = resourceTypes.find(t => t.value === type)
    return resourceType?.icon || '📋'
  }

  const getRatingStars = (rating?: number) => {
    if (!rating) return null
    return '⭐'.repeat(rating)
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Community Resources</h3>
        
        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveFilter('featured')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === 'featured'
                ? 'bg-teal-100 text-teal-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            ⭐ Featured
          </button>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-teal-100 text-teal-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            📚 All
          </button>
        </div>
      </div>

      {/* Filters for 'all' view */}
      {activeFilter === 'all' && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={filters.resource_type || ''}
                onChange={(e) => handleFilterChange('resource_type', e.target.value as ResourceType || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">All types</option>
                {resourceTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                value={filters.difficulty_level || ''}
                onChange={(e) => handleFilterChange('difficulty_level', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">All levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search resources..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
          
          {Object.keys(filters).length > 0 && (
            <button
              onClick={clearFilters}
              className="mt-3 text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Resources List */}
      <div className="space-y-4">
        {displayedResources.length > 0 ? (
          displayedResources.map((resource) => (
            <div
              key={resource.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-2xl">{getResourceIcon(resource.resource_type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{resource.title}</h4>
                      {resource.is_featured && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    {(resource.author || resource.host) && (
                      <p className="text-sm text-gray-600 mb-1">
                        by {resource.author || resource.host}
                      </p>
                    )}
                    
                    {resource.description && (
                      <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                        {resource.description}
                      </p>
                    )}
                    
                    {/* Metadata */}
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      {resource.category && (
                        <span className="flex items-center gap-1">
                          {resource.category.icon} {resource.category.name}
                        </span>
                      )}
                      
                      {resource.difficulty_level && (
                        <span className={`px-2 py-1 rounded-full ${getDifficultyColor(resource.difficulty_level)}`}>
                          {resource.difficulty_level}
                        </span>
                      )}
                      
                      {resource.estimated_time && (
                        <span>⏱️ {resource.estimated_time}</span>
                      )}
                      
                      {resource.rating && (
                        <span>{getRatingStars(resource.rating)}</span>
                      )}
                    </div>
                    
                    {/* Tags */}
                    {resource.tags && resource.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {resource.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {resource.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{resource.tags.length - 3} more</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleVote(resource.id, 'upvote')}
                      className="text-gray-400 hover:text-green-600 transition-colors"
                    >
                      👍
                    </button>
                    <span className="text-xs text-gray-500">{resource.upvotes}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleVote(resource.id, 'downvote')}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      👎
                    </button>
                    <span className="text-xs text-gray-500">{resource.downvotes}</span>
                  </div>
                  
                  {resource.url && (
                    <button
                      onClick={() => handleResourceClick(resource)}
                      className="bg-teal-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-teal-600 transition-colors"
                    >
                      View
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📚</div>
            <p>No resources found</p>
            <p className="text-sm">
              {activeFilter === 'featured' 
                ? 'No featured resources available yet.' 
                : 'Try adjusting your filters or be the first to suggest a resource!'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}