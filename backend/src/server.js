import app from './app.js'
import { execSync } from 'child_process'

const PORT = process.env.PORT || 3001

// Get local IP for better network info
const getLocalIP = () => {
  try {
    const ip = execSync("hostname -I | awk '{print $1}'", { encoding: 'utf8' }).trim()
    return ip || 'localhost'
  } catch {
    return 'localhost'
  }
}

const server = app.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIP()
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔗 Local API URL: http://localhost:${PORT}`)
  console.log(`🌐 Network API URL: http://${localIP}:${PORT}`)
  console.log(`🏥 Health check: http://localhost:${PORT}/health`)
  console.log(`📱 Access from network: http://${localIP}:${PORT}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('✅ Process terminated')
  })
})

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully')
  server.close(() => {
    console.log('✅ Process terminated')
  })
})

export default server
