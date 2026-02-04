/**
 * Chat Service API Integration
 * 
 * This service provides methods to integrate the Zalo-like chat interface
 * with a backend API. Replace the API endpoints with your actual backend URLs.
 */

import axios from 'axios';

// API Base URL - Update this to your backend server
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if authenticated
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Fetch all conversations for the current user
 * @returns {Promise<Array>} Array of conversation objects
 */
export const fetchConversations = async () => {
  try {
    const response = await apiClient.get('/conversations');
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

/**
 * Fetch messages for a specific conversation
 * @param {number} conversationId - The ID of the conversation
 * @param {number} page - Page number for pagination (optional)
 * @param {number} limit - Number of messages per page (optional)
 * @returns {Promise<Array>} Array of message objects
 */
export const fetchMessages = async (conversationId, page = 1, limit = 50) => {
  try {
    const response = await apiClient.get(`/conversations/${conversationId}/messages`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching messages for conversation ${conversationId}:`, error);
    throw error;
  }
};

/**
 * Fetch a single conversation with details
 * @param {number} conversationId - The ID of the conversation
 * @returns {Promise<Object>} Conversation object
 */
export const fetchConversationDetail = async (conversationId) => {
  try {
    const response = await apiClient.get(`/conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching conversation ${conversationId}:`, error);
    throw error;
  }
};

/**
 * Send a new message
 * @param {number} conversationId - The ID of the conversation
 * @param {Object} messageData - Message object with text, image, etc.
 * @returns {Promise<Object>} Created message object from server
 */
export const sendMessage = async (conversationId, messageData) => {
  try {
    const response = await apiClient.post(
      `/conversations/${conversationId}/messages`,
      messageData
    );
    return response.data;
  } catch (error) {
    console.error(`Error sending message:`, error);
    throw error;
  }
};

/**
 * Upload an image for a message
 * @param {number} conversationId - The ID of the conversation
 * @param {File} file - The image file to upload
 * @returns {Promise<Object>} Upload response with image URL
 */
export const uploadImage = async (conversationId, file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post(
      `/conversations/${conversationId}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Create a new conversation
 * @param {Object} conversationData - Conversation details (participants, name, etc.)
 * @returns {Promise<Object>} Created conversation object
 */
export const createConversation = async (conversationData) => {
  try {
    const response = await apiClient.post('/conversations', conversationData);
    return response.data;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};

/**
 * Update conversation (name, avatar, etc.)
 * @param {number} conversationId - The ID of the conversation
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated conversation object
 */
export const updateConversation = async (conversationId, updateData) => {
  try {
    const response = await apiClient.put(
      `/conversations/${conversationId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating conversation ${conversationId}:`, error);
    throw error;
  }
};

/**
 * Delete a conversation
 * @param {number} conversationId - The ID of the conversation to delete
 * @returns {Promise<void>}
 */
export const deleteConversation = async (conversationId) => {
  try {
    await apiClient.delete(`/conversations/${conversationId}`);
  } catch (error) {
    console.error(`Error deleting conversation ${conversationId}:`, error);
    throw error;
  }
};

/**
 * Mark messages as read
 * @param {number} conversationId - The ID of the conversation
 * @param {Array<number>} messageIds - Array of message IDs to mark as read
 * @returns {Promise<void>}
 */
export const markMessagesAsRead = async (conversationId, messageIds) => {
  try {
    await apiClient.post(
      `/conversations/${conversationId}/mark-read`,
      { messageIds }
    );
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};

/**
 * Search conversations
 * @param {string} query - Search query string
 * @returns {Promise<Array>} Array of matching conversations
 */
export const searchConversations = async (query) => {
  try {
    const response = await apiClient.get('/conversations/search', {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching conversations:', error);
    throw error;
  }
};

/**
 * Search messages within a conversation
 * @param {number} conversationId - The ID of the conversation
 * @param {string} query - Search query string
 * @returns {Promise<Array>} Array of matching messages
 */
export const searchMessages = async (conversationId, query) => {
  try {
    const response = await apiClient.get(
      `/conversations/${conversationId}/messages/search`,
      {
        params: { q: query },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error searching messages:', error);
    throw error;
  }
};

/**
 * Get typing status (for real-time features)
 * @param {number} conversationId - The ID of the conversation
 * @returns {Promise<Array>} Array of users currently typing
 */
export const getTypingStatus = async (conversationId) => {
  try {
    const response = await apiClient.get(
      `/conversations/${conversationId}/typing-status`
    );
    return response.data;
  } catch (error) {
    console.error('Error getting typing status:', error);
    throw error;
  }
};

/**
 * Send typing indicator
 * @param {number} conversationId - The ID of the conversation
 * @param {boolean} isTyping - Whether user is typing
 * @returns {Promise<void>}
 */
export const sendTypingIndicator = async (conversationId, isTyping) => {
  try {
    await apiClient.post(`/conversations/${conversationId}/typing`, { isTyping });
  } catch (error) {
    console.error('Error sending typing indicator:', error);
    throw error;
  }
};

/**
 * Fetch user profile
 * @param {number} userId - The ID of the user
 * @returns {Promise<Object>} User profile object
 */
export const fetchUserProfile = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user profile ${userId}:`, error);
    throw error;
  }
};

/**
 * Handle API errors with user-friendly messages
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (error.response) {
    // Server responded with error status
    switch (error.response.status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'You are not authenticated. Please login.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return error.response.data.message || 'An error occurred.';
    }
  } else if (error.request) {
    // Request made but no response
    return 'No response from server. Check your connection.';
  } else {
    // Error in request setup
    return 'An error occurred. Please try again.';
  }
};

export default apiClient;
