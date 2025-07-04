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
    const locale = preferences.locale || 'en'

    // Get localized prompts
    const prompts = this.getLocalizedPrompts(locale)
    
    let prompt = `${prompts.createRecipe} ${ingredientList}.`
    
    if (dietary.length > 0) {
      prompt += ` ${prompts.mustBe} ${dietary.join(' e ')}.`
    }
    
    if (cuisine !== 'any') {
      prompt += ` ${prompts.cuisineStyle} ${cuisine}.`
    }
    
    prompt += ` ${prompts.difficulty} ${difficulty}.`
    prompt += ` ${prompts.maxTime} ${maxCookingTime} ${prompts.minutes}.`
    prompt += ` ${prompts.servingsFor} ${servings} ${prompts.people}.`

    prompt += `

${prompts.responseInstructions}
{
  "title": "${prompts.recipeTitle}",
  "description": "${prompts.recipeDescription}",
  "cookingTime": ${maxCookingTime <= 30 ? Math.min(maxCookingTime, 25) : maxCookingTime - 5},
  "servings": ${servings},
  "difficulty": "${difficulty}",
  "calories": 350,
  "ingredients": [
    {"name": "${prompts.ingredientName}", "amount": "${prompts.ingredientAmount}", "emoji": "🥄"},
    {"name": "${prompts.ingredientName}", "amount": "${prompts.ingredientAmount2}", "emoji": "🧄"}
  ],
  "instructions": [
    "${prompts.step1}",
    "${prompts.step2}",
    "${prompts.step3}"
  ],
  "tags": ["vegetarian", "quick", "healthy"],
  "tips": "${prompts.tips}"
}

${prompts.important}`

    return prompt
  }

  getLocalizedPrompts(locale) {
    const prompts = {
      it: {
        createRecipe: 'Crea una ricetta deliziosa usando questi ingredienti:',
        mustBe: 'La ricetta deve essere',
        cuisineStyle: 'Rendila in stile cucina',
        difficulty: 'La difficoltà dovrebbe essere',
        maxTime: 'Il tempo di cottura non deve superare i',
        minutes: 'minuti',
        servingsFor: 'La ricetta deve essere per',
        people: 'persone',
        responseInstructions: 'Rispondi SOLO con un oggetto JSON in questo formato esatto:',
        recipeTitle: 'Nome della Ricetta',
        recipeDescription: 'Breve descrizione del piatto',
        ingredientName: 'nome ingrediente',
        ingredientAmount: '1 tazza',
        ingredientAmount2: '2 cucchiai',
        step1: 'Passo 1: istruzione dettagliata',
        step2: 'Passo 2: istruzione dettagliata',
        step3: 'Passo 3: istruzione dettagliata',
        tips: 'Consigli di cucina opzionali',
        important: 'Importante:\n- Usa principalmente gli ingredienti forniti\n- Puoi suggerire ingredienti base comuni (sale, pepe, olio d\'oliva, ecc.) se necessario\n- Fornisci tempi di cottura e porzioni realistiche\n- Includi istruzioni passo-passo dettagliate\n- Aggiungi tag rilevanti come "vegetarian", "vegan", "quick", "healthy", ecc.\n- Usa emoji appropriate per ogni ingrediente\n- Rispondi SOLO con JSON valido, nessun testo aggiuntivo'
      },
      en: {
        createRecipe: 'Create a delicious recipe using these ingredients:',
        mustBe: 'The recipe must be',
        cuisineStyle: 'Make it in',
        difficulty: 'The difficulty should be',
        maxTime: 'The cooking time should not exceed',
        minutes: 'minutes',
        servingsFor: 'The recipe should be for',
        people: 'people',
        responseInstructions: 'Respond ONLY with a JSON object in this exact format:',
        recipeTitle: 'Recipe Name',
        recipeDescription: 'Brief description of the dish',
        ingredientName: 'ingredient name',
        ingredientAmount: '1 cup',
        ingredientAmount2: '2 tablespoons',
        step1: 'Step 1: detailed instruction',
        step2: 'Step 2: detailed instruction',
        step3: 'Step 3: detailed instruction',
        tips: 'Optional cooking tips',
        important: 'Important:\n- Use mainly the provided ingredients\n- You can suggest basic common ingredients (salt, pepper, olive oil, etc.) if necessary\n- Provide realistic cooking times and portions\n- Include detailed step-by-step instructions\n- Add relevant tags like "vegetarian", "vegan", "quick", "healthy", etc.\n- Use appropriate emojis for each ingredient\n- Respond ONLY with valid JSON, no additional text'
      },
      fr: {
        createRecipe: 'Créez une délicieuse recette en utilisant ces ingrédients:',
        mustBe: 'La recette doit être',
        cuisineStyle: 'Faites-la dans le style cuisine',
        difficulty: 'La difficulté devrait être',
        maxTime: 'Le temps de cuisson ne doit pas dépasser',
        minutes: 'minutes',
        servingsFor: 'La recette doit être pour',
        people: 'personnes',
        responseInstructions: 'Répondez UNIQUEMENT avec un objet JSON dans ce format exact:',
        recipeTitle: 'Nom de la Recette',
        recipeDescription: 'Brève description du plat',
        ingredientName: 'nom de l\'ingrédient',
        ingredientAmount: '1 tasse',
        ingredientAmount2: '2 cuillères à soupe',
        step1: 'Étape 1: instruction détaillée',
        step2: 'Étape 2: instruction détaillée',
        step3: 'Étape 3: instruction détaillée',
        tips: 'Conseils de cuisine optionnels',
        important: 'Important:\n- Utilisez principalement les ingrédients fournis\n- Vous pouvez suggérer des ingrédients de base courants (sel, poivre, huile d\'olive, etc.) si nécessaire\n- Fournissez des temps de cuisson et des portions réalistes\n- Incluez des instructions détaillées étape par étape\n- Ajoutez des tags pertinents comme "vegetarian", "vegan", "quick", "healthy", etc.\n- Utilisez des emojis appropriés pour chaque ingrédient\n- Répondez UNIQUEMENT avec du JSON valide, aucun texte supplémentaire'
      },
      de: {
        createRecipe: 'Erstellen Sie ein köstliches Rezept mit diesen Zutaten:',
        mustBe: 'Das Rezept muss',
        cuisineStyle: 'Machen Sie es im Stil der',
        difficulty: 'Die Schwierigkeit sollte',
        maxTime: 'Die Kochzeit sollte nicht überschreiten',
        minutes: 'Minuten',
        servingsFor: 'Das Rezept sollte für',
        people: 'Personen sein',
        responseInstructions: 'Antworten Sie NUR mit einem JSON-Objekt in diesem exakten Format:',
        recipeTitle: 'Rezeptname',
        recipeDescription: 'Kurze Beschreibung des Gerichts',
        ingredientName: 'Zutatname',
        ingredientAmount: '1 Tasse',
        ingredientAmount2: '2 Esslöffel',
        step1: 'Schritt 1: detaillierte Anweisung',
        step2: 'Schritt 2: detaillierte Anweisung',
        step3: 'Schritt 3: detaillierte Anweisung',
        tips: 'Optionale Kochtipps',
        important: 'Wichtig:\n- Verwenden Sie hauptsächlich die bereitgestellten Zutaten\n- Sie können grundlegende übliche Zutaten (Salz, Pfeffer, Olivenöl, etc.) vorschlagen, falls nötig\n- Geben Sie realistische Kochzeiten und Portionen an\n- Fügen Sie detaillierte Schritt-für-Schritt-Anweisungen hinzu\n- Fügen Sie relevante Tags wie "vegetarian", "vegan", "quick", "healthy", etc. hinzu\n- Verwenden Sie angemessene Emojis für jede Zutat\n- Antworten Sie NUR mit gültigem JSON, kein zusätzlicher Text'
      }
    }

    return prompts[locale] || prompts['en']
  }

  getLocalizedFallbacks(locale) {
    const fallbacks = {
      it: {
        generatedRecipe: 'Ricetta Generata',
        deliciousRecipe: 'Una deliziosa ricetta creata appositamente per te!',
        followSteps: 'Segui i passaggi di preparazione',
        recipeWith: 'Ricetta con',
        simpleRecipe: 'Una ricetta semplice creata con i tuoi ingredienti disponibili.',
        onePiece: '1 pezzo',
        prepareIngredients: 'Prepara tutti gli ingredienti',
        combineIngredients: 'Combina gli ingredienti secondo le tue preferenze',
        cookUntilDone: 'Cuoci fino a cottura',
        seasonAndServe: 'Aggiusta di sale e servi',
        adjustTips: 'Aggiusta condimenti e tempi di cottura secondo il tuo gusto.'
      },
      en: {
        generatedRecipe: 'Generated Recipe',
        deliciousRecipe: 'A delicious recipe created especially for you!',
        followSteps: 'Follow the preparation steps',
        recipeWith: 'Recipe with',
        simpleRecipe: 'A simple recipe created with your available ingredients.',
        onePiece: '1 piece',
        prepareIngredients: 'Prepare all ingredients',
        combineIngredients: 'Combine ingredients according to your preferences',
        cookUntilDone: 'Cook until done',
        seasonAndServe: 'Season with salt and serve',
        adjustTips: 'Adjust seasonings and cooking times according to your taste.'
      },
      fr: {
        generatedRecipe: 'Recette Générée',
        deliciousRecipe: 'Une délicieuse recette créée spécialement pour vous!',
        followSteps: 'Suivez les étapes de préparation',
        recipeWith: 'Recette avec',
        simpleRecipe: 'Une recette simple créée avec vos ingrédients disponibles.',
        onePiece: '1 pièce',
        prepareIngredients: 'Préparez tous les ingrédients',
        combineIngredients: 'Combinez les ingrédients selon vos préférences',
        cookUntilDone: 'Cuisez jusqu\'à cuisson',
        seasonAndServe: 'Assaisonnez avec du sel et servez',
        adjustTips: 'Ajustez les assaisonnements et les temps de cuisson selon votre goût.'
      },
      de: {
        generatedRecipe: 'Generiertes Rezept',
        deliciousRecipe: 'Ein köstliches Rezept, das speziell für Sie erstellt wurde!',
        followSteps: 'Folgen Sie den Zubereitungsschritten',
        recipeWith: 'Rezept mit',
        simpleRecipe: 'Ein einfaches Rezept, das mit Ihren verfügbaren Zutaten erstellt wurde.',
        onePiece: '1 Stück',
        prepareIngredients: 'Bereiten Sie alle Zutaten vor',
        combineIngredients: 'Kombinieren Sie die Zutaten nach Ihren Vorlieben',
        cookUntilDone: 'Kochen Sie bis zur Garzeit',
        seasonAndServe: 'Mit Salz würzen und servieren',
        adjustTips: 'Passen Sie Gewürze und Kochzeiten nach Ihrem Geschmack an.'
      }
    }

    return fallbacks[locale] || fallbacks['en']
  }

  parseRecipeResponse(responseText, originalIngredients, preferences = {}) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      const jsonText = jsonMatch ? jsonMatch[0] : responseText
      
      const recipe = JSON.parse(jsonText)
      
      // Get localized fallback text
      const locale = preferences.locale || 'en'
      const fallbacks = this.getLocalizedFallbacks(locale)
      
      // Validate required fields and add defaults
      const validatedRecipe = {
        id: Date.now().toString(), // Generate unique ID
        title: recipe.title || fallbacks.generatedRecipe,
        description: recipe.description || fallbacks.deliciousRecipe,
        cookingTime: recipe.cookingTime || preferences.maxCookingTime || 30,
        servings: recipe.servings || preferences.servings || 4,
        difficulty: recipe.difficulty || preferences.difficulty || 'medium',
        calories: recipe.calories || null,
        ingredients: this.validateIngredients(recipe.ingredients || []),
        instructions: recipe.instructions || [fallbacks.followSteps],
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
    const locale = preferences.locale || 'en'
    const fallbacks = this.getLocalizedFallbacks(locale)
    
    return {
      id: Date.now().toString(),
      title: `${fallbacks.recipeWith} ${ingredients.join(', ')}`,
      description: fallbacks.simpleRecipe,
      cookingTime: preferences.maxCookingTime || 30,
      servings: preferences.servings || 2,
      difficulty: preferences.difficulty || 'easy',
      calories: null,
      ingredients: ingredients.map(ing => ({
        name: ing,
        amount: fallbacks.onePiece,
        emoji: '🥄'
      })),
      instructions: [
        fallbacks.prepareIngredients,
        fallbacks.combineIngredients,
        fallbacks.cookUntilDone,
        fallbacks.seasonAndServe
      ],
      tags: ['ai-generated', 'simple'],
      tips: fallbacks.adjustTips,
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