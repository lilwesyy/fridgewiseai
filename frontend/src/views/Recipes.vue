<template>
  <AuthenticatedLayout>
    <div class="px-4 py-6 pb-20 mx-auto max-w-3xl w-full">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ $t('recipes.title') }}</h1>
        <p class="text-gray-600">{{ $t('recipes.subtitle') }}</p>
      </div>

      <!-- Generate Recipe Button -->
      <div v-if="currentIngredients.length > 0" class="mb-6">
        <div class="bg-primary-50 rounded-lg p-4 border border-primary-200">
          <h3 class="font-semibold text-primary-900 mb-2">{{ $t('recipes.currentIngredients') }}:</h3>
          <div class="flex flex-wrap gap-2 mb-4">
            <span 
              v-for="ingredient in currentIngredients" 
              :key="ingredient"
              class="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
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
      <div class="mb-6">
        <div class="flex space-x-2 overflow-x-auto pb-2">
          <button 
            v-for="filter in filters" 
            :key="filter.key"
            @click="activeFilter = filter.key"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              activeFilter === filter.key
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
          v-for="recipe in filteredRecipes" 
          :key="recipe._id || recipe.id"
          class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1 duration-200"
        >
          <div class="p-5">
            <div class="flex items-start justify-between mb-3">
              <h3 class="text-lg font-semibold text-gray-900">{{ recipe.title }}</h3>
              <button 
                @click="toggleSaved(recipe._id || recipe.id)"
                :class="[
                  'p-2 rounded-full transition-colors',
                  savedRecipes.includes(recipe._id || recipe.id)
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-gray-400 hover:bg-gray-50'
                ]"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
                </svg>
              </button>
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

          <div class="mt-6 flex space-x-3">
            <BaseButton 
              variant="secondary" 
              @click="closeRecipeModal"
              class="flex-1"
            >
              {{ $t('common.close') }}
            </BaseButton>
            <BaseButton 
              variant="primary" 
              @click="saveRecipe(selectedRecipe)"
              :disabled="savedRecipes.includes(selectedRecipe._id || selectedRecipe.id)"
              class="flex-1"
            >
              {{ savedRecipes.includes(selectedRecipe._id || selectedRecipe.id) ? $t('recipes.saved') : $t('common.save') }}
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
        
        // Call backend API to generate recipe with preferences
        const response = await recipeService.generateRecipe(plainIngredients, this.preferences)
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
            title: `Generated: ${newRecipe.title}`,
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
    }
  }
}
</script>
