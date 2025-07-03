import { defineStore } from 'pinia'
import axios from 'axios'
import { getCurrentLanguage, getLanguageDetectionMetadata } from '@/services/languageDetectionService'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Helper function to set language
const setGlobalLanguage = (languageCode) => {
  // Access the global app instance's i18n
  if (typeof window !== 'undefined' && window.__VUE_I18N__) {
    window.__VUE_I18N__.global.locale.value = languageCode
  }
  localStorage.setItem('selectedLanguage', languageCode)
}

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
        // Aggiungi la lingua corrente e i metadata del rilevamento
        const currentLanguage = getCurrentLanguage()
        const detectionMetadata = getLanguageDetectionMetadata()
        
        const registrationData = {
          ...userData,
          detectedLanguage: currentLanguage
        }
        
        // Includi i metadata se disponibili
        if (detectionMetadata) {
          registrationData.languageDetectionMetadata = {
            source: detectionMetadata.source,
            confidence: detectionMetadata.confidence,
            country: detectionMetadata.locationData?.country,
            timezone: detectionMetadata.locationData?.timezone
          }
        }
        
        console.log('🌍 Registering user with language:', currentLanguage)
        
        const response = await axios.post('/auth/register', registrationData)
        const { token, user } = response.data
        
        this.token = token
        this.user = user
        localStorage.setItem('token', token)
        
        // Set default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        // Aggiorna la lingua globale se l'utente ha una preferenza diversa
        if (user.preferences?.language && user.preferences.language !== currentLanguage) {
          if (typeof window !== 'undefined' && window.__VUE_I18N__) {
            window.__VUE_I18N__.global.locale.value = user.preferences.language
          }
          localStorage.setItem('selectedLanguage', user.preferences.language)
        }
        
        return { success: true, user }
      } catch (error) {
        this.error = error.response?.data?.error || 'Registration failed'
        const errorCode = error.response?.data?.code
        return { success: false, error: this.error, code: errorCode }
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
        
        // Set user's preferred language if available
        if (user.preferences?.language) {
          console.log(`🌍 Setting user language to ${user.preferences.language} from profile`)
          if (typeof window !== 'undefined' && window.__VUE_I18N__) {
            window.__VUE_I18N__.global.locale.value = user.preferences.language
          }
          localStorage.setItem('selectedLanguage', user.preferences.language)
        }
        
        return { success: true, user }
      } catch (error) {
        this.error = error.response?.data?.error || 'Login failed'
        const errorCode = error.response?.data?.code
        return { success: false, error: this.error, code: errorCode }
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
        
        // Set user's preferred language if available
        if (this.user.preferences?.language) {
          setGlobalLanguage(this.user.preferences.language)
        }
        
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
