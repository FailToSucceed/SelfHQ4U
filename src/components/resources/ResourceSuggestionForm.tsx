'use client'

import { useState, useEffect } from 'react'
import { submitResource } from '@/lib/resources'
import { supabase } from '@/lib/supabase'
import type { ResourceFormData, ResourceType, DifficultyLevel } from '@/types/resource'

interface ResourceSuggestionFormProps {
  onSubmit?: () => void
}

interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export default function ResourceSuggestionForm({ onSubmit }: ResourceSuggestionFormProps) {
  const [formData, setFormData] = useState<ResourceFormData>({
    title: '',
    resource_type: 'book'
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name')

        if (error) throw error
        setCategories(data || [])
      } catch (error) {
        console.error('Error loading categories:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      setMessage('Please enter a title')
      return
    }

    try {
      setSubmitting(true)
      setMessage('')
      
      await submitResource(formData)
      setMessage('Resource suggestion submitted successfully! It will be reviewed before being published.')
      
      // Reset form
      setFormData({
        title: '',
        resource_type: 'book'
      })
      
      setShowForm(false)
      
      if (onSubmit) {
        onSubmit()
      }
      
      // Clear message after 5 seconds
      setTimeout(() => setMessage(''), 5000)
    } catch (error) {
      console.error('Error submitting resource:', error)
      setMessage('Error submitting resource. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const updateFormData = (key: keyof ResourceFormData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    updateFormData('tags', tags)
  }

  const resourceTypes: { value: ResourceType; label: string; icon: string }[] = [
    { value: 'book', label: 'Book', icon: '📚' },
    { value: 'audiobook', label: 'Audiobook', icon: '🎧' },
    { value: 'podcast', label: 'Podcast', icon: '🎙️' },
    { value: 'video', label: 'Video', icon: '🎥' },
    { value: 'article', label: 'Article', icon: '📰' },
    { value: 'course', label: 'Course', icon: '🎓' },
    { value: 'tool', label: 'Tool', icon: '🛠️' },
    { value: 'other', label: 'Other', icon: '📋' }
  ]

  const difficultyLevels: { value: DifficultyLevel; label: string }[] = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ]

  if (!showForm) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Suggest a Resource</h3>
        <p className="text-gray-600 mb-6">
          Share a book, audiobook, podcast, course, or other resource that has helped you in your personal development journey.
        </p>
        
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
            message.includes('Error') 
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {message}
          </div>
        )}
        
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Suggest Resource
        </button>
      </div>
    )
  }

  return (
    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Suggest a Resource</h3>
        <button
          onClick={() => setShowForm(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <p className="text-gray-600 mb-6">
        Help others discover valuable resources by sharing what has helped you grow.
      </p>
      
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
          message.includes('Error') 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Resource Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Resource Type</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {resourceTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => updateFormData('resource_type', type.value)}
                className={`p-3 border-2 rounded-xl transition-colors text-center ${
                  formData.resource_type === type.value
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{type.icon}</div>
                <div className="text-sm font-medium">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) => updateFormData('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="Enter the title of the resource"
          />
        </div>

        {/* Author/Host */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(formData.resource_type === 'book' || formData.resource_type === 'audiobook') && (
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <input
                type="text"
                id="author"
                value={formData.author || ''}
                onChange={(e) => updateFormData('author', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Author name"
              />
            </div>
          )}
          
          {formData.resource_type === 'podcast' && (
            <div>
              <label htmlFor="host" className="block text-sm font-medium text-gray-700 mb-2">
                Host
              </label>
              <input
                type="text"
                id="host"
                value={formData.host || ''}
                onChange={(e) => updateFormData('host', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Podcast host name"
              />
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={formData.description || ''}
            onChange={(e) => updateFormData('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            placeholder="Describe the resource and why you recommend it"
          />
        </div>

        {/* Category and Difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={formData.category_id || ''}
              onChange={(e) => updateFormData('category_id', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Select category...</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              id="difficulty"
              value={formData.difficulty_level || ''}
              onChange={(e) => updateFormData('difficulty_level', e.target.value as DifficultyLevel || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Select difficulty...</option>
              {difficultyLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* URL and Rating */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              URL (optional)
            </label>
            <input
              type="url"
              id="url"
              value={formData.url || ''}
              onChange={(e) => updateFormData('url', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="https://..."
            />
          </div>
          
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating (1-5)
            </label>
            <select
              id="rating"
              value={formData.rating || ''}
              onChange={(e) => updateFormData('rating', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Select rating...</option>
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Very Good</option>
              <option value="3">3 - Good</option>
              <option value="2">2 - Fair</option>
              <option value="1">1 - Poor</option>
            </select>
          </div>
        </div>

        {/* Estimated Time and Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="estimated_time" className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Time
            </label>
            <input
              type="text"
              id="estimated_time"
              value={formData.estimated_time || ''}
              onChange={(e) => updateFormData('estimated_time', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="e.g., 2 hours, 45 minutes, 6 weeks"
            />
          </div>
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              value={(formData.tags || []).join(', ')}
              onChange={(e) => handleTagsChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="motivation, productivity, health (comma-separated)"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              'Submit Resource'
            )}
          </button>
          
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}