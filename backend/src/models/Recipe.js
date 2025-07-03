import mongoose from 'mongoose'

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Recipe title is required'],
    trim: true,
    maxlength: [100, 'Title must be less than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Recipe description is required'],
    trim: true,
    maxlength: [500, 'Description must be less than 500 characters']
  },
  ingredients: {
    type: [{
      name: {
        type: String,
        required: [true, 'Ingredient name is required'],
        trim: true
      },
      amount: {
        type: String,
        required: [true, 'Ingredient amount is required']
      },
      unit: {
        type: String,
        default: ''
      },
      notes: {
        type: String,
        default: ''
      }
    }],
    validate: [
      {
        validator: function(v) {
          return v && v.length > 0;
        },
        message: 'At least one ingredient is required'
      }
    ]
  },
  instructions: {
    type: [{
      step: {
        type: Number,
        required: [true, 'Step number is required']
      },
      description: {
        type: String,
        required: [true, 'Step description is required'],
        trim: true
      },
      duration: {
        type: Number, // in minutes
        default: null
      },
      temperature: {
        type: String,
        default: null
      }
    }],
    validate: [
      {
        validator: function(v) {
          return v && v.length > 0;
        },
        message: 'At least one instruction step is required'
      }
    ]
  },
  cookingTime: {
    prep: {
      type: Number, // in minutes
      default: 0
    },
    cook: {
      type: Number, // in minutes  
      default: 0
    },
    total: {
      type: Number, // in minutes
      required: true
    }
  },
  servings: {
    type: Number,
    required: [true, 'Number of servings is required'],
    min: [1, 'Servings must be at least 1'],
    max: [20, 'Servings must be less than 20']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  cuisine: {
    type: String,
    enum: ['italian', 'french', 'chinese', 'japanese', 'indian', 'mexican', 'american', 'mediterranean', 'other'],
    default: 'other'
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  nutrition: {
    calories: {
      type: Number,
      min: 0
    },
    protein: {
      type: Number,
      min: 0
    },
    carbs: {
      type: Number,
      min: 0
    },
    fat: {
      type: Number,
      min: 0
    },
    fiber: {
      type: Number,
      min: 0
    }
  },
  generatedFrom: {
    ingredients: [{
      type: String,
      trim: true
    }],
    prompt: {
      type: String,
      default: ''
    },
    aiModel: {
      type: String,
      default: 'openrouter'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  savedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  image: {
    url: {
      type: String,
      default: null
    },
    alt: {
      type: String,
      default: ''
    }
  }
}, {
  timestamps: true
})

// Indexes
recipeSchema.index({ createdBy: 1, createdAt: -1 })
recipeSchema.index({ tags: 1 })
recipeSchema.index({ cuisine: 1 })
recipeSchema.index({ difficulty: 1 })
recipeSchema.index({ 'cookingTime.total': 1 })
recipeSchema.index({ 'ratings.average': -1 })

// Calculate total cooking time before saving
recipeSchema.pre('save', function(next) {
  if (this.cookingTime.prep && this.cookingTime.cook) {
    this.cookingTime.total = this.cookingTime.prep + this.cookingTime.cook
  }
  next()
})

// Virtual for formatted cooking time
recipeSchema.virtual('formattedCookingTime').get(function() {
  const total = this.cookingTime.total
  if (total < 60) {
    return `${total} min`
  } else {
    const hours = Math.floor(total / 60)
    const minutes = total % 60
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`
  }
})

// Static method to find recipes by ingredients
recipeSchema.statics.findByIngredients = function(ingredients) {
  return this.find({
    'generatedFrom.ingredients': {
      $in: ingredients.map(ing => new RegExp(ing, 'i'))
    }
  })
}

// Static method to find recipes by user
recipeSchema.statics.findByUser = function(userId) {
  return this.find({ createdBy: userId }).sort({ createdAt: -1 })
}

// Static method to find public recipes
recipeSchema.statics.findPublic = function() {
  return this.find({ isPublic: true }).sort({ 'ratings.average': -1 })
}

const Recipe = mongoose.model('Recipe', recipeSchema)

export default Recipe
