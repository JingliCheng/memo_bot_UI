/**
 * Chat API utility for connecting to your backend
 * Replace the base URL and endpoints with your actual backend configuration
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'

/**
 * Send a message to the chatbot backend
 * @param {string} message - The user's message
 * @param {string} sessionId - Optional session ID for conversation continuity
 * @returns {Promise<Object>} The bot's response
 */
export const sendMessage = async (message, sessionId = null) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers if needed
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        message,
        sessionId,
        // Add any other required fields for your backend
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error sending message:', error)
    throw error
  }
}

/**
 * Get conversation history
 * @param {string} sessionId - Session ID to retrieve history for
 * @returns {Promise<Array>} Array of previous messages
 */
export const getConversationHistory = async (sessionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/history/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers if needed
        // 'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching conversation history:', error)
    throw error
  }
}

/**
 * Create a new chat session
 * @returns {Promise<string>} New session ID
 */
export const createSession = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers if needed
        // 'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.sessionId
  } catch (error) {
    console.error('Error creating session:', error)
    throw error
  }
}
