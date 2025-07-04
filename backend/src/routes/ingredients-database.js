import express from 'express'
import axios from 'axios'
import { translateIngredient, getEnglishNameFromItalian } from '../utils/ingredientTranslations.js'

const router = express.Router()

// Cache per ingredienti TheMealDB - separato per locale
const ingredientsCache = new Map() // locale -> cache
const cacheTimestamps = new Map() // locale -> timestamp
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 ore

/**
 * Proxy endpoint per TheMealDB ingredienti
 * GET /api/ingredients-database/search?q=query
 */
router.get('/search', async (req, res) => {
  try {
    const { q: query, locale = 'en' } = req.query

    if (!query || query.length < 2) {
      return res.json({ ingredients: [] })
    }

    console.log(`🔍 Searching ingredients for: "${query}" (locale: ${locale})`)

    // Carica tutti gli ingredienti se non in cache o cache scaduta
    await loadAllIngredients(locale)

    const cache = ingredientsCache.get(locale)
    if (!cache) {
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
    
    const results = cache.filter(ingredient => {
      // Ricerca primaria: usa la versione inglese se disponibile
      const primaryMatch = ingredient.name.toLowerCase().includes(primarySearchTerm)
      
      // Ricerca secondaria: cerca anche nella versione originale e tradotta
      const nameMatch = ingredient.name.toLowerCase().includes(searchTerm)
      const translatedFieldName = `name${locale.toUpperCase()}`
      const translatedMatch = ingredient[translatedFieldName] && ingredient[translatedFieldName].toLowerCase().includes(searchTerm)
      const descriptionMatch = ingredient.description && ingredient.description.toLowerCase().includes(searchTerm)
      
      return primaryMatch || nameMatch || translatedMatch || descriptionMatch
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
    const { locale = 'en' } = req.query
    console.log(`📦 Loading all ingredients... (locale: ${locale})`)

    await loadAllIngredients(locale)

    const cache = ingredientsCache.get(locale)
    if (!cache) {
      return res.status(500).json({
        error: 'Failed to load ingredients database',
        ingredients: []
      })
    }

    res.json({
      ingredients: cache,
      count: cache.length,
      lastUpdated: cacheTimestamps.get(locale)
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
async function loadAllIngredients(locale = 'en') {
  // Controlla cache per questo locale
  const now = Date.now()
  const cache = ingredientsCache.get(locale)
  const timestamp = cacheTimestamps.get(locale)
  
  if (cache && timestamp && (now - timestamp) < CACHE_DURATION) {
    console.log(`📋 Using cached ingredients for ${locale}`)
    return cache
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
      console.log(`🔄 Processing ${response.data.meals.length} ingredients for locale ${locale}...`)
      
      // Traduci tutti gli ingredienti per il locale specifico
      const translatedIngredients = await Promise.all(
        response.data.meals.map(async (item) => {
          let translatedName = item.strIngredient // Default: inglese
          
          // Traduci solo se il locale non è inglese
          if (locale !== 'en') {
            translatedName = await translateIngredient(item.strIngredient, locale)
          }
          
          const ingredient = {
            name: item.strIngredient, // Sempre in inglese per compatibilità
            description: item.strDescription || '',
            localizedName: translatedName // Nome localizzato
          }
          
          // Aggiungi anche i campi legacy per compatibilità
          ingredient[`name${locale.toUpperCase()}`] = translatedName
          
          return ingredient
        })
      )
      
      // Salva nella cache per questo locale
      ingredientsCache.set(locale, translatedIngredients)
      cacheTimestamps.set(locale, now)
      
      console.log(`✅ Loaded and translated ${translatedIngredients.length} ingredients for ${locale}`)
      return translatedIngredients
    }

    throw new Error('Invalid response format from TheMealDB')

  } catch (error) {
    console.error('❌ Error loading from TheMealDB:', error.message)
    
    // Fallback con ingredienti hardcoded
    let cache = ingredientsCache.get(locale)
    if (!cache) {
      console.log(`🔄 Using fallback ingredients for ${locale}`)
      cache = getFallbackIngredients(locale)
      ingredientsCache.set(locale, cache)
      cacheTimestamps.set(locale, now)
    }
    
    return cache
  }
}

// Le traduzioni sono ora gestite dal sistema ibrido in utils/ingredientTranslations.js

/**
 * Ingredienti di fallback per locale
 */
function getFallbackIngredients(locale = 'en') {
  const fallbackLists = {
    en: [
      'Tomatoes', 'Onions', 'Garlic', 'Basil', 'Oregano', 'Mozzarella', 'Parmesan',
      'Olive Oil', 'Salt', 'Pepper', 'Carrots', 'Celery', 'Parsley', 'Rosemary',
      'Sage', 'Thyme', 'Peppers', 'Zucchini', 'Eggplant', 'Spinach', 'Arugula',
      'Lettuce', 'Cucumbers', 'Cherry Tomatoes', 'Mushrooms', 'Potatoes', 'Pasta', 'Rice',
      'Bread', 'Eggs', 'Milk', 'Butter', 'Yogurt', 'Ham', 'Salami', 'Tuna',
      'Salmon', 'Chicken', 'Beef', 'Pork', 'Lemons', 'Oranges', 'Apples', 'Bananas',
      'Strawberries', 'Peaches', 'Pears', 'Grapes', 'Beans', 'Lentils', 'Chickpeas'
    ],
    it: [
      'Pomodori', 'Cipolle', 'Aglio', 'Basilico', 'Origano', 'Mozzarella', 'Parmigiano',
      'Olio d\'oliva', 'Sale', 'Pepe', 'Carote', 'Sedano', 'Prezzemolo', 'Rosmarino',
      'Salvia', 'Timo', 'Peperoni', 'Zucchine', 'Melanzane', 'Spinaci', 'Rucola',
      'Lattuga', 'Cetrioli', 'Pomodorini', 'Funghi', 'Patate', 'Pasta', 'Riso',
      'Pane', 'Uova', 'Latte', 'Burro', 'Yogurt', 'Prosciutto', 'Salame', 'Tonno',
      'Salmone', 'Pollo', 'Manzo', 'Maiale', 'Limoni', 'Arance', 'Mele', 'Banane',
      'Fragole', 'Pesche', 'Pere', 'Uva', 'Fagioli', 'Lenticchie', 'Ceci'
    ],
    fr: [
      'Tomates', 'Oignons', 'Ail', 'Basilic', 'Origan', 'Mozzarella', 'Parmesan',
      'Huile d\'olive', 'Sel', 'Poivre', 'Carottes', 'Céleri', 'Persil', 'Romarin',
      'Sauge', 'Thym', 'Poivrons', 'Courgettes', 'Aubergine', 'Épinards', 'Roquette',
      'Laitue', 'Concombres', 'Tomates cerises', 'Champignons', 'Pommes de terre', 'Pâtes', 'Riz',
      'Pain', 'Œufs', 'Lait', 'Beurre', 'Yaourt', 'Jambon', 'Salami', 'Thon',
      'Saumon', 'Poulet', 'Bœuf', 'Porc', 'Citrons', 'Oranges', 'Pommes', 'Bananes',
      'Fraises', 'Pêches', 'Poires', 'Raisins', 'Haricots', 'Lentilles', 'Pois chiches'
    ],
    de: [
      'Tomaten', 'Zwiebeln', 'Knoblauch', 'Basilikum', 'Oregano', 'Mozzarella', 'Parmesan',
      'Olivenöl', 'Salz', 'Pfeffer', 'Karotten', 'Sellerie', 'Petersilie', 'Rosmarin',
      'Salbei', 'Thymian', 'Paprika', 'Zucchini', 'Aubergine', 'Spinat', 'Rucola',
      'Salat', 'Gurken', 'Kirschtomaten', 'Pilze', 'Kartoffeln', 'Nudeln', 'Reis',
      'Brot', 'Eier', 'Milch', 'Butter', 'Joghurt', 'Schinken', 'Salami', 'Thunfisch',
      'Lachs', 'Huhn', 'Rindfleisch', 'Schweinefleisch', 'Zitronen', 'Orangen', 'Äpfel', 'Bananen',
      'Erdbeeren', 'Pfirsiche', 'Birnen', 'Trauben', 'Bohnen', 'Linsen', 'Kichererbsen'
    ]
  }
  
  const fallbackList = fallbackLists[locale] || fallbackLists['en']
  
  return fallbackList.map((name, index) => {
    const englishName = fallbackLists['en'][index] // Nome inglese corrispondente
    
    const ingredient = {
      name: englishName || name, // Sempre nome inglese per compatibilità
      description: '',
      localizedName: name // Nome localizzato
    }
    
    // Aggiungi campo legacy per compatibilità
    ingredient[`name${locale.toUpperCase()}`] = name
    
    return ingredient
  })
}

export default router