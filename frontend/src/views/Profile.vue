<template>
  <AuthenticatedLayout>
    <div class="px-4 py-6">
      <!-- Profile Header -->
      <div class="text-center mb-8">
        <div class="relative inline-block">
          <!-- Profile Picture or Avatar -->
          <div class="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden cursor-pointer group transition-all duration-300 hover:ring-4 hover:ring-primary-200" @click="triggerProfilePictureChange">
            <!-- User's profile picture if available -->
            <img 
              v-if="currentUser?.avatar" 
              :src="currentUser.avatar" 
              :alt="currentUser?.name || 'Profile'"
              class="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
            />
            <!-- Name initial if no avatar but has name -->
            <div v-else-if="userInitial" class="text-2xl font-bold text-white transition-all duration-300 group-hover:scale-110">
              {{ userInitial }}
            </div>
            <!-- Default avatar icon if no name -->
            <svg v-else class="w-10 h-10 text-white transition-all duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            
            <!-- Camera overlay on hover -->
            <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
          </div>
          
          <!-- Change Photo Button -->
          <button 
            @click="triggerProfilePictureChange"
            class="absolute bottom-0 right-0 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary-700 transition-all duration-200 hover:scale-110 border-2 border-white"
            style="width: 32px; height: 32px; min-width: 32px; min-height: 32px;"
            title="Change profile picture"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </button>
        </div>
        
        <h1 class="text-2xl font-bold text-gray-900">{{ authStore.currentUser?.name || 'User' }}</h1>
        <p class="text-gray-600">{{ authStore.currentUser?.email }}</p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div class="text-center">
          <div v-if="loading" class="animate-pulse">
            <div class="h-8 bg-gray-200 rounded mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-12 mx-auto"></div>
          </div>
          <template v-else>
            <div class="text-2xl font-bold text-primary-600">{{ totalRecipes }}</div>
            <div class="text-sm text-gray-500">Recipes</div>
          </template>
        </div>
        <div class="text-center">
          <div v-if="loading" class="animate-pulse">
            <div class="h-8 bg-gray-200 rounded mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-12 mx-auto"></div>
          </div>
          <template v-else>
            <div class="text-2xl font-bold text-green-600">{{ savedRecipes }}</div>
            <div class="text-sm text-gray-500">Saved</div>
          </template>
        </div>
        <div class="text-center">
          <div v-if="loading" class="animate-pulse">
            <div class="h-8 bg-gray-200 rounded mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-12 mx-auto"></div>
          </div>
          <template v-else>
            <div class="text-2xl font-bold text-blue-600">{{ scansCount }}</div>
            <div class="text-sm text-gray-500">Scans</div>
          </template>
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

        <!-- Change Password -->
        <button 
          @click="showChangePassword = true"
          class="w-full bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex items-center space-x-3 hover:shadow-md transition-shadow"
        >
          <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m0 0v2m0-2h2m-2 0h-2m8-6a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <div class="flex-1 text-left">
            <h3 class="font-medium text-gray-900">Change Password</h3>
            <p class="text-sm text-gray-500">Update your account password</p>
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

    <!-- Profile Picture Change Modal -->
    <div v-if="showProfilePictureModal" class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50" @click="showProfilePictureModal = false">
      <div class="min-h-screen px-4 text-center">
        <div class="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-lg" @click.stop>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Change Profile Picture</h3>
            <button @click="showProfilePictureModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Photo Preview -->
          <div class="mb-6">
            <div class="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary-200 bg-primary-600 flex items-center justify-center">
              <!-- Preview of selected image -->
              <img 
                v-if="profilePicturePreview"
                :src="profilePicturePreview" 
                alt="Profile preview"
                class="w-full h-full object-cover"
              />
              <!-- Current user avatar -->
              <img 
                v-else-if="currentUser?.avatar"
                :src="currentUser.avatar" 
                alt="Current profile"
                class="w-full h-full object-cover opacity-50"
              />
              <!-- User initial if no preview and no avatar -->
              <div v-else-if="userInitial" class="text-4xl font-bold text-white opacity-50">
                {{ userInitial }}
              </div>
              <!-- Default icon if no preview, no avatar, and no name -->
              <svg v-else class="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
          </div>

          <!-- Upload Options -->
          <div class="space-y-3">
            <BaseButton 
              variant="primary" 
              full-width
              @click="openGallery"
              :disabled="uploadingProfilePicture"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Choose from Gallery
            </BaseButton>
            
            <BaseButton 
              variant="outline" 
              full-width
              @click="openCamera"
              :disabled="uploadingProfilePicture"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Take Photo
            </BaseButton>

            <BaseButton 
              v-if="currentUser?.avatar || profilePicturePreview"
              variant="secondary" 
              full-width
              @click="removeProfilePicture"
              :disabled="uploadingProfilePicture"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Remove Photo
            </BaseButton>
          </div>

          <!-- Action Buttons -->
          <div v-if="profilePicturePreview" class="mt-6 flex space-x-3">
            <BaseButton 
              variant="secondary" 
              @click="cancelProfilePictureChange"
              class="flex-1"
              :disabled="uploadingProfilePicture"
            >
              Cancel
            </BaseButton>
            <BaseButton 
              variant="primary" 
              @click="saveProfilePicture"
              class="flex-1"
              :loading="uploadingProfilePicture"
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

    <!-- Change Password Modal -->
    <div v-if="showChangePassword" class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50" @click="showChangePassword = false">
      <div class="min-h-screen px-4 text-center">
        <div class="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-lg" @click.stop>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('auth.changePassword') }}</h3>
            <button @click="cancelPasswordChange" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="changePassword" class="space-y-4">
            <!-- Current Password -->
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('auth.currentPassword') }}
              </label>
              <input
                id="currentPassword"
                v-model="passwordForm.currentPassword"
                type="password"
                :class="[
                  'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                  passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
                ]"
                :placeholder="$t('auth.currentPassword')"
              />
              <p v-if="passwordErrors.currentPassword" class="mt-1 text-sm text-red-600">
                {{ passwordErrors.currentPassword }}
              </p>
            </div>

            <!-- New Password -->
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('auth.newPassword') }}
              </label>
              <input
                id="newPassword"
                v-model="passwordForm.newPassword"
                type="password"
                :class="[
                  'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                  passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                ]"
                :placeholder="$t('auth.newPassword')"
              />
              <p v-if="passwordErrors.newPassword" class="mt-1 text-sm text-red-600">
                {{ passwordErrors.newPassword }}
              </p>
            </div>

            <!-- Confirm New Password -->
            <div>
              <label for="confirmNewPassword" class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('auth.confirmNewPassword') }}
              </label>
              <input
                id="confirmNewPassword"
                v-model="passwordForm.confirmNewPassword"
                type="password"
                :class="[
                  'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                  passwordErrors.confirmNewPassword ? 'border-red-500' : 'border-gray-300'
                ]"
                :placeholder="$t('auth.confirmNewPassword')"
              />
              <p v-if="passwordErrors.confirmNewPassword" class="mt-1 text-sm text-red-600">
                {{ passwordErrors.confirmNewPassword }}
              </p>
            </div>

            <div class="flex space-x-3 pt-4">
              <BaseButton 
                variant="secondary"
                @click="cancelPasswordChange"
                class="flex-1"
              >
                Cancel
              </BaseButton>
              <BaseButton 
                type="submit"
                variant="primary"
                class="flex-1"
                :loading="changingPassword"
              >
                Change Password
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Hidden file inputs for profile picture -->
    <input 
      ref="profilePictureInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleProfilePictureSelect"
    />
    
    <input 
      ref="profileCameraInput"
      type="file"
      accept="image/*"
      capture="user"
      class="hidden"
      @change="handleProfilePictureSelect"
    />
  </AuthenticatedLayout>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import BaseButton from '@/components/ui/Button.vue'
import { userService, userDataService } from '@/services/api'

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
      showProfilePictureModal: false,
      showChangePassword: false,
      profileForm: {
        name: '',
        email: ''
      },
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      },
      passwordErrors: {},
      changingPassword: false,
      stats: {
        totalRecipes: 0,
        totalScans: 0
      },
      savedRecipesCount: 0,
      loading: true,
      // Profile picture management
      profilePicturePreview: null,
      uploadingProfilePicture: false,
      languages: [
        { code: 'en', name: 'English' },
        { code: 'it', name: 'Italiano' },
        { code: 'fr', name: 'Français' },
        { code: 'de', name: 'Deutsch' }
      ]
    }
  },
  computed: {
    currentUser() {
      return this.authStore.currentUser
    },
    userInitial() {
      const name = this.currentUser?.name || this.authStore.currentUser?.name
      return name ? name.charAt(0).toUpperCase() : null
    },
    totalRecipes() {
      return this.stats.totalRecipes || 0
    },
    savedRecipes() {
      return this.savedRecipesCount || 0
    },
    scansCount() {
      return this.stats.totalScans || 0
    },
    currentLanguageName() {
      const current = this.languages.find(lang => lang.code === this.$i18n.locale)
      return current ? current.name : 'English'
    }
  },
  mounted() {
    this.initProfileForm()
    this.loadUserStats()
  },
  methods: {
    async loadUserStats() {
      try {
        this.loading = true
        
        // Load user statistics from backend
        const stats = await userService.getUserStats()
        this.stats = stats
        
        // Load saved recipes count
        const savedRecipeIds = await userDataService.getSavedRecipeIds()
        this.savedRecipesCount = savedRecipeIds.length
        
      } catch (error) {
        console.error('Failed to load user stats:', error)
        // Fallback to localStorage for backward compatibility
        this.loadStatsFromLocalStorage()
      } finally {
        this.loading = false
      }
    },
    
    loadStatsFromLocalStorage() {
      // Fallback method for backward compatibility
      const recipes = localStorage.getItem('generatedRecipes')
      const saved = localStorage.getItem('savedRecipes')
      
      this.stats.totalRecipes = recipes ? JSON.parse(recipes).length : 0
      this.savedRecipesCount = saved ? JSON.parse(saved).length : 0
      this.stats.totalScans = this.stats.totalRecipes * 2 // Estimate
    },

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
    },

    // Profile Picture Management Methods
    triggerProfilePictureChange() {
      this.showProfilePictureModal = true
      this.profilePicturePreview = null
    },

    openGallery() {
      if (this.$refs.profilePictureInput) {
        this.$refs.profilePictureInput.click()
      }
    },

    openCamera() {
      if (this.$refs.profileCameraInput) {
        this.$refs.profileCameraInput.click()
      }
    },

    handleProfilePictureSelect(event) {
      const file = event.target.files[0]
      if (!file) return

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.toast.error('Please select a valid image file')
        return
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        this.toast.error('Image size must be less than 5MB')
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        this.profilePicturePreview = e.target.result
      }
      reader.onerror = () => {
        this.toast.error('Error reading the image file')
      }
      reader.readAsDataURL(file)

      // Reset input
      event.target.value = ''
    },

    async saveProfilePicture() {
      if (!this.profilePicturePreview) return

      try {
        this.uploadingProfilePicture = true

        // In a real app, you would upload to your API
        // For now, we'll simulate an API call and save to localStorage
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Update the user's avatar in the auth store
        if (this.authStore.currentUser) {
          this.authStore.currentUser.avatar = this.profilePicturePreview
          
          // Save to localStorage for persistence in demo
          const userData = JSON.parse(localStorage.getItem('user') || '{}')
          userData.avatar = this.profilePicturePreview
          localStorage.setItem('user', JSON.stringify(userData))
        }

        this.toast.success('Profile picture updated successfully!')
        this.showProfilePictureModal = false
        this.profilePicturePreview = null

      } catch (error) {
        console.error('Error uploading profile picture:', error)
        this.toast.error('Failed to update profile picture')
      } finally {
        this.uploadingProfilePicture = false
      }
    },

    async removeProfilePicture() {
      try {
        this.uploadingProfilePicture = true

        // In a real app, you would call your API to remove the avatar
        await new Promise(resolve => setTimeout(resolve, 500))

        // Remove avatar from auth store
        if (this.authStore.currentUser) {
          this.authStore.currentUser.avatar = null
          
          // Update localStorage
          const userData = JSON.parse(localStorage.getItem('user') || '{}')
          delete userData.avatar
          localStorage.setItem('user', JSON.stringify(userData))
        }

        this.toast.success('Profile picture removed successfully!')
        this.showProfilePictureModal = false
        this.profilePicturePreview = null

      } catch (error) {
        console.error('Error removing profile picture:', error)
        this.toast.error('Failed to remove profile picture')
      } finally {
        this.uploadingProfilePicture = false
      }
    },

    cancelProfilePictureChange() {
      this.profilePicturePreview = null
      this.showProfilePictureModal = false
    },

    // Change Password Methods
    validatePasswordForm() {
      this.passwordErrors = {}

      if (!this.passwordForm.currentPassword) {
        this.passwordErrors.currentPassword = this.$t('auth.validation.currentPasswordRequired')
      }

      if (!this.passwordForm.newPassword) {
        this.passwordErrors.newPassword = this.$t('auth.validation.newPasswordRequired')
      } else if (this.passwordForm.newPassword.length < 6) {
        this.passwordErrors.newPassword = this.$t('auth.validation.newPasswordMinLength')
      }

      if (!this.passwordForm.confirmNewPassword) {
        this.passwordErrors.confirmNewPassword = this.$t('auth.validation.newPasswordRequired')
      } else if (this.passwordForm.newPassword !== this.passwordForm.confirmNewPassword) {
        this.passwordErrors.confirmNewPassword = this.$t('auth.validation.newPasswordsDoNotMatch')
      }

      return Object.keys(this.passwordErrors).length === 0
    },

    async changePassword() {
      if (!this.validatePasswordForm()) {
        return
      }

      try {
        this.changingPassword = true

        // In a real app, you would call your API to change the password
        // For now, we'll simulate an API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Simulate checking current password
        // In a real app, the backend would verify this
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
        if (storedUser.password && storedUser.password !== this.passwordForm.currentPassword) {
          this.passwordErrors.currentPassword = this.$t('auth.validation.wrongCurrentPassword')
          return
        }

        // Update password in localStorage for demo purposes
        if (storedUser) {
          storedUser.password = this.passwordForm.newPassword
          localStorage.setItem('user', JSON.stringify(storedUser))
        }

        this.toast.success(this.$t('auth.passwordChangeSuccess'))
        this.resetPasswordForm()
        this.showChangePassword = false

      } catch (error) {
        console.error('Error changing password:', error)
        this.toast.error('Failed to change password')
      } finally {
        this.changingPassword = false
      }
    },

    resetPasswordForm() {
      this.passwordForm = {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      }
      this.passwordErrors = {}
    },

    cancelPasswordChange() {
      this.resetPasswordForm()
      this.showChangePassword = false
    }
  }
}
</script>
