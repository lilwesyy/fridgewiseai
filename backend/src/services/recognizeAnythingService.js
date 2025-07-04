import axios from 'axios'
import FormData from 'form-data'

class RecognizeAnythingService {
  constructor() {
    // URL dell'API - usa localhost se backend gira fuori da Docker
    this.baseURL = process.env.RECOGNIZE_ANYTHING_API_URL || 'http://localhost:8000'
    this.timeout = 30000 // 30 secondi timeout per elaborazione AI
  }

  /**
   * Rileva ingredienti da immagine usando Recognize Anything API
   * @param {string} imageData - Base64 encoded image data
   * @returns {Promise<Array>} Lista di ingredienti rilevati
   */
  async detectIngredients(imageData) {
    try {
      console.log('🔍 Starting ingredient detection with Recognize Anything API...')
      
      // Converti base64 in buffer
      const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '')
      const imageBuffer = Buffer.from(base64Data, 'base64')
      
      // Crea FormData per l'upload
      const formData = new FormData()
      formData.append('file', imageBuffer, {
        filename: 'image.jpg',
        contentType: 'image/jpeg'
      })
      
      // Chiamata all'API
      const response = await axios.post(this.baseURL + '/', formData, {
        headers: {
          ...formData.getHeaders()
        },
        timeout: this.timeout
      })
      
      console.log('✅ Recognize Anything API response:', response.data)
      
      // Estrai ingredienti dalla risposta
      const ingredients = this.extractFoodIngredients(response.data)
      
      return {
        ingredients,
        confidence: this.calculateAverageConfidence(response.data),
        rawResponse: response.data,
        processingTime: response.headers['x-processing-time'] || 'N/A'
      }
      
    } catch (error) {
      console.error('❌ Error in Recognize Anything API:', error.message)
      
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Recognize Anything API not available')
      }
      
      if (error.response?.status === 413) {
        throw new Error('Image too large for processing')
      }
      
      throw new Error(`Ingredient detection failed: ${error.message}`)
    }
  }

  /**
   * Estrae ingredienti alimentari dai tag rilevati
   * @param {Object} apiResponse - Risposta dell'API
   * @returns {Array} Lista di ingredienti filtrati
   */
  extractFoodIngredients(apiResponse) {
    let allTags = []
    
    // Gestisce diversi formati di risposta a seconda del modello
    if (apiResponse.english) {
      allTags = [...allTags, ...apiResponse.english]
    }
    
    if (apiResponse.model_tags) {
      allTags = [...allTags, ...apiResponse.model_tags]
    }
    
    if (apiResponse.user_tags) {
      allTags = [...allTags, ...apiResponse.user_tags]
    }
    
    // Filtra e pulisce i tag per ottenere solo ingredienti alimentari
    const foodIngredients = allTags
      .filter(tag => tag && typeof tag === 'string')
      .map(tag => tag.toLowerCase().trim())
      .filter(tag => this.isFoodIngredient(tag))
      .map(tag => this.translateToItalian(tag))
      .filter(ingredient => ingredient)
      .slice(0, 10) // Limita a 10 ingredienti principali
    
    // Rimuovi duplicati
    return [...new Set(foodIngredients)]
  }

  /**
   * Verifica se un tag rappresenta un ingrediente alimentare
   * @param {string} tag - Tag da verificare
   * @returns {boolean} True se è un ingrediente alimentare
   */
  isFoodIngredient(tag) {
    const foodKeywords = [
      // Verdure
      'tomato', 'tomatoes', 'onion', 'onions', 'garlic', 'carrot', 'carrots',
      'pepper', 'peppers', 'potato', 'potatoes', 'lettuce', 'spinach', 'broccoli',
      'cucumber', 'zucchini', 'eggplant', 'mushroom', 'mushrooms', 'celery',
      'cabbage', 'cauliflower', 'beans', 'peas', 'corn', 'avocado',
      
      // Frutta
      'apple', 'apples', 'orange', 'oranges', 'banana', 'bananas', 'lemon',
      'lemons', 'lime', 'strawberry', 'strawberries', 'grape', 'grapes',
      'cherry', 'cherries', 'peach', 'peaches', 'pear', 'pears',
      
      // Proteine
      'chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'shrimp', 'egg',
      'eggs', 'cheese', 'milk', 'yogurt', 'mozzarella', 'parmesan',
      
      // Cereali e pasta
      'bread', 'pasta', 'rice', 'flour', 'noodles', 'spaghetti', 'pizza',
      
      // Condimenti e spezie
      'oil', 'olive', 'salt', 'pepper', 'basil', 'oregano', 'parsley',
      'rosemary', 'thyme', 'sage', 'mint', 'cilantro', 'dill',
      
      // Legumi e noci
      'nuts', 'almond', 'almonds', 'walnut', 'walnuts', 'pine nuts',
      'lentils', 'chickpeas', 'beans',
      
      // Latticini
      'butter', 'cream', 'ricotta', 'gorgonzola', 'goat cheese'
    ]
    
    // Parole da escludere (non sono ingredienti)
    const excludeKeywords = [
      'bowl', 'plate', 'dish', 'kitchen', 'table', 'cutting', 'board',
      'knife', 'spoon', 'fork', 'pan', 'pot', 'cooking', 'recipe',
      'meal', 'dinner', 'lunch', 'breakfast', 'food', 'fresh', 'raw',
      'cooked', 'fried', 'baked', 'grilled', 'chopped', 'sliced',
      'wooden', 'white', 'green', 'red', 'yellow', 'color', 'background'
    ]
    
    // Verifica se il tag contiene parole da escludere
    if (excludeKeywords.some(keyword => tag.includes(keyword))) {
      return false
    }
    
    // Verifica se il tag contiene ingredienti alimentari
    return foodKeywords.some(keyword => tag.includes(keyword))
  }

  /**
   * Traduce ingredienti inglesi in italiano
   * @param {string} englishIngredient - Ingrediente in inglese
   * @returns {string} Ingrediente tradotto in italiano
   */
  translateToItalian(englishIngredient) {
    const translations = {
      // Verdure
      'tomato': 'Pomodoro',
      'tomatoes': 'Pomodori',
      'onion': 'Cipolla',
      'onions': 'Cipolle',
      'garlic': 'Aglio',
      'carrot': 'Carota',
      'carrots': 'Carote',
      'pepper': 'Peperone',
      'peppers': 'Peperoni',
      'bell pepper': 'Peperone',
      'potato': 'Patata',
      'potatoes': 'Patate',
      'lettuce': 'Lattuga',
      'spinach': 'Spinaci',
      'broccoli': 'Broccoli',
      'cucumber': 'Cetriolo',
      'zucchini': 'Zucchine',
      'eggplant': 'Melanzana',
      'mushroom': 'Fungo',
      'mushrooms': 'Funghi',
      'celery': 'Sedano',
      'cabbage': 'Cavolo',
      'cauliflower': 'Cavolfiore',
      'beans': 'Fagioli',
      'peas': 'Piselli',
      'corn': 'Mais',
      'avocado': 'Avocado',
      
      // Frutta
      'apple': 'Mela',
      'apples': 'Mele',
      'orange': 'Arancia',
      'oranges': 'Arance',
      'banana': 'Banana',
      'bananas': 'Banane',
      'lemon': 'Limone',
      'lemons': 'Limoni',
      'lime': 'Lime',
      'strawberry': 'Fragola',
      'strawberries': 'Fragole',
      'grape': 'Uva',
      'grapes': 'Uva',
      'cherry': 'Ciliegia',
      'cherries': 'Ciliegie',
      'peach': 'Pesca',
      'peaches': 'Pesche',
      'pear': 'Pera',
      'pears': 'Pere',
      
      // Proteine
      'chicken': 'Pollo',
      'beef': 'Manzo',
      'pork': 'Maiale',
      'fish': 'Pesce',
      'salmon': 'Salmone',
      'tuna': 'Tonno',
      'shrimp': 'Gamberi',
      'egg': 'Uovo',
      'eggs': 'Uova',
      'cheese': 'Formaggio',
      'milk': 'Latte',
      'yogurt': 'Yogurt',
      'mozzarella': 'Mozzarella',
      'parmesan': 'Parmigiano',
      
      // Cereali e pasta
      'bread': 'Pane',
      'pasta': 'Pasta',
      'rice': 'Riso',
      'flour': 'Farina',
      'noodles': 'Pasta',
      'spaghetti': 'Spaghetti',
      'pizza': 'Pizza',
      
      // Condimenti e spezie
      'oil': 'Olio',
      'olive': 'Oliva',
      'olive oil': 'Olio d\'oliva',
      'salt': 'Sale',
      'pepper': 'Pepe',
      'basil': 'Basilico',
      'oregano': 'Origano',
      'parsley': 'Prezzemolo',
      'rosemary': 'Rosmarino',
      'thyme': 'Timo',
      'sage': 'Salvia',
      'mint': 'Menta',
      'cilantro': 'Coriandolo',
      'dill': 'Aneto',
      
      // Legumi e noci
      'nuts': 'Noci',
      'almond': 'Mandorla',
      'almonds': 'Mandorle',
      'walnut': 'Noce',
      'walnuts': 'Noci',
      'pine nuts': 'Pinoli',
      'lentils': 'Lenticchie',
      'chickpeas': 'Ceci',
      
      // Latticini
      'butter': 'Burro',
      'cream': 'Panna',
      'ricotta': 'Ricotta',
      'gorgonzola': 'Gorgonzola',
      'goat cheese': 'Formaggio di capra'
    }
    
    // Cerca traduzione esatta
    const exactMatch = translations[englishIngredient]
    if (exactMatch) return exactMatch
    
    // Cerca traduzioni parziali
    for (const [english, italian] of Object.entries(translations)) {
      if (englishIngredient.includes(english)) {
        return italian
      }
    }
    
    // Se non trova traduzione, capitalizza la prima lettera
    return englishIngredient.charAt(0).toUpperCase() + englishIngredient.slice(1)
  }

  /**
   * Calcola la confidenza media dai risultati
   * @param {Object} apiResponse - Risposta dell'API
   * @returns {number} Confidenza media (0-1)
   */
  calculateAverageConfidence(apiResponse) {
    // Il modello RAM non fornisce confidenza specifica per tag
    // Usiamo una stima basata sul numero di tag rilevati
    const totalTags = (apiResponse.english || []).length + 
                     (apiResponse.model_tags || []).length + 
                     (apiResponse.user_tags || []).length
    
    if (totalTags === 0) return 0
    if (totalTags >= 10) return 0.9
    if (totalTags >= 5) return 0.8
    return 0.7
  }

  /**
   * Verifica se il servizio è disponibile
   * @returns {Promise<boolean>} True se disponibile
   */
  async isServiceAvailable() {
    try {
      // Prova GET alla documentazione
      const response = await axios.get(this.baseURL + '/docs', {
        timeout: 3000
      })
      return response.status === 200
    } catch (error) {
      console.log('Recognize Anything API not available:', error.message)
      return false
    }
  }
}

export default new RecognizeAnythingService()
