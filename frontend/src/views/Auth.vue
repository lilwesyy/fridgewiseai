<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col justify-center py-12 px-4 overflow-hidden">
    <div class="max-w-md mx-auto w-full">
      <!-- Logo with entrance animation -->
      <div class="text-center mb-8 animate-fade-in-down">
        <div class="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl mx-auto flex items-center justify-center shadow-lg mb-4 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
          <svg class="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 animate-fade-in">{{ t('app.name') }}</h1>
        <p class="text-gray-600 mt-2 animate-fade-in-up">{{ t('app.tagline') }}</p>
      </div>

      <!-- Auth Forms with container animation -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6 transform animate-slide-up hover:shadow-2xl transition-all duration-500">
        <!-- Tab Switcher with improved animations -->
        <div class="flex rounded-xl bg-gray-100/80 p-1 mb-6 relative overflow-hidden">
          <div 
            class="absolute top-1 bottom-1 bg-white rounded-lg shadow-sm transition-all duration-300 ease-out"
            :style="{ 
              left: activeTab === 'login' ? '4px' : '50%', 
              right: activeTab === 'login' ? '50%' : '4px' 
            }"
          ></div>
          <button 
            @click="switchTab('login')"
            :class="[
              'flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 relative z-10 transform hover:scale-105',
              activeTab === 'login' 
                ? 'text-gray-900' 
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            <span class="flex items-center justify-center space-x-2 h-5">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
              </svg>
              <span>{{ t('auth.login') }}</span>
            </span>
          </button>
          <button 
            @click="switchTab('register')"
            :class="[
              'flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 relative z-10 transform hover:scale-105',
              activeTab === 'register' 
                ? 'text-gray-900' 
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            <span class="flex items-center justify-center space-x-2 h-5">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
              <span>{{ t('auth.register') }}</span>
            </span>
          </button>
        </div>

        <!-- Forms with transition animation -->
        <Transition name="form" mode="out-in">
          <!-- Login Form -->
          <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-6" key="login">
            <div class="space-y-4">
              <div class="animate-slide-in-right" style="animation-delay: 0.1s">
                <BaseInput
                  id="login-email"
                  v-model="loginForm.email"
                  type="email"
                  :label="t('auth.email')"
                  :placeholder="t('auth.email')"
                  :error="loginErrors.email"
                  required
                  class="transform hover:scale-[1.02] transition-transform duration-200"
                />
              </div>

              <div class="animate-slide-in-right" style="animation-delay: 0.2s">
                <BaseInput
                  id="login-password"
                  v-model="loginForm.password"
                  type="password"
                  :label="t('auth.password')"
                  :placeholder="t('auth.password')"
                  :error="loginErrors.password"
                  required
                  class="transform hover:scale-[1.02] transition-transform duration-200"
                />
              </div>
            </div>

            <div class="animate-slide-in-up" style="animation-delay: 0.3s">
              <BaseButton
                type="submit"
                variant="primary"
                :full-width="true"
                :loading="authStore.loading"
                :disabled="!isLoginFormValid"
                class="transform hover:scale-105 active:scale-95 transition-all duration-200 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
              >
                <div class="flex items-center justify-center space-x-2">
                  <svg v-if="!authStore.loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                  </svg>
                  <span>{{ t('auth.login') }}</span>
                </div>
              </BaseButton>
            </div>

            <Transition name="error">
              <div v-if="authStore.error" class="text-sm text-red-600 text-center bg-red-50 p-3 rounded-lg border border-red-200 animate-shake">
                {{ authStore.error }}
              </div>
            </Transition>
          </form>

          <!-- Register Form -->
          <form v-else @submit.prevent="handleRegister" class="space-y-6" key="register">
            <div class="space-y-4">
              <div class="animate-slide-in-left" style="animation-delay: 0.1s">
                <BaseInput
                  id="register-name"
                  v-model="registerForm.name"
                  type="text"
                  :label="t('auth.name')"
                  :placeholder="t('auth.name')"
                  :error="registerErrors.name"
                  required
                  class="transform hover:scale-[1.02] transition-transform duration-200"
                />
              </div>

              <div class="animate-slide-in-left" style="animation-delay: 0.2s">
                <BaseInput
                  id="register-email"
                  v-model="registerForm.email"
                  type="email"
                  :label="t('auth.email')"
                  :placeholder="t('auth.email')"
                  :error="registerErrors.email"
                  required
                  class="transform hover:scale-[1.02] transition-transform duration-200"
                />
              </div>

              <div class="animate-slide-in-left" style="animation-delay: 0.3s">
                <BaseInput
                  id="register-password"
                  v-model="registerForm.password"
                  type="password"
                  :label="t('auth.password')"
                  :placeholder="t('auth.password')"
                  :error="registerErrors.password"
                  required
                  class="transform hover:scale-[1.02] transition-transform duration-200"
                />
              </div>

              <div class="animate-slide-in-left" style="animation-delay: 0.4s">
                <BaseInput
                  id="register-confirm-password"
                  v-model="registerForm.confirmPassword"
                  type="password"
                  :label="t('auth.confirmPassword')"
                  :placeholder="t('auth.confirmPassword')"
                  :error="registerErrors.confirmPassword"
                  required
                  class="transform hover:scale-[1.02] transition-transform duration-200"
                />
              </div>

              <!-- Honeypot field - hidden from users but visible to bots -->
              <div class="hidden">
                <input
                  type="text"
                  name="website"
                  v-model="registerForm.honeypot"
                  tabindex="-1"
                  autocomplete="off"
                />
              </div>

              <!-- Math CAPTCHA -->
              <div class="animate-slide-in-left" style="animation-delay: 0.45s">
                <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ t('auth.securityCheck') }}
                  </label>
                  <div class="flex items-center space-x-3">
                    <span class="text-lg font-mono bg-white px-3 py-2 rounded border">
                      {{ mathCaptcha.question }}
                    </span>
                    <span class="text-lg">=</span>
                    <BaseInput
                      id="captcha-answer"
                      v-model="registerForm.captchaAnswer"
                      type="number"
                      :placeholder="t('auth.enterAnswer')"
                      :error="registerErrors.captchaAnswer"
                      required
                      class="w-20"
                      @input="validateCaptcha"
                    />
                    <button
                      type="button"
                      @click="generateMathCaptcha"
                      class="text-primary-600 hover:text-primary-700 p-1"
                      :title="t('auth.refreshCaptcha')"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Terms and Privacy checkbox -->
              <div class="animate-slide-in-left" style="animation-delay: 0.5s">
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="registerForm.acceptTerms"
                    class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 flex-shrink-0"
                    required
                  />
                  <span class="text-sm text-gray-600 leading-relaxed">
                    {{ t('auth.acceptTerms') }}
                    <a href="#" class="text-primary-600 hover:text-primary-700 underline">
                      {{ t('auth.termsOfService') }}
                    </a>
                    {{ t('auth.and') }}
                    <a href="#" class="text-primary-600 hover:text-primary-700 underline">
                      {{ t('auth.privacyPolicy') }}
                    </a>
                  </span>
                </label>
                <div v-if="registerErrors.acceptTerms" class="text-sm text-red-600 mt-1">
                  {{ registerErrors.acceptTerms }}
                </div>
              </div>
            </div>

            <div class="animate-slide-in-up" style="animation-delay: 0.5s">
              <BaseButton
                type="submit"
                variant="primary"
                :full-width="true"
                :loading="authStore.loading"
                :disabled="!isRegisterFormValid"
                class="transform hover:scale-105 active:scale-95 transition-all duration-200 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
              >
                <div class="flex items-center justify-center space-x-2">
                  <svg v-if="!authStore.loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                  </svg>
                  <span>{{ t('auth.register') }}</span>
                </div>
              </BaseButton>
            </div>

            <Transition name="error">
              <div v-if="authStore.error" class="text-sm text-red-600 text-center bg-red-50 p-3 rounded-lg border border-red-200 animate-shake">
                {{ authStore.error }}
              </div>
            </Transition>
          </form>
        </Transition>
      </div>

      <!-- Back to Landing with animation -->
      <div class="text-center mt-6 animate-fade-in-up" style="animation-delay: 0.6s">
        <button 
          @click="router.push('/')"
          class="text-sm text-gray-500 hover:text-primary-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto group"
        >
          <svg class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span>{{ t('auth.backToHome') }}</span>
        </button>
      </div>
    </div>

    <!-- Floating background elements -->
    <div class="fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -top-1/2 -right-1/2 w-96 h-96 bg-primary-200/20 rounded-full animate-float"></div>
      <div class="absolute -bottom-1/2 -left-1/2 w-80 h-80 bg-primary-300/20 rounded-full animate-float-delayed"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/ui/Button.vue'
import BaseInput from '@/components/ui/Input.vue'

const router = useRouter()
const { t } = useI18n()
const toast = useToast()
const authStore = useAuthStore()

// Reactive state
const activeTab = ref('login')
const loginForm = ref({
  email: '',
  password: ''
})
const registerForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  honeypot: '', // Anti-bot honeypot field
  captchaAnswer: '',
  acceptTerms: false
})
const loginErrors = ref({})
const registerErrors = ref({})

// Anti-bot measures
const mathCaptcha = ref({
  question: '',
  answer: 0
})
const formStartTime = ref(null)
const interactionCount = ref(0)
const lastSubmissionTime = ref(0)

// Rate limiting - minimum time between submissions (in milliseconds)
const RATE_LIMIT_MS = 5000 // 5 seconds
const MIN_FORM_TIME_MS = 3000 // Minimum 3 seconds to fill form
const MAX_FORM_TIME_MS = 1800000 // Maximum 30 minutes

// Computed properties
const isLoginFormValid = computed(() => {
  return loginForm.value.email && loginForm.value.password
})

const isRegisterFormValid = computed(() => {
  const passwordsMatch = registerForm.value.password === registerForm.value.confirmPassword
  const captchaValid = registerForm.value.captchaAnswer && parseInt(registerForm.value.captchaAnswer) === mathCaptcha.value.answer
  
  // Solo logga quando c'è un problema specifico
  if (registerForm.value.password && registerForm.value.confirmPassword && !passwordsMatch) {
    console.log('❌ Password mismatch:', {
      password: registerForm.value.password,
      confirmPassword: registerForm.value.confirmPassword
    })
  }
  
  return (
    registerForm.value.name &&
    registerForm.value.email &&
    registerForm.value.password &&
    registerForm.value.confirmPassword &&
    passwordsMatch &&
    captchaValid &&
    registerForm.value.acceptTerms &&
    !registerForm.value.honeypot
  )
})

// Methods
const switchTab = (tab) => {
  activeTab.value = tab
}

const handleLogin = async () => {
  loginErrors.value = {}
  authStore.clearMessages()

  // Basic validation
  if (!loginForm.value.email) {
    loginErrors.value.email = t('auth.validation.emailRequired')
    return
  }
  if (!loginForm.value.password) {
    loginErrors.value.password = t('auth.validation.passwordRequired')
    return
  }

  const result = await authStore.login(loginForm.value)
  if (result.success) {
    toast.success(t('notifications.auth.loginSuccess', { name: result.user.name }))
    router.push('/app/home')
  } else {
    // Show more specific error messages based on error code
    if (result.code === 'INVALID_CREDENTIALS') {
      loginErrors.value.email = t('auth.validation.invalidCredentials')
      loginErrors.value.password = t('auth.validation.invalidCredentials')
    } else if (result.code === 'ACCOUNT_DEACTIVATED') {
      loginErrors.value.email = t('auth.validation.accountDeactivated')
    }
  }
}

const handleRegister = async () => {
  console.log('🚀 Registration started')
  registerErrors.value = {}
  authStore.clearMessages()

  // Anti-bot validation checks
  console.log('🔍 Validating anti-bot measures...')
  if (!validateAntiBot()) {
    console.log('❌ Anti-bot validation failed')
    return
  }
  console.log('✅ Anti-bot validation passed')

  // Basic validation
  if (!registerForm.value.name) {
    registerErrors.value.name = t('auth.validation.nameRequired')
    return
  }
  if (!registerForm.value.email) {
    registerErrors.value.email = t('auth.validation.emailRequired')
    return
  }
  if (!registerForm.value.password) {
    registerErrors.value.password = t('auth.validation.passwordRequired')
    return
  }
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    registerErrors.value.confirmPassword = t('auth.validation.passwordsDoNotMatch')
    return
  }
  if (!registerForm.value.acceptTerms) {
    registerErrors.value.acceptTerms = t('auth.validation.termsRequired')
    return
  }

  const result = await authStore.register({
    name: registerForm.value.name,
    email: registerForm.value.email,
    password: registerForm.value.password
  })
  
  if (result.success) {
    toast.success(t('notifications.auth.registerSuccess'))
    router.push('/app/home')
  } else {
    // Show more specific error messages based on error code
    if (result.code === 'USER_EXISTS') {
      registerErrors.value.email = t('auth.validation.emailAlreadyExists')
    } else if (result.error) {
      // Handle validation errors if any
      toast.error(result.error)
    }
  }
  
  // Update last submission time for rate limiting
  lastSubmissionTime.value = Date.now()
}

// Anti-bot functions
const generateMathCaptcha = () => {
  // Semplifichiamo il captcha: solo addizioni con numeri piccoli (1-5)
  const num1 = Math.floor(Math.random() * 5) + 1  // 1-5
  const num2 = Math.floor(Math.random() * 5) + 1  // 1-5
  
  // Solo addizioni per mantenere semplicità
  const answer = num1 + num2
  
  mathCaptcha.value.question = `${num1} + ${num2}`
  mathCaptcha.value.answer = answer
  registerForm.value.captchaAnswer = ''
}

const validateCaptcha = () => {
  if (registerForm.value.captchaAnswer) {
    const userAnswer = parseInt(registerForm.value.captchaAnswer)
    if (userAnswer !== mathCaptcha.value.answer) {
      registerErrors.value.captchaAnswer = t('auth.validation.incorrectCaptcha')
    } else {
      registerErrors.value.captchaAnswer = ''
    }
  }
}

const validateAntiBot = () => {
  const currentTime = Date.now()
  
  console.log('📊 Anti-bot validation stats:', {
    honeypot: registerForm.value.honeypot,
    interactionCount: interactionCount.value,
    formTime: formStartTime.value ? currentTime - formStartTime.value : 0,
    captchaAnswer: registerForm.value.captchaAnswer,
    correctAnswer: mathCaptcha.value.answer
  })
  
  // 1. Honeypot check - if filled, it's likely a bot
  if (registerForm.value.honeypot) {
    console.log('❌ Honeypot filled')
    toast.error(t('auth.validation.suspiciousActivity'))
    return false
  }
  
  // 2. Rate limiting check
  if (lastSubmissionTime.value && (currentTime - lastSubmissionTime.value) < RATE_LIMIT_MS) {
    console.log('❌ Rate limit exceeded')
    registerErrors.value.general = t('auth.validation.tooManyAttempts')
    return false
  }
  
  // 3. Form completion time check
  if (formStartTime.value) {
    const formTime = currentTime - formStartTime.value
    if (formTime < MIN_FORM_TIME_MS) {
      console.log('❌ Form filled too fast:', formTime, 'ms')
      registerErrors.value.general = t('auth.validation.formTooFast')
      return false
    }
    if (formTime > MAX_FORM_TIME_MS) {
      console.log('❌ Form expired:', formTime, 'ms')
      registerErrors.value.general = t('auth.validation.formExpired')
      return false
    }
  }
  
  // 4. CAPTCHA validation
  if (!registerForm.value.captchaAnswer || parseInt(registerForm.value.captchaAnswer) !== mathCaptcha.value.answer) {
    console.log('❌ CAPTCHA failed')
    registerErrors.value.captchaAnswer = t('auth.validation.incorrectCaptcha')
    return false
  }
  
  // 5. Interaction count check (basic behavioral analysis) - TEMPORANEAMENTE DISABILITATO
  // if (interactionCount.value < 5) {
  //   console.log('❌ Insufficient interactions:', interactionCount.value)
  //   registerErrors.value.general = t('auth.validation.insufficientInteraction')
  //   return false
  // }
  console.log('⚠️ Interaction count check temporarily disabled')
  
  console.log('✅ All anti-bot checks passed')
  return true
}

const trackInteraction = () => {
  interactionCount.value++
}

const initializeForm = () => {
  formStartTime.value = Date.now()
  interactionCount.value = 0
  generateMathCaptcha()
}

// Add interaction tracking to form inputs
const addInteractionListeners = () => {
  // Track interactions on form fields
  const formInputs = ['register-name', 'register-email', 'register-password', 'register-confirm-password', 'captcha-answer']
  formInputs.forEach(id => {
    const element = document.getElementById(id)
    if (element) {
      element.addEventListener('focus', trackInteraction)
      element.addEventListener('input', trackInteraction)
    }
  })
}

// Watchers
watch(activeTab, (newTab) => {
  loginErrors.value = {}
  registerErrors.value = {}
  authStore.clearMessages()
  
  // Initialize anti-bot measures when switching to register tab
  if (newTab === 'register') {
    setTimeout(() => {
      initializeForm()
      addInteractionListeners()
    }, 100)
  }
})

// Initialize on component mount
onMounted(() => {
  if (activeTab.value === 'register') {
    initializeForm()
    setTimeout(addInteractionListeners, 100)
  }
})

onUnmounted(() => {
  // Clean up event listeners
  const formInputs = ['register-name', 'register-email', 'register-password', 'register-confirm-password', 'captcha-answer']
  formInputs.forEach(id => {
    const element = document.getElementById(id)
    if (element) {
      element.removeEventListener('focus', trackInteraction)
      element.removeEventListener('input', trackInteraction)
    }
  })
})
</script>

<style scoped>
/* Entrance Animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes floatDelayed {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(-180deg); }
}

/* Animation Classes */
.animate-fade-in-down {
  animation: fadeInDown 0.8s ease-out;
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.6s ease-out;
}

.animate-slide-in-right {
  animation: slideInRight 0.5s ease-out;
  animation-fill-mode: both;
}

.animate-slide-in-left {
  animation: slideInLeft 0.5s ease-out;
  animation-fill-mode: both;
}

.animate-slide-in-up {
  animation: slideInUp 0.5s ease-out;
  animation-fill-mode: both;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: floatDelayed 8s ease-in-out infinite;
  animation-delay: 2s;
}

/* Form Transition */
.form-enter-active,
.form-leave-active {
  transition: all 0.4s ease;
}

.form-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.form-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Error Transition */
.error-enter-active {
  transition: all 0.3s ease;
}

.error-leave-active {
  transition: all 0.3s ease;
}

.error-enter-from,
.error-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Custom backdrop blur for better browser support */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* Improved focus states */
.focus-within\:ring-2:focus-within {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

/* Hover effects for better interactivity */
.hover\:shadow-glow:hover {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}
</style>
