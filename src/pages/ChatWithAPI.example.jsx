/**
 * EXAMPLE: How to integrate Chat.jsx with the backend API
 * 
 * This file shows how to modify Chat.jsx to use real data from the backend
 * instead of sample data. Copy and paste the relevant parts into Chat.jsx
 * when you're ready to connect to your backend.
 */

import React, { useState, useEffect } from 'react';
import styles from './Chat.module.css';
import Sidebar from '../../components/chat/Sidebar/Sidebar';
import ChatWindow from '../../components/chat/ChatWindow/ChatWindow';
import { 
  fetchConversations, 
  fetchMessages, 
  sendMessage,
  getErrorMessage 
} from '../../services/chatService';

const ChatWithAPI = () => {
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Load all conversations on component mount
   */
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        const data = await fetchConversations();
        setConversations(data);
        
        // Auto-select first conversation
        if (data.length > 0) {
          setActiveConversation(data[0]);
        }
      } catch (err) {
        setError(getErrorMessage(err));
        console.error('Failed to load conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

  /**
   * Load messages when conversation is selected
   */
  useEffect(() => {
    const loadMessages = async () => {
      if (!activeConversation) return;

      try {
        setLoading(true);
        const data = await fetchMessages(activeConversation.id);
        setMessages(data);
      } catch (err) {
        setError(getErrorMessage(err));
        console.error('Failed to load messages:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [activeConversation]);

  /**
   * Handle sending a new message
   */
  const handleSendMessage = async (newMessage) => {
    if (!activeConversation) return;

    try {
      // Optimistically update UI
      const tempMessage = {
        ...newMessage,
        id: Date.now(),
      };
      setMessages([...messages, tempMessage]);

      // Send to server
      const response = await sendMessage(activeConversation.id, {
        text: newMessage.text,
        // Add other fields as needed (image, file, etc.)
      });

      // Update with server response (includes proper ID, etc.)
      setMessages(prev => 
        prev.map(msg => msg.id === tempMessage.id ? response : msg)
      );

      // Update conversation last message
      setConversations(
        conversations.map(conv =>
          conv.id === activeConversation.id
            ? {
              ...conv,
              lastMessage: newMessage.text,
              timestamp: new Date().toLocaleTimeString('vi-VN', { 
                hour: '2-digit', 
                minute: '2-digit' 
              }),
            }
            : conv
        )
      );
    } catch (err) {
      // Revert optimistic update on error
      setMessages(prev => prev.slice(0, -1));
      setError(getErrorMessage(err));
      console.error('Failed to send message:', err);
    }
  };

  /**
   * Handle conversation selection
   */
  const handleSelectConversation = async (conversation) => {
    setActiveConversation(conversation);
  };

  // Show loading state
  if (loading && conversations.length === 0) {
    return (
      <div className={styles.chatContainer}>
        <div className={styles.loadingContainer}>
          <p>Loading conversations...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={styles.chatContainer}>
        <div className={styles.errorContainer}>
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.sidebar}>
        <Sidebar
          conversations={conversations}
          activeConversation={activeConversation}
          onSelectConversation={handleSelectConversation}
        />
      </div>
      <div className={styles.chatArea}>
        <ChatWindow
          conversation={activeConversation}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default ChatWithAPI;

/**
 * ENVIRONMENT VARIABLES NEEDED
 * 
 * Create a .env file in your project root with:
 * REACT_APP_API_URL=http://your-api-server.com/api
 * 
 * Or use default: http://localhost:50646/api
 */

/**
 * BACKEND API ENDPOINTS REQUIRED
 * 
 * GET /api/conversations
 *   Returns: Array of conversation objects
 *   Example: [
 *     {
 *       id: 1,
 *       name: 'User Name',
 *       avatar: 'url-to-avatar',
 *       isOnline: true,
 *       lastMessage: 'Last message text',
 *       timestamp: '10:30',
 *       unreadCount: 0
 *     }
 *   ]
 * 
 * GET /api/conversations/:conversationId/messages?page=1&limit=50
 *   Returns: Array of message objects
 *   Example: [
 *     {
 *       id: 1,
 *       text: 'Message content',
 *       timestamp: '2026-01-29T10:30:00Z',
 *       isOwn: true,
 *       avatar: 'url-to-avatar',
 *       image?: 'url-to-image' (optional)
 *     }
 *   ]
 * 
 * POST /api/conversations/:conversationId/messages
 *   Body: { text: 'Message text', image?: 'image-url' }
 *   Returns: Created message object with id and timestamp
 * 
 * Optional endpoints:
 * GET /api/conversations/:conversationId
 * POST /api/conversations
 * PUT /api/conversations/:conversationId
 * DELETE /api/conversations/:conversationId
 * POST /api/conversations/:conversationId/mark-read
 * GET /api/users/:userId
 * POST /api/conversations/:conversationId/typing
 */
