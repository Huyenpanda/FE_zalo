import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import socketService from '../socket';
import * as api from '../api';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'LyLy',
      avatar: 'https://ui-avatars.com/api/?name=LyLy&background=0084ff&color=fff',
      lastMessage: 'Bạn: 📄 Sticker',
      time: '4 ngày',
      online: true
    },
    {
      id: 2,
      name: 'Sinh viên D17 EPU-IT',
      avatar: 'https://ui-avatars.com/api/?name=D17&background=ff6b6b&color=fff',
      lastMessage: 'Phạm Quang Huy: thường sau khi kết...',
      time: '19 giờ',
      unread: 5,
      group: true
    }
  ]);

  const [selectedChat, setSelectedChat] = useState({
    id: 1,
    name: 'LyLy',
    avatar: 'https://ui-avatars.com/api/?name=LyLy&background=0084ff&color=fff',
    lastMessage: 'Bạn: 📄 Sticker',
    time: '4 ngày',
    online: true
  });

  const [messages, setMessages] = useState([
    {
      id: 101,
      conversationId: 1,
      sender: { id: 999, name: 'LyLy' },
      content: 'Xin chào 👋',
      type: 'text',
      timestamp: new Date().toISOString(),
      status: 'sent'
    },
    {
      id: 102,
      conversationId: 1,
      sender: { id: 1000, name: 'Bạn' },
      content: 'Chào bạn!',
      type: 'text',
      timestamp: new Date().toISOString(),
      status: 'sent'
    }
  ]);

  const [loading, setLoading] = useState(false); // hoặc true để test trạng thái loading
  const [error, setError] = useState(null); // hoặc 'Không thể tải dữ liệu' để test UI error

  const [currentUser, setCurrentUser] = useState({
    id: 1000,
    name: 'Bạn',
    avatar: 'https://ui-avatars.com/api/?name=Ban&background=ff6b6b&color=fff'
  });

  const [onlineUsers, setOnlineUsers] = useState(new Set([999, 1000]));
  // giả sử cả bạn và LyLy đều online

  const [typingUsers, setTypingUsers] = useState(
    new Map([[1, new Set([999])]])
  );
  // giả sử LyLy đang gõ trong conversation id=1

  // ============= INIT =============

  useEffect(() => {
    // Lấy user từ localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);

      // Fetch conversations
      fetchConversations();

      // Connect to WebSocket
      initializeSocket(user.id);
    }

    return () => {
      // Cleanup khi unmount
      socketService.disconnect();
    };
  }, []);

  // ============= SOCKET SETUP =============

  const initializeSocket = (userId) => {
    try {
      socketService.connect(userId);

      // Lắng nghe tin nhắn mới
      socketService.onNewMessage((message) => {
        handleNewMessage(message);
      });

      // Lắng nghe typing indicator
      socketService.onTyping((data) => {
        handleTyping(data);
      });

      // Lắng nghe user status changes
      socketService.onUserStatusChange((data) => {
        handleUserStatusChange(data);
      });

      // Lắng nghe message read
      socketService.onMessageRead((data) => {
        handleMessageRead(data);
      });

      // Lắng nghe message deleted
      socketService.onMessageDeleted((data) => {
        handleMessageDeleted(data);
      });

      // Lắng nghe message updated
      socketService.onMessageUpdated((data) => {
        handleMessageUpdated(data);
      });

    } catch (error) {
      console.error('Socket initialization error:', error);
    }
  };

  // ============= CONVERSATIONS =============

  const fetchConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getConversations();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Không thể tải danh sách cuộc trò chuyện');
    } finally {
      setLoading(false);
    }
  };

  const selectChat = useCallback((chat) => {
    setSelectedChat(chat);

    // Join conversation room
    if (chat?.id) {
      socketService.joinConversation(chat.id);
      fetchMessages(chat.id);
    }
  }, []);

  // ============= MESSAGES =============

  const fetchMessages = async (conversationId, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMessages(conversationId, page, 50);
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Không thể tải tin nhắn');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content, type = 'text', attachments = []) => {
    if (!selectedChat) return;

    try {
      const messageData = {
        conversationId: selectedChat.id,
        content,
        type,
        attachments,
        timestamp: new Date().toISOString()
      };

      // Optimistic update - thêm tin nhắn vào UI ngay
      const tempMessage = {
        id: `temp-${Date.now()}`,
        ...messageData,
        type: 'sent',
        status: 'sending',
        sender: currentUser
      };
      setMessages(prev => [...prev, tempMessage]);

      // Gửi qua WebSocket
      socketService.sendMessage(messageData);

      // Hoặc gửi qua API (tùy backend setup)
      // const response = await api.sendMessage(messageData);

      // Update conversation preview
      updateConversationPreview(selectedChat.id, content);

    } catch (error) {
      console.error('Error sending message:', error);
      setError('Không thể gửi tin nhắn');

      // Rollback optimistic update nếu lỗi
      setMessages(prev => prev.filter(m => !m.id.startsWith('temp-')));
    }
  };

  const handleNewMessage = (message) => {
    // Nếu tin nhắn thuộc conversation hiện tại
    if (message.conversationId === selectedChat?.id) {
      setMessages(prev => {
        // Remove temp message nếu có
        const filtered = prev.filter(m => !m.id.startsWith('temp-'));
        return [...filtered, message];
      });

      // Đánh dấu đã đọc nếu đang xem conversation này
      if (message.sender.id !== currentUser?.id) {
        socketService.markAsRead(message.id, message.conversationId);
      }
    }

    // Update conversation preview
    updateConversationPreview(message.conversationId, message.content, message.timestamp);
  };

  const handleMessageDeleted = ({ messageId, conversationId }) => {
    if (conversationId === selectedChat?.id) {
      setMessages(prev => prev.filter(m => m.id !== messageId));
    }
  };

  const handleMessageUpdated = ({ messageId, content, conversationId }) => {
    if (conversationId === selectedChat?.id) {
      setMessages(prev =>
        prev.map(m => m.id === messageId ? { ...m, content, edited: true } : m)
      );
    }
  };

  const handleMessageRead = ({ messageId, userId }) => {
    setMessages(prev =>
      prev.map(m =>
        m.id === messageId
          ? { ...m, readBy: [...(m.readBy || []), userId] }
          : m
      )
    );
  };

  const deleteMessage = async (messageId) => {
    try {
      await api.deleteMessage(messageId);
      socketService.emit('message:delete', { messageId, conversationId: selectedChat.id });
    } catch (error) {
      console.error('Error deleting message:', error);
      setError('Không thể xóa tin nhắn');
    }
  };

  const updateMessage = async (messageId, content) => {
    try {
      await api.updateMessage(messageId, content);
      socketService.emit('message:update', { messageId, content, conversationId: selectedChat.id });
    } catch (error) {
      console.error('Error updating message:', error);
      setError('Không thể sửa tin nhắn');
    }
  };

  // ============= TYPING INDICATOR =============

  const startTyping = () => {
    if (selectedChat) {
      socketService.emitTyping(selectedChat.id);
    }
  };

  const stopTyping = () => {
    if (selectedChat) {
      socketService.emitStopTyping(selectedChat.id);
    }
  };

  const handleTyping = ({ userId, conversationId, isTyping }) => {
    setTypingUsers(prev => {
      const newMap = new Map(prev);
      const users = newMap.get(conversationId) || new Set();

      if (isTyping) {
        users.add(userId);
      } else {
        users.delete(userId);
      }

      newMap.set(conversationId, users);
      return newMap;
    });
  };

  // ============= USER STATUS =============

  const handleUserStatusChange = ({ userId, status }) => {
    setOnlineUsers(prev => {
      const newSet = new Set(prev);
      if (status === 'online') {
        newSet.add(userId);
      } else {
        newSet.delete(userId);
      }
      return newSet;
    });

    // Update conversation list
    setConversations(prev =>
      prev.map(conv =>
        conv.userId === userId ? { ...conv, online: status === 'online' } : conv
      )
    );
  };

  // ============= FILE UPLOAD =============

  const uploadFile = async (file, onProgress) => {
    try {
      const response = await api.uploadFile(file, onProgress);
      return response.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Không thể upload file');
      throw error;
    }
  };

  // ============= HELPERS =============

  const updateConversationPreview = (conversationId, lastMessage, timestamp) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? {
            ...conv,
            lastMessage,
            time: timestamp ? formatTime(timestamp) : 'Bây giờ',
            unread: conv.id !== selectedChat?.id ? (conv.unread || 0) + 1 : 0
          }
          : conv
      )
    );
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Bây giờ';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} phút`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ`;
    return `${Math.floor(diff / 86400000)} ngày`;
  };

  // ============= CONTEXT VALUE =============

  const value = {
    // State
    conversations,
    selectedChat,
    messages,
    loading,
    error,
    currentUser,
    onlineUsers,
    typingUsers,

    // Actions
    fetchConversations,
    selectChat: selectChat,
    setSelectedChat: selectChat,
    fetchMessages,
    sendMessage,
    deleteMessage,
    updateMessage,
    startTyping,
    stopTyping,
    uploadFile,

    // Helpers
    isUserOnline: (userId) => onlineUsers.has(userId),
    isUserTyping: (conversationId, userId) => typingUsers.get(conversationId)?.has(userId) || false
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// Hook để sử dụng ChatContext
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

export default ChatContext;