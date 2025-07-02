import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import './styles/main.css'

// Import translations
import en from './locales/en.json'
import it from './locales/it.json'
import fr from './locales/fr.json'
import de from './locales/de.json'

// Create i18n instance
const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: navigator.language.split('-')[0] || 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    it,
    fr,
    de
  }
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

app.mount('#app')
