/**
 * Servizio per il rilevamento automatico della lingua basato su IP
 */

// Mappa dei codici paese ISO 3166-1 alpha-2 alle lingue supportate
const COUNTRY_TO_LANGUAGE = {
  // Italiano
  'IT': 'it',
  'SM': 'it', // San Marino
  'VA': 'it', // Vaticano
  'CH': 'it', // Svizzera (multilingue, ma includiamo l'italiano)
  
  // Francese
  'FR': 'fr',
  'BE': 'fr', // Belgio (multilingue)
  'LU': 'fr', // Lussemburgo (multilingue)
  'MC': 'fr', // Monaco
  'CA': 'fr', // Canada (multilingue)
  'CH': 'fr', // Svizzera (sovrascrive l'italiano - gestiremo meglio dopo)
  
  // Tedesco
  'DE': 'de',
  'AT': 'de', // Austria
  'LI': 'de', // Liechtenstein
  
  // Inglese (default)
  'US': 'en',
  'GB': 'en',
  'AU': 'en',
  'NZ': 'en',
  'IE': 'en',
  'ZA': 'en',
  'IN': 'en',
  'SG': 'en',
}

// Lingue supportate dalla nostra app
const SUPPORTED_LANGUAGES = ['en', 'it', 'fr', 'de']

/**
 * Rileva la posizione dell'utente tramite IP usando un servizio gratuito
 */
async function detectLocationByIP() {
  try {
    // Utilizziamo ipapi.co che fornisce 1000 richieste gratuite al giorno
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch location data')
    }

    const data = await response.json()
    return {
      country: data.country_code,
      region: data.region,
      city: data.city,
      timezone: data.timezone,
      success: true
    }
  } catch (error) {
    console.warn('Failed to detect location by IP:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Determina la lingua migliore basata sui dati di geolocalizzazione
 */
function getLanguageFromLocation(locationData) {
  if (!locationData.success || !locationData.country) {
    return null
  }

  const country = locationData.country.toUpperCase()
  const language = COUNTRY_TO_LANGUAGE[country]

  // Verifica che la lingua sia supportata
  if (language && SUPPORTED_LANGUAGES.includes(language)) {
    return language
  }

  return null
}

/**
 * Rileva la lingua preferita dell'utente usando varie strategie
 */
export async function detectUserLanguage() {
  // 1. Controlla se esiste già una preferenza salvata
  const savedLanguage = localStorage.getItem('selectedLanguage')
  if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
    return {
      language: savedLanguage,
      source: 'localStorage',
      confidence: 'high'
    }
  }

  // 2. Prova il rilevamento tramite IP
  try {
    const locationData = await detectLocationByIP()
    const languageFromIP = getLanguageFromLocation(locationData)
    
    if (languageFromIP) {
      return {
        language: languageFromIP,
        source: 'ip-geolocation',
        confidence: 'high',
        locationData
      }
    }
  } catch (error) {
    console.warn('IP-based language detection failed:', error)
  }

  // 3. Fallback al browser language
  const browserLanguage = navigator.language.split('-')[0]
  if (SUPPORTED_LANGUAGES.includes(browserLanguage)) {
    return {
      language: browserLanguage,
      source: 'browser',
      confidence: 'medium'
    }
  }

  // 4. Fallback alle lingue accettate dal browser
  const acceptedLanguages = navigator.languages || [navigator.language]
  for (const lang of acceptedLanguages) {
    const langCode = lang.split('-')[0]
    if (SUPPORTED_LANGUAGES.includes(langCode)) {
      return {
        language: langCode,
        source: 'browser-accepted',
        confidence: 'medium'
      }
    }
  }

  // 5. Default a inglese
  return {
    language: 'en',
    source: 'default',
    confidence: 'low'
  }
}

/**
 * Salva la preferenza di lingua nel localStorage e nei cookie
 */
export function saveLanguagePreference(language, source = 'user') {
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    console.warn(`Language ${language} is not supported`)
    return false
  }

  try {
    // Salva nel localStorage per persistenza a lungo termine
    localStorage.setItem('selectedLanguage', language)
    
    // Salva nei cookie per il rilevamento lato server (scade in 1 anno)
    const expirationDate = new Date()
    expirationDate.setFullYear(expirationDate.getFullYear() + 1)
    document.cookie = `language=${language}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`
    
    // Salva metadata per analytics
    const metadata = {
      language,
      source,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    }
    localStorage.setItem('languageDetectionMetadata', JSON.stringify(metadata))
    
    return true
  } catch (error) {
    console.error('Failed to save language preference:', error)
    return false
  }
}

/**
 * Ottiene la preferenza di lingua corrente
 */
export function getCurrentLanguage() {
  return localStorage.getItem('selectedLanguage') || 'en'
}

/**
 * Ottiene i metadata del rilevamento lingua
 */
export function getLanguageDetectionMetadata() {
  try {
    const metadata = localStorage.getItem('languageDetectionMetadata')
    return metadata ? JSON.parse(metadata) : null
  } catch (error) {
    console.error('Failed to parse language detection metadata:', error)
    return null
  }
}

/**
 * Verifica se la lingua è stata rilevata automaticamente o scelta dall'utente
 */
export function isLanguageAutoDetected() {
  const metadata = getLanguageDetectionMetadata()
  return metadata && ['ip-geolocation', 'browser', 'browser-accepted', 'default'].includes(metadata.source)
}
