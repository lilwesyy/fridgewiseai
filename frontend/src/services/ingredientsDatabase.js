import axios from 'axios'

class IngredientsDatabase {
  constructor() {
    this.baseURL = 'ingredients-database' // Rimuovi /api perché axios.defaults.baseURL lo include già
    this.cache = new Map()
    this.allIngredients = []
    this.isLoaded = false
  }

  /**
   * Carica tutti gli ingredienti tramite backend
   * @param {string} locale - Locale per le traduzioni
   * @returns {Promise<Array>} Lista di tutti gli ingredienti
   */
  async loadAllIngredients(locale = 'en') {
    const cacheKey = `all_${locale}`
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    try {
      console.log('🔍 Loading ingredients from backend...')
      const response = await axios.get(`${this.baseURL}/all`, {
        params: { locale },
        timeout: 10000
      })

      if (response.data && response.data.ingredients) {
        const ingredients = response.data.ingredients
        this.cache.set(cacheKey, ingredients)
        console.log(`✅ Loaded ${ingredients.length} ingredients from backend for ${locale}`)
        return ingredients
      }

      throw new Error('Invalid response format')
    } catch (error) {
      console.error('❌ Error loading ingredients from backend:', error.message)
      // Nessun fallback - ritorna array vuoto
      return []
    }
  }

  /**
   * Cerca ingredienti per categoria
   * @param {string} categoryName - Nome della categoria
   * @param {string} locale - Locale per le traduzioni
   * @returns {Promise<Array>} Ingredienti della categoria
   */
  async searchByCategory(categoryName, locale = 'en') {
    if (!categoryName) {
      return []
    }

    // Controlla cache
    const cacheKey = `category_${categoryName.toLowerCase()}_${locale}`
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    try {
      console.log(`🏷️ Searching ingredients by category: "${categoryName}"`)
      const response = await axios.get(`${this.baseURL}/category`, {
        params: { name: categoryName, locale }, // Rimosso refresh per non sovraccaricare API
        timeout: 5000
      })

      const results = response.data.ingredients || []
      
      // Salva in cache
      this.cache.set(cacheKey, results)
      
      console.log(`✅ Found ${results.length} ingredients for category "${categoryName}" (${locale})`)
      return results
    } catch (error) {
      console.error('❌ Error searching by category:', error.message)
      return []
    }
  }

  /**
   * Cerca ingredienti che corrispondono alla query
   * @param {string} query - Testo di ricerca
   * @param {string} locale - Locale per le traduzioni
   * @returns {Promise<Array>} Ingredienti corrispondenti
   */
  async searchIngredients(query, locale = 'en') {
    if (!query || query.length < 2) {
      return []
    }

    // Controlla cache
    const cacheKey = `${query.toLowerCase()}_${locale}`
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    try {
      console.log(`🔍 Searching ingredients for: "${query}"`)
      const response = await axios.get(`${this.baseURL}/search`, {
        params: { q: query, locale },
        timeout: 5000
      })

      const results = response.data.ingredients || []
      
      // Salva in cache
      this.cache.set(cacheKey, results)
      
      console.log(`✅ Found ${results.length} ingredients for "${query}" (${locale})`)
      return results
    } catch (error) {
      console.error('❌ Error searching ingredients:', error.message)
      return []
    }
  }

// Le traduzioni sono ora gestite dal backend

// Nessun fallback nel frontend - il database è obbligatorio

  /**
   * Pulisce la cache (utile per test o refresh)
   */
  clearCache() {
    this.cache.clear()
    console.log('🧹 Ingredients cache cleared')
  }
}

export default new IngredientsDatabase()