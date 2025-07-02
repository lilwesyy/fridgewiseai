<template>
  <AuthenticatedLayout>
    <div class="px-4 py-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ $t('recipes.title') }}</h1>
        <p class="text-gray-600">{{ $t('recipes.subtitle') }}</p>
      </div>

      <!-- Generate Recipe Button -->
      <div v-if="currentIngredients.length > 0" class="mb-6">
        <div class="bg-primary-50 rounded-lg p-4 border border-primary-200">
          <h3 class="font-semibold text-primary-900 mb-2">{{ $t('recipes.currentIngredients') }}:</h3>
          <div class="flex flex-wrap gap-2 mb-3">
            <span 
              v-for="ingredient in currentIngredients" 
              :key="ingredient"
              class="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
            >
              {{ ingredient }}
            </span>
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
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div class="p-4">
            <div class="flex items-start justify-between mb-2">
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
            
            <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
              <span v-if="recipe.cookingTime">⏱️ {{ recipe.cookingTime.total || recipe.cookingTime }} {{ $t('recipes.minutes') }}</span>
              <span v-if="recipe.difficulty">📊 {{ $t(`recipes.difficulty.${recipe.difficulty}`) }}</span>
              <span v-if="recipe.servings">👥 {{ recipe.servings }} {{ $t('recipes.servings') }}</span>
            </div>

            <div v-if="recipe.tags && recipe.tags.length" class="flex flex-wrap gap-1 mb-3">
              <span 
                v-for="tag in recipe.tags" 
                :key="tag"
                class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
              >
                {{ $t(`recipes.tags.${tag}`, tag) }}
              </span>
            </div>

            <BaseButton 
              variant="secondary" 
              @click="viewRecipe(recipe)"
              class="w-full"
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
        class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="p-6">
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
            <div v-if="selectedRecipe.cookingTime" class="text-center p-3 bg-gray-50 rounded">
              <div class="font-semibold">{{ $t('recipes.cookingTime') }}</div>
              <div class="text-gray-600">{{ selectedRecipe.cookingTime.total || selectedRecipe.cookingTime }} {{ $t('recipes.minutes') }}</div>
            </div>
            <div v-if="selectedRecipe.difficulty" class="text-center p-3 bg-gray-50 rounded">
              <div class="font-semibold">{{ $t('recipes.difficulty.label') }}</div>
              <div class="text-gray-600">{{ $t(`recipes.difficulty.${selectedRecipe.difficulty}`) }}</div>
            </div>
            <div v-if="selectedRecipe.servings" class="text-center p-3 bg-gray-50 rounded">
              <div class="font-semibold">{{ $t('recipes.servings') }}</div>
              <div class="text-gray-600">{{ selectedRecipe.servings }}</div>
            </div>
            <div v-if="selectedRecipe.nutritionalInfo" class="text-center p-3 bg-gray-50 rounded">
              <div class="font-semibold">{{ $t('recipes.calories') }}</div>
              <div class="text-gray-600">{{ selectedRecipe.nutritionalInfo.calories || '-' }}</div>
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
                <span class="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
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
                <span class="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
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
        console.error('Failed to load recipes:', error)
        this.toast.error(this.$t('notifications.recipes.loadError'))
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
        
        // Call backend API to generate recipe
        const response = await recipeService.generateRecipe(plainIngredients)
        const newRecipe = response.recipe

        // Add to local recipes list
        this.recipes.unshift(newRecipe)

        // Clear current ingredients
        userDataService.clearCurrentIngredients()
        this.currentIngredients = []

        // Add to recent activity
        await userDataService.addRecentActivity({
          id: newRecipe._id,
          title: `Generated: ${newRecipe.title}`,
          timestamp: new Date().toLocaleDateString()
        })

        this.toast.success(this.$t('notifications.recipes.generateSuccess'))

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
          if (ing.name) return `${ing.amount || ''} ${ing.unit || ''} ${ing.name}`.trim()
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
    }
  }
}
</script>
