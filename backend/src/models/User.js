import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name must be less than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  avatar: {
    type: String,
    default: null
  },
  avatarPublicId: {
    type: String,
    default: null
  },
  preferences: {
    language: {
      type: String,
      enum: ['en', 'it', 'fr', 'de'],
      default: 'en'
    },
    detectedLanguage: {
      type: String,
      enum: ['en', 'it', 'fr', 'de'],
      default: null
    },
    languageDetectionMetadata: {
      source: {
        type: String,
        enum: ['ip', 'browser', 'fallback'],
        default: null
      },
      confidence: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: null
      },
      country: {
        type: String,
        default: null
      },
      detectedAt: {
        type: Date,
        default: null
      }
    },
    dietaryRestrictions: [{
      type: String,
      enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'kosher', 'halal']
    }],
    cuisinePreferences: [{
      type: String,
      enum: ['italian', 'french', 'chinese', 'japanese', 'indian', 'mexican', 'american', 'mediterranean']
    }],
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'any'],
      default: 'any'
    },
    maxCookingTime: {
      type: Number,
      default: 120 // minutes
    },
    savedRecipes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    }],
    recentActivity: [{
      id: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      timestamp: {
        type: String,
        required: true
      }
    }]
  },
  stats: {
    totalRecipes: {
      type: Number,
      default: 0
    },
    totalScans: {
      type: Number,
      default: 0
    },
    savedRecipes: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next()
  
  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12)
    this.password = hashedPassword
    next()
  } catch (error) {
    next(error)
  }
})

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Instance method to get public profile
userSchema.methods.toJSON = function() {
  const userObject = this.toObject()
  delete userObject.password
  return userObject
}

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() })
}

// Update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date()
  return this.save()
}

const User = mongoose.model('User', userSchema)

export default User
