import express from 'express'
import Recipe from '../models/Recipe.js'
import { authenticateToken, optionalAuth } from '../middleware/auth.js'
import Joi from 'joi'

const router = express.Router()

// Generate recipe from ingredients
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const generateSchema = Joi.object({
      ingredients: Joi.array().items(Joi.string().trim()).min(1).required(),
      preferences: Joi.object({
        cuisine: Joi.string().valid('italian', 'french', 'chinese', 'japanese', 'indian', 'mexican', 'american', 'mediterranean', 'other').optional(),
        difficulty: Joi.string().valid('easy', 'medium', 'hard').optional(),
        maxCookingTime: Joi.number().min(1).max(480).optional(),
        servings: Joi.number().min(1).max(20).optional()
      }).optional()
    })

    const { error, value } = generateSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(detail => detail.message)
      })
    }

    const { ingredients, preferences = {} } = value

    // Simulate AI recipe generation
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Create mock recipe based on ingredients
    const recipe = new Recipe({
      title: `Delicious ${ingredients[0]} ${ingredients[1] || 'Dish'}`,
      description: `A wonderful recipe featuring ${ingredients.join(', ')} with perfect flavors and textures.`,
      ingredients: [
        ...ingredients.map((ing, index) => ({
          name: ing,
          amount: index === 0 ? '2 cups' : '1 cup',
          unit: '',
          notes: ''
        })),
        {
          name: 'Olive oil',
          amount: '2',
          unit: 'tbsp',
          notes: ''
        },
        {
          name: 'Salt',
          amount: '1',
          unit: 'tsp',
          notes: 'to taste'
        },
        {
          name: 'Black pepper',
          amount: '1/2',
          unit: 'tsp',
          notes: 'to taste'
        }
      ],
      instructions: [
        {
          step: 1,
          description: 'Prepare all ingredients by washing and chopping as needed.',
          duration: 10
        },
        {
          step: 2,
          description: 'Heat olive oil in a large pan over medium heat.',
          duration: 2
        },
        {
          step: 3,
          description: `Add ${ingredients[0].toLowerCase()} and cook for 5-7 minutes until tender.`,
          duration: 7
        },
        {
          step: 4,
          description: `Add remaining ingredients and cook for 10-15 minutes, stirring occasionally.`,
          duration: 15
        },
        {
          step: 5,
          description: 'Season with salt and pepper to taste. Serve hot and enjoy!',
          duration: 2
        }
      ],
      cookingTime: {
        prep: 10,
        cook: 25,
        total: 35
      },
      servings: preferences.servings || 4,
      difficulty: preferences.difficulty || 'medium',
      cuisine: preferences.cuisine || 'other',
      tags: ['homemade', 'fresh', 'ai-generated'],
      generatedFrom: {
        ingredients,
        prompt: `Generate recipe with ${ingredients.join(', ')}`,
        aiModel: 'mock-ai'
      },
      createdBy: req.user._id,
      isPublic: false
    })

    await recipe.save()

    // Update user stats
    await req.user.updateOne({ $inc: { 'stats.totalRecipes': 1 } })

    res.status(201).json({
      message: 'Recipe generated successfully',
      recipe: recipe
    })
  } catch (error) {
    console.error('Recipe generation error:', error)
    res.status(500).json({
      error: 'Failed to generate recipe',
      code: 'GENERATION_ERROR'
    })
  }
})

// Get user's recipes
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const recipes = await Recipe.findByUser(req.user._id)
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Recipe.countDocuments({ createdBy: req.user._id })

    res.json({
      recipes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get recipes error:', error)
    res.status(500).json({
      error: 'Failed to get recipes',
      code: 'FETCH_ERROR'
    })
  }
})

// Get single recipe
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('createdBy', 'name')

    if (!recipe) {
      return res.status(404).json({
        error: 'Recipe not found',
        code: 'RECIPE_NOT_FOUND'
      })
    }

    // Check if user can access this recipe
    if (!recipe.isPublic && (!req.user || !recipe.createdBy._id.equals(req.user._id))) {
      return res.status(403).json({
        error: 'Access denied',
        code: 'ACCESS_DENIED'
      })
    }

    res.json({ recipe })
  } catch (error) {
    console.error('Get recipe error:', error)
    res.status(500).json({
      error: 'Failed to get recipe',
      code: 'FETCH_ERROR'
    })
  }
})

// Update recipe
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)

    if (!recipe) {
      return res.status(404).json({
        error: 'Recipe not found',
        code: 'RECIPE_NOT_FOUND'
      })
    }

    // Check ownership
    if (!recipe.createdBy.equals(req.user._id)) {
      return res.status(403).json({
        error: 'Access denied',
        code: 'ACCESS_DENIED'
      })
    }

    // Update allowed fields
    const allowedUpdates = ['title', 'description', 'ingredients', 'instructions', 'cookingTime', 'servings', 'difficulty', 'cuisine', 'tags', 'isPublic']
    const updates = {}
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field]
      }
    })

    Object.assign(recipe, updates)
    await recipe.save()

    res.json({
      message: 'Recipe updated successfully',
      recipe
    })
  } catch (error) {
    console.error('Update recipe error:', error)
    res.status(500).json({
      error: 'Failed to update recipe',
      code: 'UPDATE_ERROR'
    })
  }
})

// Delete recipe
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)

    if (!recipe) {
      return res.status(404).json({
        error: 'Recipe not found',
        code: 'RECIPE_NOT_FOUND'
      })
    }

    // Check ownership
    if (!recipe.createdBy.equals(req.user._id)) {
      return res.status(403).json({
        error: 'Access denied',
        code: 'ACCESS_DENIED'
      })
    }

    await Recipe.findByIdAndDelete(req.params.id)

    // Update user stats
    await req.user.updateOne({ $inc: { 'stats.totalRecipes': -1 } })

    res.json({
      message: 'Recipe deleted successfully'
    })
  } catch (error) {
    console.error('Delete recipe error:', error)
    res.status(500).json({
      error: 'Failed to delete recipe',
      code: 'DELETE_ERROR'
    })
  }
})

// Search recipes
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      q,
      cuisine,
      difficulty,
      maxCookingTime,
      tags,
      page = 1,
      limit = 10
    } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const query = { isPublic: true }

    // Text search
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    }

    // Filters
    if (cuisine) query.cuisine = cuisine
    if (difficulty) query.difficulty = difficulty
    if (maxCookingTime) query['cookingTime.total'] = { $lte: parseInt(maxCookingTime) }
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim())
      query.tags = { $in: tagArray }
    }

    const recipes = await Recipe.find(query)
      .populate('createdBy', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ 'ratings.average': -1, createdAt: -1 })
      .lean()

    const total = await Recipe.countDocuments(query)

    res.json({
      recipes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('Search recipes error:', error)
    res.status(500).json({
      error: 'Failed to search recipes',
      code: 'SEARCH_ERROR'
    })
  }
})

export default router
