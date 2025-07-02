<template>
  <AuthenticatedLayout>
    <div class="px-4 py-6">
      <!-- Profile Header -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">{{ authStore.currentUser?.name || 'User' }}</h1>
        <p class="text-gray-600">{{ authStore.currentUser?.email }}</p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div class="text-center">
          <div class="text-2xl font-bold text-primary-600">{{ totalRecipes }}</div>
          <div class="text-sm text-gray-500">Recipes</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ savedRecipes }}</div>
          <div class="text-sm text-gray-500">Saved</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ scansCount }}</div>
          <div class="text-sm text-gray-500">Scans</div>
        </div>
      </div>

      <!-- Menu Items -->
      <div class="space-y-2">
        <!-- Account Settings -->
        <button 
          @click="showAccountSettings = true"
          class="w-full bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex items-center space-x-3 hover:shadow-md transition-shadow"
        >
          <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <div class="flex-1 text-left">
            <h3 class="font-medium text-gray-900">Account Settings</h3>
            <p class="text-sm text-gray-500">Manage your profile and preferences</p>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>

        <!-- Language Settings -->
        <button 
          @click="showLanguageSettings = true"
          class="w-full bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex items-center space-x-3 hover:shadow-md transition-shadow"
        >
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
            </svg>
          </div>
          <div class="flex-1 text-left">
            <h3 class="font-medium text-gray-900">Language</h3>
            <p class="text-sm text-gray-500">{{ currentLanguageName }}</p>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>

        <!-- Export Data -->
        <button 
          @click="exportData"
          class="w-full bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex items-center space-x-3 hover:shadow-md transition-shadow"
        >
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div class="flex-1 text-left">
            <h3 class="font-medium text-gray-900">Export Data</h3>
            <p class="text-sm text-gray-500">Download your recipes and data</p>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>

        <!-- Support -->
        <button 
          @click="openSupport"
          class="w-full bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex items-center space-x-3 hover:shadow-md transition-shadow"
        >
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="flex-1 text-left">
            <h3 class="font-medium text-gray-900">Help & Support</h3>
            <p class="text-sm text-gray-500">Get help and report issues</p>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>

        <!-- Donate -->
        <button 
          @click="openDonation"
          class="w-full bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex items-center space-x-3 hover:shadow-md transition-shadow"
        >
          <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </div>
          <div class="flex-1 text-left">
            <h3 class="font-medium text-gray-900">Support the App</h3>
            <p class="text-sm text-gray-500">Help us keep improving FridgeWiseAI</p>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>

      <!-- Logout Button -->
      <div class="mt-8 pt-6 border-t border-gray-200">
        <BaseButton 
          variant="secondary" 
          full-width
          @click="handleLogout"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Logout
        </BaseButton>
      </div>

      <!-- App Version -->
      <div class="mt-6 text-center">
        <p class="text-xs text-gray-400">FridgeWiseAI v1.0.0</p>
      </div>
    </div>

    <!-- Account Settings Modal -->
    <div v-if="showAccountSettings" class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50" @click="showAccountSettings = false">
      <div class="min-h-screen px-4 text-center">
        <div class="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-lg" @click.stop>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Account Settings</h3>
            <button @click="showAccountSettings = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                v-model="profileForm.name"
                type="text"
                class="input"
                placeholder="Your name"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                v-model="profileForm.email"
                type="email"
                class="input"
                placeholder="Your email"
              />
            </div>
          </div>

          <div class="mt-6 flex space-x-3">
            <BaseButton 
              variant="secondary" 
              @click="showAccountSettings = false"
              class="flex-1"
            >
              Cancel
            </BaseButton>
            <BaseButton 
              variant="primary" 
              @click="updateProfile"
              class="flex-1"
            >
              Save
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Language Settings Modal -->
    <div v-if="showLanguageSettings" class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50" @click="showLanguageSettings = false">
      <div class="min-h-screen px-4 text-center">
        <div class="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-lg" @click.stop>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Language Settings</h3>
            <button @click="showLanguageSettings = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="space-y-2">
            <button 
              v-for="language in languages" 
              :key="language.code"
              @click="changeLanguage(language.code)"
              :class="[
                'w-full p-3 text-left rounded-lg border transition-colors',
                $i18n.locale === language.code
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:bg-gray-50'
              ]"
            >
              {{ language.name }}
            </button>
          </div>

          <div class="mt-6">
            <BaseButton 
              variant="primary" 
              @click="showLanguageSettings = false"
              full-width
            >
              Done
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import BaseButton from '@/components/ui/Button.vue'

export default {
  name: 'ProfilePage',
  components: {
    AuthenticatedLayout,
    BaseButton
  },
  setup() {
    const authStore = useAuthStore()
    const toast = useToast()
    return { authStore, toast }
  },
  data() {
    return {
      showAccountSettings: false,
      showLanguageSettings: false,
      profileForm: {
        name: '',
        email: ''
      },
      languages: [
        { code: 'en', name: 'English' },
        { code: 'it', name: 'Italiano' },
        { code: 'fr', name: 'Français' },
        { code: 'de', name: 'Deutsch' }
      ]
    }
  },
  computed: {
    totalRecipes() {
      const recipes = localStorage.getItem('generatedRecipes')
      return recipes ? JSON.parse(recipes).length : 0
    },
    savedRecipes() {
      const saved = localStorage.getItem('savedRecipes')
      return saved ? JSON.parse(saved).length : 0
    },
    scansCount() {
      // Mock scan count - in real app this would come from user stats
      return this.totalRecipes * 2 // Approximate scans vs recipes ratio
    },
    currentLanguageName() {
      const current = this.languages.find(lang => lang.code === this.$i18n.locale)
      return current ? current.name : 'English'
    }
  },
  mounted() {
    this.initProfileForm()
  },
  methods: {
    initProfileForm() {
      if (this.authStore.currentUser) {
        this.profileForm.name = this.authStore.currentUser.name || ''
        this.profileForm.email = this.authStore.currentUser.email || ''
      }
    },

    updateProfile() {
      // In a real app, this would make an API call
      console.log('Updating profile:', this.profileForm)
      this.showAccountSettings = false
      this.toast.success(this.$t('notifications.profile.updateSuccess'))
      
      // Update local user data
      if (this.authStore.user) {
        this.authStore.user.name = this.profileForm.name
        this.authStore.user.email = this.profileForm.email
      }
    },

    changeLanguage(languageCode) {
      this.$i18n.locale = languageCode
      localStorage.setItem('selectedLanguage', languageCode)
    },

    exportData() {
      try {
        const data = {
          recipes: JSON.parse(localStorage.getItem('generatedRecipes') || '[]'),
          savedRecipes: JSON.parse(localStorage.getItem('savedRecipes') || '[]'),
          recentActivity: JSON.parse(localStorage.getItem('recentActivity') || '[]'),
          exportDate: new Date().toISOString()
        }

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `fridgewiseai-data-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        this.toast.success(this.$t('notifications.profile.exportSuccess'))
      } catch (error) {
        console.error('Export error:', error)
        this.toast.error(this.$t('notifications.profile.exportError'))
      }
    },

    openSupport() {
      // In a real app, this might open a help center or contact form
      const supportEmail = 'support@fridgewiseai.com'
      const subject = 'FridgeWiseAI Support Request'
      const body = 'Hi FridgeWiseAI team,\n\nI need help with:\n\n'
      window.location.href = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    },

    openDonation() {
      // In a real app, this would open PayPal donation modal
      alert('Thank you for considering supporting FridgeWiseAI! PayPal integration coming soon.')
    },

    handleLogout() {
      if (confirm('Are you sure you want to logout?')) {
        this.authStore.logout()
        this.toast.info(this.$t('notifications.auth.logoutSuccess'))
        this.$router.push('/')
      }
    }
  }
}
</script>
