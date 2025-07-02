import axios from 'axios'

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
  // Generate a new recipe from ingredients
  async generateRecipe(ingredients, preferences = {}) {
    try {
      const response = await axios.post('/recipes/generate', {
        ingredients,
        preferences
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to generate recipe')
    }
  }

  // Get user's recipes with pagination
  async getUserRecipes(page = 1, limit = 10) {
    try {
      const response = await axios.get('/recipes/my', {
        params: { page, limit }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch recipes')
    }
  }

  // Get all user's recipes (no pagination)
  async getAllUserRecipes() {
    try {
      const response = await axios.get('/recipes/my', {
        params: { limit: 1000 } // Large limit to get all recipes
      })
      return response.data.recipes || []
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch all recipes')
    }
  }

  // Get a single recipe by ID
  async getRecipe(recipeId) {
    try {
      const response = await axios.get(`/recipes/${recipeId}`)
      return response.data.recipe
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch recipe')
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
      throw new Error(error.response?.data?.error || 'Failed to fetch user stats')
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
}

class IngredientService {
  // Detect ingredients from image
  async detectIngredients(imageData) {
    try {
      const response = await axios.post('/ingredients/detect', {
        image: imageData
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to detect ingredients')
    }
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
      // Get user's saved recipes from their profile or preferences
      const response = await axios.get('/auth/me')
      return response.data.user.preferences?.savedRecipes || []
    } catch (error) {
      console.warn('Failed to fetch saved recipes from server, using fallback')
      return []
    }
  }

  async addSavedRecipe(recipeId) {
    try {
      const currentSaved = await this.getSavedRecipeIds()
      if (!currentSaved.includes(recipeId)) {
        const updatedSaved = [...currentSaved, recipeId]
        await axios.put('/auth/profile', {
          preferences: { savedRecipes: updatedSaved }
        })
      }
      return true
    } catch (error) {
      throw new Error('Failed to save recipe')
    }
  }

  async removeSavedRecipe(recipeId) {
    try {
      const currentSaved = await this.getSavedRecipeIds()
      const updatedSaved = currentSaved.filter(id => id !== recipeId)
      await axios.put('/auth/profile', {
        preferences: { savedRecipes: updatedSaved }
      })
      return true
    } catch (error) {
      throw new Error('Failed to remove saved recipe')
    }
  }

  async getSavedRecipes() {
    try {
      const savedIds = await this.getSavedRecipeIds()
      if (savedIds.length === 0) return []

      // Fetch full recipe data for saved IDs
      const recipes = await Promise.all(
        savedIds.map(async (id) => {
          try {
            return await this.recipeService.getRecipe(id)
          } catch (error) {
            console.warn(`Failed to fetch recipe ${id}:`, error)
            return null
          }
        })
      )

      return recipes.filter(recipe => recipe !== null)
    } catch (error) {
      throw new Error('Failed to fetch saved recipes')
    }
  }

  // Recent Activity Management (stored in user preferences)
  async getRecentActivity() {
    try {
      const response = await axios.get('/auth/me')
      return response.data.user.preferences?.recentActivity || []
    } catch (error) {
      console.warn('Failed to fetch recent activity from server')
      return []
    }
  }

  async addRecentActivity(activity) {
    try {
      const currentActivity = await this.getRecentActivity()
      const updatedActivity = [activity, ...currentActivity].slice(0, 10) // Keep only last 10
      
      await axios.put('/auth/profile', {
        preferences: { recentActivity: updatedActivity }
      })
      return true
    } catch (error) {
      throw new Error('Failed to update recent activity')
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
