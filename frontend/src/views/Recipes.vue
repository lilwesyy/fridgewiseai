<template>
  <AuthenticatedLayout>
    <div class="px-4 py-6 pb-20 mx-auto max-w-3xl w-full">
      <!-- Header -->
      <div class="mb-6 animate-fade-in-up">
        <h1 class="text-2xl font-bold text-gray-900 mb-2 animate-slide-in-left animation-delay-200">{{ $t('recipes.title') }}</h1>
        <p class="text-gray-600 animate-slide-in-left animation-delay-300">{{ $t('recipes.subtitle') }}</p>
      </div>

      <!-- Generate Recipe Button -->
      <div v-if="currentIngredients.length > 0" class="mb-6 animate-slide-down-fade-in animation-delay-400">
        <div class="bg-primary-50 rounded-lg p-4 border border-primary-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300 group">
          <h3 class="font-semibold text-primary-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">{{ $t('recipes.currentIngredients') }}:</h3>
          <div class="flex flex-wrap gap-2 mb-4">
            <span 
              v-for="(ingredient, index) in currentIngredients" 
              :key="ingredient"
              class="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm hover:bg-primary-200 hover:scale-105 transition-all duration-300 animate-bounce-in"
              :class="`animation-delay-${500 + index * 100}`"
            >
              {{ ingredient }}
            </span>
          </div>
          
          <!-- Recipe Preferences -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <!-- Servings -->
            <div>
              <label class="block text-sm font-medium text-primary-800 mb-1">{{ $t('recipes.servings') }}</label>
              <select 
                v-model="preferences.servings" 
                class="w-full px-3 py-2 border border-primary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm"
              >
                <option value="1">1 {{ $t('recipes.person') }}</option>
                <option value="2">2 {{ $t('recipes.people') }}</option>
                <option value="4">4 {{ $t('recipes.people') }}</option>
                <option value="6">6 {{ $t('recipes.people') }}</option>
                <option value="8">8 {{ $t('recipes.people') }}</option>
              </select>
            </div>
            
            <!-- Difficulty -->
            <div>
              <label class="block text-sm font-medium text-primary-800 mb-1">{{ $t('recipes.difficulty.label') }}</label>
              <select 
                v-model="preferences.difficulty" 
                class="w-full px-3 py-2 border border-primary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm"
              >
                <option value="easy">{{ $t('recipes.difficulty.easy') }}</option>
                <option value="medium">{{ $t('recipes.difficulty.medium') }}</option>
                <option value="hard">{{ $t('recipes.difficulty.hard') }}</option>
              </select>
            </div>
            
            <!-- Max Cooking Time -->
            <div>
              <label class="block text-sm font-medium text-primary-800 mb-1">{{ $t('recipes.maxCookingTime') }}</label>
              <select 
                v-model="preferences.maxCookingTime" 
                class="w-full px-3 py-2 border border-primary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm"
              >
                <option value="15">15 {{ $t('recipes.minutes') }}</option>
                <option value="30">30 {{ $t('recipes.minutes') }}</option>
                <option value="45">45 {{ $t('recipes.minutes') }}</option>
                <option value="60">60 {{ $t('recipes.minutes') }}</option>
                <option value="90">90 {{ $t('recipes.minutes') }}</option>
                <option value="120">120 {{ $t('recipes.minutes') }}</option>
              </select>
            </div>
          </div>
          
          <BaseButton 
            variant="primary" 
            @click="generateRecipe"
            :loading="generating"
            full-width
          >
            {{ $t('recipes.generate') }}
          </BaseButton>
        </div>
      </div>

      <!-- Filters -->
      <div class="mb-6 animate-fade-in-up animation-delay-800">
        <div class="flex space-x-2 overflow-x-auto pb-2">
          <button 
            v-for="(filter, index) in filters" 
            :key="filter.key"
            @click="activeFilter = filter.key"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md animate-bounce-in',
              activeFilter === filter.key
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              `animation-delay-${900 + index * 100}`
            ]"
          >
            {{ $t(`recipes.filters.${filter.key}`) }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div class="animate-pulse">
            <div class="h-4 bg-gray-200 rounded mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Recipe List -->
      <div v-else-if="filteredRecipes.length > 0" class="space-y-4">
        <div 
          v-for="(recipe, index) in filteredRecipes" 
          :key="recipe._id || recipe.id"
          class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl hover:border-primary-200 transition-all transform hover:-translate-y-2 hover:scale-105 duration-300 animate-slide-in-right group"
          :class="`animation-delay-${1200 + index * 150}`"
        >
          <div class="p-5">
            <div class="flex items-start justify-between mb-3">
              <h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">{{ recipe.title }}</h3>
              <div class="flex space-x-1">
                <button 
                  @click="toggleSaved(recipe._id || recipe.id)"
                  :class="[
                    'p-2 rounded-full transition-all duration-300 hover:scale-110',
                    savedRecipes.includes(recipe._id || recipe.id)
                      ? 'text-red-600 hover:bg-red-50 animate-pulse-slow'
                      : 'text-gray-400 hover:bg-gray-50'
                  ]"
                >
                  <svg class="w-5 h-5 transition-transform duration-300 hover:scale-125" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
                  </svg>
                </button>
                <button 
                  @click="deleteRecipe(recipe._id || recipe.id)"
                  class="p-2 rounded-full transition-all duration-300 hover:scale-110 text-gray-400 hover:text-red-600 hover:bg-red-50"
                >
                  <svg class="w-5 h-5 transition-transform duration-300 hover:scale-125" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <p class="text-gray-600 text-sm mb-3">{{ recipe.description }}</p>
            
            <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span v-if="recipe.cookingTime" class="flex items-center">
                <svg class="w-4 h-4 text-primary-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ recipe.cookingTime.total || recipe.cookingTime }} {{ $t('recipes.minutes') }}
              </span>
              <span v-if="recipe.difficulty" class="flex items-center">
                <svg class="w-4 h-4 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                {{ $t(`recipes.difficulty.${recipe.difficulty}`) }}
              </span>
              <span v-if="recipe.servings" class="flex items-center">
                <svg class="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                {{ recipe.servings }} {{ $t('recipes.servings') }}
              </span>
            </div>

            <div v-if="recipe.tags && recipe.tags.length" class="flex flex-wrap gap-1 mb-4">
              <span 
                v-for="tag in recipe.tags" 
                :key="tag"
                class="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-gray-200 transition-colors"
              >
                {{ $t(`recipes.tags.${tag}`, tag) }}
              </span>
            </div>

            <BaseButton 
              variant="secondary" 
              @click="viewRecipe(recipe)"
              class="w-full shadow-sm hover:shadow transition-shadow"
            >
              {{ $t('recipes.viewRecipe') }}
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading" class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('recipes.empty.title') }}</h3>
        <p class="text-gray-500 mb-4">{{ $t('recipes.empty.subtitle') }}</p>
        <div class="flex justify-center">
          <BaseButton 
            variant="primary" 
            @click="$router.push('/camera')"
          >
            {{ $t('recipes.empty.action') }}
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Recipe Modal -->
    <div 
      v-if="selectedRecipe" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="closeRecipeModal"
    >
      <div 
        class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        @click.stop
      >
        <div class="p-7 pb-20">
          <div class="flex items-start justify-between mb-4">
            <h2 class="text-2xl font-bold text-gray-900">{{ selectedRecipe.title }}</h2>
            <button 
              @click="closeRecipeModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <p v-if="selectedRecipe.description" class="text-gray-600 mb-4">{{ selectedRecipe.description }}</p>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
            <div v-if="selectedRecipe.cookingTime" class="text-center p-3 bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg shadow-sm">
              <div class="font-semibold">{{ $t('recipes.cookingTime') }}</div>
              <div class="text-gray-600">{{ selectedRecipe.cookingTime.total || selectedRecipe.cookingTime }} {{ $t('recipes.minutes') }}</div>
            </div>
            <div v-if="selectedRecipe.difficulty" class="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm">
              <div class="font-semibold">{{ $t('recipes.difficulty.label') }}</div>
              <div class="text-gray-600">{{ $t(`recipes.difficulty.${selectedRecipe.difficulty}`) }}</div>
            </div>
            <div v-if="selectedRecipe.servings" class="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-sm">
              <div class="font-semibold">{{ $t('recipes.servings') }}</div>
              <div class="text-gray-600">{{ selectedRecipe.servings }}</div>
            </div>
            <div v-if="selectedRecipe.calories || selectedRecipe.nutritionalInfo" class="text-center p-3 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg shadow-sm">
              <div class="font-semibold">{{ $t('recipes.calories') }}</div>
              <div class="text-gray-600">{{ selectedRecipe.calories || selectedRecipe.nutritionalInfo?.calories || '-' }}</div>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">{{ $t('recipes.ingredients') }}</h3>
            <ul class="space-y-2">
              <li 
                v-for="(ingredient, index) in getIngredientList(selectedRecipe.ingredients)" 
                :key="index"
                class="flex items-center text-gray-700"
              >
              <span class="w-2 h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mr-3 shadow-sm"></span>
                {{ ingredient }}
              </li>
            </ul>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">{{ $t('recipes.instructions') }}</h3>
            <ol class="space-y-3">
              <li 
                v-for="(instruction, index) in getInstructionsList(selectedRecipe.instructions)" 
                :key="index"
                class="flex text-gray-700"
              >
                <span class="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 shadow-sm">
                  {{ index + 1 }}
                </span>
                <span>{{ instruction }}</span>
              </li>
            </ol>
          </div>

          <!-- Cooking Mode Info -->
          <div v-if="!savedRecipes.includes(selectedRecipe._id || selectedRecipe.id)" class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h4 class="text-sm font-medium text-blue-900">{{ $t('recipes.cookingModeInfo.title') }}</h4>
                <p class="text-sm text-blue-700 mt-1">{{ $t('recipes.cookingModeInfo.message') }}</p>
              </div>
            </div>
          </div>

          <div class="mt-6 flex space-x-3">
            <BaseButton 
              variant="secondary" 
              @click="closeRecipeModal"
              class="flex-1"
            >
              {{ $t('common.close') }}
            </BaseButton>
            <BaseButton 
              variant="secondary" 
              @click="deleteRecipe(selectedRecipe._id || selectedRecipe.id)"
              class="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              {{ $t('common.delete') }}
            </BaseButton>
            <BaseButton 
              variant="primary" 
              @click="saveRecipe(selectedRecipe)"
              :disabled="savedRecipes.includes(selectedRecipe._id || selectedRecipe.id)"
              class="flex-1"
            >
              {{ savedRecipes.includes(selectedRecipe._id || selectedRecipe.id) ? $t('recipes.saved') : $t('recipes.saveForCooking') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>


    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50" @click="cancelDeleteRecipe">
      <div class="min-h-screen px-4 text-center">
        <div class="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-lg" @click.stop>
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('recipes.confirmDeleteTitle') }}</h3>
            <p class="text-gray-600">{{ $t('recipes.confirmDeleteMessage') }}</p>
          </div>

          <div class="flex space-x-3">
            <BaseButton 
              variant="secondary" 
              @click="cancelDeleteRecipe"
              class="flex-1"
            >
              {{ $t('common.cancel') }}
            </BaseButton>
            <BaseButton 
              variant="primary" 
              @click="confirmDeleteRecipe"
              class="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              {{ $t('common.delete') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<script>
import { useToast } from 'vue-toastification'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import BaseButton from '@/components/ui/Button.vue'
import { recipeService, userDataService } from '@/services/api'
import { DonationHelper } from '@/utils/donationHelper'

export default {
  name: 'RecipesPage',
  components: {
    AuthenticatedLayout,
    BaseButton
  },
  setup() {
    const toast = useToast()
    return { toast }
  },
  data() {
    return {
      recipes: [],
      currentIngredients: [],
      loading: false,
      generating: false,
      activeFilter: 'all',
      selectedRecipe: null,
      savedRecipes: [],
      showDeleteConfirm: false,
      recipeToDelete: null,
      preferences: {
        servings: 4,
        difficulty: 'easy',
        maxCookingTime: 30
      },
      filters: [
        { key: 'all', label: 'All' },
        { key: 'quick', label: 'Quick (< 30 min)' },
        { key: 'easy', label: 'Easy' },
        { key: 'vegetarian', label: 'Vegetarian' },
        { key: 'healthy', label: 'Healthy' }
      ]
    }
  },
  computed: {
    filteredRecipes() {
      if (this.activeFilter === 'all') {
        return this.recipes
      }
      return this.recipes.filter(recipe => {
        switch (this.activeFilter) {
          case 'quick':
            return (recipe.cookingTime?.total || recipe.cookingTime) <= 30
          case 'easy':
            return recipe.difficulty === 'easy'
          case 'vegetarian':
            return recipe.tags?.includes('vegetarian')
          case 'healthy':
            return recipe.tags?.includes('healthy')
          default:
            return true
        }
      })
    }
  },
  async mounted() {
    await this.loadCurrentIngredients()
    await this.loadRecipes()
    await this.loadSavedRecipes()
  },
  methods: {
    async loadCurrentIngredients() {
      try {
        this.currentIngredients = userDataService.getCurrentIngredients()
      } catch (error) {
        console.error('Failed to load current ingredients:', error)
        this.currentIngredients = []
      }
    },

    async loadRecipes() {
      this.loading = true
      try {
        // Load user's recipes from database
        this.recipes = await recipeService.getAllUserRecipes()
      } catch (error) {
        console.warn('Database not available, showing empty state:', error.message)
        // Set empty recipes without showing error toast
        this.recipes = []
      } finally {
        this.loading = false
      }
    },

    async loadSavedRecipes() {
      try {
        this.savedRecipes = await userDataService.getSavedRecipeIds()
      } catch (error) {
        console.error('Failed to load saved recipes:', error)
        this.savedRecipes = []
      }
    },

    async generateRecipe() {
      if (this.currentIngredients.length === 0) return

      this.generating = true

      try {
        // Convert to plain array to avoid Proxy serialization issues
        const plainIngredients = Array.from(this.currentIngredients)
        console.log('Sending ingredients to API:', plainIngredients)
        console.log('Sending preferences to API:', this.preferences)
        
        // Call backend API to generate recipe with preferences and locale
        const preferencesWithLocale = {
          ...this.preferences,
          locale: this.$i18n.locale
        }
        console.log('Sending locale:', this.$i18n.locale)
        
        const response = await recipeService.generateRecipe(plainIngredients, preferencesWithLocale)
        const newRecipe = response.recipe

        // Add to local recipes list
        this.recipes.unshift(newRecipe)

        // Clear current ingredients
        userDataService.clearCurrentIngredients()
        this.currentIngredients = []

        // Add to recent activity (skip if backend not available)
        try {
          await userDataService.addRecentActivity({
            id: newRecipe.id,
            title: `${this.$t('home.generated')} ${newRecipe.title}`,
            timestamp: new Date().toLocaleDateString()
          })
        } catch (error) {
          console.warn('Failed to update recent activity (backend not available):', error.message)
          // Continue without failing the recipe generation
        }

        this.toast.success(this.$t('notifications.recipes.generateSuccess'))

        // Check if should show donation toast
        this.checkDonationToast()

      } catch (error) {
        console.error('Recipe generation error:', error)
        this.toast.error(this.$t('notifications.recipes.generateError'))
      } finally {
        this.generating = false
      }
    },

    viewRecipe(recipe) {
      this.selectedRecipe = recipe
    },

    closeRecipeModal() {
      this.selectedRecipe = null
    },

    async saveRecipe(recipe) {
      try {
        const recipeId = recipe._id || recipe.id
        if (!recipeId) {
          this.toast.error(this.$t('notifications.recipes.saveError'))
          return
        }
        if (!this.savedRecipes.includes(recipeId)) {
          await userDataService.addSavedRecipe(recipeId)
          this.savedRecipes.push(recipeId)
          this.toast.success(this.$t('notifications.recipes.saveSuccess'))
          
          // Close modal and redirect to saved recipes for cooking mode
          this.selectedRecipe = null
          this.$router.push('/app/saved')
        }
      } catch (error) {
        console.error('Failed to save recipe:', error)
        this.toast.error(this.$t('notifications.recipes.saveError'))
      }
    },

    async toggleSaved(recipeId) {
      try {
        const index = this.savedRecipes.indexOf(recipeId)
        if (index > -1) {
          await userDataService.removeSavedRecipe(recipeId)
          this.savedRecipes.splice(index, 1)
          this.toast.info(this.$t('notifications.recipes.removeSuccess'))
        } else {
          await userDataService.addSavedRecipe(recipeId)
          this.savedRecipes.push(recipeId)
          this.toast.success(this.$t('notifications.recipes.saveSuccess'))
          
          // Redirect to saved recipes for cooking mode
          this.$router.push('/app/saved')
        }
      } catch (error) {
        console.error('Failed to toggle saved recipe:', error)
        this.toast.error(this.$t('notifications.recipes.saveError'))
      }
    },

    // Helper methods to handle different data formats
    getIngredientList(ingredients) {
      if (!ingredients) return []
      if (Array.isArray(ingredients)) {
        return ingredients.map(ing => {
          if (typeof ing === 'string') return ing
          if (ing.name) {
            // Handle new OpenRouter format: {name, amount, emoji}
            const amount = ing.amount || ''
            const emoji = ing.emoji || ''
            return `${emoji} ${amount} ${ing.name}`.trim()
          }
          return ing.toString()
        })
      }
      return []
    },

    getInstructionsList(instructions) {
      if (!instructions) return []
      if (Array.isArray(instructions)) {
        return instructions.map(inst => {
          if (typeof inst === 'string') return inst
          if (inst.description) return inst.description
          return inst.toString()
        })
      }
      return []
    },

    checkDonationToast() {
      // Increment recipe count and check if should show donation toast
      DonationHelper.incrementRecipeCount()
      
      if (DonationHelper.shouldShowDonationToast()) {
        // Show toast after a small delay
        setTimeout(() => {
          this.toast.info(this.$t('recipes.donationToast'), {
            timeout: 8000,
            closeOnClick: false,
            pauseOnFocusLoss: false,
            pauseOnHover: true,
            draggable: false,
            showCloseButtonOnHover: true,
            hideProgressBar: false,
            closeButton: "button",
            icon: true,
            rtl: false
          })
          DonationHelper.markDonationToastShown()
        }, 2000)
      }
    },


    deleteRecipe(recipeId) {
      this.recipeToDelete = recipeId
      this.showDeleteConfirm = true
    },

    async confirmDeleteRecipe() {
      if (!this.recipeToDelete) return

      try {
        await recipeService.deleteRecipe(this.recipeToDelete)
        
        // Remove from local recipes list
        this.recipes = this.recipes.filter(recipe => 
          (recipe._id || recipe.id) !== this.recipeToDelete
        )
        
        // Remove from saved recipes if it was saved
        const savedIndex = this.savedRecipes.indexOf(this.recipeToDelete)
        if (savedIndex > -1) {
          this.savedRecipes.splice(savedIndex, 1)
        }
        
        // Remove from recent activity
        try {
          await userDataService.removeRecentActivityByRecipeId(this.recipeToDelete)
        } catch (error) {
          console.warn('Failed to remove from recent activity:', error.message)
        }
        
        this.toast.success(this.$t('notifications.recipes.deleteSuccess'))
        
        // Close modal if the deleted recipe was currently being viewed
        if (this.selectedRecipe && (this.selectedRecipe._id || this.selectedRecipe.id) === this.recipeToDelete) {
          this.selectedRecipe = null
        }
      } catch (error) {
        console.error('Failed to delete recipe:', error)
        this.toast.error(this.$t('notifications.recipes.deleteError'))
      } finally {
        this.cancelDeleteRecipe()
      }
    },

    cancelDeleteRecipe() {
      this.showDeleteConfirm = false
      this.recipeToDelete = null
    }
  }
}
</script>

<style scoped>
/* Recipes component animations */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-down-fade-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.3) translateY(30px);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05) translateY(-5px);
  }
  70% {
    opacity: 1;
    transform: scale(0.95) translateY(0);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* Animation classes */
.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

.animate-slide-in-left {
  animation: slide-in-left 0.6s ease-out forwards;
}

.animate-slide-in-right {
  animation: slide-in-right 0.6s ease-out forwards;
}

.animate-slide-down-fade-in {
  animation: slide-down-fade-in 0.5s ease-out forwards;
}

.animate-bounce-in {
  animation: bounce-in 0.8s ease-out forwards;
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

/* Animation delays */
.animation-delay-200 { animation-delay: 200ms; }
.animation-delay-300 { animation-delay: 300ms; }
.animation-delay-400 { animation-delay: 400ms; }
.animation-delay-500 { animation-delay: 500ms; }
.animation-delay-600 { animation-delay: 600ms; }
.animation-delay-700 { animation-delay: 700ms; }
.animation-delay-800 { animation-delay: 800ms; }
.animation-delay-900 { animation-delay: 900ms; }
.animation-delay-1000 { animation-delay: 1000ms; }
.animation-delay-1100 { animation-delay: 1100ms; }
.animation-delay-1200 { animation-delay: 1200ms; }
.animation-delay-1350 { animation-delay: 1350ms; }
.animation-delay-1500 { animation-delay: 1500ms; }
.animation-delay-1650 { animation-delay: 1650ms; }
.animation-delay-1800 { animation-delay: 1800ms; }

/* Initially hide animated elements */
.animate-fade-in-up,
.animate-slide-in-left,
.animate-slide-in-right,
.animate-slide-down-fade-in,
.animate-bounce-in {
  opacity: 0;
}
</style>
