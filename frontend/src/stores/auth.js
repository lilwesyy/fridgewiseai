import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    currentUser: (state) => state.user
  },

  actions: {
    async register(userData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, userData)
        const { token, user } = response.data
        
        this.token = token
        this.user = user
        localStorage.setItem('token', token)
        
        // Set default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Registration failed'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async login(credentials) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials)
        const { token, user } = response.data
        
        this.token = token
        this.user = user
        localStorage.setItem('token', token)
        
        // Set default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async getCurrentUser() {
      if (!this.token) return
      
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        const response = await axios.get(`${API_BASE_URL}/auth/me`)
        this.user = response.data.user
      } catch (error) {
        // Token is invalid, logout
        this.logout()
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.error = null
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    },

    clearError() {
      this.error = null
    }
  }
})
