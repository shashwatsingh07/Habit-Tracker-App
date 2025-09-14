import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { HabitWithCompletions } from '../../hooks/useHabits'
import toast from 'react-hot-toast'

const habitSchema = z.object({
  name: z.string().min(1, 'Habit name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  category: z.string().min(1, 'Category is required'),
  frequency: z.enum(['daily', 'weekly']),
  target_days: z.number().min(1, 'Target days must be at least 1').max(7, 'Target days cannot exceed 7'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
})

type HabitFormData = z.infer<typeof habitSchema>

interface HabitFormProps {
  habit?: HabitWithCompletions
  onSave: (data: Omit<HabitFormData, 'target_days'> & { target_days: number }) => Promise<void>
  onCancel: () => void
}

const categories = [
  'Health & Fitness',
  'Learning',
  'Productivity',
  'Mindfulness',
  'Relationships',
  'Hobbies',
  'Finance',
  'Other'
]

const colors = [
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5A2B', // Brown
  '#6366F1', // Indigo
  '#EC4899', // Pink
]

export function HabitForm({ habit, onSave, onCancel }: HabitFormProps) {
  const [loading, setLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: habit?.name || '',
      description: habit?.description || '',
      category: habit?.category || categories[0],
      frequency: habit?.frequency || 'daily',
      target_days: habit?.target_days || 1,
      color: habit?.color || colors[0],
    }
  })

  const selectedColor = watch('color')
  const frequency = watch('frequency')

  const onSubmit = async (data: HabitFormData) => {
    try {
      setLoading(true)
      await onSave(data)
      toast.success(habit ? 'Habit updated successfully!' : 'Habit created successfully!')
      onCancel()
    } catch (error: any) {
      toast.error(error.message || 'Failed to save habit')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {habit ? 'Edit Habit' : 'Create New Habit'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Habit Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Habit Name *
            </label>
            <input
              {...register('name')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., Drink 8 glasses of water"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Optional description..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              {...register('category')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequency *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  {...register('frequency')}
                  type="radio"
                  value="daily"
                  className="mr-2"
                />
                Daily
              </label>
              <label className="flex items-center">
                <input
                  {...register('frequency')}
                  type="radio"
                  value="weekly"
                  className="mr-2"
                />
                Weekly
              </label>
            </div>
            {errors.frequency && (
              <p className="mt-1 text-sm text-red-600">{errors.frequency.message}</p>
            )}
          </div>

          {/* Target Days (only for weekly) */}
          {frequency === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Days per Week *
              </label>
              <input
                {...register('target_days', { valueAsNumber: true })}
                type="number"
                min="1"
                max="7"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.target_days && (
                <p className="mt-1 text-sm text-red-600">{errors.target_days.message}</p>
              )}
            </div>
          )}

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color *
            </label>
            <div className="flex space-x-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue('color', color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? 'border-gray-400 scale-110'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            {errors.color && (
              <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading 
                ? (habit ? 'Updating...' : 'Creating...') 
                : (habit ? 'Update Habit' : 'Create Habit')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}