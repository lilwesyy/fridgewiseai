import User from '../models/User.js'
import { generateToken } from '../middleware/auth.js'
import Joi from 'joi'

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
  })
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

    const { name, email, password } = value

    // Check if user already exists
    const existingUser = await User.findByEmail(email)
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        code: 'USER_EXISTS'
      })
    }

    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password
    })

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
        maxCookingTime: Joi.number().min(1).max(480).optional()
      }).optional()
    })

    const { error, value } = updateSchema.validate(req.body)
    if (error) {
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
