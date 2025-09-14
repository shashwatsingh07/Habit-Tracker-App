import { useState, useEffect } from 'react'
import { TrendingUp, Target, Calendar, Award } from 'lucide-react'
import { analyticsAPI } from '../services/api'
import toast from 'react-hot-toast'

interface OverallStats {
  totalHabits: number
  completedToday: number
  currentStreak: number
  longestStreak: number
  completionRate: number
  totalCompletions: number
}

interface HabitTrend {
  name: string
  color: string
  completions: number
  streak: number
  completionRate: number
}

export function Analytics() {
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null)
  const [habitTrends, setHabitTrends] = useState<HabitTrend[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const [statsRes, trendsRes] = await Promise.all([
        analyticsAPI.getOverallStats(),
        analyticsAPI.getHabitTrends()
      ])

      setOverallStats(statsRes.data.stats)
      setHabitTrends(trendsRes.data.trends)
    } catch (error: any) {
      toast.error('Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600">
          Track your progress and gain insights into your habit patterns
        </p>
      </div>

      {/* Overall Stats */}
      {overallStats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Habits</p>
                <p className="text-2xl font-bold text-gray-900">{overallStats.totalHabits}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900">{overallStats.completedToday}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">{overallStats.currentStreak}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-cyan-100 rounded-lg">
                <Award className="h-6 w-6 text-cyan-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Longest Streak</p>
                <p className="text-2xl font-bold text-gray-900">{overallStats.longestStreak}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Rate */}
      {overallStats && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Completion Rate</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Success Rate</span>
            <span className="text-sm font-medium text-gray-900">{Math.round(overallStats.completionRate)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-500 to-cyan-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${overallStats.completionRate}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {overallStats.totalCompletions} total completions across all habits
          </p>
        </div>
      )}

      {/* Habit Trends */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Habit Performance</h3>
        </div>
        
        <div className="p-6">
          {habitTrends.length > 0 ? (
            <div className="space-y-4">
              {habitTrends.map((habit, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: habit.color }}
                      />
                      <h4 className="font-medium text-gray-900">{habit.name}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{habit.streak} day streak</p>
                      <p className="text-xs text-gray-600">{habit.completions} completions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-700">Completion Rate</span>
                    <span className="text-xs font-medium text-gray-900">{Math.round(habit.completionRate)}%</span>
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
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No habit data yet</h3>
              <p className="text-gray-600">Create some habits and start tracking to see analytics!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}