// Test utility for Gemini integration
import { geminiService } from '../services/geminiService.js'

export async function testRecipeGeneration() {
  console.log('🧪 Testing Gemini recipe generation...')
  
  const testIngredients = ['pomodori', 'mozzarella', 'basilico', 'farina']
  const testPreferences = {
    cuisine: 'italian',
    difficulty: 'easy',
    dietary: ['vegetarian']
  }

  try {
    console.log('📝 Generating recipe with ingredients:', testIngredients)
    const recipe = await geminiService.generateRecipe(testIngredients, testPreferences)
    
    console.log('✅ Recipe generated successfully!')
    console.log('📄 Recipe details:', {
      title: recipe.title,
      cookingTime: recipe.cookingTime,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      ingredientsCount: recipe.ingredients.length,
      instructionsCount: recipe.instructions.length,
      tags: recipe.tags
    })
    
    return recipe
  } catch (error) {
    console.error('❌ Recipe generation failed:', error.message)
    
    if (error.message.includes('API key not configured')) {
      console.log('💡 To fix this:')
      console.log('1. Get an API key from https://aistudio.google.com/app/apikey')
      console.log('2. Add it to your .env file as VITE_GEMINI_API_KEY=your_key_here')
      console.log('3. Restart the development server')
    }
    
    throw error
  }
}

// Test connection without generating a full recipe
export async function testApiConnection() {
  console.log('🔌 Testing Gemini API connection...')
  
  try {
    await geminiService.testConnection()
    console.log('✅ API connection successful!')
    return true
  } catch (error) {
    console.error('❌ API connection failed:', error.message)
    return false
  }
}

// Demo function to populate with sample recipes for development
export function createSampleRecipes() {
  const sampleRecipes = [
    {
      id: 'sample-1',
      title: 'Pasta al Pomodoro',
      description: 'Un classico della cucina italiana, semplice e delizioso',
      cookingTime: 20,
      servings: 4,
      difficulty: 'easy',
      calories: 350,
      ingredients: [
        { name: 'Pasta', amount: '400g', emoji: '🍝' },
        { name: 'Pomodori pelati', amount: '400g', emoji: '🍅' },
        { name: 'Aglio', amount: '2 spicchi', emoji: '🧄' },
        { name: 'Basilico', amount: 'q.b.', emoji: '🌿' },
        { name: 'Olio extravergine', amount: '3 cucchiai', emoji: '🫒' }
      ],
      instructions: [
        'Metti a bollire abbondante acqua salata',
        'Scalda l\'olio in una padella e soffriggi l\'aglio',
        'Aggiungi i pomodori pelati e cuoci per 10 minuti',
        'Cuoci la pasta al dente',
        'Scola la pasta e mantecala con il sugo',
        'Aggiungi il basilico fresco e servi'
      ],
      tags: ['italian', 'vegetarian', 'quick', 'ai-generated'],
      tips: 'Per un sapore più intenso, aggiungi un pizzico di zucchero al sugo',
      sourceIngredients: ['pasta', 'pomodori', 'aglio', 'basilico'],
      createdAt: new Date().toISOString(),
      isGenerated: true
    },
    {
      id: 'sample-2',
      title: 'Caprese Salad',
      description: 'Fresca insalata con mozzarella, pomodori e basilico',
      cookingTime: 10,
      servings: 2,
      difficulty: 'easy',
      calories: 280,
      ingredients: [
        { name: 'Mozzarella di bufala', amount: '200g', emoji: '🧀' },
        { name: 'Pomodori maturi', amount: '2 grandi', emoji: '🍅' },
        { name: 'Basilico fresco', amount: '1 mazzetto', emoji: '🌿' },
        { name: 'Olio extravergine', amount: '3 cucchiai', emoji: '🫒' },
        { name: 'Sale', amount: 'q.b.', emoji: '🧂' }
      ],
      instructions: [
        'Taglia la mozzarella a fette spesse',
        'Taglia i pomodori a fette',
        'Alterna mozzarella e pomodori nel piatto',
        'Aggiungi le foglie di basilico',
        'Condisci con olio e sale',
        'Lascia riposare 10 minuti prima di servire'
      ],
      tags: ['italian', 'vegetarian', 'fresh', 'no-cook', 'ai-generated'],
      tips: 'Usa pomodori a temperatura ambiente per il miglior sapore',
      sourceIngredients: ['mozzarella', 'pomodori', 'basilico'],
      createdAt: new Date().toISOString(),
      isGenerated: true
    }
  ]

  // Store sample recipes in localStorage
  localStorage.setItem('generatedRecipes', JSON.stringify(sampleRecipes))
  console.log('📝 Sample recipes created and stored!')
  
  return sampleRecipes
}