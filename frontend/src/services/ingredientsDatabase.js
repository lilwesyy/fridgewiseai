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
   * @returns {Promise<Array>} Lista di tutti gli ingredienti
   */
  async loadAllIngredients() {
    if (this.isLoaded && this.allIngredients.length > 0) {
      return this.allIngredients
    }

    try {
      console.log('🔍 Loading ingredients from backend...')
      const response = await axios.get(`${this.baseURL}/all`, {
        timeout: 10000
      })

      if (response.data && response.data.ingredients) {
        this.allIngredients = response.data.ingredients
        this.isLoaded = true
        console.log(`✅ Loaded ${this.allIngredients.length} ingredients from backend`)
        return this.allIngredients
      }

      throw new Error('Invalid response format')
    } catch (error) {
      console.error('❌ Error loading ingredients from backend:', error.message)
      // Nessun fallback - ritorna array vuoto
      return []
    }
  }

  /**
   * Cerca ingredienti che corrispondono alla query
   * @param {string} query - Testo di ricerca
   * @returns {Promise<Array>} Ingredienti corrispondenti
   */
  async searchIngredients(query) {
    if (!query || query.length < 2) {
      return []
    }

    // Controlla cache
    const cacheKey = query.toLowerCase()
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    try {
      console.log(`🔍 Searching ingredients for: "${query}"`)
      const response = await axios.get(`${this.baseURL}/search`, {
        params: { q: query },
        timeout: 5000
      })

      const results = response.data.ingredients || []
      
      // Salva in cache
      this.cache.set(cacheKey, results)
      
      console.log(`✅ Found ${results.length} ingredients for "${query}"`)
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
    this.allIngredients = []
    this.isLoaded = false
    console.log('🧹 Ingredients cache cleared')
  }
}

export default new IngredientsDatabase()