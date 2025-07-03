<template>
  <AuthenticatedLayout>
    <div class="px-4 py-6 mx-auto max-w-3xl w-full">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ $t('savedRecipes.title') }}</h1>
        <p class="text-gray-600">{{ $t('savedRecipes.subtitle') }}</p>
      </div>

      <!-- Search Bar -->
      <div class="mb-6">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('savedRecipes.searchPlaceholder')"
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Filter Tabs -->
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
            {{ $t(`savedRecipes.filters.${filter.key}`) }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 gap-4">
        <div v-for="i in 4" :key="i" class="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div class="animate-pulse">
            <div class="h-4 bg-gray-200 rounded mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Saved Recipes Grid -->
      <div v-else-if="filteredSavedRecipes.length > 0" class="grid grid-cols-1 gap-5">
        <div 
          v-for="recipe in filteredSavedRecipes" 
          :key="recipe._id || recipe.id"
          class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1 duration-200"
        >
          <div class="p-5">
            <div class="flex items-start justify-between mb-2">
              <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">{{ recipe.title }}</h3>
              <div class="flex space-x-1 ml-2">
                <button 
                  @click="toggleSaved(recipe._id || recipe.id)"
                  class="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
                  </svg>
                </button>
                <button 
                  @click="shareRecipe(recipe)"
                  class="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div class="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ recipe.cookingTime?.total || recipe.cookingTime }}{{ typeof recipe.cookingTime?.total === 'number' ? ' min' : '' }}
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                {{ recipe.difficulty }}
              </div>
            </div>

            <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ recipe.description }}</p>

            <!-- Tags -->
            <div v-if="recipe.tags && recipe.tags.length > 0" class="mb-4">
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="tag in recipe.tags.slice(0, 3)" 
                  :key="tag"
                  class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
                >
                  #{{ tag }}
                </span>
                <span 
                  v-if="recipe.tags.length > 3"
                  class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
                >
                  +{{ recipe.tags.length - 3 }}
                </span>
              </div>
            </div>

            <div class="flex space-x-2">
              <BaseButton 
                variant="primary" 
                size="sm"
                @click="viewRecipe(recipe)"
                class="flex-1"
              >
                {{ $t('recipes.viewRecipe') }}
              </BaseButton>
              <BaseButton 
                variant="secondary" 
                size="sm"
                @click="cookRecipe(recipe)"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ $t('cookingMode.startCooking') }}
              </BaseButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
        <div class="w-20 h-20 bg-gradient-to-br from-gray-100 to-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {{ searchQuery ? $t('savedRecipes.noRecipesFound') : $t('savedRecipes.empty') }}
        </h3>
        <p class="text-gray-500 mb-4">
          {{ searchQuery ? $t('savedRecipes.tryAdjustSearch') : $t('savedRecipes.saveToSee') }}
        </p>
        <div class="flex justify-center">
          <BaseButton 
            v-if="!searchQuery"
            variant="primary"
            @click="$router.push('/app/recipes')"
          >
            {{ $t('savedRecipes.browseRecipes') }}
          </BaseButton>
        <BaseButton 
          v-else
          variant="secondary"
          @click="clearSearch"
        >
          {{ $t('savedRecipes.clearSearch') }}
        </BaseButton>
        </div>
      </div>
    </div>

    <!-- Recipe Detail Modal (same as Recipes page) -->
    <div 
      v-if="selectedRecipe" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="closeRecipeModal"
    >
      <div 
        class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        @click.stop
      >
        <div class="p-7">
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
            <div v-if="selectedRecipe.nutrition || selectedRecipe.nutritionalInfo" class="text-center p-3 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg shadow-sm">
              <div class="font-semibold">{{ $t('recipes.calories') }}</div>
              <div class="text-gray-600">{{ (selectedRecipe.nutrition?.calories || selectedRecipe.nutritionalInfo?.calories) || '-' }}</div>
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
              @click="cookRecipe(selectedRecipe)"
              class="flex-1"
            >                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ $t('cookingMode.startCooking') }}
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
import { userDataService } from '@/services/api'

export default {
  name: 'SavedRecipesPage',
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
      savedRecipes: [],
      loading: false,
      searchQuery: '',
      activeFilter: 'all',
      selectedRecipe: null,
      filters: [
        { key: 'all' },
        { key: 'quick' },
        { key: 'easy' },
        { key: 'vegetarian' },
        { key: 'healthy' }
      ]
    }
  },
  computed: {
    filteredSavedRecipes() {
      let filtered = this.savedRecipes

      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(recipe =>
          recipe.title.toLowerCase().includes(query) ||
          recipe.description.toLowerCase().includes(query) ||
          this.getIngredientNames(recipe.ingredients).some(ing => ing.toLowerCase().includes(query))
        )
      }

      // Apply category filter
      if (this.activeFilter !== 'all') {
        filtered = filtered.filter(recipe => {
          switch (this.activeFilter) {
            case 'quick':
              return recipe.cookingTime?.total <= 30
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

      return filtered
    }
  },
  mounted() {
    this.loadSavedRecipes()
  },
  methods: {
    async loadSavedRecipes() {
      this.loading = true
      
      try {
        // Load saved recipes from database
        this.savedRecipes = await userDataService.getSavedRecipes()
      } catch (error) {
        console.error('Error loading saved recipes:', error)
        this.toast.error(this.$t('notifications.recipes.loadError') || 'Failed to load saved recipes')
      } finally {
        this.loading = false
      }
    },

    viewRecipe(recipe) {
      this.selectedRecipe = recipe
    },

    closeRecipeModal() {
      this.selectedRecipe = null
    },

    async toggleSaved(recipeId) {
      try {
        await userDataService.removeSavedRecipe(recipeId)
        // Remove from local list
        this.savedRecipes = this.savedRecipes.filter(recipe => 
          (recipe._id || recipe.id) !== recipeId
        )
        this.toast.info(this.$t('notifications.recipes.removeSuccess'))
      } catch (error) {
        console.error('Failed to remove saved recipe:', error)
        this.toast.error(this.$t('notifications.recipes.removeError') || 'Failed to remove recipe')
      }
    },

    shareRecipe(recipe) {
      if (navigator.share) {
        navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: window.location.href
        })
      } else {
        // Fallback: copy to clipboard
        const ingredientsText = this.getIngredientNames(recipe.ingredients).join('\n')
        const text = `${recipe.title}\n\n${recipe.description}\n\nIngredients:\n${ingredientsText}`
        navigator.clipboard.writeText(text).then(() => {
          this.toast.success(this.$t('notifications.recipes.shareSuccess'))
        }).catch(() => {
          this.toast.error(this.$t('notifications.general.error'))
        })
      }
    },

    cookRecipe(recipe) {
      // Naviga alla modalità cucina con la ricetta
      this.$router.push({
        name: 'CookingMode',
        params: {
          recipe: encodeURIComponent(JSON.stringify(recipe))
        }
      })
    },

    clearSearch() {
      this.searchQuery = ''
    },

    // Helper methods to handle different data formats
    getIngredientNames(ingredients) {
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

    getIngredientList(ingredients) {
      return this.getIngredientNames(ingredients)
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

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
