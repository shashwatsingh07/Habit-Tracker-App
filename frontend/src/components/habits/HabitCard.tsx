import { useState } from 'react'
import { 
  CheckCircle2, 
  Circle, 
  Flame, 
  TrendingUp,
  Calendar
} from 'lucide-react'

interface Habit {
  _id: string
  name: string
  description: string
  category: string
  frequency: 'daily' | 'weekly'
  color: string
  streak: number
  completedToday: boolean
  completionRate: number
}

interface HabitCardProps {
  habit: Habit
  onToggle: (habitId: string) => Promise<void>
}

export function HabitCard({ habit, onToggle }: HabitCardProps) {
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    try {
      setLoading(true)
      await onToggle(habit._id)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
      style={{ borderLeftColor: habit.color, borderLeftWidth: '4px' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{habit.name}</h3>
            <span 
              className="px-2 py-1 text-xs font-medium rounded-full"
              style={{ 
                backgroundColor: habit.color + '20', 
                color: habit.color 
              }}
            >
              {habit.category}
            </span>
          </div>
          
          {habit.description && (
            <p className="text-sm text-gray-600 mb-3">{habit.description}</p>
          )}

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {habit.frequency === 'daily' ? 'Daily' : 'Weekly'}
            </div>
            <div className="flex items-center">
              <Flame className="h-4 w-4 mr-1" />
              {habit.streak} streak
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              {Math.round(habit.completionRate)}%
            </div>
          </div>
        </div>

        <button
          onClick={handleToggle}
          disabled={loading}
          className={`p-2 rounded-lg transition-all duration-200 ${
            habit.completedToday
              ? 'text-green-600 hover:bg-green-50'
              : 'text-gray-400 hover:bg-gray-50 hover:text-green-600'
          }`}
        >
          {habit.completedToday ? (
            <CheckCircle2 className="h-6 w-6" />
          ) : (
            <Circle className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-gray-700">Completion Rate</span>
          <span className="text-xs font-medium text-gray-500">
            {Math.round(habit.completionRate)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${habit.completionRate}%`,
              backgroundColor: habit.color 
            }}
          />
        </div>
      </div>
    </div>
  )
}