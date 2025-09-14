import { useState, useEffect } from 'react'
import { Plus, Target, TrendingUp, Calendar, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { habitsAPI } from '../services/api'
import { HabitCard } from '../components/habits/HabitCard'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

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
  createdAt: string
}

export function Dashboard() {
  const { user } = useAuth()
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHabits()
  }, [])

  const fetchHabits = async () => {
    try {
      const response = await habitsAPI.getHabits()
      setHabits(response.data.habits)
    } catch (error: any) {
      toast.error('Failed to fetch habits')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleHabit = async (habitId: string) => {
    try {
      await habitsAPI.toggleCompletion(habitId)
      await fetchHabits() // Refresh habits
      toast.success('Habit updated!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update habit')
    }
  }

  const totalHabits = habits.length
  const completedToday = habits.filter(h => h.completedToday).length
  const avgStreak = habits.length > 0 
    ? Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / habits.length)
    : 0
  const avgCompletionRate = habits.length > 0
    ? Math.round(habits.reduce((sum, h) => sum + h.completionRate, 0) / habits.length)
    : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your habits...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Good {new Date().getHours() < 12 ? 'morning' : 'evening'}, {user?.fullName.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-600">
              Today is {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <Link
            to="/create-habit"
            className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Add Habit</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Habits</p>
                <p className="text-2xl font-bold text-gray-900">{totalHabits}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900">{completedToday}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Avg. Streak</p>
                <p className="text-2xl font-bold text-gray-900">{avgStreak}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <Calendar className="h-5 w-5 text-cyan-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{avgCompletionRate}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Habits List */}
      {habits.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No habits yet</h3>
          <p className="text-gray-600 mb-6">Start building better habits today!</p>
          <Link
            to="/create-habit"
            className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all"
          >
            Create Your First Habit
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Habits</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {habits.map((habit) => (
              <HabitCard
                key={habit._id}
                habit={habit}
                onToggle={handleToggleHabit}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}