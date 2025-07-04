import express from 'express'
import { authenticateToken } from '../middleware/auth.js'
import recognizeAnythingService from '../services/recognizeAnythingService.js'

const router = express.Router()

// Detect ingredients from image
router.post('/detect', authenticateToken, async (req, res) => {
  try {
    const { image, locale } = req.body
    
    if (!image) {
      return res.status(400).json({
        error: 'Image data is required',
        code: 'MISSING_IMAGE'
      })
    }

    console.log('🔍 Processing ingredient detection request...')
    
    // Usa il servizio Recognize Anything direttamente con locale
    const result = await recognizeAnythingService.detectIngredients(image, locale || 'en')
    
    if (result.ingredients.length === 0) {
      console.log('⚠️ No ingredients detected')
      
      return res.status(422).json({
        error: 'No ingredients detected',
        code: 'NO_INGREDIENTS_FOUND',
        message: 'Nessun ingrediente rilevato nell\'immagine. Prova con una foto più chiara o con ingredienti diversi.'
      })
    }

    // Aggiorna statistiche utente
    await req.user.updateOne({ $inc: { 'stats.totalScans': 1 } })

    console.log(`✅ Detected ${result.ingredients.length} ingredients:`, result.ingredients)

    res.json({
      message: 'Ingredients detected successfully',
      ingredients: result.ingredients,
      confidence: result.confidence,
      processingTime: result.processingTime
    })

  } catch (error) {
    console.error('❌ Ingredient detection error:', error)
    
    res.status(500).json({
      error: 'Failed to detect ingredients',
      code: 'DETECTION_ERROR',
      message: 'Errore durante il riconoscimento degli ingredienti: ' + error.message
    })
  }
})

export default router
