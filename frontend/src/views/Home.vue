<template>
  <AuthenticatedLayout>
    <div class="px-4 py-6 mx-auto max-w-3xl w-full">
      <!-- Welcome Section -->
      <div class="mb-10 bg-gradient-to-r from-primary-50 to-blue-50 p-6 rounded-xl border border-primary-100 shadow-sm">
        <h1 class="text-2xl font-bold text-gray-900 mb-2" v-html="welcomeMessage"></h1>
        <p class="text-gray-600">
          {{ $t('home.subtitle') }}
        </p>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-2 gap-6 mb-10">
        <button 
          @click="$router.push('/app/camera')"
          class="bg-white rounded-xl p-6 shadow-md border border-primary-100 hover:shadow-lg hover:border-primary-200 transition-all transform hover:-translate-y-1 duration-200"
        >
          <div class="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <h3 class="font-semibold text-gray-900 text-center text-lg">{{ $t('home.scanIngredients') }}</h3>
        </button>

        <button 
          @click="$router.push('/app/recipes')"
          class="bg-white rounded-xl p-6 shadow-md border border-green-100 hover:shadow-lg hover:border-green-200 transition-all transform hover:-translate-y-1 duration-200"
        >
          <div class="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <h3 class="font-semibold text-gray-900 text-center text-lg">{{ $t('home.viewRecipes') }}</h3>
        </button>
      </div>

      <!-- Recent Activity -->
      <div class="mb-10">
        <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span class="inline-block w-1 h-6 bg-primary-500 rounded mr-2"></span>
          {{ $t('home.recentActivity') }}
        </h2>
        <div v-if="recentItems.length > 0" class="space-y-4">
          <div 
            v-for="item in recentItems" 
            :key="item.id"
            class="bg-white rounded-xl p-4 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200"
          >
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center shadow-sm">
                <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900">{{ item.title }}</h3>
                <p class="text-sm text-gray-500">{{ item.timestamp }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <div class="w-20 h-20 bg-gradient-to-br from-gray-100 to-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <h3 class="text-xl font-medium text-gray-900 mb-2">{{ $t('home.noRecipesYet') }}</h3>
          <p class="text-gray-600 mb-6 max-w-sm mx-auto">{{ $t('home.noRecipesSubtitle') }}</p>
          <div class="flex justify-center">
            <BaseButton 
              variant="primary"
              @click="$router.push('/app/camera')"
              class="px-6 py-3 text-base"
            >
              {{ $t('home.getStarted') }}
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Tips Section -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm">
        <div class="flex items-start space-x-4">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-blue-900 mb-2 text-lg">{{ $t('home.proTip') }}</h3>
            <p class="text-blue-800">
              {{ $t('home.proTipContent') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import BaseButton from '@/components/ui/Button.vue'
import { userDataService } from '@/services/api'

export default {
  name: 'HomePage',
  components: {
    AuthenticatedLayout,
    BaseButton
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      recentItems: [],
      loading: false
    }
  },
  computed: {
    welcomeMessage() {
      const userName = this.authStore.currentUser?.name || this.$t('auth.name');
      const highlightedName = `<span class="text-primary-600">${userName}</span>`;
      return this.$t('home.welcome', { name: highlightedName });
    }
  },
  mounted() {
    this.loadRecentActivity()
  },
  methods: {
    async loadRecentActivity() {
      this.loading = true
      try {
        // Load recent activity from database
        this.recentItems = await userDataService.getRecentActivity()
      } catch (error) {
        console.error('Failed to load recent activity:', error)
        // Fallback to empty array
        this.recentItems = []
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
