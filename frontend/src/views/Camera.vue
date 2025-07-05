<template>
  <AuthenticatedLayout :show-header="showHeader" :show-navigation="true">
    <div class="flex flex-col relative overflow-hidden bg-black z-30" :class="showHeader ? 'fixed top-16 left-0 right-0 bottom-0' : 'fixed inset-0'">
      <!-- Choice Screen -->
      <div v-if="showChoiceScreen" class="absolute inset-0 flex items-center justify-center bg-white z-50">
        <div class="text-center max-w-lg mx-auto px-6 py-8 w-full animate-fade-in-up">
          <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in animation-delay-200">
            <svg class="w-10 h-10 text-blue-600 animate-pulse-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          
          <h2 class="text-2xl font-bold text-gray-900 mb-4 animate-slide-in-left animation-delay-300">{{ $t('camera.choiceTitle') }}</h2>
          <p class="text-gray-600 mb-8 animate-slide-in-left animation-delay-400">{{ $t('camera.choiceSubtitle') }}</p>
          
          <div class="space-y-4">
            <button 
              @click="showManualSelection"
              class="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 hover:scale-105 hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3 animate-bounce-in animation-delay-500 group"
            >
              <svg class="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
              </svg>
              <span>{{ $t('camera.manualSelection') }}</span>
            </button>
            
            <button 
              @click="startCameraMode"
              class="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-green-700 hover:scale-105 hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3 animate-bounce-in animation-delay-600 group"
            >
              <svg class="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2-2V9z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>{{ $t('camera.useCamera') }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Manual Selection Screen -->
      <div v-if="showManualSelectionScreen" class="absolute inset-0 flex flex-col bg-white z-50">
        <div class="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3">
          <div class="max-w-3xl mx-auto">
            <div class="flex items-center justify-between">
              <button 
                @click="backToChoice"
                class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center transition-all active:scale-95"
              >
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <h2 class="text-lg font-semibold text-gray-900">{{ $t('camera.selectIngredients') }}</h2>
              <button 
                @click="generateRecipeFromManual"
                :disabled="selectedIngredients.length === 0"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                {{ $t('camera.generateRecipesButton') }}
              </button>
            </div>
            
            <!-- Search Bar -->
            <div class="mt-4 relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="$t('camera.searchIngredients')"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
        
        <!-- Selected Ingredients -->
        <div v-if="selectedIngredients.length > 0" class="flex-shrink-0 bg-blue-50 border-b border-blue-200 px-4 py-3">
          <div class="max-w-3xl mx-auto">
            <h3 class="text-sm font-medium text-blue-900 mb-2">{{ $t('camera.selectedIngredients') }} ({{ selectedIngredients.length }})</h3>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="ingredient in selectedIngredients" 
                :key="ingredient"
                class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {{ ingredient }}
                <button 
                  @click="removeIngredient(ingredient)"
                  class="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </span>
            </div>
          </div>
        </div>
        
        <!-- Main Content Area -->
        <div class="flex-1 overflow-y-auto pb-20">
          <div class="p-4 max-w-3xl mx-auto">
            <!-- Search Results or Popular Ingredients -->
            <div v-if="searchQuery.length >= 2 || searchResults.length > 0" class="space-y-3">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-medium text-gray-700">
                  {{ searchQuery.length >= 2 ? $t('camera.searchResults') : $t('camera.categoryResults') }}
                </h3>
                <div class="flex items-center space-x-2">
                  <div v-if="isSearching" class="flex items-center text-blue-600">
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    <span class="text-xs">{{ $t('camera.searching') }}</span>
                  </div>
                  <button 
                    v-if="searchResults.length > 0 && searchQuery.length === 0"
                    @click="clearCategoryResults"
                    class="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded border border-gray-300 hover:border-gray-400 transition-colors"
                  >
                    {{ $t('camera.clearButton') }}
                  </button>
                </div>
              </div>
              <div v-if="filteredIngredients.length > 0 && !isSearching" class="grid grid-cols-2 gap-3">
                <div 
                  v-for="ingredient in filteredIngredients.slice(0, 20)" 
                  :key="ingredient"
                  @click="toggleIngredient(ingredient)"
                  class="relative bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 cursor-pointer transition-all duration-200 transform hover:scale-105"
                  :class="{ 'border-blue-500 bg-blue-50': selectedIngredients.includes(ingredient) }"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <div class="text-lg mb-1">{{ getIngredientEmoji(ingredient) }}</div>
                      <div class="text-sm font-medium text-gray-900 leading-tight">{{ ingredient }}</div>
                    </div>
                    <div class="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center ml-2"
                         :class="{ 'bg-blue-600 border-blue-600': selectedIngredients.includes(ingredient) }">
                      <svg v-if="selectedIngredients.includes(ingredient)" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else-if="!isSearching" class="text-center py-12">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('camera.noResults') }}</h3>
                <p class="text-gray-500">{{ $t('camera.tryAnotherSearch') }}</p>
              </div>
            </div>
            
            <!-- Popular Ingredients (shown when not searching) -->
            <div v-else class="space-y-6">
              <!-- Search Prompt -->
              <div class="text-center py-8">
                <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ $t('camera.searchPromptTitle') }}</h3>
                <p class="text-gray-600 mb-4">{{ $t('camera.searchPromptSubtitle') }}</p>
              </div>
              
              <!-- Popular Categories -->
              <div class="animate-fade-in-up animation-delay-200">
                <h3 class="text-sm font-medium text-gray-700 mb-3 animate-slide-in-left animation-delay-300">{{ $t('camera.popularCategories') }}</h3>
                <div class="grid grid-cols-2 gap-3">
                  <div 
                    v-for="(category, index) in popularCategories" 
                    :key="category.name"
                    @click="searchByCategory(category.name)"
                    class="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 hover:from-blue-50 hover:to-blue-100 hover:border-blue-300 hover:shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 animate-bounce-in group"
                    :class="`animation-delay-${400 + index * 100}`"
                  >
                    <div class="text-center">
                      <div class="text-2xl mb-2 group-hover:scale-125 transition-transform duration-300">{{ category.emoji }}</div>
                      <div class="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{{ category.name }}</div>
                      <div class="text-xs text-gray-500 mt-1 group-hover:text-blue-500 transition-colors duration-300">{{ category.count }} {{ $t('camera.ingredients') }}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Quick Add (Most Used) -->
              <div class="animate-fade-in-up animation-delay-1000">
                <h3 class="text-sm font-medium text-gray-700 mb-3 animate-slide-in-left animation-delay-1100">{{ $t('camera.quickAdd') }}</h3>
                <div class="flex flex-wrap gap-2">
                  <button 
                    v-for="(ingredient, index) in quickAddIngredients" 
                    :key="ingredient"
                    @click="toggleIngredient(ingredient)"
                    class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 hover:scale-105 hover:shadow-md transition-all duration-300 animate-slide-in-right group"
                    :class="[
                      { 'bg-blue-100 border-blue-300 text-blue-800': selectedIngredients.includes(ingredient) },
                      `animation-delay-${1200 + index * 100}`
                    ]"
                  >
                    <span class="mr-2 group-hover:scale-110 transition-transform duration-300">{{ getIngredientEmoji(ingredient) }}</span>
                    {{ ingredient }}
                    <svg v-if="selectedIngredients.includes(ingredient)" class="w-4 h-4 ml-2 text-blue-600 animate-bounce-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isRequestingPermission" class="absolute inset-0 flex items-center justify-center bg-white z-50">
        <button 
          @click="goBack"
          class="absolute top-4 left-4 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center transition-all active:scale-95"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ t('camera.initializingCamera') }}</h3>
          <p class="text-gray-600">{{ t('camera.pleaseWait') }}</p>
        </div>
      </div>

      <!-- Permission Denied -->
      <div v-if="permissionDenied" class="absolute inset-0 flex items-center justify-center bg-white z-50 overflow-y-auto pb-20">
        <button 
          @click="goBack"
          class="absolute top-4 left-4 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center transition-all active:scale-95 z-10"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        
        <div class="text-center max-w-lg mx-auto px-6 py-8 w-full">
          <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18"></path>
            </svg>
          </div>
          
          <h3 class="text-lg font-semibold text-gray-900 mb-3">{{ t('camera.cameraAccessLimited') }}</h3>
          <p class="text-gray-600 mb-6">{{ cameraError }}</p>
          
          <!-- iOS Fallback Notice -->
          <div v-if="deviceInfo.isIOS" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div class="flex items-center mb-2">
              <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="font-semibold text-green-800">{{ t('camera.alternativeSolutionAvailable') }}</span>
            </div>
            <p class="text-green-700 text-sm">
              {{ t('camera.alternativeSolutionDescription') }}
            </p>
          </div>
          
          <!-- iOS specific instructions -->
          <div v-if="deviceInfo.isIOS" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <h4 class="font-semibold text-blue-900 mb-3 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
              </svg>
              {{ t('camera.iOSInstructionsTitle') }}
            </h4>
            <div class="space-y-3 text-sm text-blue-800">
              <div class="flex items-start">
                <span class="font-semibold mr-2">1.</span>
                <span>{{ t('camera.iOSInstructions1') }}</span>
              </div>
              <div class="flex items-start">
                <span class="font-semibold mr-2">2.</span>
                <span>{{ t('camera.iOSInstructions2') }}</span>
              </div>
              <div class="flex items-start">
                <span class="font-semibold mr-2">3.</span>
                <span>{{ t('camera.iOSInstructions3') }}</span>
              </div>
              <div class="flex items-start">
                <span class="font-semibold mr-2">4.</span>
                <span>{{ t('camera.iOSInstructions4') }}</span>
              </div>
              <div class="flex items-start">
                <span class="font-semibold mr-2">5.</span>
                <span>{{ t('camera.iOSInstructions5') }}</span>
              </div>
              <div class="flex items-start">
                <span class="font-semibold mr-2">6.</span>
                <span>{{ t('camera.iOSInstructions6') }}</span>
              </div>
            </div>
          </div>
          
          <div class="space-y-3 mx-auto w-full max-w-md">
            <!-- iOS Camera Capture Button -->
            <BaseButton v-if="deviceInfo.isIOS" variant="primary" full-width @click="openCameraCapture">
              {{ t('camera.takePhotoWithiPhone') }}
            </BaseButton>
            <!-- iOS Force Camera Button -->
            <BaseButton v-if="deviceInfo.isIOS && deviceInfo.hasMediaDevices" variant="primary" full-width @click="forceIOSCameraRequest">
              {{ t('camera.forceIOSCameraAccess') }}
            </BaseButton>
            <BaseButton variant="primary" full-width @click="requestPermission">
              {{ deviceInfo.isIOS ? t('camera.tryAfterChangingSettings') : t('camera.tryAgain') }}
            </BaseButton>
            <BaseButton variant="secondary" full-width @click="testCameraPermissions" v-if="deviceInfo.isIOS">
              {{ t('camera.testCameraPermissions') }}
            </BaseButton>
            <BaseButton variant="secondary" full-width @click="openGallery">
              {{ t('camera.uploadFromGallery') }}
            </BaseButton>
            <BaseButton v-if="deviceInfo.isIOS" variant="secondary" full-width @click="openIOSSettings">
              {{ t('camera.openIPhoneSettings') }}
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Camera View -->
      <div v-if="!capturedImage && !permissionDenied" class="absolute inset-0">
        <video 
          ref="videoElement"
          autoplay
          playsinline
          muted
          class="absolute inset-0 w-full h-full object-cover"
          style="background: #000;"
          :style="{ visibility: isStreamActive ? 'visible' : 'hidden' }"
        ></video>
        
        <!-- Show loading overlay if stream not active yet -->
        <div v-if="!isStreamActive || isRequestingPermission" class="absolute inset-0 flex items-center justify-center bg-black">
          <div class="text-center px-6">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <h3 class="text-lg font-semibold text-white mb-2">{{ isRequestingPermission ? t('camera.initializingCamera') : t('camera.startingCamera') }}</h3>
            <p class="text-gray-300 mb-6">{{ isRequestingPermission ? t('camera.pleaseWait') : t('camera.connecting') }}</p>
            
            <!-- iOS fallback option during loading -->
            <div v-if="deviceInfo.isIOS && !isRequestingPermission" class="space-y-3 mx-auto w-full max-w-md">
              <p class="text-sm text-gray-400 mb-3">{{ t('camera.cameraProblems') }}</p>
              <BaseButton variant="primary" @click="openCameraCapture" class="bg-white/20 border-white/30 text-white hover:bg-white/30">
                {{ t('camera.takePhotoWithiPhone') }}
              </BaseButton>
              <BaseButton variant="secondary" @click="openGallery" class="bg-transparent border-white/30 text-white hover:bg-white/10">
                {{ t('camera.uploadFromGallery') }}
              </BaseButton>
            </div>
          </div>
        </div>
        
        <!-- Camera Controls Overlay - only show when stream is active -->
        <div v-if="isStreamActive" class="absolute inset-0 pointer-events-none z-40">
          <!-- Top bar -->
          <div class="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-4 pointer-events-auto">
            <div class="flex items-center justify-between">
              <button @click="goBack" class="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              
              <!-- Debug info (only show in development) -->
              <div v-if="isDevelopment" class="text-xs text-white/70 bg-black/40 rounded px-2 py-1">
                {{ useIOSWorkaround ? 'iOS Enhanced' : 'Standard' }}
              </div>
              
              <!-- Camera switch button with indicator -->
              <div class="relative">
                <button @click="switchCamera" class="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center transition-all active:scale-95">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m0 0l-2-2m0 0l7-7 7 7m-10 5h10a1 1 0 001-1V10"></path>
                  </svg>
                </button>
                <!-- Camera mode indicator -->
                <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <span class="text-xs text-white font-bold">{{ currentFacingMode === 'environment' ? 'P' : 'F' }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Center guide -->
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="w-64 h-64 border-2 border-white/40 border-dashed rounded-2xl"></div>
          </div>
          
          <!-- Bottom controls -->
          <div class="absolute left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 pb-8 pointer-events-auto" :class="{ 'bottom-0': true, 'md:bottom-16 lg:bottom-20': true }">
            <div class="flex items-center justify-center space-x-8 mx-auto max-w-sm">
              <button @click="openGallery" class="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center transition-all active:scale-95 touch-manipulation">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </button>
              
              <button @click="capturePhoto" class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 touch-manipulation">
                <div class="w-12 h-12 bg-white border-4 border-gray-300 rounded-full"></div>
              </button>
              
              <!-- Camera switch button -->
              <div class="relative">
                <button @click="switchCamera" class="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center transition-all active:scale-95 touch-manipulation">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                </button>
                <!-- Camera mode indicator -->
                <div class="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <span class="text-xs text-white font-bold">{{ currentFacingMode === 'environment' ? 'P' : 'F' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Image Preview -->
      <div v-if="capturedImage" class="flex-1 flex flex-col overflow-hidden">
        <div class="flex-1 relative bg-black min-h-0">
          <!-- Top overlay with back button -->
          <div class="absolute top-4 left-4 z-10">
            <button 
              @click="goBack"
              class="w-10 h-10 bg-black/50 backdrop-blur rounded-full flex items-center justify-center transition-all active:scale-95"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
          </div>
          
          <img 
            :src="capturedImage" 
            alt="Captured ingredients"
            class="w-full h-full object-contain"
          />
          
          <!-- Processing overlay -->
          <div v-if="processing" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="text-white text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <h3 class="text-lg font-semibold mb-2">{{ t('camera.scanningInProgress') }}</h3>
              <p class="text-sm opacity-80">{{ t('camera.analyzingIngredients') }}</p>
            </div>
          </div>
        </div>

        <!-- Preview Controls - scrollable section -->
        <div class="bg-white flex-shrink-0 max-h-80 overflow-y-auto pb-20">
          <div class="p-4 space-y-4 mx-auto max-w-3xl w-full">
            <div v-if="detectedIngredients.length > 0" class="mb-4">
              <h3 class="font-semibold text-gray-900 mb-2">{{ t('camera.detectedIngredientsLabel') }}</h3>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="ingredient in detectedIngredients" 
                  :key="ingredient"
                  class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {{ ingredient }}
                </span>
              </div>
            </div>

            <!-- Main action buttons - responsive layout -->
            <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <BaseButton 
                variant="secondary" 
                full-width
                @click="addMorePhotos"
                :disabled="processing"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                {{ t('camera.addMorePhotos') }}
              </BaseButton>
              <BaseButton 
                variant="secondary" 
                full-width
                @click="clearAndRetake"
                :disabled="processing"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                {{ t('camera.restart') }}
              </BaseButton>
              <BaseButton 
                variant="primary" 
                full-width
                @click="generateRecipe"
                :loading="processing"
                :disabled="detectedIngredients.length === 0"
              >
                {{ t('camera.generateRecipes') }}
              </BaseButton>
            </div>
            
            <!-- iOS Additional Options -->
            <div v-if="deviceInfo.isIOS && !deviceInfo.hasMediaDevices" class="flex space-x-3 mt-3">
              <BaseButton 
                variant="secondary" 
                full-width
                @click="openCameraCapture"
                :disabled="processing"
              >
                {{ t('camera.iPhoneCameraButton') }}
              </BaseButton>
              <BaseButton 
                variant="secondary" 
                full-width
                @click="openGallery"
                :disabled="processing"
              >
                {{ t('camera.galleryButton') }}
              </BaseButton>
            </div>
            
            <!-- Add some padding at bottom for mobile navigation -->
            <div class="h-20 md:h-4"></div>
          </div>
        </div>
      </div>

      <!-- Hidden file input for gallery -->
      <input 
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileSelect"
      />

      <!-- Hidden file input for iOS camera capture -->
      <input 
        ref="cameraInput"
        type="file"
        accept="image/*"
        capture="environment"
        class="hidden"
        @change="handleCameraCapture"
      />

      <!-- Hidden canvas for image capture -->
      <canvas ref="canvasElement" class="hidden"></canvas>
    </div>
  </AuthenticatedLayout>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import BaseButton from '@/components/ui/Button.vue'
import { ingredientService, userDataService } from '@/services/api'
import { DonationHelper } from '@/utils/donationHelper'
import ingredientsDatabase from '@/services/ingredientsDatabase'

const router = useRouter()
const toast = useToast()
const { t, locale } = useI18n()

// Template refs
const videoElement = ref(null)
const canvasElement = ref(null)
const fileInput = ref(null)
const cameraInput = ref(null)

// Core state - simplified for reliability
const mediaStream = ref(null)
const isStreamActive = ref(false)
const capturedImage = ref(null)
const processing = ref(false)
const cameraError = ref(null)
const currentFacingMode = ref('environment')
const detectedIngredients = ref([])

// Manual selection state
const showChoiceScreen = ref(true)
const showManualSelectionScreen = ref(false)
const selectedIngredients = ref([])
const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const searchDebounceTimeout = ref(null)

const popularCategories = computed(() => {
  const baseCategories = [
    { key: 'vegetables', emoji: '🥬', count: 15 },
    { key: 'fruit', emoji: '🍎', count: 12 },
    { key: 'meat', emoji: '🥩', count: 8 },
    { key: 'cheese', emoji: '🧀', count: 6 },
    { key: 'spices', emoji: '🌿', count: 10 },
    { key: 'grains', emoji: '🌾', count: 7 }
  ]
  
  // Mappa le chiavi alle traduzioni localizzate
  const categoryMapping = {
    'it': {
      'vegetables': 'Verdure',
      'fruit': 'Frutta', 
      'meat': 'Carne',
      'cheese': 'Formaggi',
      'spices': 'Spezie',
      'grains': 'Cereali'
    },
    'en': {
      'vegetables': 'Vegetables',
      'fruit': 'Fruit',
      'meat': 'Meat', 
      'cheese': 'Cheese',
      'spices': 'Spices',
      'grains': 'Grains'
    },
    'fr': {
      'vegetables': 'Légumes',
      'fruit': 'Fruits',
      'meat': 'Viande',
      'cheese': 'Fromage', 
      'spices': 'Épices',
      'grains': 'Céréales'
    },
    'de': {
      'vegetables': 'Gemüse',
      'fruit': 'Obst',
      'meat': 'Fleisch',
      'cheese': 'Käse',
      'spices': 'Gewürze', 
      'grains': 'Getreide'
    }
  }
  
  const currentLocale = locale.value
  const translations = categoryMapping[currentLocale] || categoryMapping['en']
  
  return baseCategories.map(category => ({
    name: translations[category.key] || category.key,
    emoji: category.emoji,
    count: category.count
  }))
})

const quickAddIngredients = computed(() => {
  // Ingredienti comuni per quick add
  const commonIngredientsLists = {
    it: ['Pomodori', 'Cipolla', 'Aglio', 'Basilico', 'Olio d\'oliva', 'Sale', 'Mozzarella'],
    en: ['Tomatoes', 'Onion', 'Garlic', 'Basil', 'Olive Oil', 'Salt', 'Mozzarella'],
    fr: ['Tomates', 'Oignon', 'Ail', 'Basilic', 'Huile d\'olive', 'Sel', 'Mozzarella'],
    de: ['Tomaten', 'Zwiebel', 'Knoblauch', 'Basilikum', 'Olivenöl', 'Salz', 'Mozzarella']
  }
  
  const currentLocale = locale.value
  return commonIngredientsLists[currentLocale] || commonIngredientsLists['en']
})

// Permission state
const hasPermission = ref(false)
const permissionDenied = ref(false)
const isRequestingPermission = ref(false)
const hasMultipleCameras = ref(false)

// iOS Safari specific handling
const retryCount = ref(0)
const maxRetries = ref(3)
const useIOSWorkaround = ref(false)

// Development mode check
const isDevelopment = ref(import.meta.env.DEV)

// Computed properties
const filteredIngredients = computed(() => {
  return searchResults.value.map(result => {
    // Usa il nome localizzato se disponibile, altrimenti usa il nome inglese
    return result.localizedName || result[`name${locale.value.toUpperCase()}`] || result.name
  })
})

const showHeader = computed(() => {
  // Show header on choice screen and manual selection screen
  // Hide header only when camera is active or captured image is shown
  return showChoiceScreen.value || showManualSelectionScreen.value
})

// Device info
const deviceInfo = ref({
  isIOS: false,
  isSafari: false,
  isMobile: false,
  hasMediaDevices: false
})

// Initialize device info with enhanced iOS detection
const initDeviceInfo = () => {
  const userAgent = navigator.userAgent
  
  // Enhanced iOS detection
  const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isSafariBrowser = /AppleWebKit/.test(userAgent) && !/Chrome/.test(userAgent) && /Safari/.test(userAgent)
  
  deviceInfo.value = {
    isIOS: isIOSDevice,
    isSafari: isSafariBrowser,
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
    hasMediaDevices: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  }
  
  console.log('Device info:', deviceInfo.value)
  console.log('Protocol:', window.location.protocol)
  console.log('Host:', window.location.host)
  console.log('MediaDevices available:', !!navigator.mediaDevices)
  console.log('getUserMedia available:', !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia))
  console.log('Secure context:', window.isSecureContext)
  console.log('iOS + Safari detected:', isIOSDevice && isSafariBrowser)
  
  // Additional iOS-specific checks
  if (isIOSDevice) {
    console.log('iOS Version info:', {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      maxTouchPoints: navigator.maxTouchPoints,
      standalone: window.navigator.standalone,
      webkitAudioContext: typeof window.webkitAudioContext !== 'undefined'
    })
  }
}

// Check camera permissions status
const checkCameraPermissions = async () => {
  try {
    if (!navigator.permissions) {
      console.log('Permissions API not available')
      return 'prompt'
    }
    
    const result = await navigator.permissions.query({ name: 'camera' })
    console.log('Camera permission status:', result.state)
    return result.state // 'granted', 'denied', 'prompt'
  } catch (error) {
    console.warn('Could not check camera permissions:', error)
    return 'prompt'
  }
}

// Check available cameras
const checkAvailableCameras = async () => {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return
    }
    
    const devices = await navigator.mediaDevices.enumerateDevices()
    const videoDevices = devices.filter(device => device.kind === 'videoinput')
    hasMultipleCameras.value = videoDevices.length > 1
    
    console.log(`Found ${videoDevices.length} camera(s)`)
  } catch (error) {
    console.warn('Could not enumerate devices:', error)
  }
}

// Force permission request with explicit user interaction
const forcePermissionRequest = async () => {
  console.log('Forcing permission request with user interaction...')
  
  // Check current permission status first
  const permissionStatus = await checkCameraPermissions()
  console.log('Current permission status before request:', permissionStatus)
  
  if (permissionStatus === 'denied') {
    console.log('Camera permissions previously denied - user must enable manually')
    cameraError.value = 'I permessi della camera sono stati negati in precedenza. Segui le istruzioni qui sotto per riattivarli.'
    permissionDenied.value = true
    return false
  }
  
  // For iOS, we need to make sure we're in a user gesture context
  if (deviceInfo.value.isIOS) {
    console.log('iOS detected - ensuring user gesture context and trying immediate access')
    
    // Try to immediately request camera access within user gesture
    try {
      console.log('Attempting immediate iOS camera access...')
      const testStream = await navigator.mediaDevices.getUserMedia({ video: true })
      console.log('iOS immediate access successful!')
      
      // Stop the test stream and return success
      testStream.getTracks().forEach(track => track.stop())
      return true
    } catch (error) {
      console.warn('iOS immediate access failed:', error.name)
      
      // If it's a permission issue, let the user know
      if (error.name === 'NotAllowedError') {
        return false
      }
      
      // For other errors, continue with the normal flow
      return true
    }
  }
  
  return true
}

// iOS-specific aggressive camera request
const forceIOSCameraAccess = async () => {
  console.log('Forcing iOS camera access with aggressive tactics...')
  console.log('Requested facing mode:', currentFacingMode.value)
  
  if (!deviceInfo.value.isIOS) {
    return false
  }
  
  // Multiple strategies for iOS, respecting currentFacingMode
  const strategies = [
    // Strategy 1: Use current facing mode
    async () => {
      console.log(`iOS Strategy 1: Current facing mode (${currentFacingMode.value})`)
      return await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: currentFacingMode.value } 
      })
    },
    
    // Strategy 2: Use current facing mode with exact constraint
    async () => {
      console.log(`iOS Strategy 2: Exact facing mode (${currentFacingMode.value})`)
      return await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: { exact: currentFacingMode.value } } 
      })
    },
    
    // Strategy 3: Ultra-minimal request (fallback)
    async () => {
      console.log('iOS Strategy 3: Ultra-minimal request')
      return await navigator.mediaDevices.getUserMedia({ video: true })
    },
    
    // Strategy 4: Low resolution with facing mode
    async () => {
      console.log(`iOS Strategy 4: Low resolution with ${currentFacingMode.value}`)
      return await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: currentFacingMode.value,
          width: { exact: 320 }, 
          height: { exact: 240 } 
        } 
      })
    }
  ]
  
  for (let i = 0; i < strategies.length; i++) {
    try {
      console.log(`Trying iOS strategy ${i + 1}...`)
      const stream = await strategies[i]()
      console.log(`iOS strategy ${i + 1} successful!`)
      return stream
    } catch (error) {
      console.warn(`iOS strategy ${i + 1} failed:`, error.name)
      
      // Brief pause between strategies
      if (i < strategies.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    }
  }
  
  throw new Error('All iOS strategies failed')
}

// Enhanced iOS Safari camera initialization with aggressive tactics
const initIOSCamera = async () => {
  console.log('Initializing camera for iOS Safari with aggressive tactics...')
  console.log('Requested facing mode:', currentFacingMode.value)
  
  // Force permission request first
  const canRequest = await forcePermissionRequest()
  if (!canRequest) {
    throw new Error('Cannot request permissions - previously denied')
  }
  
  // Try extremely simplified constraints for iOS Safari
  const constraintSets = [
    // Ultra-minimal constraints for iOS compatibility
    {
      video: {
        facingMode: { exact: currentFacingMode.value }
      }
    },
    // Fallback without exact facingMode
    {
      video: {
        facingMode: currentFacingMode.value
      }
    },
    // iOS-specific low resolution
    {
      video: {
        width: { exact: 320 },
        height: { exact: 240 },
        facingMode: currentFacingMode.value
      }
    },
    // Minimal possible constraints
    {
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 }
      }
    },
    // Last resort - just video with no constraints
    {
      video: true
    }
  ]
  
  for (let i = 0; i < constraintSets.length; i++) {
    try {
      console.log(`iOS attempt ${i + 1}/5:`, constraintSets[i])
      
      // For iOS, we need to be more aggressive about timing
      const stream = await Promise.race([
        navigator.mediaDevices.getUserMedia(constraintSets[i]),
        new Promise((_, reject) => setTimeout(() => reject(new Error('iOS timeout')), 5000))
      ])
      
      console.log(`iOS Success with constraint set ${i + 1}`)
      return stream
    } catch (error) {
      console.warn(`iOS constraint set ${i + 1} failed:`, error.name, error.message)
      
      if (i === constraintSets.length - 1) {
        throw error
      }
      
      // Brief pause between attempts for iOS
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }
}

// Enhanced video element setup for iOS
const setupVideoElement = async (stream) => {
  console.log('Setting up video element for iOS compatibility...')
  
  let video = videoElement.value || document.querySelector('video')
  
  if (!video) {
    console.log('Video element not found, waiting for DOM...')
    await nextTick()
    
    // Enhanced retry logic with longer timeout for iOS
    let attempts = 0
    const maxAttempts = 30 // 30 attempts * 100ms = 3 seconds
    
    while (!video && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 100))
      video = videoElement.value || document.querySelector('video')
      attempts++
      console.log(`Attempt ${attempts}: Video element found:`, !!video)
    }
    
    if (!video) {
      throw new Error('Video element not available after extended waiting')
    }
  }
  
  console.log('Video element found, configuring for iOS...')
  
  // Essential iOS video attributes - set before srcObject
  video.setAttribute('webkit-playsinline', 'true')
  video.setAttribute('playsinline', 'true')
  video.muted = true
  video.autoplay = true
  video.playsInline = true
  
  // iOS specific styling to prevent issues
  video.style.objectFit = 'cover'
  video.style.width = '100%'
  video.style.height = '100%'
  
  console.log('iOS attributes set, assigning stream...')
  
  // Set stream
  video.srcObject = stream
  
  // Enhanced promise for iOS video loading
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      console.error('Video load timeout after 15 seconds')
      reject(new Error('Video load timeout'))
    }, 15000)
    
    const onLoadedMetadata = () => {
      console.log('Video metadata loaded successfully:', {
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        readyState: video.readyState
      })
      clearTimeout(timeout)
      cleanup()
      resolve(video)
    }
    
    const onError = (error) => {
      console.error('Video load error:', error)
      clearTimeout(timeout)
      cleanup()
      reject(new Error('Video load error'))
    }
    
    const onCanPlay = () => {
      console.log('Video can play - attempting play...')
      video.play().then(() => {
        console.log('Video play() successful')
      }).catch(err => {
        console.warn('Video play() failed but continuing:', err)
      })
    }
    
    const cleanup = () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.removeEventListener('error', onError)
      video.removeEventListener('canplay', onCanPlay)
    }
    
    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('error', onError)
    video.addEventListener('canplay', onCanPlay)
    
    // Force load
    video.load()
    
    // Also try immediate play for iOS
    setTimeout(() => {
      video.play().catch(err => {
        console.log('Initial play attempt failed (normal for some iOS versions):', err)
      })
    }, 100)
  })
}

// Request camera permission and initialize
const requestPermission = async () => {
  const startTime = Date.now()
  console.log('Starting camera permission request at:', new Date().toISOString())
  
  if (!deviceInfo.value.hasMediaDevices) {
    console.error('MediaDevices not available')
    if (!navigator.mediaDevices) {
        if (deviceInfo.value.isIOS) {
          cameraError.value = 'La camera diretta non è disponibile su Safari iOS, ma puoi usare il pulsante "Scatta Foto con Camera iPhone" per fare foto.'
        } else {
          cameraError.value = 'Le API della camera non sono disponibili su questo browser. Assicurati di essere su HTTPS.'
        }
      } else if (!navigator.mediaDevices.getUserMedia) {
        if (deviceInfo.value.isIOS) {
          cameraError.value = 'L\'accesso diretto alla camera non è supportato su Safari iOS, ma puoi usare il pulsante "Scatta Foto con Camera iPhone".'
        } else {
          cameraError.value = 'La funzione camera non è supportata su questo browser.'
        }
    } else {
      cameraError.value = 'Il tuo browser non supporta l\'accesso alla camera'
    }
    
    permissionDenied.value = true
    return
  }

  // Check if we're in a secure context
  if (!window.isSecureContext) {
    console.error('Not in secure context')
    cameraError.value = 'La camera richiede una connessione sicura (HTTPS). Attualmente sei su: ' + window.location.protocol
    permissionDenied.value = true
    return
  }

  // Check permission status before attempting request
  const permissionStatus = await checkCameraPermissions()
  console.log('Current permission status:', permissionStatus)
  
  if (permissionStatus === 'denied') {
    console.log('Camera permissions are denied - showing instructions')
    cameraError.value = 'I permessi della camera sono stati negati. Segui le istruzioni qui sotto per riattivarli.'
    permissionDenied.value = true
    return
  }

  isRequestingPermission.value = true
  permissionDenied.value = false
  cameraError.value = null
  console.log('Set isRequestingPermission to true')

  try {
    // For iOS Safari, use enhanced compatibility approach with aggressive tactics
    if (deviceInfo.value.isIOS && deviceInfo.value.isSafari) {
      console.log('iOS Safari detected - using AGGRESSIVE compatibility mode')
      
      // First try: Aggressive direct access
      try {
        console.log('Attempting aggressive iOS camera access...')
        mediaStream.value = await forceIOSCameraAccess()
        console.log('Aggressive iOS access successful!')
      } catch (aggressiveError) {
        console.warn('Aggressive access failed, trying enhanced iOS initialization:', aggressiveError)
        
        // Second try: Enhanced iOS initialization
        try {
          mediaStream.value = await initIOSCamera()
          console.log('Enhanced iOS camera initialization successful')
        } catch (iosError) {
          console.warn('Enhanced iOS initialization failed, trying basic fallback:', iosError)
          
          // Final fallback: Ultra-basic constraints
          const ultraBasicConstraints = { video: true }
          mediaStream.value = await navigator.mediaDevices.getUserMedia(ultraBasicConstraints)
          console.log('Ultra-basic iOS fallback successful')
        }
      }
      
      // Setup video element with iOS-specific handling
      await setupVideoElement(mediaStream.value)
      useIOSWorkaround.value = true
      
    } else {
      // Standard getUserMedia approach for all other cases
      console.log('📹 Using standard getUserMedia approach')
      
      // Basic constraints that work on all devices
      const constraints = {
        video: {
          facingMode: currentFacingMode.value,
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 }
        },
        audio: false
      }

      console.log('Requesting camera with constraints:', constraints)
      
      console.log('Step 1: Calling getUserMedia...')
      mediaStream.value = await navigator.mediaDevices.getUserMedia(constraints)
      console.log('Step 2: getUserMedia successful, stream obtained:', !!mediaStream.value)
      
      // Wait for video element to be available in DOM
      let video = videoElement.value || document.querySelector('video')
      
      if (!video) {
        console.log('Video element not found, waiting for DOM...')
        await nextTick()
        
        // Keep trying to find the video element for up to 2 seconds
        let attempts = 0
        const maxAttempts = 20 // 20 attempts * 100ms = 2 seconds
        
        while (!video && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 100))
          video = videoElement.value || document.querySelector('video')
          attempts++
          console.log(`Attempt ${attempts}: Video element found:`, !!video)
        }
        
        if (!video) {
          throw new Error('Video element not available after waiting')
        }
      }
      
      console.log('Step 3: Video element available, setting up...')
      
      // Set up video element properly
      video.srcObject = mediaStream.value
      video.muted = true
      video.playsInline = true
      
      // Wait for video to be ready and play
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Video load timeout'))
        }, 10000)

        video.onloadedmetadata = () => {
          console.log('✅ Video metadata loaded:', {
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight
          })
          clearTimeout(timeout)
          resolve()
        }
        
        video.onerror = (error) => {
          clearTimeout(timeout)
          reject(new Error('Video load error'))
        }
        
        if (video.load) {
          video.load()
        }
      })

      await video.play()
      console.log('✅ Video play() completed successfully')
      useIOSWorkaround.value = false
    }
    
    hasPermission.value = true
    isStreamActive.value = true
    retryCount.value = 0
    
    console.log('Camera initialized successfully')
    console.log('Current state:', {
      isStreamActive: isStreamActive.value,
      isRequestingPermission: isRequestingPermission.value,
      hasPermission: hasPermission.value,
      permissionDenied: permissionDenied.value,
      capturedImage: !!capturedImage.value,
      useIOSWorkaround: useIOSWorkaround.value
    })
    
  } catch (error) {
    console.error('Camera access error:', error)
    
    mediaStream.value = null
    isStreamActive.value = false
    useIOSWorkaround.value = false
    retryCount.value++
    
    // Handle different error types with enhanced iOS support
    if (error.name === 'NotAllowedError') {
      if (deviceInfo.value.isIOS) {
        cameraError.value = 'Accesso camera negato su iPhone. Segui le istruzioni qui sotto per abilitare la camera, oppure usa il pulsante "Testa Permessi Camera".'
      } else {
        cameraError.value = 'Accesso alla camera negato. Abilita i permessi per continuare.'
      }
    } else if (error.name === 'NotFoundError') {
      cameraError.value = 'Nessuna camera trovata su questo dispositivo.'
    } else if (error.name === 'OverconstrainedError') {
      if (deviceInfo.value.isIOS && retryCount.value < maxRetries.value) {
        console.log('🔄 Retrying with simpler constraints for iOS...')
        setTimeout(() => {
          requestPermission()
        }, 1000)
        return
      }
      cameraError.value = 'Le impostazioni della camera non sono supportate.'
    } else if (error.name === 'NotReadableError') {
      cameraError.value = 'Camera già in uso da un\'altra applicazione.'
    } else {
      if (deviceInfo.value.isIOS && retryCount.value < maxRetries.value) {
        console.log(`🔄 iOS retry attempt ${retryCount.value}/${maxRetries.value}...`)
        setTimeout(() => {
          requestPermission()
        }, 2000)
        return
      }
      
      cameraError.value = deviceInfo.value.isIOS 
        ? '❌ Errore camera iPhone. Prova il pulsante "Testa Permessi Camera" o usa "Carica da Galleria".'
        : 'Errore nell\'accesso alla camera. Riprova o usa la galleria.'
    }
    
    permissionDenied.value = true
  } finally {
    const endTime = Date.now()
    console.log(`⏱️ Camera initialization took: ${endTime - startTime}ms`)
    isRequestingPermission.value = false
    console.log('📋 Set isRequestingPermission to false')
  }
}

// Switch between front and back camera
const switchCamera = async () => {
  console.log('🔄 Switch camera button clicked')
  console.log('📊 Current state:', {
    hasMultipleCameras: hasMultipleCameras.value,
    currentFacingMode: currentFacingMode.value,
    isStreamActive: isStreamActive.value
  })

  // Save previous mode before changing it
  const previousMode = currentFacingMode.value

  try {
    // Stop current stream
    if (mediaStream.value) {
      const tracks = mediaStream.value.getTracks()
      tracks.forEach(track => track.stop())
      mediaStream.value = null
    }

    // Toggle facing mode
    currentFacingMode.value = currentFacingMode.value === 'environment' ? 'user' : 'environment'
    
    console.log(`🔄 Switching from ${previousMode} to ${currentFacingMode.value}`)
    
    // Reset stream state
    isStreamActive.value = false
    
    // Add a small delay to ensure the stream is completely stopped
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Request new stream with new facing mode
    await requestPermission()
    
    // Verify the camera actually switched (for debug purposes)
    if (mediaStream.value) {
      const videoTracks = mediaStream.value.getVideoTracks()
      if (videoTracks.length > 0) {
        const settings = videoTracks[0].getSettings()
        console.log('📷 Camera settings after switch:', {
          facingMode: settings.facingMode,
          requestedMode: currentFacingMode.value,
          width: settings.width,
          height: settings.height
        })
      }
    }
    
    console.log('✅ Camera switch successful')
    
  } catch (error) {
    console.error('Error switching camera:', error)
    
    // Revert facing mode if switch failed
    currentFacingMode.value = previousMode
    console.log(`Reverted to ${previousMode} due to error`)
    
    // Try to restart with original camera
    try {
      await requestPermission()
    } catch (restartError) {
      console.error('Failed to restart camera:', restartError)
    }
  }
}

// Capture photo from video stream
const capturePhoto = () => {
  console.log('Capture photo button clicked')
  const video = videoElement.value || document.querySelector('video')
  if (!video || !canvasElement.value || !isStreamActive.value) {
    console.error('Camera not ready:', {
      video: !!video,
      canvas: !!canvasElement.value,
      isStreamActive: isStreamActive.value,
      useIOSWorkaround: useIOSWorkaround.value
    })
    toast.error(t('camera.errors.cameraNotReady'))
    return
  }

  try {
    console.log('Starting photo capture...')
    console.log('Capture method:', useIOSWorkaround.value ? 'iOS Enhanced' : 'Standard')
    
    const canvas = canvasElement.value
    const context = canvas.getContext('2d')

    // Set canvas size to match video
    canvas.width = video.videoWidth || video.clientWidth || 640
    canvas.height = video.videoHeight || video.clientHeight || 480
    console.log('Canvas size set to:', canvas.width, 'x', canvas.height)
    
    // Additional check for valid dimensions
    if (canvas.width === 0 || canvas.height === 0) {
      console.warn('Invalid video dimensions, using fallback size')
      canvas.width = 640
      canvas.height = 480
    }

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    // Convert to base64 image with higher quality for iOS
    const quality = useIOSWorkaround.value ? 0.95 : 0.9
    capturedImage.value = canvas.toDataURL('image/jpeg', quality)
    console.log('Image captured, size:', capturedImage.value.length, 'bytes')
    
    // Stop camera stream
    cleanup()
    
    // Process the captured image
    processImage()
    
    console.log('Photo captured successfully')
    
  } catch (error) {
    console.error('Error capturing photo:', error)
    toast.error(t('camera.errors.captureError'))
  }
}

// Process captured image for ingredient detection
const processImage = async () => {
  if (!capturedImage.value) return

  processing.value = true
  detectedIngredients.value = []

  try {
    console.log('Processing image for ingredient detection...')
    
    // Call API for ingredient detection with current locale
    const response = await ingredientService.detectIngredients(capturedImage.value, locale.value)
    const newIngredients = response.ingredients || []
    
    // Aggiungi nuovi ingredienti a quelli già rilevati (evita duplicati)
    newIngredients.forEach(ingredient => {
      if (!detectedIngredients.value.includes(ingredient)) {
        detectedIngredients.value.push(ingredient)
      }
    })
    
    if (newIngredients.length > 0) {
      const confidenceText = response.confidence ? ` (confidenza: ${Math.round(response.confidence * 100)}%)` : ''
      toast.success(t('camera.ingredientsAdded', { added: newIngredients.length, total: detectedIngredients.value.length }))
    } else {
      toast.info(t('camera.noNewIngredientsDetected'))
    }
    
  } catch (error) {
    // Gestisci diversi tipi di errore con toast localizzati
    if (error.response?.status === 503) {
      toast.error(t('camera.serviceUnavailable'))
    } else if (error.response?.status === 422) {
      toast.warning(t('camera.noIngredientsDetected'))
    } else {
      toast.error(t('camera.analysisError'))
    }
    
    // Non aggiungere ingredienti mockati
    detectedIngredients.value = []
    
  } finally {
    processing.value = false
  }
}

// Open gallery for file selection
const openGallery = () => {
  console.log('Gallery button clicked')
  if (fileInput.value) {
    console.log('Opening file input...')
    fileInput.value.click()
  } else {
    console.error('File input not available')
  }
}

// Open camera capture for iOS Safari (fallback method)
const openCameraCapture = () => {
  console.log('iOS Camera capture button clicked')
  if (cameraInput.value) {
    console.log('📱 Opening camera capture input...')
    cameraInput.value.click()
  } else {
    console.error('Camera input not available')
    toast.error('Errore nell\'apertura della camera')
  }
}

// Force iOS camera request with aggressive tactics
const forceIOSCameraRequest = async () => {
  console.log('Force iOS Camera Request initiated by user')
  
  if (!deviceInfo.value.isIOS) {
    toast.error('Questa funzione è disponibile solo su iOS')
    return
  }
  
  // Reset state
  permissionDenied.value = false
  cameraError.value = null
  isRequestingPermission.value = true
  retryCount.value = 0
  
  try {
    console.log('Starting aggressive iOS camera access...')
    
    // Try the aggressive access method directly
    mediaStream.value = await forceIOSCameraAccess()
    
    // Setup video element with iOS-specific handling
    await setupVideoElement(mediaStream.value)
    
    hasPermission.value = true
    isStreamActive.value = true
    useIOSWorkaround.value = true
    
    toast.success(t('camera.success.iOSCameraActivated'))
    console.log('Forced iOS camera access successful')
    
  } catch (error) {
    console.error('Forced iOS camera access failed:', error)
    
    mediaStream.value = null
    isStreamActive.value = false
    useIOSWorkaround.value = false
    
    // Provide specific error messages
    if (error.name === 'NotAllowedError') {
      cameraError.value = t('camera.errors.permissionDenied')
      toast.error(t('camera.errors.permissionDeniedIOS'))
    } else if (error.name === 'NotFoundError') {
      cameraError.value = t('camera.errors.cameraNotFoundDevice')
      toast.error(t('camera.errors.cameraNotFound'))
    } else {
      cameraError.value = t('camera.errors.safariIOS')
      toast.error(t('camera.errors.iOSCameraError') + ': ' + (error.message || t('camera.errors.unknownError')))
    }
    
    permissionDenied.value = true
  } finally {
    isRequestingPermission.value = false
  }
}

// Open iOS Settings app (attempt)
const openIOSSettings = () => {
  console.log('Attempting to open iOS Settings...')
  // Try to open iOS Settings app to Camera settings
  window.location.href = 'App-prefs:root=Privacy&path=CAMERA'
  
  // Fallback: show instructions alert
  setTimeout(() => {
    alert('Apri le Impostazioni manualmente:\nImpostazioni > Privacy e sicurezza > Camera > Safari\n\nOppure:\nImpostazioni > Safari > Camera > Consenti')
  }, 1000)
}

// Test camera permissions specifically
const testCameraPermissions = async () => {
  console.log('Testing camera permissions...')
  
  try {
    // First check if mediaDevices is available
    if (!navigator.mediaDevices) {
      console.error('navigator.mediaDevices not available')
      if (deviceInfo.value.isIOS) {
        toast.info(t('camera.errors.safariIOS'))
        cameraError.value = t('camera.errors.safariIOS')
      } else {
        toast.error(t('camera.errors.apiNotAvailable'))
        cameraError.value = t('camera.errors.apiNotAvailable')
      }
      permissionDenied.value = true
      return
    }
    
    // Check if getUserMedia is available
    if (!navigator.mediaDevices.getUserMedia) {
      console.error('getUserMedia not available')
      if (deviceInfo.value.isIOS) {
        toast.info(t('camera.errors.getUserMediaIOS'))
        cameraError.value = t('camera.errors.safariIOS')
      } else {
        toast.error(t('camera.errors.getUserMediaNotAvailable'))
        cameraError.value = t('camera.errors.unsupportedBrowser')
      }
      permissionDenied.value = true
      return
    }
    
    // Check if we're in a secure context
    if (!window.isSecureContext) {
      console.error('Not in secure context')
      toast.error(t('camera.errors.insecureConnection'))
      cameraError.value = t('camera.errors.insecureConnection')
      permissionDenied.value = true
      return
    }
    
    console.log('All APIs are available, checking permissions...')
    
    // Check permission status first
    const permissionStatus = await checkCameraPermissions()
    console.log('Permission status:', permissionStatus)
    
    if (permissionStatus === 'denied') {
      toast.error(t('camera.errors.permissionDenied'))
      return
    }
    
    if (permissionStatus === 'granted') {
      toast.success(t('camera.success.permissionAlreadyGranted'))
      // Try to initialize camera
      setTimeout(() => requestPermission(), 500)
      return
    }
    
    // If prompt, try to request permission
    console.log('Attempting to trigger permission popup...')
    
    // Create a minimal request to trigger the permission popup
    try {
      const testStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      })
      
      console.log('Permission granted! Stream obtained.')
      toast.success(t('camera.success.permissionGranted'))
      
      // Stop the test stream
      testStream.getTracks().forEach(track => track.stop())
      
      // Now initialize properly
      setTimeout(() => requestPermission(), 500)
      
    } catch (error) {
      console.error('Permission test failed:', error)
      
      if (error.name === 'NotAllowedError') {
        toast.error(t('camera.errors.permissionDenied'))
        cameraError.value = t('camera.errors.permissionDenied')
        permissionDenied.value = true
      } else if (error.name === 'NotFoundError') {
        toast.error(t('camera.errors.cameraNotFoundDevice'))
        cameraError.value = t('camera.errors.cameraNotFoundDevice')
        permissionDenied.value = true
      } else if (error.name === 'NotSupportedError') {
        toast.error(t('camera.errors.unsupportedBrowser'))
        cameraError.value = t('camera.errors.unsupportedBrowser')
        permissionDenied.value = true
      } else {
        toast.error(t('camera.errors.permissionCheckError') + ': ' + (error.message || t('camera.errors.unknownError')))
        cameraError.value = t('camera.errors.permissionCheckError')
        permissionDenied.value = true
      }
    }
    
  } catch (error) {
    console.error('Error testing permissions:', error)
    toast.error(t('camera.errors.permissionCheckError') + ': ' + (error.message || t('camera.errors.unknownError')))
    cameraError.value = t('camera.errors.permissionCheckError')
    permissionDenied.value = true
  }
}

// Handle file selection from gallery
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    toast.error(t('camera.selectValidImageFile'))
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    capturedImage.value = e.target.result
    cleanup() // Stop camera if running
    processImage()
  }
  reader.onerror = () => {
    toast.error(t('camera.fileReadError'))
  }
  reader.readAsDataURL(file)
}

// Handle camera capture from iOS Safari
const handleCameraCapture = (event) => {
  console.log('Camera capture file received')
  const file = event.target.files[0]
  if (!file) {
    console.log('No file selected from camera')
    return
  }

  console.log('Camera file details:', {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: new Date(file.lastModified)
  })

  // Log usage analytics
  console.log('Using iOS camera capture fallback method')

  if (!file.type.startsWith('image/')) {
    toast.error(t('camera.invalidCameraFile'))
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    console.log('Camera image loaded successfully')
    capturedImage.value = e.target.result
    cleanup() // Stop any running camera stream
    toast.success(t('camera.photoTakenSuccess'))
    processImage()
  }
  reader.onerror = () => {
    console.error('Error reading camera file')
    toast.error(t('camera.cameraFileReadError'))
  }
  
  // Reset the input for future captures
  event.target.value = ''
  
  reader.readAsDataURL(file)
}

// Add more photos (keep existing ingredients)
const addMorePhotos = () => {
  capturedImage.value = null
  processing.value = false
  
  // For iOS devices, offer choice between methods
  if (deviceInfo.value.isIOS && !deviceInfo.value.hasMediaDevices) {
    // If direct camera access isn't available, just clean up
    console.log('iOS device - camera stream not available, staying in capture mode')
    // Don't restart camera since it's not available
    return
  }
  
  // Restart camera for devices that support it
  setTimeout(() => {
    requestPermission()
  }, 100)
}

// Clear all and retake (reset everything)
const clearAndRetake = () => {
  capturedImage.value = null
  detectedIngredients.value = []
  processing.value = false
  
  // For iOS devices, offer choice between methods
  if (deviceInfo.value.isIOS && !deviceInfo.value.hasMediaDevices) {
    // If direct camera access isn't available, just clean up
    console.log('iOS device - camera stream not available, staying in capture mode')
    // Don't restart camera since it's not available
    return
  }
  
  // Restart camera for devices that support it
  setTimeout(() => {
    requestPermission()
  }, 100)
}

// retakePhoto è ora gestito da clearAndRetake

// Generate recipe from detected ingredients
const generateRecipe = async () => {
  if (detectedIngredients.value.length === 0) {
    toast.error(t('camera.noIngredientsToUse'))
    return
  }

  processing.value = true
  
  try {
    // Store ingredients for recipe generation
    userDataService.setCurrentIngredients(detectedIngredients.value)
    
    // Check if should show donation toast (for camera detection)
    checkDonationToast()
    
    // Navigate to recipes page
    router.push('/app/recipes')
    
  } catch (error) {
    console.error('Error generating recipe:', error)
    toast.error(t('camera.recipeGenerationError'))
  } finally {
    processing.value = false
  }
}

// Go back to previous page
const goBack = () => {
  cleanup()
  router.go(-1)
}

// Clean up camera resources
const cleanup = () => {
  console.log('Cleaning up camera resources...')
  
  // Clean up getUserMedia stream
  if (mediaStream.value) {
    const tracks = mediaStream.value.getTracks()
    tracks.forEach(track => track.stop())
    mediaStream.value = null
    console.log('Media stream stopped')
  }
  
  isStreamActive.value = false
  hasPermission.value = false
  useIOSWorkaround.value = false
  retryCount.value = 0
  
  console.log('Camera cleanup completed')
}

// Manual selection functions
const showManualSelection = () => {
  showChoiceScreen.value = false
  showManualSelectionScreen.value = true
}

const startCameraMode = async () => {
  showChoiceScreen.value = false
  showManualSelectionScreen.value = false
  await nextTick()
  await requestPermission()
}

const backToChoice = () => {
  showManualSelectionScreen.value = false
  showChoiceScreen.value = true
  selectedIngredients.value = []
  searchQuery.value = ''
}

const toggleIngredient = (ingredient) => {
  const index = selectedIngredients.value.indexOf(ingredient)
  if (index > -1) {
    selectedIngredients.value.splice(index, 1)
  } else {
    selectedIngredients.value.push(ingredient)
  }
  // Clear search bar after selection to allow new search
  searchQuery.value = ''
}

const removeIngredient = (ingredient) => {
  const index = selectedIngredients.value.indexOf(ingredient)
  if (index > -1) {
    selectedIngredients.value.splice(index, 1)
  }
}

const generateRecipeFromManual = async () => {
  if (selectedIngredients.value.length === 0) {
    toast.error(t('camera.selectAtLeastOne'))
    return
  }

  try {
    // Store ingredients for recipe generation
    userDataService.setCurrentIngredients(selectedIngredients.value)
    
    // Check if should show donation toast (for manual selection)
    checkDonationToast()
    
    // Navigate to recipes page
    router.push('/app/recipes')
    
  } catch (error) {
    console.error('Error generating recipe from manual selection:', error)
    toast.error(t('camera.recipeGenerationError'))
  }
}

const getIngredientEmoji = (ingredient) => {
  const emojiMap = {
    'Pomodori': '🍅',
    'Pomodorini': '🍅',
    'Cipolla': '🧅',
    'Aglio': '🧄',
    'Basilico': '🌿',
    'Origano': '🌿',
    'Prezzemolo': '🌿',
    'Rosmarino': '🌿',
    'Salvia': '🌿',
    'Timo': '🌿',
    'Mozzarella': '🧀',
    'Parmigiano': '🧀',
    'Carote': '🥕',
    'Peperoni': '🌶️',
    'Zucchine': '🥒',
    'Melanzane': '🍆',
    'Spinaci': '🥬',
    'Rucola': '🥬',
    'Lattuga': '🥬',
    'Cetrioli': '🥒',
    'Funghi': '🍄',
    'Patate': '🥔',
    'Uova': '🥚',
    'Pollo': '🐔',
    'Manzo': '🥩',
    'Maiale': '🥩',
    'Prosciutto': '🥓',
    'Salame': '🥓',
    'Tonno': '🐟',
    'Salmone': '🐟',
    'Limoni': '🍋',
    'Arance': '🍊',
    'Mele': '🍎',
    'Banane': '🍌',
    'Fragole': '🍓',
    'Pesche': '🍑',
    'Pere': '🍐',
    'Uva': '🍇',
    'Pasta': '🍝',
    'Riso': '🍚',
    'Pane': '🍞',
    'Latte': '🥛',
    'Fagioli': '🫘',
    'Lenticchie': '🫘',
    'Ceci': '🫘'
  }
  return emojiMap[ingredient] || '🥘'
}

// Ricerca ingredienti con debounce
const searchIngredients = async (query) => {
  if (!query || query.length < 2) {
    searchResults.value = []
    isSearching.value = false
    return
  }

  isSearching.value = true
  
  try {
    const results = await ingredientsDatabase.searchIngredients(query, locale.value)
    searchResults.value = results
    console.log(`🔍 Found ${results.length} ingredients for "${query}"`)
  } catch (error) {
    console.error('Error searching ingredients:', error)
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

// Watch per search query con debounce
const debouncedSearch = (newQuery) => {
  // Cancella timeout precedente
  if (searchDebounceTimeout.value) {
    clearTimeout(searchDebounceTimeout.value)
  }

  // Imposta nuovo timeout
  searchDebounceTimeout.value = setTimeout(() => {
    searchIngredients(newQuery)
  }, 300) // 300ms debounce
}

const searchByCategory = async (categoryName) => {
  console.log(`🏷️ Searching by category: ${categoryName}`)
  isSearching.value = true
  searchQuery.value = '' // Clear search query to show category results
  
  try {
    const results = await ingredientsDatabase.searchByCategory(categoryName, locale.value)
    searchResults.value = results
    console.log(`✅ Found ${results.length} ingredients for category "${categoryName}"`)
    
    // Debug: mostra come sono strutturati i risultati
    if (results.length > 0) {
      console.log('🔍 First result structure:', results[0])
      console.log('🌍 Current locale:', locale.value)
    }
    
    // Show a toast with the category name and count
    if (results.length > 0) {
      toast.success(`${results.length} ${t('camera.categorySearchSuccess')} "${categoryName}"`)
    } else {
      toast.info(`${t('camera.categorySearchEmpty')} "${categoryName}"`)
    }
  } catch (error) {
    console.error('Error searching by category:', error)
    searchResults.value = []
    toast.error(t('camera.categorySearchError'))
  } finally {
    isSearching.value = false
  }
}

const clearCategoryResults = () => {
  searchResults.value = []
  searchQuery.value = ''
  console.log('🧹 Category results cleared')
}

const checkDonationToast = () => {
  // Increment recipe count and check if should show donation toast
  DonationHelper.incrementRecipeCount()
  
  if (DonationHelper.shouldShowDonationToast()) {
    // Show toast after a small delay
    setTimeout(() => {
      toast.info(t('recipes.donationToast'), {
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

// Watcher per search query
watch(searchQuery, (newQuery) => {
  debouncedSearch(newQuery)
})

// Component lifecycle
onMounted(async () => {
  console.log('Camera component mounted')
  
  // Initialize device info
  initDeviceInfo()
  
  // Check available cameras
  await checkAvailableCameras()
  
  // Pre-load ingredients database per le ricerche (ma non per quick add)
  try {
    await ingredientsDatabase.loadAllIngredients(locale.value)
    console.log(`✅ Ingredients database loaded for search`)
  } catch (error) {
    console.warn('Could not pre-load ingredients database:', error)
  }
  
  // Don't automatically start camera - show choice screen instead
  console.log('Showing choice screen instead of auto-starting camera')
})

onBeforeUnmount(() => {
  console.log('Camera component unmounting')
  cleanup()
})
</script>

<style scoped>
/* Mobile fullscreen styles */
.fixed {
  position: fixed !important;
}

.inset-0 {
  top: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  left: 0 !important;
}

/* Ensure true fullscreen on mobile */
@media screen and (max-width: 768px) {
  .fixed.inset-0 {
    width: 100vw !important;
    height: 100vh !important;
    height: 100dvh !important; /* Dynamic viewport height for mobile */
  }
}

/* Video styling */
video {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
  background: #000;
  position: absolute !important;
  top: 0;
  left: 0;
  z-index: 1;
}

/* iOS specific video fixes */
video {
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

/* Override any parent layout constraints */
.absolute.inset-0 {
  position: absolute !important;
  top: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
}

/* Safe area handling for iOS */
@supports (padding: max(0px)) {
  .pb-8 {
    padding-bottom: max(2rem, env(safe-area-inset-bottom));
  }
  
  /* Account for safe areas and navigation on mobile */
  @media screen and (max-width: 768px) {
    .fixed.inset-0 {
      top: env(safe-area-inset-top, 0) !important;
      /* Leave space for bottom navigation - don't override bottom */
      left: env(safe-area-inset-left, 0) !important;
      right: env(safe-area-inset-right, 0) !important;
      /* Adjust height to account for navigation */
      height: calc(100vh - 80px) !important; /* 80px is typical nav height */
      height: calc(100dvh - 80px) !important;
    }
  }
}

/* Mobile responsive */
@media screen and (max-width: 768px) {
  .h-screen {
    min-height: 100vh;
    min-height: -webkit-fill-available;
    min-height: 100dvh;
  }
  
  /* Adjust container for navigation space */
  .fixed.inset-0 {
    bottom: 80px !important; /* Leave space for bottom navigation */
    height: calc(100vh - 80px) !important;
    height: calc(100dvh - 80px) !important;
  }
  
  /* Force fullscreen video within available space */
  video {
    width: 100vw !important;
    height: calc(100vh - 80px) !important;
    height: calc(100dvh - 80px) !important;
  }
  
  /* Ensure camera controls are above navigation */
  .pointer-events-auto {
    z-index: 40 !important;
  }
  
  /* Improve touch targets for mobile */
  button {
    touch-action: manipulation;
  }
}

/* Camera component animations */
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
.animation-delay-1300 { animation-delay: 1300ms; }
.animation-delay-1400 { animation-delay: 1400ms; }
.animation-delay-1500 { animation-delay: 1500ms; }

/* Initially hide animated elements */
.animate-fade-in-up,
.animate-slide-in-left,
.animate-slide-in-right,
.animate-bounce-in {
  opacity: 0;
}
</style>
