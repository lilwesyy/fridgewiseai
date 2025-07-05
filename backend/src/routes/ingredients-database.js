import express from 'express'
import axios from 'axios'
import { translateIngredient, translateIngredients, getEnglishNameFromItalian } from '../utils/ingredientTranslations.js'

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

    // Carica ingredienti di base (solo inglese)
    const baseIngredients = await loadBaseIngredients()

    // Ricerca intelligente: traduce automaticamente italiano -> inglese
    const searchTerm = query.toLowerCase()
    
    // 1. Cerca la versione inglese se è stata inserita una parola italiana
    const englishEquivalent = await getEnglishNameFromItalian(query)
    
    // 2. Usa la versione inglese per la ricerca se disponibile
    const primarySearchTerm = englishEquivalent ? englishEquivalent.toLowerCase() : searchTerm
    
    console.log(`🔍 Search: "${query}" ${englishEquivalent ? `→ "${englishEquivalent}"` : '(direct)'}`)
    
    // Filtra i risultati negli ingredienti base (inglese)
    const filteredIngredients = baseIngredients.filter(ingredient => {
      const nameMatch = ingredient.name.toLowerCase().includes(primarySearchTerm) || 
                       ingredient.name.toLowerCase().includes(searchTerm)
      const descriptionMatch = ingredient.description && 
                              ingredient.description.toLowerCase().includes(searchTerm)
      
      return nameMatch || descriptionMatch
    }).slice(0, 20) // Limita a 20 risultati

    // Traduci SOLO i risultati trovati
    const results = await loadLocalizedIngredients(filteredIngredients, locale)

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
 * Endpoint per ottenere ingredienti per categoria
 * GET /api/ingredients-database/category?name=categoria&locale=it
 */
router.get('/category', async (req, res) => {
  try {
    const { name: categoryName, locale = 'en', refresh = false } = req.query

    if (!categoryName) {
      return res.status(400).json({
        error: 'Category name is required',
        ingredients: []
      })
    }

    console.log(`🏷️ Searching ingredients for category: "${categoryName}" (locale: ${locale})`)

    // Mappa le categorie locali a quelle di TheMealDB
    const categoryMapping = {
      // Italiano
      'verdure': ['vegetables', 'leafy', 'root'],
      'frutta': ['fruit'],
      'carne': ['meat', 'beef', 'pork', 'chicken'],
      'formaggi': ['cheese', 'dairy'],
      'spezie': ['herbs', 'spices', 'seasoning'],
      'cereali': ['grain', 'wheat', 'rice', 'pasta'],
      
      // Inglese
      'vegetables': ['vegetables', 'leafy', 'root'],
      'fruit': ['fruit'],
      'meat': ['meat', 'beef', 'pork', 'chicken'],
      'cheese': ['cheese', 'dairy'],
      'spices': ['herbs', 'spices', 'seasoning'],
      'grains': ['grain', 'wheat', 'rice', 'pasta'],
      
      // Francese
      'légumes': ['vegetables', 'leafy', 'root'],
      'fruits': ['fruit'],
      'viande': ['meat', 'beef', 'pork', 'chicken'],
      'fromage': ['cheese', 'dairy'],
      'épices': ['herbs', 'spices', 'seasoning'],
      'céréales': ['grain', 'wheat', 'rice', 'pasta'],
      
      // Tedesco
      'gemüse': ['vegetables', 'leafy', 'root'],
      'obst': ['fruit'],
      'fleisch': ['meat', 'beef', 'pork', 'chicken'],
      'käse': ['cheese', 'dairy'],
      'gewürze': ['herbs', 'spices', 'seasoning'],
      'getreide': ['grain', 'wheat', 'rice', 'pasta']
    }

    // Carica ingredienti di base (solo inglese)
    if (refresh === 'true') {
      console.log(`🔄 Forcing cache refresh`)
      ingredientsCache.delete('base')
      cacheTimestamps.delete('base')
    }
    const baseIngredients = await loadBaseIngredients()

    // Trova i termini di ricerca per la categoria
    const searchTerms = categoryMapping[categoryName.toLowerCase()] || [categoryName.toLowerCase()]
    
    console.log(`🔍 Searching for terms: ${searchTerms.join(', ')}`)

    // Filtra ingredienti in base alla categoria (solo inglese per ora)
    const filteredIngredients = baseIngredients.filter(ingredient => {
      const name = ingredient.name.toLowerCase()
      const description = (ingredient.description || '').toLowerCase()
      
      return searchTerms.some(term => 
        name.includes(term) || 
        description.includes(term) ||
        // Aggiunge alcune corrispondenze specifiche per categorie comuni
        (term === 'vegetables' && (name.includes('onion') || name.includes('tomato') || name.includes('carrot') || name.includes('pepper') || name.includes('celery') || name.includes('spinach') || name.includes('lettuce'))) ||
        (term === 'fruit' && (name.includes('apple') || name.includes('banana') || name.includes('orange') || name.includes('lemon') || name.includes('strawberry') || name.includes('grape'))) ||
        (term === 'meat' && (name.includes('beef') || name.includes('pork') || name.includes('chicken') || name.includes('lamb') || name.includes('turkey'))) ||
        (term === 'cheese' && (name.includes('cheese') || name.includes('mozzarella') || name.includes('parmesan') || name.includes('cheddar'))) ||
        (term === 'herbs' && (name.includes('basil') || name.includes('oregano') || name.includes('thyme') || name.includes('rosemary') || name.includes('parsley'))) ||
        (term === 'grain' && (name.includes('rice') || name.includes('wheat') || name.includes('pasta') || name.includes('bread')))
      )
    }).slice(0, 25) // Limita a 25 risultati per categoria

    // Traduci SOLO gli ingredienti filtrati per la categoria
    const results = await loadLocalizedIngredients(filteredIngredients, locale)

    console.log(`✅ Found ${results.length} ingredients for category "${categoryName}"`)

    res.json({
      ingredients: results,
      count: results.length,
      category: categoryName,
      searchTerms: searchTerms
    })

  } catch (error) {
    console.error('❌ Error searching by category:', error.message)
    res.status(500).json({
      error: 'Failed to search by category',
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
    const { locale = 'en', limit = 50 } = req.query
    console.log(`📦 Loading ingredients with limit ${limit}... (locale: ${locale})`)

    // Carica solo gli ingredienti di base
    const baseIngredients = await loadBaseIngredients()
    
    // Limita il numero di ingredienti per evitare traduzioni eccessive
    const limitedIngredients = baseIngredients.slice(0, parseInt(limit))
    
    // Traduci solo il numero limitato di ingredienti
    const results = await loadLocalizedIngredients(limitedIngredients, locale)

    res.json({
      ingredients: results,
      count: results.length,
      total: baseIngredients.length,
      lastUpdated: cacheTimestamps.get('base')
    })

  } catch (error) {
    console.error('❌ Error loading ingredients:', error.message)
    res.status(500).json({
      error: 'Failed to load ingredients',
      ingredients: []
    })
  }
})

/**
 * Carica gli ingredienti di base (solo inglese) da TheMealDB
 */
async function loadBaseIngredients() {
  // Controlla cache di base (solo inglese)
  const now = Date.now()
  const cache = ingredientsCache.get('base')
  const timestamp = cacheTimestamps.get('base')
  
  if (cache && timestamp && (now - timestamp) < CACHE_DURATION) {
    console.log(`📋 Using cached base ingredients`)
    return cache
  }

  try {
    console.log('🌐 Fetching base ingredients from TheMealDB...')
    
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?i=list', {
      timeout: 10000,
      headers: {
        'User-Agent': 'FridgeWiseAI/1.0'
      }
    })

    if (response.data && response.data.meals) {
      console.log(`📦 Loaded ${response.data.meals.length} base ingredients from TheMealDB`)
      
      // Salva solo i dati inglesi senza traduzione
      const baseIngredients = response.data.meals.map(item => ({
        name: item.strIngredient,
        description: item.strDescription || ''
      }))
      
      // Salva nella cache di base
      ingredientsCache.set('base', baseIngredients)
      cacheTimestamps.set('base', now)
      
      return baseIngredients
    }

    throw new Error('Invalid response format from TheMealDB')

  } catch (error) {
    console.error('❌ Error loading from TheMealDB:', error.message)
    
    // Fallback con ingredienti hardcoded (solo inglese)
    const fallbackIngredients = getFallbackIngredients('en')
    ingredientsCache.set('base', fallbackIngredients)
    cacheTimestamps.set('base', now)
    
    return fallbackIngredients
  }
}

/**
 * Carica e traduce solo gli ingredienti necessari per un locale specifico
 */
async function loadLocalizedIngredients(ingredients, locale = 'en') {
  if (locale === 'en') {
    return ingredients.map(ingredient => ({
      ...ingredient,
      localizedName: ingredient.name,
      [`name${locale.toUpperCase()}`]: ingredient.name
    }))
  }

  // Traduci solo gli ingredienti richiesti
  console.log(`🔄 Translating ${ingredients.length} ingredients to ${locale}...`)
  const translatedIngredients = await translateIngredients(ingredients, locale)
  
  return translatedIngredients.map(ingredient => ({
    ...ingredient,
    [`name${locale.toUpperCase()}`]: ingredient.nameTranslated
  }))
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