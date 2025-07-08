import { onMounted, onUnmounted } from 'vue'
import axios from 'axios'

export function useHeartbeat() {
  let heartbeatInterval = null

  const sendHeartbeat = async () => {
    try {
      await axios.post('/heartbeat')
    } catch (error) {
      // Silently fail - don't spam console
      // console.error('Heartbeat failed:', error)
    }
  }

  const startHeartbeat = () => {
    // Send initial heartbeat
    sendHeartbeat()
    
    // Send heartbeat every 30 seconds
    heartbeatInterval = setInterval(sendHeartbeat, 30000)
  }

  const stopHeartbeat = () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval)
      heartbeatInterval = null
    }
  }

  onMounted(() => {
    startHeartbeat()
  })

  onUnmounted(() => {
    stopHeartbeat()
  })

  return {
    sendHeartbeat,
    startHeartbeat,
    stopHeartbeat
  }
}