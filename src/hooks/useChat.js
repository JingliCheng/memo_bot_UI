import { useState, useCallback, useRef } from 'react'
import { sendMessage, createSession } from '../api/chatApi'

/**
 * Custom hook for managing chat functionality
 * @returns {Object} Chat state and functions
 */
export const useChat = () => {
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState(null)
  const sessionIdRef = useRef(null)

  // Initialize session on first use
  const initializeSession = useCallback(async () => {
    if (!sessionIdRef.current) {
      try {
        sessionIdRef.current = await createSession()
      } catch (error) {
        console.error('Failed to create session:', error)
        // Continue without session ID if creation fails
      }
    }
  }, [])

  const sendMessageToBot = useCallback(async (userMessage) => {
    if (!userMessage.trim()) return

    // Initialize session if needed
    await initializeSession()

    const userMsg = {
      id: Date.now(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)
    setError(null)

    try {
      const response = await sendMessage(userMessage, sessionIdRef.current)
      
      const botMessage = {
        id: Date.now() + 1,
        text: response.message || response.text || 'Sorry, I could not process your request.',
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      setError('Failed to send message. Please try again.')
      
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please check your connection and try again.',
        sender: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }, [initializeSession])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
    sessionIdRef.current = null
  }, [])

  return {
    messages,
    isTyping,
    error,
    sendMessage: sendMessageToBot,
    clearMessages
  }
}
