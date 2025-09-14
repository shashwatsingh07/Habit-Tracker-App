import { useState } from 'react'
import { Search, UserPlus, UserCheck } from 'lucide-react'
import { socialAPI } from '../services/api'
import toast from 'react-hot-toast'

interface User {
  _id: string
  username: string
  fullName: string
  avatar?: string
  isFollowing?: boolean
}

export function SearchUsers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    try {
      setLoading(true)
      const response = await socialAPI.searchUsers(query)
      setSearchResults(response.data.users)
    } catch (error: any) {
      toast.error('Failed to search users')
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async (userId: string) => {
    try {
      await socialAPI.followUser(userId)
      toast.success('User followed successfully!')
      
      // Update the search results to reflect the follow status
      setSearchResults(prev => prev.map(user => 
        user._id === userId ? { ...user, isFollowing: true } : user
      ))
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to follow user')
    }
  }

  const handleUnfollow = async (userId: string) => {
    try {
      await socialAPI.unfollowUser(userId)
      toast.success('User unfollowed successfully!')
      
      // Update the search results to reflect the unfollow status
      setSearchResults(prev => prev.map(user => 
        user._id === userId ? { ...user, isFollowing: false } : user
      ))
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to unfollow user')
    }
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Search Users
        </h1>
        <p className="text-gray-600">
          Find and follow other users to stay motivated together
        </p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by username or name..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-4">
                <div className="w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Searching...</p>
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{user.fullName}</h3>
                      <p className="text-sm text-gray-600">@{user.username}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => user.isFollowing ? handleUnfollow(user._id) : handleFollow(user._id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      user.isFollowing
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    }`}
                  >
                    {user.isFollowing ? (
                      <>
                        <UserCheck className="h-4 w-4 mr-1 inline" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-1 inline" />
                        Follow
                      </>
                    )}
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600">No users found</p>
              </div>
            )}
          </div>
        )}

        {!searchQuery && (
          <div className="text-center py-8">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Search for Users</h3>
            <p className="text-gray-600">Enter a username or name to find other users</p>
          </div>
        )}
      </div>
    </div>
  )
}