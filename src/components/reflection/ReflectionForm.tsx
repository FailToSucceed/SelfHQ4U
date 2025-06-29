'use client'

import { useState, useEffect } from 'react'
import { saveReflection, getCurrentWeekReflection } from '@/lib/reflections'
import type { ReflectionFormData, Reflection } from '@/types/reflection'

interface ReflectionFormProps {
  onSave?: (reflection: Reflection) => void
}

export default function ReflectionForm({ onSave }: ReflectionFormProps) {
  const [formData, setFormData] = useState<ReflectionFormData>({})
  const [currentReflection, setCurrentReflection] = useState<Reflection | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  // Load existing reflection for current week
  useEffect(() => {
    const loadCurrentReflection = async () => {
      try {
        setLoading(true)
        const reflection = await getCurrentWeekReflection()
        if (reflection) {
          setCurrentReflection(reflection)
          setFormData({
            values_alignment: reflection.values_alignment,
            values_reflection: reflection.values_reflection,
            mission_progress: reflection.mission_progress,
            mission_reflection: reflection.mission_reflection,
            week_progress_reflection: reflection.week_progress_reflection,
            week_challenges: reflection.week_challenges,
            week_wins: reflection.week_wins,
            vision_progress: reflection.vision_progress,
            vision_reflection: reflection.vision_reflection,
            gratitude_items: reflection.gratitude_items || []
          })
        }
      } catch (error) {
        console.error('Error loading reflection:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCurrentReflection()
  }, [])

  const handleSave = async (isDraft: boolean = false) => {
    try {
      setSaving(true)
      setMessage('')
      
      const savedReflection = await saveReflection(formData, isDraft)
      setCurrentReflection(savedReflection)
      setMessage(isDraft ? 'Draft saved successfully!' : 'Reflection submitted successfully!')
      
      if (onSave) {
        onSave(savedReflection)
      }
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving reflection:', error)
      setMessage('Error saving reflection. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSave(false)
  }

  const updateFormData = (key: keyof ReflectionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleGratitudeChange = (value: string) => {
    const items = value.split('\n').filter(item => item.trim() !== '')
    updateFormData('gratitude_items', items)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Weekly Reflection</h3>
        {currentReflection && (
          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
            currentReflection.is_draft 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {currentReflection.is_draft ? 'Draft' : 'Submitted'}
          </span>
        )}
      </div>
      
      <p className="text-gray-600 mb-6">Reflect on your progress and align with your values, vision, and mission</p>
      
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
        {/* Values Alignment */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Values Alignment Check</h4>
          <p className="text-sm text-gray-600 mb-3">How well do your current habits align with your core values? (1-10)</p>
          <div className="flex gap-2 mb-3">
            {[1,2,3,4,5,6,7,8,9,10].map(rating => (
              <button 
                key={rating} 
                type="button"
                onClick={() => updateFormData('values_alignment', rating)}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm transition-colors ${
                  formData.values_alignment === rating
                    ? 'bg-teal-500 text-white border-teal-500'
                    : 'border-teal-300 hover:bg-teal-100 hover:border-teal-500'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
          <textarea 
            className="w-full p-3 border border-gray-300 rounded-lg resize-none" 
            rows={2}
            value={formData.values_reflection || ''}
            onChange={(e) => updateFormData('values_reflection', e.target.value)}
            placeholder="Describe how your current activities align with your values..."
          />
        </div>
        
        {/* Mission Progress */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Mission Progress</h4>
          <p className="text-sm text-gray-600 mb-3">How meaningful and aligned have your activities been with your mission this week? (1-10)</p>
          <div className="flex gap-2 mb-3">
            {[1,2,3,4,5,6,7,8,9,10].map(rating => (
              <button 
                key={rating} 
                type="button"
                onClick={() => updateFormData('mission_progress', rating)}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm transition-colors ${
                  formData.mission_progress === rating
                    ? 'bg-purple-500 text-white border-purple-500'
                    : 'border-purple-300 hover:bg-purple-100 hover:border-purple-500'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
          <textarea 
            className="w-full p-3 border border-gray-300 rounded-lg resize-none" 
            rows={3}
            value={formData.mission_reflection || ''}
            onChange={(e) => updateFormData('mission_reflection', e.target.value)}
            placeholder="Describe how your recent actions have contributed to your mission. What felt most meaningful?"
          />
        </div>
        
        {/* Weekly Progress */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Weekly Progress Reflection</h4>
          <textarea 
            className="w-full p-3 border border-gray-300 rounded-lg resize-none" 
            rows={4}
            value={formData.week_progress_reflection || ''}
            onChange={(e) => updateFormData('week_progress_reflection', e.target.value)}
            placeholder="What progress have you made this week? What would you do differently?"
          />
        </div>

        {/* Challenges & Wins */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Challenges</h4>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-lg resize-none" 
              rows={3}
              value={formData.week_challenges || ''}
              onChange={(e) => updateFormData('week_challenges', e.target.value)}
              placeholder="What challenges did you face this week?"
            />
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Wins</h4>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-lg resize-none" 
              rows={3}
              value={formData.week_wins || ''}
              onChange={(e) => updateFormData('week_wins', e.target.value)}
              placeholder="What wins, both big and small, can you celebrate?"
            />
          </div>
        </div>
        
        {/* Vision Progress */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Vision Progress</h4>
          <p className="text-sm text-gray-600 mb-3">How are your current actions moving you toward your vision? (1-10)</p>
          <div className="flex gap-2 mb-3">
            {[1,2,3,4,5,6,7,8,9,10].map(rating => (
              <button 
                key={rating} 
                type="button"
                onClick={() => updateFormData('vision_progress', rating)}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm transition-colors ${
                  formData.vision_progress === rating
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'border-blue-300 hover:bg-blue-100 hover:border-blue-500'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
          <textarea 
            className="w-full p-3 border border-gray-300 rounded-lg resize-none" 
            rows={3}
            value={formData.vision_reflection || ''}
            onChange={(e) => updateFormData('vision_reflection', e.target.value)}
            placeholder="Reflect on how your daily habits and activities align with your long-term vision..."
          />
        </div>

        {/* Gratitude */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Gratitude & Appreciation</h4>
          <textarea 
            className="w-full p-3 border border-gray-300 rounded-lg resize-none" 
            rows={4}
            value={(formData.gratitude_items || []).join('\n')}
            onChange={(e) => handleGratitudeChange(e.target.value)}
            placeholder="What are you grateful for this week? (Enter each item on a new line)"
          />
          <p className="text-xs text-gray-500 mt-1">Tip: Each line will be saved as a separate gratitude item</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              'Submit Reflection'
            )}
          </button>
          
          <button 
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save as Draft
          </button>
        </div>
      </form>
    </div>
  )
}