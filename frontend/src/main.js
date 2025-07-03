import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import './styles/toast.css'
import App from './App.vue'
import router from './router'
import './styles/main.css'
import { useAuthStore } from './stores/auth'
import { detectUserLanguage, saveLanguagePreference } from './services/languageDetectionService'

// Import translations
import en from './locales/en.json'
import it from './locales/it.json'
import fr from './locales/fr.json'
import de from './locales/de.json'

// Create i18n instance with temporary locale
const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: 'en', // Temporary, will be updated after detection
  fallbackLocale: 'en',
  messages: {
    en,
    it,
    fr,
    de
  }
})

// Make i18n globally accessible for stores
if (typeof window !== 'undefined') {
  window.__VUE_I18N__ = i18n
}

// Toast configuration - Design meno invasivo
const toastOptions = {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: true,
  hideProgressBar: false,
  closeButton: false,
  icon: true,
  rtl: false,
  transition: 'Vue-Toastification__slideBlurred',
  maxToasts: 3,
  newestOnTop: true,
  filterBeforeCreate: (toast, toasts) => {
    if (toasts.filter(
      t => t.type === toast.type && t.content === toast.content
    ).length !== 0) {
      return false; // Previene toast duplicati
    }
    return toast;
  }
}

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(Toast, toastOptions)

// Funzione per inizializzare la lingua
async function initializeLanguage() {
  try {
    console.log('🌍 Detecting user language...')
    const detection = await detectUserLanguage()
    
    console.log(`🌍 Language detected: ${detection.language} (source: ${detection.source}, confidence: ${detection.confidence})`)
    
    // Aggiorna la locale di i18n
    i18n.global.locale.value = detection.language
    
    // Salva la preferenza se non esisteva già
    if (detection.source !== 'localStorage') {
      saveLanguagePreference(detection.language, detection.source)
      console.log(`🌍 Language preference saved: ${detection.language}`)
    }
    
    // Log aggiuntivo per debug
    if (detection.locationData) {
      console.log(`🌍 Location data:`, {
        country: detection.locationData.country,
        city: detection.locationData.city,
        timezone: detection.locationData.timezone
      })
    }
    
  } catch (error) {
    console.error('🌍 Language detection failed:', error)
    // Fallback al comportamento precedente
    const fallbackLanguage = localStorage.getItem('selectedLanguage') || 
                            navigator.language.split('-')[0] || 'en'
    i18n.global.locale.value = fallbackLanguage
  }
}

// Initialize language and auth state before mounting
Promise.all([
  initializeLanguage(),
  useAuthStore().initializeAuth()
]).then(() => {
  console.log('🚀 App initialized successfully')
  app.mount('#app')
}).catch(error => {
  console.error('🚀 Failed to initialize app:', error)
  // Mount anyway with defaults
  app.mount('#app')
})
