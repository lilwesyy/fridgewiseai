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
  // Controlla cache
  const cacheKey = `${englishName}_${targetLang}`
  const cached = translationCache.get(cacheKey)
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    console.log(`💾 Cached translation: ${englishName} → ${cached.translation} (${targetLang})`)
    return cached.translation
  }

  try {
    console.log(`🌐 Translating: "${englishName}" to ${targetLang}`)
    const translation = await translateWithAPI(englishName, 'en', targetLang)
    
    // Salva in cache
    translationCache.set(cacheKey, {
      translation,
      timestamp: Date.now()
    })
    
    console.log(`✅ Translation success: ${englishName} → ${translation} (${targetLang})`)
    return translation
  } catch (error) {
    console.warn(`❌ Translation failed for "${englishName}":`, error.message)
    return englishName
  }
}

/**
 * Chiama MyMemory API per tradurre un testo (gratuita)
 * @param {string} text - Testo da tradurre
 * @param {string} sourceLang - Lingua sorgente
 * @param {string} targetLang - Lingua destinazione
 * @returns {Promise<string>} Testo tradotto
 */
async function translateWithAPI(text, sourceLang = 'en', targetLang = 'it') {
  const langPair = `${sourceLang}|${targetLang}`
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`

  const response = await axios.get(url, {
    timeout: 5000,
    headers: {
      'User-Agent': 'FridgeWiseAI/1.0'
    }
  })

  if (response.data && response.data.responseData && response.data.responseData.translatedText) {
    const translation = response.data.responseData.translatedText
    
    // Verifica che la traduzione sia valida (non sia uguale al testo originale o errore)
    if (translation.toLowerCase() !== text.toLowerCase() && !translation.includes('MYMEMORY WARNING')) {
      return translation
    }
  }

  throw new Error('Invalid response from MyMemory API')
}

/**
 * Traduce un array di ingredienti (versione async)
 * @param {Array} ingredients - Array di ingredienti con nome inglese
 * @param {string} targetLang - Lingua di destinazione
 * @returns {Promise<Array>} Array di ingredienti con traduzioni
 */
export async function translateIngredients(ingredients, targetLang = 'it') {
  const translatedIngredients = await Promise.all(
    ingredients.map(async (ingredient) => {
      const nameTranslated = await translateIngredient(ingredient.name, targetLang)
      return {
        ...ingredient,
        nameTranslated
      }
    })
  )
  
  return translatedIngredients
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
    const englishTranslation = await translateWithAPI(italianName, 'it', 'en')
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