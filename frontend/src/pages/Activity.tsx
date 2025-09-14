import { formatDistanceToNow, format } from 'date-fns'
import { CheckCircle2, Users, TrendingUp, Calendar } from 'lucide-react'
import { useSocial } from '../hooks/useSocial'

export function Activity() {
  const { friendsActivity, following, loading } = useSocial()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading activity feed...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Activity Feed
        </h1>
        <p className="text-gray-600">
          See what your friends are up to and stay motivated
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
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Recent Activities</p>
              <p className="text-2xl font-bold text-gray-900">{friendsActivity.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-cyan-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">
                {friendsActivity.filter(activity => {
                  const activityDate = new Date(activity.completed_at)
                  const weekAgo = new Date()
                  weekAgo.setDate(weekAgo.getDate() - 7)
                  return activityDate >= weekAgo
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {friendsActivity.length > 0 ? (
            friendsActivity.map((activity) => (
              <div key={activity.id} className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={activity.user.avatar_url}
                    alt={activity.user.full_name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <p className="text-sm">
                        <span className="font-medium text-gray-900">
                          {activity.user.full_name}
                        </span>{' '}
                        completed{' '}
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
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(activity.completed_at), 'MMM d, yyyy')}
                      </span>
                      <span>
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    
                    {activity.habit.description && (
                      <p className="text-sm text-gray-600 mt-2">
                        {activity.habit.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : following.length > 0 ? (
            <div className="p-12 text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
              <p className="text-gray-600">
                Your friends haven't completed any habits recently. Be the first to inspire them!
              </p>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start following friends</h3>
              <p className="text-gray-600 mb-4">
                Follow friends to see their habit completions and stay motivated together.
              </p>
              <a
                href="/friends"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all"
              >
                <Users className="h-4 w-4 mr-2" />
                Find Friends
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}