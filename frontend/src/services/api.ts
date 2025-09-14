import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API
export const authAPI = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  register: (data: { username: string; email: string; password: string; fullName: string }) =>
    api.post('/auth/register', data),
  
  getProfile: () =>
    api.get('/auth/profile'),
}

// Habits API
export const habitsAPI = {
  getHabits: () =>
    api.get('/habits'),
  
  createHabit: (data: any) =>
    api.post('/habits', data),
  
  updateHabit: (id: string, data: any) =>
    api.put(`/habits/${id}`, data),
  
  deleteHabit: (id: string) =>
    api.delete(`/habits/${id}`),
  
  toggleCompletion: (id: string) =>
    api.post(`/habits/${id}/toggle`),
  
  getHabitStats: (id: string) =>
    api.get(`/habits/${id}/stats`),
}

// Social API
export const socialAPI = {
  searchUsers: (query: string) =>
    api.get(`/social/search?q=${query}`),
  
  followUser: (userId: string) =>
    api.post(`/social/follow/${userId}`),
  
  unfollowUser: (userId: string) =>
    api.delete(`/social/follow/${userId}`),
  
  getFollowing: () =>
    api.get('/social/following'),
  
  getFollowers: () =>
    api.get('/social/followers'),
  
  getFriendsActivity: () =>
    api.get('/social/activity'),
}

// Analytics API
export const analyticsAPI = {
  getOverallStats: () =>
    api.get('/analytics/overview'),
  
  getHabitTrends: () =>
    api.get('/analytics/trends'),
}