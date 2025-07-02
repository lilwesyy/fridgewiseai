import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
    successMessage: null,
    initialized: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user && state.initialized,
    currentUser: (state) => state.user
  },

  actions: {
    async register(userData) {
      this.loading = true
      this.error = null
      this.successMessage = null
      
      try {
        const response = await axios.post('/auth/register', userData)
        const { token, user } = response.data
        
        this.token = token
        this.user = user
        localStorage.setItem('token', token)
        
        // Set default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        return { success: true, user }
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
      this.successMessage = null
      
      try {
        const response = await axios.post('/auth/login', credentials)
        const { token, user } = response.data
        
        this.token = token
        this.user = user
        localStorage.setItem('token', token)
        
        // Set default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        return { success: true, user }
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async getCurrentUser() {
      if (!this.token) {
        this.initialized = true
        return
      }
      
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        const response = await axios.get('/auth/me')
        this.user = response.data.user
        this.initialized = true
      } catch (error) {
        console.warn('Token validation failed:', error.response?.data?.message)
        // Token is invalid, logout
        this.logout()
        this.initialized = true
      }
    },

    async initializeAuth() {
      // Initialize the auth state when app starts
      if (this.token && !this.user) {
        await this.getCurrentUser()
      } else {
        this.initialized = true
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.error = null
      this.successMessage = null
      this.initialized = true
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    },

    clearError() {
      this.error = null
    },

    clearSuccess() {
      this.successMessage = null
    },

    clearMessages() {
      this.error = null
      this.successMessage = null
    }
  }
})
