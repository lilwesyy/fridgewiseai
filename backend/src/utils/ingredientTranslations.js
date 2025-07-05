import axios from 'axios'

/**
 * Sistema di traduzione ingredienti usando MyMemory API gratuita
 */

// Cache per traduzioni
const translationCache = new Map()
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 ore


/**
 * Traduce un ingrediente inglese nella lingua specificata
 * @param {string} englishName - Nome inglese dell'ingrediente
 * @param {string} targetLang - Lingua di destinazione (it, fr, de, es)
 * @returns {Promise<string>} Nome tradotto
 */
export async function translateIngredient(englishName, targetLang = 'it') {
  // Se è inglese, ritorna direttamente
  if (targetLang === 'en') {
    return englishName
  }

  // 1. Controlla cache
  const cacheKey = `${englishName}_${targetLang}`
  const cached = translationCache.get(cacheKey)
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    console.log(`💾 Cached translation: ${englishName} → ${cached.translation} (${targetLang})`)
    return cached.translation
  }

  // 2. Prova traduzione con retry logic
  try {
    const translation = await translateWithRetry(englishName, 'en', targetLang, 2)
    
    // Salva in cache
    translationCache.set(cacheKey, {
      translation,
      timestamp: Date.now()
    })
    
    console.log(`✅ Translated: ${englishName} → ${translation} (${targetLang})`)
    return translation
  } catch (error) {
    console.warn(`❌ Translation failed for "${englishName}":`, error.message)
    // Fallback: ritorna nome inglese
    return englishName
  }
}

/**
 * Traduce con retry logic per gestire timeout
 * @param {string} text - Testo da tradurre
 * @param {string} sourceLang - Lingua sorgente  
 * @param {string} targetLang - Lingua destinazione
 * @param {number} maxRetries - Numero massimo di tentativi
 * @returns {Promise<string>} Testo tradotto
 */
async function translateWithRetry(text, sourceLang = 'en', targetLang = 'it', maxRetries = 2) {
  let lastError = null
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const timeout = Math.min(3000 + (attempt * 1000), 8000) // Timeout crescente: 4s, 5s, 6s...
      const translation = await translateWithAPI(text, sourceLang, targetLang, timeout)
      return translation
    } catch (error) {
      lastError = error
      console.warn(`⚠️ Translation attempt ${attempt}/${maxRetries} failed for "${text}":`, error.message)
      
      if (attempt < maxRetries) {
        const delay = attempt * 500 // Delay crescente: 500ms, 1000ms
        console.log(`⏳ Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError
}

/**
 * Chiama LibreTranslate API locale per tradurre un testo
 * @param {string} text - Testo da tradurre
 * @param {string} sourceLang - Lingua sorgente
 * @param {string} targetLang - Lingua destinazione
 * @param {number} timeout - Timeout in millisecondi
 * @returns {Promise<string>} Testo tradotto
 */
async function translateWithAPI(text, sourceLang = 'en', targetLang = 'it', timeout = 5000) {
  const url = 'http://localhost:5000/translate'
  
  const requestData = {
    q: text,
    source: sourceLang,
    target: targetLang
  }

  const response = await axios.post(url, requestData, {
    timeout,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (response.data && response.data.translatedText) {
    const translation = response.data.translatedText
    
    // Verifica che la traduzione sia valida
    if (translation && translation.toLowerCase() !== text.toLowerCase()) {
      return translation
    }
  }

  throw new Error('Invalid response from LibreTranslate API')
}

/**
 * Traduce un array di ingredienti con batching intelligente
 * @param {Array} ingredients - Array di ingredienti con nome inglese
 * @param {string} targetLang - Lingua di destinazione
 * @returns {Promise<Array>} Array di ingredienti con traduzioni
 */
export async function translateIngredients(ingredients, targetLang = 'it') {
  if (targetLang === 'en') {
    return ingredients.map(ingredient => ({
      ...ingredient,
      nameTranslated: ingredient.name
    }))
  }

  // Batch size per evitare overload
  const BATCH_SIZE = 5
  const result = []
  
  for (let i = 0; i < ingredients.length; i += BATCH_SIZE) {
    const batch = ingredients.slice(i, i + BATCH_SIZE)
    
    // Traduci batch con Promise.all ma con limite
    const translatedBatch = await Promise.all(
      batch.map(async (ingredient) => {
        const nameTranslated = await translateIngredient(ingredient.name, targetLang)
        return {
          ...ingredient,
          nameTranslated
        }
      })
    )
    
    result.push(...translatedBatch)
    
    // Piccola pausa tra i batch per non sovraccaricare l'API
    if (i + BATCH_SIZE < ingredients.length) {
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }
  
  return result
}

/**
 * Ottiene tutte le lingue supportate
 * @returns {Array} Array delle lingue supportate
 */
export function getSupportedLanguages() {
  return ['it', 'fr', 'de', 'es']
}

/**
 * Verifica se una lingua è supportata
 * @param {string} lang - Codice lingua
 * @returns {boolean} True se supportata
 */
export function isLanguageSupported(lang) {
  return getSupportedLanguages().includes(lang)
}

/**
 * Traduce una parola italiana in inglese usando API di traduzione
 * @param {string} italianName - Nome italiano dell'ingrediente
 * @returns {Promise<string|null>} Nome inglese corrispondente o null se non trovato
 */
export async function getEnglishNameFromItalian(italianName) {
  try {
    console.log(`🔄 Translating search term: "${italianName}" (it → en)`)
    const englishTranslation = await translateWithRetry(italianName, 'it', 'en', 2)
    console.log(`✅ Search translation: "${italianName}" → "${englishTranslation}"`)
    return englishTranslation
  } catch (error) {
    console.warn(`❌ Search translation failed for "${italianName}":`, error.message)
    return null
  }
}

export default {
  translateIngredient,
  translateIngredients,
  getSupportedLanguages,
  isLanguageSupported,
  getEnglishNameFromItalian
}