import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Database } from '../lib/database.types'
import { useAuth } from './useAuth'

type Profile = Database['public']['Tables']['profiles']['Row']
type Follow = Database['public']['Tables']['follows']['Row']
type HabitCompletion = Database['public']['Tables']['habit_completions']['Row']
type Habit = Database['public']['Tables']['habits']['Row']

export interface FriendActivity {
  id: string
  user: Profile
  habit: Habit
  completed_at: string
  created_at: string
}

export function useSocial() {
  const { user } = useAuth()
  const [following, setFollowing] = useState<Profile[]>([])
  const [followers, setFollowers] = useState<Profile[]>([])
  const [friendsActivity, setFriendsActivity] = useState<FriendActivity[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSocialData = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Fetch following
      const { data: followingData, error: followingError } = await supabase
        .from('follows')
        .select(`
          following_id,
          profiles!follows_following_id_fkey(*)
        `)
        .eq('follower_id', user.id)

      if (followingError) throw followingError

      const followingProfiles = followingData?.map(f => f.profiles).filter(Boolean) as Profile[] || []
      setFollowing(followingProfiles)

      // Fetch followers
      const { data: followersData, error: followersError } = await supabase
        .from('follows')
        .select(`
          follower_id,
          profiles!follows_follower_id_fkey(*)
        `)
        .eq('following_id', user.id)

      if (followersError) throw followersError

      const followerProfiles = followersData?.map(f => f.profiles).filter(Boolean) as Profile[] || []
      setFollowers(followerProfiles)

      // Fetch friends' activity
      if (followingProfiles.length > 0) {
        const followingIds = followingProfiles.map(p => p.id)
        
        const { data: activityData, error: activityError } = await supabase
          .from('habit_completions')
          .select(`
            *,
            profiles(*),
            habits(*)
          `)
          .in('user_id', followingIds)
          .order('created_at', { ascending: false })
          .limit(50)

        if (activityError) throw activityError

        const activities: FriendActivity[] = activityData?.map(completion => ({
          id: completion.id,
          user: completion.profiles as Profile,
          habit: completion.habits as Habit,
          completed_at: completion.completed_at,
          created_at: completion.created_at,
        })) || []

        setFriendsActivity(activities)
      } else {
        setFriendsActivity([])
      }
    } catch (error) {
      console.error('Error fetching social data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchSocialData()
    } else {
      setFollowing([])
      setFollowers([])
      setFriendsActivity([])
      setLoading(false)
    }
  }, [user])

  const searchUsers = async (query: string): Promise<Profile[]> => {
    if (!query.trim()) return []

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
      .neq('id', user?.id || '')
      .limit(10)

    if (error) throw error
    return data || []
  }

  const followUser = async (targetUserId: string) => {
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('follows')
      .insert({
        follower_id: user.id,
        following_id: targetUserId
      })

    if (error) throw error
    await fetchSocialData()
  }

  const unfollowUser = async (targetUserId: string) => {
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId)

    if (error) throw error
    await fetchSocialData()
  }

  const isFollowing = (targetUserId: string): boolean => {
    return following.some(p => p.id === targetUserId)
  }

  return {
    following,
    followers,
    friendsActivity,
    loading,
    searchUsers,
    followUser,
    unfollowUser,
    isFollowing,
    refetch: fetchSocialData
  }
}