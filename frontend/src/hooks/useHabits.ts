import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Database } from '../lib/database.types'
import { useAuth } from './useAuth'
import { startOfWeek, endOfWeek, format, parseISO } from 'date-fns'

type Habit = Database['public']['Tables']['habits']['Row']
type HabitCompletion = Database['public']['Tables']['habit_completions']['Row']

export interface HabitWithCompletions extends Habit {
  completions: HabitCompletion[]
  currentStreak: number
  isCompletedToday: boolean
  completionRate: number
}

export function useHabits() {
  const { user } = useAuth()
  const [habits, setHabits] = useState<HabitWithCompletions[]>([])
  const [loading, setLoading] = useState(true)

  const fetchHabits = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (habitsError) throw habitsError

      const { data: completionsData, error: completionsError } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })

      if (completionsError) throw completionsError

      const habitsWithCompletions: HabitWithCompletions[] = habitsData.map(habit => {
        const habitCompletions = completionsData.filter(c => c.habit_id === habit.id)
        
        return {
          ...habit,
          completions: habitCompletions,
          currentStreak: calculateStreak(habitCompletions, habit.frequency),
          isCompletedToday: isCompletedToday(habitCompletions, habit.frequency),
          completionRate: calculateCompletionRate(habitCompletions, habit.created_at, habit.frequency)
        }
      })

      setHabits(habitsWithCompletions)
    } catch (error) {
      console.error('Error fetching habits:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchHabits()
    } else {
      setHabits([])
      setLoading(false)
    }
  }, [user])

  const createHabit = async (habitData: Omit<Database['public']['Tables']['habits']['Insert'], 'user_id'>) => {
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('habits')
      .insert({ ...habitData, user_id: user.id })
      .select()
      .single()

    if (error) throw error
    await fetchHabits()
    return data
  }

  const updateHabit = async (id: string, updates: Database['public']['Tables']['habits']['Update']) => {
    const { data, error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    await fetchHabits()
    return data
  }

  const deleteHabit = async (id: string) => {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id)

    if (error) throw error
    await fetchHabits()
  }

  const completeHabit = async (habitId: string) => {
    if (!user) throw new Error('User not authenticated')

    const today = format(new Date(), 'yyyy-MM-dd')
    
    const { data, error } = await supabase
      .from('habit_completions')
      .insert({
        habit_id: habitId,
        user_id: user.id,
        completed_at: today
      })
      .select()
      .single()

    if (error) throw error
    await fetchHabits()
    return data
  }

  const uncompleteHabit = async (habitId: string) => {
    if (!user) throw new Error('User not authenticated')

    const today = format(new Date(), 'yyyy-MM-dd')
    
    const { error } = await supabase
      .from('habit_completions')
      .delete()
      .eq('habit_id', habitId)
      .eq('user_id', user.id)
      .eq('completed_at', today)

    if (error) throw error
    await fetchHabits()
  }

  return {
    habits,
    loading,
    createHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    uncompleteHabit,
    refetch: fetchHabits
  }
}

function calculateStreak(completions: HabitCompletion[], frequency: string): number {
  if (completions.length === 0) return 0

  const sortedCompletions = completions
    .map(c => parseISO(c.completed_at))
    .sort((a, b) => b.getTime() - a.getTime())

  let streak = 0
  const today = new Date()
  
  if (frequency === 'daily') {
    for (let i = 0; i < sortedCompletions.length; i++) {
      const completion = sortedCompletions[i]
      const expectedDate = new Date(today)
      expectedDate.setDate(today.getDate() - i)
      
      const completionDate = format(completion, 'yyyy-MM-dd')
      const expectedDateStr = format(expectedDate, 'yyyy-MM-dd')
      
      if (completionDate === expectedDateStr) {
        streak++
      } else {
        break
      }
    }
  } else {
    // Weekly frequency
    for (let i = 0; i < sortedCompletions.length; i++) {
      const completion = sortedCompletions[i]
      const expectedWeekStart = startOfWeek(new Date(today))
      expectedWeekStart.setDate(expectedWeekStart.getDate() - (i * 7))
      
      const completionWeekStart = startOfWeek(completion)
      
      if (format(completionWeekStart, 'yyyy-MM-dd') === format(expectedWeekStart, 'yyyy-MM-dd')) {
        streak++
      } else {
        break
      }
    }
  }

  return streak
}

function isCompletedToday(completions: HabitCompletion[], frequency: string): boolean {
  const today = new Date()
  
  if (frequency === 'daily') {
    const todayStr = format(today, 'yyyy-MM-dd')
    return completions.some(c => c.completed_at === todayStr)
  } else {
    // Weekly frequency
    const weekStart = startOfWeek(today)
    const weekEnd = endOfWeek(today)
    
    return completions.some(c => {
      const completionDate = parseISO(c.completed_at)
      return completionDate >= weekStart && completionDate <= weekEnd
    })
  }
}

function calculateCompletionRate(completions: HabitCompletion[], createdAt: string, frequency: string): number {
  const created = parseISO(createdAt)
  const today = new Date()
  
  let expectedCompletions = 0
  
  if (frequency === 'daily') {
    const daysDiff = Math.floor((today.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
    expectedCompletions = Math.max(1, daysDiff + 1)
  } else {
    const weeksDiff = Math.floor((today.getTime() - created.getTime()) / (1000 * 60 * 60 * 24 * 7))
    expectedCompletions = Math.max(1, weeksDiff + 1)
  }
  
  return Math.min(100, (completions.length / expectedCompletions) * 100)
}