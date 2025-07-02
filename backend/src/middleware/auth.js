import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required',
        code: 'TOKEN_MISSING' 
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Find user
    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      return res.status(401).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND' 
      })
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        error: 'User account is deactivated',
        code: 'ACCOUNT_DEACTIVATED' 
      })
    }

    // Add user to request object
    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token',
        code: 'TOKEN_INVALID' 
      })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        code: 'TOKEN_EXPIRED' 
      })
    }

    console.error('Auth middleware error:', error)
    res.status(500).json({ 
      error: 'Authentication failed',
      code: 'AUTH_ERROR' 
    })
  }
}

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      req.user = null
      return next()
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select('-password')
    
    req.user = user && user.isActive ? user : null
    next()
  } catch (error) {
    // For optional auth, we just set user to null on error
    req.user = null
    next()
  }
}

export const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET, 
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      issuer: 'fridgewiseai'
    }
  )
}

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}
