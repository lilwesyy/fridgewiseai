import User from '../models/User.js'
import { generateToken } from '../middleware/auth.js'
import { uploadImage, deleteImage } from '../services/cloudinaryService.js'
import { getLocationFromIP, getRealIP } from '../services/geolocationService.js'
import Joi from 'joi'
import multer from 'multer'

// Configure multer for memory storage
const storage = multer.memoryStorage()
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  }
})

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must be less than 50 characters',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required'
  }),
  // Lingua rilevata automaticamente dal frontend
  detectedLanguage: Joi.string().valid('en', 'it', 'fr', 'de').optional(),
  // Metadata del rilevamento per analytics
  languageDetectionMetadata: Joi.object({
    source: Joi.string().valid('localStorage', 'ip-geolocation', 'browser', 'browser-accepted', 'default').optional(),
    confidence: Joi.string().valid('high', 'medium', 'low').optional(),
    country: Joi.string().length(2).optional(),
    timezone: Joi.string().optional()
  }).optional()
})

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
})

export const register = async (req, res) => {
  try {
    // Validate input
    const { error, value } = registerSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(detail => detail.message)
      })
    }

    const { name, email, password, detectedLanguage, languageDetectionMetadata } = value

    // Check if user already exists
    const existingUser = await User.findByEmail(email)
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        code: 'USER_EXISTS'
      })
    }

    // Prepara i dati utente con la lingua rilevata
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password
    }

    // Se è stata rilevata una lingua valida, impostala come preferenza
    if (detectedLanguage && ['en', 'it', 'fr', 'de'].includes(detectedLanguage)) {
      userData.preferences = {
        language: detectedLanguage,
        detectedLanguage: detectedLanguage
      }
      
      // Aggiungi i metadata della rilevazione se disponibili
      if (languageDetectionMetadata) {
        userData.preferences.languageDetectionMetadata = {
          source: languageDetectionMetadata.source,
          confidence: languageDetectionMetadata.confidence,
          country: languageDetectionMetadata.country,
          detectedAt: new Date()
        }
        
        console.log(`🌍 Language detection metadata saved:`, userData.preferences.languageDetectionMetadata)
      }
      
      console.log(`🌍 Setting user language to ${detectedLanguage} based on detection`)
    }

    // Get user's IP and location
    const userIP = getRealIP(req)
    const location = await getLocationFromIP(userIP)
    
    // Add location to user data only if not local IP
    if (location) {
      userData.location = location
    }

    // Create new user
    const user = new User(userData)

    await user.save()

    // Generate token
    const token = generateToken(user._id)

    // Update last login
    await user.updateLastLogin()

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
        stats: user.stats,
        createdAt: user.createdAt
      },
      token
    })
  } catch (error) {
    console.error('Registration error:', error)
    
    if (error.code === 11000) {
      return res.status(409).json({
        error: 'User already exists',
        code: 'USER_EXISTS'
      })
    }
    
    res.status(500).json({
      error: 'Registration failed',
      code: 'REGISTRATION_ERROR'
    })
  }
}

export const login = async (req, res) => {
  try {
    // Validate input
    const { error, value } = loginSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(detail => detail.message)
      })
    }

    const { email, password } = value

    // Find user by email
    const user = await User.findByEmail(email)
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      })
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        error: 'Account is deactivated',
        code: 'ACCOUNT_DEACTIVATED'
      })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      })
    }

    // Generate token
    const token = generateToken(user._id)

    // Update last login
    await user.updateLastLogin()

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
        stats: user.stats,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      },
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      error: 'Login failed',
      code: 'LOGIN_ERROR'
    })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = req.user

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
        stats: user.stats,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({
      error: 'Failed to get profile',
      code: 'PROFILE_ERROR'
    })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const updateSchema = Joi.object({
      name: Joi.string().min(2).max(50).optional(),
      preferences: Joi.object({
        language: Joi.string().valid('en', 'it', 'fr', 'de').optional(),
        dietaryRestrictions: Joi.array().items(
          Joi.string().valid('vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'kosher', 'halal')
        ).optional(),
        cuisinePreferences: Joi.array().items(
          Joi.string().valid('italian', 'french', 'chinese', 'japanese', 'indian', 'mexican', 'american', 'mediterranean')
        ).optional(),
        difficulty: Joi.string().valid('easy', 'medium', 'hard', 'any').optional(),
        maxCookingTime: Joi.number().min(1).max(480).optional(),
        recentActivity: Joi.array().items(
          Joi.object({
            id: Joi.string().optional(),
            title: Joi.string().optional(),
            timestamp: Joi.string().optional()
          })
        ).max(10).optional(),
        savedRecipes: Joi.array().items(Joi.string()).optional()
      }).optional()
    })

    const { error, value } = updateSchema.validate(req.body)
    if (error) {
      console.log('Profile update validation error:', error.details)
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(detail => detail.message)
      })
    }

    const user = await User.findById(req.user._id)
    
    if (value.name) {
      user.name = value.name.trim()
    }
    
    if (value.preferences) {
      user.preferences = { ...user.preferences, ...value.preferences }
    }

    await user.save()

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
        stats: user.stats,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      error: 'Failed to update profile',
      code: 'UPDATE_ERROR'
    })
  }
}

export const refreshToken = async (req, res) => {
  try {
    const user = req.user
    const newToken = generateToken(user._id)

    res.json({
      message: 'Token refreshed successfully',
      token: newToken
    })
  } catch (error) {
    console.error('Token refresh error:', error)
    res.status(500).json({
      error: 'Failed to refresh token',
      code: 'REFRESH_ERROR'
    })
  }
}

// Avatar upload and management
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No image file provided',
        code: 'NO_FILE'
      })
    }

    const user = req.user

    // Upload new avatar to Cloudinary
    const uploadResult = await uploadImage(req.file.buffer, {
      public_id: `avatar_${user._id}`,
      overwrite: true
    })

    // If user had a previous avatar, delete it (optional since we're overwriting)
    // if (user.avatar && user.avatarPublicId) {
    //   await deleteImage(user.avatarPublicId)
    // }

    // Update user with new avatar
    user.avatar = uploadResult.secure_url
    user.avatarPublicId = uploadResult.public_id
    await user.save()

    res.json({
      message: 'Avatar uploaded successfully',
      avatar: uploadResult.secure_url,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        preferences: user.preferences,
        stats: user.stats,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Avatar upload error:', error)
    res.status(500).json({
      error: 'Failed to upload avatar',
      code: 'UPLOAD_ERROR'
    })
  }
}

export const removeAvatar = async (req, res) => {
  try {
    const user = req.user

    // Delete from Cloudinary if exists
    if (user.avatarPublicId) {
      await deleteImage(user.avatarPublicId)
    }

    // Remove avatar from user
    user.avatar = null
    user.avatarPublicId = null
    await user.save()

    res.json({
      message: 'Avatar removed successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        preferences: user.preferences,
        stats: user.stats,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Avatar removal error:', error)
    res.status(500).json({
      error: 'Failed to remove avatar',
      code: 'REMOVAL_ERROR'
    })
  }
}

// Change password
export const changePassword = async (req, res) => {
  try {
    const changePasswordSchema = Joi.object({
      currentPassword: Joi.string().required().messages({
        'any.required': 'Current password is required'
      }),
      newPassword: Joi.string().min(6).required().messages({
        'string.min': 'New password must be at least 6 characters',
        'any.required': 'New password is required'
      })
    })

    const { error, value } = changePasswordSchema.validate(req.body)
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(detail => detail.message)
      })
    }

    const { currentPassword, newPassword } = value
    const user = await User.findById(req.user._id)

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        error: 'Current password is incorrect',
        code: 'INVALID_CURRENT_PASSWORD'
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({
      message: 'Password changed successfully'
    })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({
      error: 'Failed to change password',
      code: 'PASSWORD_CHANGE_ERROR'
    })
  }
}
