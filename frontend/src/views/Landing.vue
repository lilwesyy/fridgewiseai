<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation Bar -->
    <nav 
      class="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform"
      :class="{ 
        'shadow-lg': navbarShadow, 
        'shadow-sm': !navbarShadow,
        '-translate-y-full': !navbarVisible && !mobileMenuOpen,
        'translate-y-0': navbarVisible || mobileMenuOpen
      }"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
              </svg>
            </div>
            <span class="ml-3 text-xl font-bold text-gray-900">FridgeWise AI</span>
          </div>
          
          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-8">
            <a href="#features" class="text-gray-700 hover:text-primary-600 font-medium">{{ t('landing.nav.features') }}</a>
            <a href="#how-it-works" class="text-gray-700 hover:text-primary-600 font-medium">{{ t('landing.nav.howItWorks') }}</a>
            <a href="#about" class="text-gray-700 hover:text-primary-600 font-medium">{{ t('landing.nav.about') }}</a>
            <BaseButton variant="primary" @click="router.push('/auth')">
              {{ t('landing.nav.getStarted') }}
            </BaseButton>
          </div>
          
          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button @click="toggleMobileMenu" class="text-gray-700 hover:text-primary-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Mobile menu -->
        <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 py-4">
          <div class="flex flex-col space-y-4">
            <a href="#features" @click="mobileMenuOpen = false" class="text-gray-700 hover:text-primary-600 font-medium">{{ t('landing.nav.features') }}</a>
            <a href="#how-it-works" @click="mobileMenuOpen = false" class="text-gray-700 hover:text-primary-600 font-medium">{{ t('landing.nav.howItWorks') }}</a>
            <a href="#about" @click="mobileMenuOpen = false" class="text-gray-700 hover:text-primary-600 font-medium">{{ t('landing.nav.about') }}</a>
            <BaseButton variant="primary" @click="router.push('/auth')" class="w-full">
              {{ t('landing.nav.getStarted') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary-50 via-white to-primary-50 py-20 lg:py-32 pt-36 lg:pt-44">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Hero Content -->
          <div class="text-center lg:text-left">
            <div class="mb-6">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                🚀 {{ t('landing.hero.badge') }}
              </span>
            </div>
            
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {{ t('landing.hero.title') }}
              <span class="text-primary-600">{{ t('landing.hero.titleHighlight') }}</span>
            </h1>
            
            <p class="text-xl text-gray-600 mb-8 leading-relaxed">
              {{ t('landing.hero.subtitle') }}
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <BaseButton 
                variant="primary" 
                size="lg"
                @click="router.push('/auth')"
                class="text-lg px-8 py-4"
              >
                {{ t('landing.hero.cta') }}
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </BaseButton>
              
              <button class="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-700 hover:text-primary-600 transition-colors">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ t('landing.hero.demo') }}
              </button>
            </div>
            
            <!-- Stats -->
            <div class="mt-12 grid grid-cols-3 gap-6 text-center lg:text-left">
              <div>
                <div class="text-2xl font-bold text-gray-900">10K+</div>
                <div class="text-sm text-gray-600">{{ t('landing.stats.recipes') }}</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-900">95%</div>
                <div class="text-sm text-gray-600">{{ t('landing.stats.accuracy') }}</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-900">2M+</div>
                <div class="text-sm text-gray-600">{{ t('landing.stats.users') }}</div>
              </div>
            </div>
          </div>
          
          <!-- Hero Image/Illustration -->
          <div class="relative">
            <div class="bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-1 transition-transform duration-300">
              <div class="bg-white rounded-2xl p-6 transform -rotate-3">
                <div class="grid grid-cols-2 gap-4">
                  <!-- Mock ingredients -->
                  <div class="space-y-3">
                    <div class="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                      <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">🍅</div>
                      <span class="text-sm font-medium">{{ t('ingredients.tomatoes') }}</span>
                    </div>
                    <div class="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                      <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">🧀</div>
                      <span class="text-sm font-medium">{{ t('ingredients.cheese') }}</span>
                    </div>
                    <div class="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                      <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">🌿</div>
                      <span class="text-sm font-medium">{{ t('ingredients.basil') }}</span>
                    </div>
                  </div>
                  
                  <div class="flex items-center justify-center">
                    <div class="text-center">
                      <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-2">
                        <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                      </div>
                      <div class="text-xs font-medium text-gray-600">{{ t('recipe.aiMagic') }}</div>
                    </div>
                  </div>
                </div>
                
                <div class="mt-4 p-3 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
                  <div class="text-xs font-medium text-primary-800 mb-1">{{ t('recipe.suggested') }}</div>
                  <div class="text-sm font-bold text-gray-900">{{ t('recipe.pizzaMargherita') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {{ t('landing.features.title') }}
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            {{ t('landing.features.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature 1: Smart Recognition -->
          <div class="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              {{ t('landing.features.recognize.title') }}
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ t('landing.features.recognize.description') }}
            </p>
          </div>

          <!-- Feature 2: Personalized Recipes -->
          <div class="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              {{ t('landing.features.recipes.title') }}
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ t('landing.features.recipes.description') }}
            </p>
          </div>

          <!-- Feature 3: Save Favorites -->
          <div class="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              {{ t('landing.features.save.title') }}
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ t('landing.features.save.description') }}
            </p>
          </div>

          <!-- Feature 4: Zero Waste -->
          <div class="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              {{ t('landing.features.zeroWaste.title') }}
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ t('landing.features.zeroWaste.description') }}
            </p>
          </div>

          <!-- Feature 5: Multi-language -->
          <div class="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              {{ t('landing.features.multilang.title') }}
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ t('landing.features.multilang.description') }}
            </p>
          </div>

          <!-- Feature 6: Offline Mode -->
          <div class="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              {{ t('landing.features.offline.title') }}
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ t('landing.features.offline.description') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section id="how-it-works" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {{ t('landing.howItWorks.title') }}
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            {{ t('landing.howItWorks.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Step 1 -->
          <div class="text-center">
            <div class="mb-8">
              <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">{{ t('landing.howItWorks.step1.title') }}</h3>
            <p class="text-gray-600">{{ t('landing.howItWorks.step1.description') }}</p>
          </div>

          <!-- Step 2 -->
          <div class="text-center">
            <div class="mb-8">
              <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">{{ t('landing.howItWorks.step2.title') }}</h3>
            <p class="text-gray-600">{{ t('landing.howItWorks.step2.description') }}</p>
          </div>

          <!-- Step 3 -->
          <div class="text-center">
            <div class="mb-8">
              <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">{{ t('landing.howItWorks.step3.title') }}</h3>
            <p class="text-gray-600">{{ t('landing.howItWorks.step3.description') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
          {{ t('landing.cta.title') }}
        </h2>
        <p class="text-xl text-primary-100 mb-8">
          {{ t('landing.cta.subtitle') }}
        </p>
        <div class="flex justify-center">
          <BaseButton 
            variant="secondary" 
            size="lg"
            @click="router.push('/auth')"
            class="inline-flex items-center bg-white text-primary-600 hover:bg-gray-50 text-lg px-8 py-4 font-semibold rounded-lg shadow-sm transition-colors"
          >
            {{ t('landing.cta.button') }}
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </BaseButton>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center mb-6">
              <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                </svg>
              </div>
              <span class="ml-3 text-xl font-bold">FridgeWise AI</span>
            </div>
            <p class="text-gray-400 mb-6 max-w-md">
              {{ t('landing.footer.description') }}
            </p>
            <div class="flex space-x-4">
              <!-- Social Links -->
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.744-1.378l-.628 2.43c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-semibold mb-6">{{ t('landing.footer.quickLinks') }}</h3>
            <ul class="space-y-4">
              <li><a href="#features" class="text-gray-400 hover:text-white transition-colors">{{ t('landing.nav.features') }}</a></li>
              <li><a href="#how-it-works" class="text-gray-400 hover:text-white transition-colors">{{ t('landing.nav.howItWorks') }}</a></li>
              <li><a href="#about" class="text-gray-400 hover:text-white transition-colors">{{ t('landing.nav.about') }}</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">{{ t('landing.footer.pricing') }}</a></li>
            </ul>
          </div>
          
          <!-- Support -->
          <div>
            <h3 class="text-lg font-semibold mb-6">{{ t('landing.footer.support') }}</h3>
            <ul class="space-y-4">
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">{{ t('landing.footer.help') }}</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">{{ t('landing.footer.contact') }}</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">{{ t('landing.footer.privacy') }}</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors">{{ t('landing.footer.terms') }}</a></li>
            </ul>
          </div>
        </div>
        
        <div class="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 text-sm">
            © 2025 FridgeWise AI. {{ t('landing.footer.rights') }}
          </p>
          <div class="flex items-center space-x-4 mt-4 md:mt-0">
            <span class="text-gray-400 text-sm">{{ t('landing.footer.madeWith') }}</span>
            <span class="text-red-500">❤️</span>
            <span class="text-gray-400 text-sm">{{ t('landing.footer.location') }}</span>
          </div>
        </div>
      </div>
    </footer>

    <!-- Go to Top Button -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 scale-75"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-75"
    >
      <button
        v-if="showScrollToTop"
        @click="scrollToTop"
        class="fixed bottom-8 right-8 w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group"
        :title="t('common.goToTop')"
      >
        <svg 
          class="w-6 h-6 transform group-hover:-translate-y-0.5 transition-transform duration-200" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
        </svg>
      </button>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/ui/Button.vue'

const router = useRouter()
const { t } = useI18n()

const mobileMenuOpen = ref(false)
const showScrollToTop = ref(false)
const navbarShadow = ref(false)
const navbarVisible = ref(true)
const lastScrollY = ref(0)

const handleScroll = () => {
  const currentScrollY = window.scrollY
  
  // Show/hide scroll to top button
  showScrollToTop.value = currentScrollY > 300
  
  // Add shadow to navbar when scrolled
  navbarShadow.value = currentScrollY > 10
  
  // Hide/show navbar based on scroll direction
  if (currentScrollY > lastScrollY.value && currentScrollY > 80) {
    // Scrolling down & past threshold - hide navbar
    navbarVisible.value = false
  } else if (currentScrollY < lastScrollY.value || currentScrollY <= 80) {
    // Scrolling up or at top - show navbar
    navbarVisible.value = true
  }
  
  lastScrollY.value = currentScrollY
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  // Keep navbar visible when mobile menu is open
  if (mobileMenuOpen.value) {
    navbarVisible.value = true
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
