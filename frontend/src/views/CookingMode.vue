<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header con controlli principali -->
    <div class="bg-white shadow-sm border-b border-gray-200 px-2 sm:px-4 py-3 sm:py-4">
      <div class="flex items-center justify-between max-w-6xl mx-auto">
        <div class="flex items-center space-x-2 sm:space-x-4">
          <Button
            @click="exitCookingMode"
            variant="ghost"
            size="sm"
            class="text-gray-600 hover:text-gray-800 p-2 sm:p-3"
          >
            <ArrowLeft class="h-5 w-5 sm:h-6 sm:w-6 sm:mr-2" />
            <span class="hidden sm:inline">{{ $t('common.exit') }}</span>
          </Button>
          <h2 class="text-lg sm:text-xl font-bold text-primary-600 hidden sm:block">FridgeWiseAI</h2>
        </div>
        
        <!-- Timer totale -->
        <div class="text-center">
          <div class="text-xl sm:text-3xl font-mono font-bold text-primary-600">
            {{ formatTime(totalElapsedTime) }}
          </div>
          <p class="text-xs sm:text-sm text-gray-500">{{ $t('cookingMode.totalTime') }}</p>
        </div>
      </div>
    </div>

    <!-- Sezione nome ricetta e progresso -->
    <div class="bg-gray-50 border-b border-gray-200 px-2 sm:px-4 py-2 sm:py-3">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-lg sm:text-2xl font-bold text-gray-900 mb-1 truncate">
          {{ recipe.name }}
        </h1>
        <p class="text-xs sm:text-sm text-gray-500">
          {{ $t('cookingMode.stepProgress', { current: currentStep + 1, total: recipe.instructions.length }) }}
        </p>
      </div>
    </div>

    <!-- Mobile Tab Navigation -->
    <div class="lg:hidden bg-white border-b border-gray-200">
      <div class="flex">
        <button 
          @click="activeTab = 'ingredients'"
          class="flex-1 py-3 px-4 text-center font-medium text-sm border-b-2 transition-colors"
          :class="activeTab === 'ingredients' 
            ? 'border-primary-500 text-primary-600 bg-primary-50' 
            : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          {{ $t('cookingMode.ingredients') }}
        </button>
        <button 
          @click="activeTab = 'step'"
          class="flex-1 py-3 px-4 text-center font-medium text-sm border-b-2 transition-colors"
          :class="activeTab === 'step' 
            ? 'border-primary-500 text-primary-600 bg-primary-50' 
            : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          {{ $t('cookingMode.currentStep') }}
        </button>
        <button 
          @click="activeTab = 'overview'"
          class="flex-1 py-3 px-4 text-center font-medium text-sm border-b-2 transition-colors"
          :class="activeTab === 'overview' 
            ? 'border-primary-500 text-primary-600 bg-primary-50' 
            : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          {{ $t('cookingMode.overview') }}
        </button>
      </div>
    </div>

    <div class="max-w-6xl mx-auto p-2 sm:p-4">
      <!-- Mobile Content -->
      <div class="lg:hidden">
        <!-- Ingredients Tab -->
        <div v-if="activeTab === 'ingredients'" class="space-y-4">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 class="text-lg font-bold mb-4 text-gray-900 flex items-center">
              <CheckSquare class="h-5 w-5 mr-2 text-primary-600" />
              {{ $t('cookingMode.ingredients') }}
            </h2>
            
            <div class="space-y-2">
              <div 
                v-for="(ingredient, index) in recipe.ingredients" 
                :key="index"
                class="flex items-center space-x-3 p-2 rounded-lg border transition-all cursor-pointer"
                :class="checkedIngredients[index] 
                  ? 'bg-primary-50 border-primary-200' 
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'"
                @click="toggleIngredient(index)"
              >
                <div 
                  class="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                  :class="checkedIngredients[index] 
                    ? 'bg-primary-500 border-primary-500' 
                    : 'border-gray-300'"
                >
                  <Check v-if="checkedIngredients[index]" class="h-3 w-3 text-white" />
                </div>
                <span 
                  class="text-sm leading-relaxed transition-all"
                  :class="checkedIngredients[index] 
                    ? 'line-through text-gray-500' 
                    : 'text-gray-900'"
                >
                  {{ ingredient }}
                </span>
              </div>
            </div>

            <!-- Progresso ingredienti -->
            <div class="mt-4 p-3 bg-gray-50 rounded-lg">
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-medium text-gray-700">
                  {{ $t('cookingMode.ingredientsProgress') }}
                </span>
                <span class="text-xs font-bold text-primary-600">
                  {{ checkedIngredientsCount }}/{{ recipe.ingredients.length }}
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  :style="{ width: ingredientsProgress + '%' }"
                ></div>
              </div>
              
              <!-- Auto-start timer quando tutti gli ingredienti sono controllati -->
              <div v-if="allIngredientsChecked && !stepTimerActive && !hasStartedCooking" 
                   class="mt-3 p-2 bg-primary-50 border border-primary-200 rounded-lg">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-primary-700 font-medium">
                    {{ $t('cookingMode.allIngredientsReady') }}
                  </span>
                  <Button
                    @click="startCookingProcess"
                    size="sm"
                    class="bg-primary-600 hover:bg-primary-700 text-white text-xs px-3 py-1"
                  >
                    {{ $t('cookingMode.startCooking') }}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step Tab -->
        <div v-if="activeTab === 'step'" class="space-y-4">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4" 
               @touchstart="handleTouchStart" 
               @touchend="handleTouchEnd">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-gray-900">
                {{ $t('cookingMode.currentStep') }}
              </h2>
              <div class="flex items-center space-x-2">
                <span class="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium">
                  {{ currentStep + 1 }} / {{ recipe.instructions.length }}
                </span>
              </div>
            </div>

            <!-- Barra di progresso generale -->
            <div class="mb-4">
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div 
                  class="bg-primary-500 h-3 rounded-full transition-all duration-300 flex items-center justify-end pr-1"
                  :style="{ width: overallProgress + '%' }"
                >
                  <span class="text-xs font-bold text-white" v-if="overallProgress > 20">
                    {{ Math.round(overallProgress) }}%
                  </span>
                </div>
              </div>
            </div>

            <!-- Contenuto dello step corrente -->
            <div class="mb-4">
              <div class="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-r-lg relative">
                <p class="text-base leading-relaxed text-gray-900 font-medium">
                  {{ recipe.instructions[currentStep] }}
                </p>
              </div>
            </div>

            <!-- Timer dello step -->
            <div class="mb-4 p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-medium text-gray-700">
                  {{ $t('cookingMode.stepTimer') }}
                </span>
                <div class="flex space-x-1">
                  <Button
                    @click="addStepTime(60)"
                    variant="ghost"
                    size="sm"
                    class="text-xs px-2 py-1"
                  >
                    +1{{ $t('cookingMode.min') }}
                  </Button>
                  <Button
                    @click="addStepTime(300)"
                    variant="ghost"
                    size="sm"
                    class="text-xs px-2 py-1"
                  >
                    +5{{ $t('cookingMode.min') }}
                  </Button>
                </div>
              </div>
              
              <div class="text-center">
                <div class="text-2xl font-mono font-bold mb-2"
                     :class="stepTimer <= 10 && stepTimer > 0 
                       ? 'text-red-600 animate-pulse' 
                       : 'text-primary-600'"
                >
                  {{ formatTime(stepTimer) }}
                </div>
                
                <div class="flex justify-center space-x-2">
                  <Button
                    @click="startStepTimer"
                    v-if="!stepTimerActive"
                    variant="default"
                    size="sm"
                    class="bg-primary-600 hover:bg-primary-700 px-3 py-2"
                  >
                    <Play class="h-4 w-4 mr-1" />
                    {{ $t('cookingMode.startTimer') }}
                  </Button>
                  
                  <Button
                    @click="pauseStepTimer"
                    v-if="stepTimerActive"
                    variant="secondary"
                    size="sm"
                    class="px-3 py-2"
                  >
                    <Pause class="h-4 w-4 mr-1" />
                    {{ $t('cookingMode.pauseTimer') }}
                  </Button>
                  
                  <Button
                    @click="resetStepTimer"
                    variant="ghost"
                    size="sm"
                    class="px-3 py-2"
                  >
                    <RotateCcw class="h-4 w-4 mr-1" />
                    {{ $t('cookingMode.resetTimer') }}
                  </Button>
                </div>
              </div>
            </div>

            <!-- Navigazione step -->
            <div class="flex justify-between">
              <Button
                @click="previousStep"
                :disabled="currentStep === 0"
                variant="secondary"
                size="sm"
                class="px-4 py-2"
              >
                <ChevronLeft class="h-4 w-4 mr-1" />
                {{ $t('cookingMode.previous') }}
              </Button>
              
              <Button
                @click="nextStep"
                v-if="currentStep < recipe.instructions.length - 1"
                variant="default"
                size="sm"
                class="px-4 py-2 bg-primary-600 hover:bg-primary-700"
              >
                {{ $t('cookingMode.next') }}
                <ChevronRight class="h-4 w-4 ml-1" />
              </Button>
              
              <Button
                @click="completeCooking"
                v-if="currentStep === recipe.instructions.length - 1"
                variant="default"
                size="sm"
                class="px-4 py-2 bg-primary-600 hover:bg-primary-700"
              >
                <CheckCircle class="h-4 w-4 mr-1" />
                {{ $t('cookingMode.complete') }}
              </Button>
            </div>
          </div>
        </div>

        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="space-y-4">
          <!-- Informazioni ricetta -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 class="text-lg font-bold mb-3 text-gray-900">
              {{ $t('cookingMode.recipeInfo') }}
            </h3>
            
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">{{ $t('common.prepTime') }}:</span>
                <span class="font-medium text-gray-900">{{ recipe.prepTime || $t('common.notSpecified') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">{{ $t('common.cookTime') }}:</span>
                <span class="font-medium text-gray-900">{{ recipe.cookTime || $t('common.notSpecified') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">{{ $t('common.servings') }}:</span>
                <span class="font-medium text-gray-900">{{ recipe.servings || $t('common.notSpecified') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">{{ $t('common.difficulty') }}:</span>
                <span class="font-medium text-gray-900">{{ recipe.difficulty || $t('common.notSpecified') }}</span>
              </div>
            </div>
          </div>

          <!-- Lista di tutti gli step -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 class="text-lg font-bold mb-3 text-gray-900">
              {{ $t('cookingMode.allSteps') }}
            </h3>
            
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <div 
                v-for="(step, index) in recipe.instructions" 
                :key="index"
                class="p-2 rounded-lg cursor-pointer transition-all"
                :class="index === currentStep 
                  ? 'bg-primary-100 border border-primary-300' 
                  : index < currentStep 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-gray-50 border border-gray-200 hover:border-gray-300'"
                @click="goToStep(index)"
              >
                <div class="flex items-start space-x-2">
                  <span class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        :class="index === currentStep 
                          ? 'bg-primary-500 text-white' 
                          : index < currentStep 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-300 text-gray-600'"
                  >
                    <CheckCircle v-if="index < currentStep" class="h-3 w-3" />
                    <span v-else>{{ index + 1 }}</span>
                  </span>
                  <p class="text-xs text-gray-700 leading-relaxed">{{ step }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop Layout -->
      <div class="hidden lg:grid grid-cols-3 gap-6">
        
        <!-- Colonna sinistra: Lista ingredienti -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-bold mb-4 text-gray-900 flex items-center">
            <CheckSquare class="h-6 w-6 mr-2 text-primary-600" />
            {{ $t('cookingMode.ingredients') }}
          </h2>
          
          <div class="space-y-3">
            <div 
              v-for="(ingredient, index) in recipe.ingredients" 
              :key="index"
              class="flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer"
              :class="checkedIngredients[index] 
                ? 'bg-primary-50 border-primary-200' 
                : 'bg-gray-50 border-gray-200 hover:border-gray-300'"
              @click="toggleIngredient(index)"
            >
              <div 
                class="w-6 h-6 rounded border-2 flex items-center justify-center transition-all"
                :class="checkedIngredients[index] 
                  ? 'bg-primary-500 border-primary-500' 
                  : 'border-gray-300'"
              >
                <Check v-if="checkedIngredients[index]" class="h-4 w-4 text-white" />
              </div>
              <span 
                class="text-lg leading-relaxed transition-all"
                :class="checkedIngredients[index] 
                  ? 'line-through text-gray-500' 
                  : 'text-gray-900'"
              >
                {{ ingredient }}
              </span>
            </div>
          </div>

          <!-- Progresso ingredienti -->
          <div class="mt-6 p-4 bg-gray-50 rounded-lg">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-700">
                {{ $t('cookingMode.ingredientsProgress') }}
              </span>
              <span class="text-sm font-bold text-primary-600">
                {{ checkedIngredientsCount }}/{{ recipe.ingredients.length }}
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div 
                class="bg-primary-500 h-3 rounded-full transition-all duration-300"
                :style="{ width: ingredientsProgress + '%' }"
              ></div>
            </div>
            
            <!-- Auto-start timer quando tutti gli ingredienti sono controllati -->
            <div v-if="allIngredientsChecked && !stepTimerActive && !hasStartedCooking" 
                 class="mt-3 p-3 bg-primary-50 border border-primary-200 rounded-lg">
              <div class="flex items-center justify-between">
                <span class="text-sm text-primary-700 font-medium">
                  {{ $t('cookingMode.allIngredientsReady') }}
                </span>
                <Button
                  @click="startCookingProcess"
                  size="sm"
                  class="bg-primary-600 hover:bg-primary-700 text-white"
                >
                  {{ $t('cookingMode.startCooking') }}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Colonna centrale: Step corrente -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6" 
             @touchstart="handleTouchStart" 
             @touchend="handleTouchEnd">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900">
              {{ $t('cookingMode.currentStep') }}
            </h2>
            <div class="flex items-center space-x-2">
              <span class="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                {{ currentStep + 1 }} / {{ recipe.instructions.length }}
              </span>
            </div>
          </div>

          <!-- Barra di progresso generale -->
          <div class="mb-6">
            <div class="w-full bg-gray-200 rounded-full h-4">
              <div 
                class="bg-primary-500 h-4 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                :style="{ width: overallProgress + '%' }"
              >
                <span class="text-xs font-bold text-white" v-if="overallProgress > 15">
                  {{ Math.round(overallProgress) }}%
                </span>
              </div>
            </div>
          </div>

          <!-- Contenuto dello step corrente -->
          <div class="mb-6">
            <div class="bg-primary-50 border-l-4 border-primary-500 p-6 rounded-r-lg relative">
              <p class="text-xl leading-relaxed text-gray-900 font-medium">
                {{ recipe.instructions[currentStep] }}
              </p>
            </div>
          </div>

          <!-- Timer dello step -->
          <div class="mb-6 p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-medium text-gray-700">
                {{ $t('cookingMode.stepTimer') }}
              </span>
              <div class="flex space-x-2">
                <Button
                  @click="addStepTime(60)"
                  variant="ghost"
                  size="sm"
                  class="text-xs"
                >
                  +1{{ $t('cookingMode.min') }}
                </Button>
                <Button
                  @click="addStepTime(300)"
                  variant="ghost"
                  size="sm"
                  class="text-xs"
                >
                  +5{{ $t('cookingMode.min') }}
                </Button>
              </div>
            </div>
            
            <div class="text-center">
              <div class="text-4xl font-mono font-bold mb-2"
                   :class="stepTimer <= 10 && stepTimer > 0 
                     ? 'text-red-600 animate-pulse' 
                     : 'text-primary-600'"
              >
                {{ formatTime(stepTimer) }}
              </div>
              
              <div class="flex justify-center space-x-3">
                <Button
                  @click="startStepTimer"
                  v-if="!stepTimerActive"
                  variant="default"
                  size="lg"
                  class="bg-primary-600 hover:bg-primary-700"
                >
                  <Play class="h-5 w-5 mr-2" />
                  {{ $t('cookingMode.startTimer') }}
                </Button>
                
                <Button
                  @click="pauseStepTimer"
                  v-if="stepTimerActive"
                  variant="secondary"
                  size="lg"
                >
                  <Pause class="h-5 w-5 mr-2" />
                  {{ $t('cookingMode.pauseTimer') }}
                </Button>
                
                <Button
                  @click="resetStepTimer"
                  variant="ghost"
                  size="lg"
                >
                  <RotateCcw class="h-5 w-5 mr-2" />
                  {{ $t('cookingMode.resetTimer') }}
                </Button>
              </div>
            </div>
          </div>

          <!-- Navigazione step -->
          <div class="flex justify-between">
            <Button
              @click="previousStep"
              :disabled="currentStep === 0"
              variant="secondary"
              size="lg"
              class="px-8"
            >
              <ChevronLeft class="h-5 w-5 mr-2" />
              {{ $t('cookingMode.previous') }}
            </Button>
            
            <Button
              @click="nextStep"
              v-if="currentStep < recipe.instructions.length - 1"
              variant="default"
              size="lg"
              class="px-8 bg-primary-600 hover:bg-primary-700"
            >
              {{ $t('cookingMode.next') }}
              <ChevronRight class="h-5 w-5 ml-2" />
            </Button>
            
            <Button
              @click="completeCooking"
              v-if="currentStep === recipe.instructions.length - 1"
              variant="default"
              size="lg"
              class="px-8 bg-primary-600 hover:bg-primary-700"
            >
              <CheckCircle class="h-5 w-5 mr-2" />
              {{ $t('cookingMode.complete') }}
            </Button>
          </div>
        </div>

        <!-- Colonna destra: Overview e controlli -->
        <div class="space-y-6">
          <!-- Informazioni ricetta -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-bold mb-4 text-gray-900">
              {{ $t('cookingMode.recipeInfo') }}
            </h3>
            
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">{{ $t('common.prepTime') }}:</span>
                <span class="font-medium text-gray-900">{{ recipe.prepTime || $t('common.notSpecified') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">{{ $t('common.cookTime') }}:</span>
                <span class="font-medium text-gray-900">{{ recipe.cookTime || $t('common.notSpecified') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">{{ $t('common.servings') }}:</span>
                <span class="font-medium text-gray-900">{{ recipe.servings || $t('common.notSpecified') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">{{ $t('common.difficulty') }}:</span>
                <span class="font-medium text-gray-900">{{ recipe.difficulty || $t('common.notSpecified') }}</span>
              </div>
            </div>
          </div>

          <!-- Lista di tutti gli step -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-bold mb-4 text-gray-900">
              {{ $t('cookingMode.allSteps') }}
            </h3>
            
            <div class="space-y-2 max-h-96 overflow-y-auto">
              <div 
                v-for="(step, index) in recipe.instructions" 
                :key="index"
                class="p-3 rounded-lg cursor-pointer transition-all"
                :class="index === currentStep 
                  ? 'bg-primary-100 border border-primary-300' 
                  : index < currentStep 
                    ? 'bg-primary-50 border border-primary-200'
                    : 'bg-gray-50 border border-gray-200 hover:border-gray-300'"
                @click="goToStep(index)"
              >
                <div class="flex items-start space-x-3">
                  <div 
                    class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-1"
                    :class="index === currentStep 
                      ? 'bg-primary-500 text-white' 
                      : index < currentStep 
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-300 text-gray-700'"
                  >
                    <Check v-if="index < currentStep" class="h-3 w-3" />
                    <span v-else>{{ index + 1 }}</span>
                  </div>
                  <p class="text-sm leading-relaxed"
                     :class="index === currentStep 
                       ? 'text-gray-900 font-medium' 
                       : index < currentStep 
                         ? 'text-gray-600'
                         : 'text-gray-700'"
                  >
                    {{ step }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notifiche audio/visuali -->
    <div 
      v-if="showTimerNotification"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="dismissNotification"
    >
      <div class="bg-white rounded-xl p-8 shadow-2xl text-center max-w-md mx-4 animate-bounce">
        <div class="text-6xl mb-4">⏰</div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">
          {{ $t('cookingMode.timerFinished') }}
        </h3>
        <p class="text-gray-600 mb-6">
          {{ $t('cookingMode.stepCompleted') }}
        </p>
        <Button
          @click="dismissNotification"
          variant="default"
          size="lg"
          class="bg-primary-600 hover:bg-primary-700"
        >
          {{ $t('cookingMode.continue') }}
        </Button>
      </div>
    </div>

    <!-- Modale di conferma uscita -->
    <div 
      v-if="showExitModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showExitModal = false"
    >
      <div class="bg-white rounded-xl p-8 shadow-2xl text-center max-w-md mx-4" @click.stop>
        <div class="mb-6">
          <h2 class="text-3xl font-bold text-primary-600 mb-2">FridgeWiseAI</h2>
          <div class="w-12 h-0.5 bg-primary-600 mx-auto"></div>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">
          {{ $t('cookingMode.exitConfirmTitle') }}
        </h3>
        <p class="text-gray-600 mb-6">
          {{ $t('cookingMode.exitConfirmMessage') }}
        </p>
        <div class="flex space-x-3 justify-center">
          <Button
            @click="showExitModal = false"
            variant="secondary"
            size="lg"
            class="px-6"
          >
            {{ $t('common.cancel') }}
          </Button>
          <Button
            @click="confirmExit"
            variant="default"
            size="lg"
            class="px-6 bg-red-600 hover:bg-red-700 text-white"
          >
            {{ $t('cookingMode.exitConfirm') }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Audio placeholder - no actual files needed -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/Button.vue'
import { 
  ArrowLeft, 
  CheckSquare, 
  Check, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle 
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// Props dalla rotta
const recipe = ref({
  name: '',
  ingredients: [],
  instructions: [],
  prepTime: '',
  cookTime: '',
  servings: '',
  difficulty: ''
})

// State per la navigazione degli step
const currentStep = ref(0)

// State per la checklist ingredienti
const checkedIngredients = ref([])

// Timer totale
const totalElapsedTime = ref(0)
const totalTimerInterval = ref(null)

// Timer per step
const stepTimer = ref(0)
const stepTimerActive = ref(false)
const stepTimerInterval = ref(null)
const stepTimerInitialTime = ref(300) // 5 minuti default

// Notifiche
const showTimerNotification = ref(false)

// Stato per il cooking process
const hasStartedCooking = ref(false)

// Stato per il modale di uscita
const showExitModal = ref(false)

// Mobile tab navigation
const activeTab = ref('step')

// Computed properties
const checkedIngredientsCount = computed(() => {
  return checkedIngredients.value.filter(checked => checked).length
})

const ingredientsProgress = computed(() => {
  return recipe.value.ingredients.length > 0 
    ? (checkedIngredientsCount.value / recipe.value.ingredients.length) * 100 
    : 0
})

const overallProgress = computed(() => {
  return recipe.value.instructions.length > 0 
    ? ((currentStep.value + 1) / recipe.value.instructions.length) * 100 
    : 0
})

const allIngredientsChecked = computed(() => {
  return recipe.value.ingredients.length > 0 && 
         checkedIngredientsCount.value === recipe.value.ingredients.length
})

// Metodi per gestire i timer
const formatTime = (seconds) => {
  const mins = Math.floor(Math.abs(seconds) / 60)
  const secs = Math.abs(seconds) % 60
  const sign = seconds < 0 ? '-' : ''
  return `${sign}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const startTotalTimer = () => {
  if (totalTimerInterval.value) return
  
  totalTimerInterval.value = setInterval(() => {
    totalElapsedTime.value += 1
  }, 1000)
}

const stopTotalTimer = () => {
  if (totalTimerInterval.value) {
    clearInterval(totalTimerInterval.value)
    totalTimerInterval.value = null
  }
}

const startStepTimer = () => {
  if (stepTimer.value <= 0) {
    stepTimer.value = stepTimerInitialTime.value
  }
  
  stepTimerActive.value = true
  stepTimerInterval.value = setInterval(() => {
    stepTimer.value -= 1
    
    if (stepTimer.value <= 0) {
      pauseStepTimer()
      showTimerNotification.value = true
      playTimerSound()
    }
  }, 1000)
}

const pauseStepTimer = () => {
  stepTimerActive.value = false
  if (stepTimerInterval.value) {
    clearInterval(stepTimerInterval.value)
    stepTimerInterval.value = null
  }
}

const resetStepTimer = () => {
  pauseStepTimer()
  stepTimer.value = stepTimerInitialTime.value
}

const addStepTime = (seconds) => {
  stepTimer.value += seconds
}

const playTimerSound = () => {
  try {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Create a pleasant notification beep
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
  } catch (error) {
    console.warn('Could not play timer sound:', error)
    // Fallback: use browser notification API if available
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(t('cookingMode.timerFinished'), {
        body: t('cookingMode.stepCompleted'),
        icon: '/favicon.ico'
      })
    }
  }
}

const dismissNotification = () => {
  showTimerNotification.value = false
}

const startCookingProcess = () => {
  hasStartedCooking.value = true
  startStepTimer()
}

// Metodi per la navigazione
const nextStep = () => {
  if (currentStep.value < recipe.value.instructions.length - 1) {
    currentStep.value += 1
    resetStepTimer()
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value -= 1
    resetStepTimer()
  }
}

const goToStep = (stepIndex) => {
  currentStep.value = stepIndex
  resetStepTimer()
}

// Metodi per ingredienti
const toggleIngredient = (index) => {
  checkedIngredients.value[index] = !checkedIngredients.value[index]
}

// Metodi per completamento
const completeCooking = () => {
  stopTotalTimer()
  pauseStepTimer()
  
  // Mostra un messaggio di completamento e torna alla pagina precedente
  router.push({ 
    name: 'SavedRecipes',
    query: { 
      message: t('cookingMode.cookingCompleted'),
      cookingTime: formatTime(totalElapsedTime.value)
    }
  })
}

const exitCookingMode = () => {
  showExitModal.value = true
}

const confirmExit = () => {
  stopTotalTimer()
  pauseStepTimer()
  showExitModal.value = false
  router.go(-1)
}

// Lifecycle
onMounted(() => {
  // Carica la ricetta dai parametri della rotta
  if (route.params.recipe) {
    try {
      const rawRecipe = JSON.parse(decodeURIComponent(route.params.recipe))
      
      // Normalizza il formato della ricetta per compatibilità
      recipe.value = {
        name: rawRecipe.title || rawRecipe.name || 'Recipe',
        ingredients: normalizeIngredients(rawRecipe.ingredients || []),
        instructions: normalizeInstructions(rawRecipe.instructions || []),
        prepTime: rawRecipe.prepTime || rawRecipe.cookingTime?.prep || '',
        cookTime: rawRecipe.cookTime || rawRecipe.cookingTime?.cook || rawRecipe.cookingTime?.total || '',
        servings: rawRecipe.servings || '',
        difficulty: rawRecipe.difficulty || ''
      }
    } catch (error) {
      console.error('Error parsing recipe:', error)
      router.go(-1)
      return
    }
  } else {
    router.go(-1)
    return
  }
  
  // Inizializza la checklist ingredienti
  checkedIngredients.value = new Array(recipe.value.ingredients.length).fill(false)
  
  // Imposta timer iniziale basato sul tempo di cottura
  if (recipe.value.cookTime) {
    const cookTimeStr = String(recipe.value.cookTime)
    const minutes = parseInt(cookTimeStr.match(/\d+/)?.[0] || '5')
    stepTimerInitialTime.value = minutes * 60
    stepTimer.value = stepTimerInitialTime.value
  }
  
  // Avvia il timer totale
  startTotalTimer()
  
  // Richiedi permesso per le notifiche
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
  
  // Impedisci lo spegnimento dello schermo durante la cottura
  if ('wakeLock' in navigator) {
    navigator.wakeLock.request('screen').catch((err) => {
      console.warn('Could not request wake lock:', err)
    })
  }
})

// Funzioni di normalizzazione per compatibilità
const normalizeIngredients = (ingredients) => {
  if (!Array.isArray(ingredients)) return []
  
  return ingredients.map(ing => {
    if (typeof ing === 'string') return ing
    if (ing.name) return `${ing.amount || ''} ${ing.unit || ''} ${ing.name}`.trim()
    return ing.toString()
  })
}

const normalizeInstructions = (instructions) => {
  if (!Array.isArray(instructions)) return []
  
  return instructions.map(inst => {
    if (typeof inst === 'string') return inst
    if (inst.description) return inst.description
    if (inst.step) return inst.step
    return inst.toString()
  })
}

onUnmounted(() => {
  stopTotalTimer()
  pauseStepTimer()
})

// Watch per gli step cambiamenti
watch(currentStep, () => {
  // Reset timer quando si cambia step
  resetStepTimer()
})

// Watch per gli ingredienti - auto-start del timer quando tutti sono controllati
watch(allIngredientsChecked, (newValue) => {
  if (newValue && !hasStartedCooking.value && !stepTimerActive.value) {
    // Opzionale: avvio automatico dopo un breve delay per dare tempo all'utente di vedere il messaggio
    setTimeout(() => {
      if (allIngredientsChecked.value && !hasStartedCooking.value) {
        startCookingProcess()
      }
    }, 2000) // 2 secondi di delay
  }
})

// Gestione dei gesti touch per mobile
const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX
}

const handleTouchEnd = (e) => {
  const touchEndX = e.changedTouches[0].clientX
  const diffX = touchStartX.value - touchEndX
  
  // Swipe threshold
  if (Math.abs(diffX) > 50) {
    if (diffX > 0 && currentStep.value < recipe.value.instructions.length - 1) {
      // Swipe left - next step
      nextStep()
    } else if (diffX < 0 && currentStep.value > 0) {
      // Swipe right - previous step
      previousStep()
    }
  }
}

const touchStartX = ref(0)
</script>

<style scoped>
/* Animazioni personalizzate */
@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0, -8px, 0);
  }
  70% {
    transform: translate3d(0, -4px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
}

.animate-bounce {
  animation: bounce 1s ease-in-out infinite;
}

/* Stili per la modalità cucina */
.text-4xl {
  font-size: 2.5rem;
  line-height: 1;
}

/* Ottimizzazioni per touch */
@media (max-width: 1024px) {
  .grid-cols-1.lg\:grid-cols-3 {
    grid-template-columns: 1fr;
  }
  
  .text-xl {
    font-size: 1.375rem;
  }
  
  .text-4xl {
    font-size: 3rem;
  }
}

/* Miglioramenti per accessibilità */
button:focus {
  outline: 2px solid #16a34a;
  outline-offset: 2px;
}

.cursor-pointer:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Smooth transitions */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Border style consistency */
.border {
  border-width: 1px;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
</style>
