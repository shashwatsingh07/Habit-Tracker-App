import { useState, useEffect } from 'react'
import { Users, UserCheck, Activity } from 'lucide-react'
import { socialAPI } from '../services/api'
import toast from 'react-hot-toast'

interface User {
  _id: string
  username: string
  fullName: string
  avatar?: string
}

interface FriendActivity {
  _id: string
  user: User
  habit: {
    name: string
    color: string
  }
  completedAt: string
  streak: number
}

export function Friends() {
  const [following, setFollowing] = useState<User[]>([])
  const [followers, setFollowers] = useState<User[]>([])
  const [friendsActivity, setFriendsActivity] = useState<FriendActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'following' | 'followers' | 'activity'>('activity')

  useEffect(() => {
    fetchSocialData()
  }, [])

  const fetchSocialData = async () => {
    try {
      const [followingRes, followersRes, activityRes] = await Promise.all([
        socialAPI.getFollowing(),
        socialAPI.getFollowers(),
        socialAPI.getFriendsActivity()
      ])

      setFollowing(followingRes.data.following)
      setFollowers(followersRes.data.followers)
      setFriendsActivity(activityRes.data.activities)
    } catch (error: any) {
      toast.error('Failed to fetch social data')
    } finally {
      setLoading(false)
    }
  }

  const handleUnfollow = async (userId: string) => {
    try {
      await socialAPI.unfollowUser(userId)
      toast.success('User unfollowed successfully!')
      await fetchSocialData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to unfollow user')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading friends...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Friends & Community
        </h1>
        <p className="text-gray-600">
          Connect with others and stay motivated together
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Following</p>
              <p className="text-2xl font-bold text-gray-900">{following.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Followers</p>
              <p className="text-2xl font-bold text-gray-900">{followers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <Activity className="h-5 w-5 text-cyan-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Recent Activities</p>
              <p className="text-2xl font-bold text-gray-900">{friendsActivity.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'activity'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Activity className="h-4 w-4 mr-2 inline" />
              Activity Feed
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'following'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="h-4 w-4 mr-2 inline" />
              Following ({following.length})
            </button>
            <button
              onClick={() => setActiveTab('followers')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'followers'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserCheck className="h-4 w-4 mr-2 inline" />
              Followers ({followers.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'activity' && (
            <div className="space-y-4">
              {friendsActivity.length > 0 ? (
                friendsActivity.map((activity) => (
                  <div key={activity._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {activity.user.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium text-gray-900">{activity.user.fullName}</span>
                        {' '}completed{' '}
                        <span 
                          className="font-medium px-2 py-1 rounded text-xs"
                          style={{ 
                            backgroundColor: activity.habit.color + '20', 
                            color: activity.habit.color 
                          }}
                        >
                          {activity.habit.name}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.streak} day streak • {new Date(activity.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
                  <p className="text-gray-600">Follow some friends to see their progress!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'following' && (
            <div className="space-y-4">
              {following.length > 0 ? (
                following.map((user) => (
                  <div key={user._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{user.fullName}</h3>
                        <p className="text-sm text-gray-600">@{user.username}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleUnfollow(user._id)}
                      className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Unfollow
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Not following anyone yet</h3>
                  <p className="text-gray-600">Search for users to follow and stay motivated!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'followers' && (
            <div className="space-y-4">
              {followers.length > 0 ? (
                followers.map((user) => (
                  <div key={user._id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{user.fullName}</h3>
                      <p className="text-sm text-gray-600">@{user.username}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No followers yet</h3>
                  <p className="text-gray-600">Share your progress to attract followers!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}