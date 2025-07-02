<template>
  <AuthenticatedLayout>
    <div class="px-4 py-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Saved Recipes</h1>
        <p class="text-gray-600">Your favorite recipes collection</p>
      </div>

      <!-- Search Bar -->
      <div class="mb-6">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search saved recipes..."
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
            {{ filter.label }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="i in 4" :key="i" class="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div class="animate-pulse">
            <div class="h-4 bg-gray-200 rounded mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Saved Recipes Grid -->
      <div v-else-if="filteredSavedRecipes.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div 
          v-for="recipe in filteredSavedRecipes" 
          :key="recipe.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          <div class="p-4">
            <div class="flex items-start justify-between mb-2">
              <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">{{ recipe.title }}</h3>
              <div class="flex space-x-1 ml-2">
                <button 
                  @click="toggleSaved(recipe.id)"
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

            <div class="flex items-center space-x-4 text-sm text-gray-500 mb-3">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ recipe.cookingTime }}
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                >
                  #{{ tag }}
                </span>
                <span 
                  v-if="recipe.tags.length > 3"
                  class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
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
                View Recipe
              </BaseButton>
              <BaseButton 
                variant="secondary" 
                size="sm"
                @click="cookRecipe(recipe)"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Cook
              </BaseButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {{ searchQuery ? 'No recipes found' : 'No saved recipes yet' }}
        </h3>
        <p class="text-gray-500 mb-4">
          {{ searchQuery ? 'Try adjusting your search terms' : 'Save your favorite recipes to see them here' }}
        </p>
        <BaseButton 
          v-if="!searchQuery"
          variant="primary"
          @click="$router.push('/app/recipes')"
        >
          Browse Recipes
        </BaseButton>
        <BaseButton 
          v-else
          variant="secondary"
          @click="clearSearch"
        >
          Clear Search
        </BaseButton>
      </div>
    </div>

    <!-- Recipe Detail Modal (reused from Recipes page) -->
    <div v-if="selectedRecipe" class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50" @click="closeRecipeModal">
      <div class="min-h-screen px-4 text-center">
        <div class="fixed inset-0 transition-opacity"></div>
        
        <div class="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-lg" @click.stop>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">{{ selectedRecipe.title }}</h3>
            <button @click="closeRecipeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="space-y-4 max-h-96 overflow-y-auto">
            <div>
              <h4 class="font-medium text-gray-900 mb-2">{{ $t('recipes.ingredients') }}:</h4>
              <ul class="text-sm text-gray-600 space-y-1">
                <li v-for="ingredient in selectedRecipe.ingredients" :key="ingredient">
                  • {{ ingredient }}
                </li>
              </ul>
            </div>

            <div>
              <h4 class="font-medium text-gray-900 mb-2">{{ $t('recipes.instructions') }}:</h4>
              <ol class="text-sm text-gray-600 space-y-2">
                <li v-for="(step, index) in selectedRecipe.instructions" :key="index" class="flex">
                  <span class="font-medium mr-2">{{ index + 1 }}.</span>
                  <span>{{ step }}</span>
                </li>
              </ol>
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
              variant="primary" 
              @click="cookRecipe(selectedRecipe)"
              class="flex-1"
            >
              Start Cooking
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<script>
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import BaseButton from '@/components/ui/Button.vue'

export default {
  name: 'SavedRecipesPage',
  components: {
    AuthenticatedLayout,
    BaseButton
  },
  data() {
    return {
      savedRecipeIds: [],
      allRecipes: [],
      loading: false,
      searchQuery: '',
      activeFilter: 'all',
      selectedRecipe: null,
      filters: [
        { key: 'all', label: 'All' },
        { key: 'quick', label: 'Quick' },
        { key: 'easy', label: 'Easy' },
        { key: 'vegetarian', label: 'Vegetarian' },
        { key: 'healthy', label: 'Healthy' }
      ]
    }
  },
  computed: {
    savedRecipes() {
      return this.allRecipes.filter(recipe => 
        this.savedRecipeIds.includes(recipe.id)
      )
    },
    filteredSavedRecipes() {
      let filtered = this.savedRecipes

      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(recipe =>
          recipe.title.toLowerCase().includes(query) ||
          recipe.description.toLowerCase().includes(query) ||
          recipe.ingredients.some(ing => ing.toLowerCase().includes(query))
        )
      }

      // Apply category filter
      if (this.activeFilter !== 'all') {
        filtered = filtered.filter(recipe => {
          switch (this.activeFilter) {
            case 'quick':
              return parseInt(recipe.cookingTime) <= 30
            case 'easy':
              return recipe.difficulty === 'Easy'
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
    loadSavedRecipes() {
      this.loading = true
      
      try {
        // Load saved recipe IDs
        const savedIds = localStorage.getItem('savedRecipes')
        if (savedIds) {
          this.savedRecipeIds = JSON.parse(savedIds)
        }

        // Load all recipes
        const allRecipes = localStorage.getItem('generatedRecipes')
        if (allRecipes) {
          this.allRecipes = JSON.parse(allRecipes)
        }
      } catch (error) {
        console.error('Error loading saved recipes:', error)
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

    toggleSaved(recipeId) {
      const index = this.savedRecipeIds.indexOf(recipeId)
      if (index > -1) {
        this.savedRecipeIds.splice(index, 1)
        localStorage.setItem('savedRecipes', JSON.stringify(this.savedRecipeIds))
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
        const text = `${recipe.title}\n\n${recipe.description}\n\nIngredients:\n${recipe.ingredients.join('\n')}`
        navigator.clipboard.writeText(text).then(() => {
          // Show toast notification
          alert('Recipe copied to clipboard!')
        })
      }
    },

    cookRecipe(recipe) {
      // Start cooking mode - could open a step-by-step cooking guide
      this.closeRecipeModal()
      // For now, just show an alert
      alert(`Starting cooking mode for ${recipe.title}!`)
    },

    clearSearch() {
      this.searchQuery = ''
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
