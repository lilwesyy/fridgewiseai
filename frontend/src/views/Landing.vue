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
            <div class="w-10 h-10 flex items-center justify-center">
              <img src="@/assets/black_simbol.svg" alt="FridgeWise AI Logo" class="w-10 h-10">
            </div>
            <span class="ml-3 text-xl font-bold text-gray-900">FridgeWise AI</span>
          </div>
          
          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-6">
            <a href="#features" class="text-gray-700 hover:text-primary-600 font-medium">{{ t('landing.nav.features') }}</a>
            <a href="#how-it-works" class="text-gray-700 hover:text-primary-600 font-medium">{{ t('landing.nav.howItWorks') }}</a>
            <!-- <a href="#about" class="text-gray-700 hover:text-primary-600 font-medium">{{ t('landing.nav.about') }}</a> -->
            
            <!-- Language Selector -->
            <div class="relative">
              <button 
                @click="showLanguageDropdown = !showLanguageDropdown"
                class="flex items-center space-x-1 text-gray-700 hover:text-primary-600 font-medium"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                </svg>
                <span>{{ getCurrentLanguageName() }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <!-- Language Dropdown -->
              <div v-if="showLanguageDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <button 
                  v-for="language in availableLanguages" 
                  :key="language.code"
                  @click="changeLanguage(language.code)"
                  class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                  :class="{ 'bg-primary-50 text-primary-600': $i18n.locale === language.code }"
                >
                  <span>{{ language.name }}</span>
                  <span v-if="$i18n.locale === language.code" class="text-primary-600">✓</span>
                </button>
              </div>
            </div>
            
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
            
            <!-- Mobile Language Selector -->
            <div class="border-t border-gray-200 pt-4">
              <p class="text-sm font-medium text-gray-900 mb-2">{{ t('landing.nav.language') }}</p>
              <div class="grid grid-cols-2 gap-2">
                <button 
                  v-for="language in availableLanguages" 
                  :key="language.code"
                  @click="changeLanguage(language.code)"
                  class="px-3 py-2 text-sm rounded-lg border transition-colors"
                  :class="$i18n.locale === language.code 
                    ? 'border-primary-500 bg-primary-50 text-primary-700' 
                    : 'border-gray-200 hover:bg-gray-50'"
                >
                  {{ language.name }}
                </button>
              </div>
            </div>
            
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

    <!-- Support Section -->
    <section class="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6">
          <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
          </svg>
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {{ t('landing.support.title') }}
        </h2>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {{ t('landing.support.description') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            @click="openDonation"
            class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
            </svg>
            {{ t('landing.support.donateButton') }}
          </button>
          <p class="text-sm text-gray-500">{{ t('landing.support.note') }}</p>
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
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center">
          <!-- Company Info -->
          <div class="flex items-center justify-center mb-6">
            <div class="w-12 h-12 flex items-center justify-center">
              <img src="@/assets/black_simbol.svg" alt="FridgeWise AI Logo" class="w-12 h-12 filter brightness-0 invert">
            </div>
            <span class="ml-3 text-xl font-bold">FridgeWise AI</span>
          </div>
          
          <p class="text-gray-400 mb-6 max-w-md mx-auto">
            {{ t('landing.footer.description') }}
          </p>
          
          <!-- Instagram Link -->
          <div class="mb-8">
            <a href="https://www.instagram.com/fridgewiseai/" class="text-gray-400 hover:text-white transition-colors">
              <svg class="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
          
          <!-- Copyright -->
          <div class="border-t border-gray-800 pt-6">
            <p class="text-gray-400 text-sm">
              © 2025 FridgeWise AI. {{ t('landing.footer.rights') }}
            </p>
            <p class="text-gray-500 text-xs mt-2">
              {{ t('landing.footer.madeWith') }} ❤️ {{ t('landing.footer.location') }}
            </p>
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
import { saveLanguagePreference } from '@/services/languageDetectionService'
import { DonationHelper } from '@/utils/donationHelper'

const router = useRouter()
const { t, locale } = useI18n()

const mobileMenuOpen = ref(false)
const showScrollToTop = ref(false)
const showLanguageDropdown = ref(false)
const navbarShadow = ref(false)
const navbarVisible = ref(true)
const lastScrollY = ref(0)

// Lingue disponibili
const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'it', name: 'Italiano' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' }
]

// Ottiene il nome della lingua corrente
const getCurrentLanguageName = () => {
  const current = availableLanguages.find(lang => lang.code === locale.value)
  return current ? current.name : 'English'
}

// Cambia la lingua
const changeLanguage = (languageCode) => {
  console.log(`🌍 Changing language to: ${languageCode}`)
  
  // Aggiorna la locale di i18n
  locale.value = languageCode
  
  // Salva la preferenza (nei cookie per la landing page)
  saveLanguagePreference(languageCode, 'user')
  
  // Chiudi i dropdown
  showLanguageDropdown.value = false
  mobileMenuOpen.value = false
  
  console.log(`🌍 Language changed to: ${languageCode}`)
}

// Funzioni di gestione navbar e scroll
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

// Chiudi dropdown quando si clicca fuori
const handleClickOutside = (event) => {
  if (showLanguageDropdown.value && !event.target.closest('.relative')) {
    showLanguageDropdown.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
})

// Gestione donazioni
const openDonation = () => {
  DonationHelper.openPayPalDonation()
}

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})
</script>
