import axios from 'axios'

class GeminiService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta'
    this.model = 'gemini-1.5-flash'
    
    // Create a clean axios instance without auth interceptors
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': this.apiKey
      }
    })
    
    console.log('🔑 Gemini API Key configured:', this.apiKey ? 'Yes (length: ' + this.apiKey.length + ')' : 'No')
    console.log('🤖 Using Gemini model:', this.model)
    
    if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
      console.warn('⚠️ Gemini API key not found or not configured properly.')
      console.log('💡 To fix this:')
      console.log('1. Get an API key from https://aistudio.google.com/app/apikey')
      console.log('2. Add it to your .env file as VITE_GEMINI_API_KEY=your_key_here')
      console.log('3. Restart the development server (npm run dev)')
    }
  }

  async generateRecipe(ingredients, preferences = {}) {
    if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
      throw new Error('Gemini API key not configured. Please add a valid API key to your .env file and restart the server.')
    }

    console.log(`🤖 Using Gemini model: ${this.model}`)
    //console.log(`🔑 API Key (first 20 chars): ${this.apiKey.substring(0, 20)}...`)
    
    try {
      const prompt = this.buildRecipePrompt(ingredients, preferences)
      
      const requestData = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
          topP: 0.8,
          topK: 10
        }
      }
      
      console.log('📤 Sending request to Gemini API...')
      
      const response = await this.axiosInstance.post(
        `/models/${this.model}:generateContent`,
        requestData
      )

      const generatedText = response.data.candidates[0].content.parts[0].text
      console.log(`✅ Success with Gemini model: ${this.model}`)
      console.log('📝 Generated text length:', generatedText.length)
      
      return this.parseRecipeResponse(generatedText, ingredients, preferences)
      
    } catch (error) {
      console.error(`❌ Gemini API failed:`, error.response?.status || error.message)
      console.error('Full error:', error)
      console.error('Response data:', error.response?.data)
      console.error('Request headers:', error.config?.headers)
      
      if (error.response?.status === 401) {
        throw new Error('Invalid Gemini API key. Please check your API key.')
      } else if (error.response?.status === 403) {
        throw new Error('Gemini API access forbidden. Check your API key permissions.')
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a few moments.')
      } else if (error.response?.data?.error?.message) {
        throw new Error(error.response.data.error.message)
      } else {
        throw new Error('Failed to generate recipe with Gemini AI. Please try again.')
      }
    }
  }

  buildRecipePrompt(ingredients, preferences = {}) {
    const ingredientList = ingredients.join(', ')
    const dietary = preferences.dietary || []
    const cuisine = preferences.cuisine || 'any'
    const difficulty = preferences.difficulty || 'easy'
    const maxCookingTime = preferences.maxCookingTime || 30
    const servings = preferences.servings || 4

    let prompt = `Crea una ricetta deliziosa usando questi ingredienti: ${ingredientList}.`
    
    if (dietary.length > 0) {
      prompt += ` La ricetta deve essere ${dietary.join(' e ')}.`
    }
    
    if (cuisine !== 'any') {
      prompt += ` Rendila in stile cucina ${cuisine}.`
    }
    
    prompt += ` La difficoltà dovrebbe essere ${difficulty}.`
    prompt += ` Il tempo di cottura non deve superare i ${maxCookingTime} minuti.`
    prompt += ` La ricetta deve essere per ${servings} persone.`

    prompt += `

Rispondi SOLO con un oggetto JSON in questo formato esatto:
{
  "title": "Nome della Ricetta",
  "description": "Breve descrizione del piatto",
  "cookingTime": ${maxCookingTime <= 30 ? Math.min(maxCookingTime, 25) : maxCookingTime - 5},
  "servings": ${servings},
  "difficulty": "${difficulty}",
  "calories": 350,
  "ingredients": [
    {"name": "nome ingrediente", "amount": "1 tazza", "emoji": "🥄"},
    {"name": "nome ingrediente", "amount": "2 cucchiai", "emoji": "🧄"}
  ],
  "instructions": [
    "Passo 1: istruzione dettagliata",
    "Passo 2: istruzione dettagliata",
    "Passo 3: istruzione dettagliata"
  ],
  "tags": ["vegetarian", "quick", "healthy"],
  "tips": "Consigli di cucina opzionali"
}

Importante: 
- Usa principalmente gli ingredienti forniti
- Puoi suggerire ingredienti base comuni (sale, pepe, olio d'oliva, ecc.) se necessario
- Fornisci tempi di cottura e porzioni realistiche
- Includi istruzioni passo-passo dettagliate
- Aggiungi tag rilevanti come "vegetarian", "vegan", "quick", "healthy", ecc.
- Usa emoji appropriate per ogni ingrediente
- Rispondi SOLO con JSON valido, nessun testo aggiuntivo`

    return prompt
  }

  parseRecipeResponse(responseText, originalIngredients, preferences = {}) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      const jsonText = jsonMatch ? jsonMatch[0] : responseText
      
      const recipe = JSON.parse(jsonText)
      
      // Validate required fields and add defaults
      const validatedRecipe = {
        id: Date.now().toString(), // Generate unique ID
        title: recipe.title || 'Ricetta Generata',
        description: recipe.description || 'Una deliziosa ricetta creata appositamente per te!',
        cookingTime: recipe.cookingTime || preferences.maxCookingTime || 30,
        servings: recipe.servings || preferences.servings || 4,
        difficulty: recipe.difficulty || preferences.difficulty || 'medium',
        calories: recipe.calories || null,
        ingredients: this.validateIngredients(recipe.ingredients || []),
        instructions: recipe.instructions || ['Segui i passaggi di preparazione'],
        tags: recipe.tags || ['ai-generated'],
        tips: recipe.tips || '',
        sourceIngredients: originalIngredients,
        createdAt: new Date().toISOString(),
        isGenerated: true
      }

      return validatedRecipe
    } catch (error) {
      console.error('Failed to parse Gemini response:', error)
      console.error('Raw response:', responseText)
      // Return a fallback recipe if parsing fails
      return this.createFallbackRecipe(originalIngredients, preferences)
    }
  }

  validateIngredients(ingredients) {
    return ingredients.map(ingredient => ({
      name: ingredient.name || 'Ingrediente sconosciuto',
      amount: ingredient.amount || '1 pezzo',
      emoji: ingredient.emoji || '🥄'
    }))
  }

  createFallbackRecipe(ingredients, preferences = {}) {
    return {
      id: Date.now().toString(),
      title: `Ricetta con ${ingredients.join(', ')}`,
      description: 'Una ricetta semplice creata con i tuoi ingredienti disponibili.',
      cookingTime: preferences.maxCookingTime || 30,
      servings: preferences.servings || 2,
      difficulty: preferences.difficulty || 'easy',
      calories: null,
      ingredients: ingredients.map(ing => ({
        name: ing,
        amount: '1 pezzo',
        emoji: '🥄'
      })),
      instructions: [
        'Prepara tutti gli ingredienti',
        'Combina gli ingredienti secondo le tue preferenze',
        'Cuoci fino a cottura',
        'Aggiusta di sale e servi'
      ],
      tags: ['ai-generated', 'simple'],
      tips: 'Aggiusta condimenti e tempi di cottura secondo il tuo gusto.',
      sourceIngredients: ingredients,
      createdAt: new Date().toISOString(),
      isGenerated: true
    }
  }

  // Method to test the API connection
  async testConnection() {
    if (!this.apiKey) {
      throw new Error('API key not configured')
    }

    try {
      await this.generateRecipe(['pomodoro', 'formaggio'], { difficulty: 'easy' })
      return true
    } catch (error) {
      throw error
    }
  }
}

export const geminiService = new GeminiService()
export default geminiService