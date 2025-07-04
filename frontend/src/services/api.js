import axios from 'axios'
import { geminiService } from './geminiService.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL
axios.defaults.timeout = 10000

// Set auth token if available
const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Request interceptor to add token to requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const errorCode = error.response?.data?.code
      
      // Token expired or invalid, clear storage and redirect
      if (errorCode === 'TOKEN_EXPIRED' || errorCode === 'TOKEN_INVALID' || errorCode === 'TOKEN_MISSING') {
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        
        // Only redirect if not already on auth page
        if (!window.location.pathname.includes('/auth')) {
          window.location.href = '/auth'
        }
      }
    }
    return Promise.reject(error)
  }
)

class RecipeService {
  // Generate a new recipe from ingredients using Gemini
  async generateRecipe(ingredients, preferences = {}) {
    try {
      // Use Gemini service instead of backend API
      const recipe = await geminiService.generateRecipe(ingredients, preferences)
      
      // Save the recipe to the database (no fallback)
      const savedRecipe = await this.saveRecipeToDatabase(recipe)
      return { recipe: savedRecipe }
    } catch (error) {
      console.error('Recipe generation failed:', error.message)
      throw new Error(error.message || 'Failed to generate recipe')
    }
  }


  // Save recipe to database
  async saveRecipeToDatabase(recipe) {
    try {
      const response = await axios.post('/recipes', {
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        cookingTime: recipe.cookingTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        calories: recipe.calories,
        tags: recipe.tags,
        tips: recipe.tips,
        sourceIngredients: recipe.sourceIngredients,
        isGenerated: recipe.isGenerated
      })
      return response.data
    } catch (error) {
      console.error('Database save failed:', error)
      throw error
    }
  }


  // Get user's recipes with pagination (from database only)
  async getUserRecipes(page = 1, limit = 10) {
    try {
      const response = await axios.get(`/recipes?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      console.warn('Database not available for paginated recipes:', error.message)
      // Return empty result instead of throwing error
      return {
        recipes: [],
        total: 0,
        page,
        limit,
        totalPages: 0
      }
    }
  }

  // Get all user's recipes (no pagination)
  async getAllUserRecipes() {
    try {
      const response = await axios.get('/recipes/all')
      return response.data
    } catch (error) {
      console.warn('Database not available for recipes:', error.message)
      // Return empty array instead of throwing error
      return []
    }
  }

  // Get a single recipe by ID (from database)
  async getRecipe(recipeId) {
    try {
      const response = await axios.get(`/recipes/${recipeId}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch recipe from database:', error)
      throw new Error('Failed to fetch recipe from database')
    }
  }

  // Update a recipe
  async updateRecipe(recipeId, recipeData) {
    try {
      const response = await axios.put(`/recipes/${recipeId}`, recipeData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update recipe')
    }
  }

  // Delete a recipe
  async deleteRecipe(recipeId) {
    try {
      const response = await axios.delete(`/recipes/${recipeId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete recipe')
    }
  }

  // Search public recipes
  async searchRecipes(query = {}) {
    try {
      const response = await axios.get('/recipes', {
        params: query
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to search recipes')
    }
  }
}

class UserService {
  // Get user statistics
  async getUserStats() {
    try {
      const response = await axios.get('/users/stats')
      return response.data.stats
    } catch (error) {
      console.warn('Database not available for user stats:', error.message)
      // Return default stats instead of throwing error
      return {
        totalRecipes: 0,
        totalScans: 0
      }
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await axios.put('/auth/profile', profileData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update profile')
    }
  }

  // Update user preferences
  async updatePreferences(preferences) {
    try {
      const response = await axios.put('/users/preferences', { preferences })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update preferences')
    }
  }

  // Upload avatar
  async uploadAvatar(file) {
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      
      const response = await axios.post('/auth/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to upload avatar')
    }
  }

  // Remove avatar
  async removeAvatar() {
    try {
      const response = await axios.delete('/auth/avatar')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to remove avatar')
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await axios.put('/auth/change-password', {
        currentPassword,
        newPassword
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to change password')
    }
  }

  // Register supporter status
  async registerSupporter(donationData) {
    try {
      const response = await axios.post('/auth/supporter', donationData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to register supporter status')
    }
  }
}

class IngredientService {
  // Detect ingredients from image
  async detectIngredients(imageData, locale = 'en') {
    try {
      console.log('🔍 Sending image for ingredient detection...')
      console.log('🌍 Using locale:', locale)
      
      const response = await axios.post('/ingredients/detect', {
        image: imageData,
        locale: locale
      })
      
      console.log('✅ Ingredient detection response:', response.data)
      
      return response.data
    } catch (error) {
      console.error('❌ Ingredient detection error:', error)
      
      // Restituisce dati di fallback in caso di errore
      if (error.response?.status === 500) {
        const fallbackIngredients = this.getFallbackIngredients(locale)
        return {
          ingredients: fallbackIngredients,
          confidence: 0.5,
          fallbackMode: true,
          error: 'Servizio temporaneamente non disponibile'
        }
      }
      
      throw new Error(error.response?.data?.error || 'Failed to detect ingredients')
    }
  }

  getFallbackIngredients(locale) {
    const fallbacks = {
      it: ['Pomodori', 'Cipolla', 'Aglio', 'Basilico'],
      en: ['Tomatoes', 'Onion', 'Garlic', 'Basil'],
      fr: ['Tomates', 'Oignon', 'Ail', 'Basilic'],
      de: ['Tomaten', 'Zwiebel', 'Knoblauch', 'Basilikum']
    }
    
    return fallbacks[locale] || fallbacks['en']
  }
}

// User Data Service - manages user-specific data in database
class UserDataService {
  constructor() {
    this.recipeService = new RecipeService()
  }

  // Saved Recipes Management
  async getSavedRecipeIds() {
    try {
      const savedRecipes = await this.getSavedRecipes()
      return savedRecipes.map(recipe => recipe._id || recipe.id)
    } catch (error) {
      console.warn('Failed to fetch saved recipe IDs:', error.message)
      return []
    }
  }

  async addSavedRecipe(recipeId) {
    try {
      await axios.post(`/recipes/${recipeId}/save`)
      return true
    } catch (error) {
      console.warn('Failed to save recipe:', error.message)
      return false
    }
  }

  async removeSavedRecipe(recipeId) {
    try {
      await axios.delete(`/recipes/${recipeId}/save`)
      return true
    } catch (error) {
      console.warn('Failed to remove saved recipe:', error.message)
      return false
    }
  }

  async getSavedRecipes() {
    try {
      const response = await axios.get('/recipes/saved')
      return response.data
    } catch (error) {
      console.warn('Failed to get saved recipes:', error.message)
      return []
    }
  }

  // Recent Activity Management (using new database endpoints)
  async getRecentActivity() {
    try {
      const response = await axios.get('/activity')
      return response.data
    } catch (error) {
      console.warn('Failed to fetch recent activity:', error.message)
      return []
    }
  }

  async addRecentActivity(activity) {
    try {
      await axios.post('/activity', {
        type: 'recipe_generated',
        title: activity.title || 'Recipe Generated',
        description: activity.description || '',
        relatedId: activity.id || null,
        metadata: {
          timestamp: activity.timestamp || new Date().toISOString()
        }
      })
      return true
    } catch (error) {
      // Log the error but don't throw - allow app to continue working
      console.warn('Backend not available for recent activity update:', error.message)
      return false
    }
  }

  // Current Ingredients Management (temporary data, can stay in localStorage for now)
  getCurrentIngredients() {
    try {
      const ingredients = localStorage.getItem('currentIngredients')
      return ingredients ? JSON.parse(ingredients) : []
    } catch (error) {
      return []
    }
  }

  setCurrentIngredients(ingredients) {
    localStorage.setItem('currentIngredients', JSON.stringify(ingredients))
  }

  clearCurrentIngredients() {
    localStorage.removeItem('currentIngredients')
  }
}

// Export service instances
export const recipeService = new RecipeService()
export const userService = new UserService()
export const ingredientService = new IngredientService()
export const userDataService = new UserDataService()

export default {
  recipeService,
  userService,
  ingredientService,
  userDataService
}
