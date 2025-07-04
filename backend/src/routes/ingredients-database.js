import express from 'express'
import axios from 'axios'
import { translateIngredient, getEnglishNameFromItalian } from '../utils/ingredientTranslations.js'

const router = express.Router()

// Cache per ingredienti TheMealDB
let ingredientsCache = null
let cacheTimestamp = null
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 ore

/**
 * Proxy endpoint per TheMealDB ingredienti
 * GET /api/ingredients-database/search?q=query
 */
router.get('/search', async (req, res) => {
  try {
    const { q: query } = req.query

    if (!query || query.length < 2) {
      return res.json({ ingredients: [] })
    }

    console.log(`🔍 Searching ingredients for: "${query}"`)

    // Carica tutti gli ingredienti se non in cache o cache scaduta
    await loadAllIngredients()

    if (!ingredientsCache) {
      return res.status(500).json({
        error: 'Failed to load ingredients database',
        ingredients: []
      })
    }

    // Ricerca intelligente: traduce automaticamente italiano -> inglese
    const searchTerm = query.toLowerCase()
    
    // 1. Cerca la versione inglese se è stata inserita una parola italiana
    const englishEquivalent = await getEnglishNameFromItalian(query)
    
    // 2. Usa la versione inglese per la ricerca se disponibile
    const primarySearchTerm = englishEquivalent ? englishEquivalent.toLowerCase() : searchTerm
    
    console.log(`🔍 Search: "${query}" ${englishEquivalent ? `→ "${englishEquivalent}"` : '(direct)'}`)
    
    const results = ingredientsCache.filter(ingredient => {
      // Ricerca primaria: usa la versione inglese se disponibile
      const primaryMatch = ingredient.name.toLowerCase().includes(primarySearchTerm)
      
      // Ricerca secondaria: cerca anche nella versione originale e tradotta
      const nameMatch = ingredient.name.toLowerCase().includes(searchTerm)
      const nameITMatch = ingredient.nameIT.toLowerCase().includes(searchTerm)
      const descriptionMatch = ingredient.description && ingredient.description.toLowerCase().includes(searchTerm)
      
      return primaryMatch || nameMatch || nameITMatch || descriptionMatch
    }).slice(0, 20) // Limita a 20 risultati

    console.log(`✅ Found ${results.length} ingredients for "${query}"`)

    res.json({
      ingredients: results,
      count: results.length,
      query: query
    })

  } catch (error) {
    console.error('❌ Error searching ingredients:', error.message)
    res.status(500).json({
      error: 'Failed to search ingredients',
      ingredients: []
    })
  }
})

/**
 * Endpoint per ottenere tutti gli ingredienti
 * GET /api/ingredients-database/all
 */
router.get('/all', async (req, res) => {
  try {
    console.log('📦 Loading all ingredients...')

    await loadAllIngredients()

    if (!ingredientsCache) {
      return res.status(500).json({
        error: 'Failed to load ingredients database',
        ingredients: []
      })
    }

    res.json({
      ingredients: ingredientsCache,
      count: ingredientsCache.length,
      lastUpdated: cacheTimestamp
    })

  } catch (error) {
    console.error('❌ Error loading all ingredients:', error.message)
    res.status(500).json({
      error: 'Failed to load ingredients',
      ingredients: []
    })
  }
})

/**
 * Carica tutti gli ingredienti da TheMealDB
 */
async function loadAllIngredients() {
  // Controlla cache
  const now = Date.now()
  if (ingredientsCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('📋 Using cached ingredients')
    return ingredientsCache
  }

  try {
    console.log('🌐 Fetching ingredients from TheMealDB...')
    
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?i=list', {
      timeout: 10000,
      headers: {
        'User-Agent': 'FridgeWiseAI/1.0'
      }
    })

    if (response.data && response.data.meals) {
      console.log(`🔄 Processing ${response.data.meals.length} ingredients with hybrid translation...`)
      
      // Traduci tutti gli ingredienti in parallelo
      ingredientsCache = await Promise.all(
        response.data.meals.map(async (item) => {
          const nameIT = await translateIngredient(item.strIngredient, 'it')
          return {
            name: item.strIngredient,
            description: item.strDescription || '',
            nameIT: nameIT
          }
        })
      )
      
      cacheTimestamp = now
      console.log(`✅ Loaded and translated ${ingredientsCache.length} ingredients from TheMealDB`)
      return ingredientsCache
    }

    throw new Error('Invalid response format from TheMealDB')

  } catch (error) {
    console.error('❌ Error loading from TheMealDB:', error.message)
    
    // Fallback con ingredienti hardcoded
    if (!ingredientsCache) {
      console.log('🔄 Using fallback ingredients')
      ingredientsCache = getFallbackIngredients()
      cacheTimestamp = now
    }
    
    return ingredientsCache
  }
}

// Le traduzioni sono ora gestite dal sistema ibrido in utils/ingredientTranslations.js

/**
 * Ingredienti di fallback
 */
function getFallbackIngredients() {
  const fallbackList = [
    'Pomodori', 'Cipolle', 'Aglio', 'Basilico', 'Origano', 'Mozzarella', 'Parmigiano',
    'Olio d\'oliva', 'Sale', 'Pepe', 'Carote', 'Sedano', 'Prezzemolo', 'Rosmarino',
    'Salvia', 'Timo', 'Peperoni', 'Zucchine', 'Melanzane', 'Spinaci', 'Rucola',
    'Lattuga', 'Cetrioli', 'Pomodorini', 'Funghi', 'Patate', 'Pasta', 'Riso',
    'Pane', 'Uova', 'Latte', 'Burro', 'Yogurt', 'Prosciutto', 'Salame', 'Tonno',
    'Salmone', 'Pollo', 'Manzo', 'Maiale', 'Limoni', 'Arance', 'Mele', 'Banane',
    'Fragole', 'Pesche', 'Pere', 'Uva', 'Fagioli', 'Lenticchie', 'Ceci'
  ]

  return fallbackList.map(name => ({
    name: name,
    nameIT: name,
    description: ''
  }))
}

export default router