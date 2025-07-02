<template>
  <AuthenticatedLayout>
    <div class="px-4 py-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ $t('recipes.title') }}</h1>
        <p class="text-gray-600">Delicious recipes based on your ingredients</p>
      </div>

      <!-- Generate Recipe Button -->
      <div v-if="currentIngredients.length > 0" class="mb-6">
        <div class="bg-primary-50 rounded-lg p-4 border border-primary-200">
          <h3 class="font-semibold text-primary-900 mb-2">Current Ingredients:</h3>
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
            {{ filter.label }}
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
          :key="recipe.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div class="p-4">
            <div class="flex items-start justify-between mb-2">
              <h3 class="text-lg font-semibold text-gray-900">{{ recipe.title }}</h3>
              <button 
                @click="toggleSaved(recipe.id)"
                :class="[
                  'p-2 rounded-full transition-colors',
                  savedRecipes.includes(recipe.id)
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-gray-400 hover:bg-gray-50'
                ]"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
                </svg>
              </button>
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
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                {{ recipe.servings }} servings
              </div>
            </div>

            <p class="text-gray-600 text-sm mb-4">{{ recipe.description }}</p>

            <!-- Ingredients preview -->
            <div class="mb-4">
              <h4 class="font-medium text-gray-900 mb-2">{{ $t('recipes.ingredients') }}:</h4>
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="ingredient in recipe.ingredients.slice(0, 3)" 
                  :key="ingredient"
                  class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                >
                  {{ ingredient }}
                </span>
                <span 
                  v-if="recipe.ingredients.length > 3"
                  class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                >
                  +{{ recipe.ingredients.length - 3 }} more
                </span>
              </div>
            </div>

            <div class="flex space-x-2">
              <BaseButton 
                variant="secondary" 
                size="sm"
                @click="viewRecipe(recipe)"
                class="flex-1"
              >
                View Recipe
              </BaseButton>
              <BaseButton 
                variant="primary" 
                size="sm"
                @click="saveRecipe(recipe)"
                :disabled="savedRecipes.includes(recipe.id)"
              >
                {{ savedRecipes.includes(recipe.id) ? 'Saved' : 'Save' }}
              </BaseButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
        <p class="text-gray-500 mb-4">Start by scanning your ingredients to generate personalized recipes</p>
        <BaseButton 
          variant="primary"
          @click="$router.push('/app/camera')"
        >
          Scan Ingredients
        </BaseButton>
      </div>
    </div>

    <!-- Recipe Detail Modal -->
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

          <div class="space-y-4">
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
              @click="saveRecipe(selectedRecipe)"
              :disabled="savedRecipes.includes(selectedRecipe.id)"
              class="flex-1"
            >
              {{ savedRecipes.includes(selectedRecipe.id) ? 'Saved' : $t('common.save') }}
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
  name: 'RecipesPage',
  components: {
    AuthenticatedLayout,
    BaseButton
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
  },
  mounted() {
    this.loadCurrentIngredients()
    this.loadRecipes()
    this.loadSavedRecipes()
  },
  methods: {
    loadCurrentIngredients() {
      const stored = localStorage.getItem('currentIngredients')
      if (stored) {
        this.currentIngredients = JSON.parse(stored)
      }
    },

    loadRecipes() {
      // Load recipes from localStorage or API
      const stored = localStorage.getItem('generatedRecipes')
      if (stored) {
        this.recipes = JSON.parse(stored)
      }
    },

    loadSavedRecipes() {
      const stored = localStorage.getItem('savedRecipes')
      if (stored) {
        this.savedRecipes = JSON.parse(stored)
      }
    },

    async generateRecipe() {
      if (this.currentIngredients.length === 0) return

      this.generating = true

      try {
        // Simulate API call to generate recipe
        await new Promise(resolve => setTimeout(resolve, 3000))

        const newRecipe = {
          id: Date.now(),
          title: `${this.currentIngredients[0]} ${this.currentIngredients[1] || 'Dish'}`,
          description: `A delicious recipe using ${this.currentIngredients.join(', ')}`,
          cookingTime: '25 min',
          difficulty: 'Medium',
          servings: 4,
          ingredients: [
            ...this.currentIngredients.map(ing => `1 cup ${ing.toLowerCase()}`),
            '2 tbsp olive oil',
            'Salt and pepper to taste'
          ],
          instructions: [
            'Prepare all ingredients by washing and chopping as needed.',
            'Heat olive oil in a large pan over medium heat.',
            'Add main ingredients and cook for 10-15 minutes.',
            'Season with salt and pepper.',
            'Serve hot and enjoy!'
          ],
          tags: ['healthy', 'homemade']
        }

        this.recipes.unshift(newRecipe)
        localStorage.setItem('generatedRecipes', JSON.stringify(this.recipes))
        localStorage.removeItem('currentIngredients')
        this.currentIngredients = []

        // Add to recent activity
        const recentActivity = JSON.parse(localStorage.getItem('recentActivity') || '[]')
        recentActivity.unshift({
          id: newRecipe.id,
          title: `Generated: ${newRecipe.title}`,
          timestamp: new Date().toLocaleDateString()
        })
        localStorage.setItem('recentActivity', JSON.stringify(recentActivity.slice(0, 10)))

      } catch (error) {
        console.error('Recipe generation error:', error)
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

    saveRecipe(recipe) {
      if (!this.savedRecipes.includes(recipe.id)) {
        this.savedRecipes.push(recipe.id)
        localStorage.setItem('savedRecipes', JSON.stringify(this.savedRecipes))
      }
    },

    toggleSaved(recipeId) {
      const index = this.savedRecipes.indexOf(recipeId)
      if (index > -1) {
        this.savedRecipes.splice(index, 1)
      } else {
        this.savedRecipes.push(recipeId)
      }
      localStorage.setItem('savedRecipes', JSON.stringify(this.savedRecipes))
    }
  }
}
</script>
