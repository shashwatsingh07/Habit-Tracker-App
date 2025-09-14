import { useState, useEffect } from 'react'
import { Edit3, LogOut, User, Target, TrendingUp, Users } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { analyticsAPI, socialAPI } from '../services/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

interface ProfileStats {
  totalHabits: number
  longestStreak: number
  completionRate: number
  totalCompletions: number
}

export function Profile() {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState<ProfileStats | null>(null)
  const [followingCount, setFollowingCount] = useState(0)
  const [followersCount, setFollowersCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const navigate=useNavigate();

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      const [statsRes, followingRes, followersRes] = await Promise.all([
        analyticsAPI.getOverallStats(),
        socialAPI.getFollowing(),
        socialAPI.getFollowers()
      ])

      setStats(statsRes.data.stats)
      setFollowingCount(followingRes.data.following.length)
      setFollowersCount(followersRes.data.followers.length)
    } catch (error: any) {
      toast.error('Failed to fetch profile data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout=async()=>{
    await logout();
    navigate('/');
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-cyan-500 h-32 relative">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>

        {/* Profile Content */}
        <div className="px-6 pb-6">
          {/* Profile Picture & Basic Info */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 -mt-16 relative z-10">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <span className="text-white text-4xl font-bold">
                  {user?.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-0 sm:pb-4 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user?.fullName}</h1>
                  <p className="text-gray-600">@{user?.username}</p>
                  <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
                </div>
                <div className="flex space-x-2 mt-4 sm:mt-0">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-purple-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">{stats?.totalHabits || 0}</div>
              <div className="text-sm text-purple-700">Total Habits</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{stats?.longestStreak || 0}</div>
              <div className="text-sm text-green-700">Longest Streak</div>
            </div>
            
            <div className="bg-cyan-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-cyan-600">{followingCount}</div>
              <div className="text-sm text-cyan-700">Following</div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-orange-600">{followersCount}</div>
              <div className="text-sm text-orange-700">Followers</div>
            </div>
          </div>

          {/* Additional Stats */}
          {stats && (
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Overall Success Rate</span>
                    <span className="text-sm font-medium text-gray-900">{Math.round(stats.completionRate)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.completionRate}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Total Completions</span>
                    <span className="text-sm font-medium text-gray-900">{stats.totalCompletions}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Habits completed across all time
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}