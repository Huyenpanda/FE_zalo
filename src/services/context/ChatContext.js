// ChatContext.js
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import socketService from '../socket';
import api from '../api';
import axios from 'axios'; 
const ChatContext = createContext();

// ============================================================
// MOCK DATA — tồn tại song song với API data
// ID bắt đầu bằng "mock-" để không bao giờ trùng với DB
// ============================================================
const MOCK_CONVERSATIONS = [
  {
    id: 'mock-conv-1',
    userId: 'mock-user-1',
    name: 'Nguyễn Thị Lan',
    avatar: 'https://ui-avatars.com/api/?name=Nguyen+Thi+Lan&background=0084ff&color=fff',
    lastMessage: 'Bạn ơi tối nay rảnh không?',
    time: '2 phút',
    online: true,
    unread: 2,
    type: 'PRIVATE',
    group: false,
    isMock: true,
  },
  {
    id: 'mock-conv-2',
    userId: 'mock-user-2',
    name: 'Trần Văn Minh',
    avatar: 'https://ui-avatars.com/api/?name=Tran+Van+Minh&background=ff6b6b&color=fff',
    lastMessage: 'Ok bạn nhé, để tôi xem lại code',
    time: '1 giờ',
    online: false,
    unread: 0,
    type: 'PRIVATE',
    group: false,
    isMock: true,
  },
  {
    id: 'mock-conv-3',
    userId: null,
    name: 'Nhóm Dự Án Zola',
    avatar: 'https://ui-avatars.com/api/?name=Zola+Team&background=00b894&color=fff',
    lastMessage: 'Minh: Đã push code lên rồi nhé mọi người',
    time: '3 giờ',
    online: false,
    unread: 5,
    type: 'GROUP',
    group: true,
    isMock: true,
  },
  {
    id: 'mock-conv-4',
    userId: 'mock-user-4',
    name: 'Lê Hoàng Nam',
    avatar: 'https://ui-avatars.com/api/?name=Le+Hoang+Nam&background=6c5ce7&color=fff',
    lastMessage: 'Cảm ơn bạn nhiều lắm!',
    time: '1 ngày',
    online: true,
    unread: 0,
    type: 'PRIVATE',
    group: false,
    isMock: true,
  },
];

// Mock messages theo từng conversation
const MOCK_MESSAGES = {
  'mock-conv-1': [
    {
      id: 'mock-msg-1-1', _id: 'mock-msg-1-1',
      conversationId: 'mock-conv-1',
      content: 'Chào bạn! 👋',
      senderId: 'mock-user-1',
      sender: { _id: 'mock-user-1', fullName: 'Nguyễn Thị Lan', avatar: 'https://ui-avatars.com/api/?name=Lan&background=0084ff&color=fff' },
      type: 'TEXT', isRead: true,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'mock-msg-1-2', _id: 'mock-msg-1-2',
      conversationId: 'mock-conv-1',
      content: 'Chào Lan! Lâu rồi không gặp 😄',
      senderId: 'me',
      sender: null,
      type: 'TEXT', isRead: true,
      createdAt: new Date(Date.now() - 3600000 * 1.9).toISOString(),
    },
    {
      id: 'mock-msg-1-3', _id: 'mock-msg-1-3',
      conversationId: 'mock-conv-1',
      content: 'Bạn ơi tối nay rảnh không?',
      senderId: 'mock-user-1',
      sender: { _id: 'mock-user-1', fullName: 'Nguyễn Thị Lan', avatar: 'https://ui-avatars.com/api/?name=Lan&background=0084ff&color=fff' },
      type: 'TEXT', isRead: false,
      createdAt: new Date(Date.now() - 120000).toISOString(),
    },
  ],
  'mock-conv-2': [
    {
      id: 'mock-msg-2-1', _id: 'mock-msg-2-1',
      conversationId: 'mock-conv-2',
      content: 'Minh ơi, cái bug hôm qua fix chưa?',
      senderId: 'me',
      sender: null,
      type: 'TEXT', isRead: true,
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: 'mock-msg-2-2', _id: 'mock-msg-2-2',
      conversationId: 'mock-conv-2',
      content: 'Ok bạn nhé, để tôi xem lại code',
      senderId: 'mock-user-2',
      sender: { _id: 'mock-user-2', fullName: 'Trần Văn Minh', avatar: 'https://ui-avatars.com/api/?name=Minh&background=ff6b6b&color=fff' },
      type: 'TEXT', isRead: true,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
  'mock-conv-3': [
    {
      id: 'mock-msg-3-1', _id: 'mock-msg-3-1',
      conversationId: 'mock-conv-3',
      content: 'Mọi người ơi, họp lúc 3h chiều nhé!',
      senderId: 'mock-user-1',
      sender: { _id: 'mock-user-1', fullName: 'Nguyễn Thị Lan', avatar: 'https://ui-avatars.com/api/?name=Lan&background=0084ff&color=fff' },
      type: 'TEXT', isRead: true,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: 'mock-msg-3-2', _id: 'mock-msg-3-2',
      conversationId: 'mock-conv-3',
      content: 'Đã push code lên rồi nhé mọi người',
      senderId: 'mock-user-2',
      sender: { _id: 'mock-user-2', fullName: 'Trần Văn Minh', avatar: 'https://ui-avatars.com/api/?name=Minh&background=ff6b6b&color=fff' },
      type: 'TEXT', isRead: false,
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
  ],
  'mock-conv-4': [
    {
      id: 'mock-msg-4-1', _id: 'mock-msg-4-1',
      conversationId: 'mock-conv-4',
      content: 'Bạn giúp mình vấn đề này được không?',
      senderId: 'mock-user-4',
      sender: { _id: 'mock-user-4', fullName: 'Lê Hoàng Nam', avatar: 'https://ui-avatars.com/api/?name=Nam&background=6c5ce7&color=fff' },
      type: 'TEXT', isRead: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'mock-msg-4-2', _id: 'mock-msg-4-2',
      conversationId: 'mock-conv-4',
      content: 'Được, bạn cứ nói đi nhé!',
      senderId: 'me',
      sender: null,
      type: 'TEXT', isRead: true,
      createdAt: new Date(Date.now() - 86400000 + 60000).toISOString(),
    },
    {
      id: 'mock-msg-4-3', _id: 'mock-msg-4-3',
      conversationId: 'mock-conv-4',
      content: 'Cảm ơn bạn nhiều lắm!',
      senderId: 'mock-user-4',
      sender: { _id: 'mock-user-4', fullName: 'Lê Hoàng Nam', avatar: 'https://ui-avatars.com/api/?name=Nam&background=6c5ce7&color=fff' },
      type: 'TEXT', isRead: true,
      createdAt: new Date(Date.now() - 86400000 + 120000).toISOString(),
    },
  ],
};

// ============================================================
// Helper: normalize conversation từ API về cùng format mock
// ============================================================
const normalizeApiConversation = (conv, currentUserId) => {
  const participantList = Array.isArray(conv.participants)
    ? conv.participants
    : Array.isArray(conv.members)
      ? conv.members
      : conv.participant
        ? [conv.participant]
        : Array.isArray(conv.users)
          ? conv.users
          : [];
  const otherUser = participantList.find(
    u => String(u.id || u._id) !== String(currentUserId)
  );
  return {
    id: conv.id || conv._id,
    userId: otherUser?.id || otherUser?._id,
    name: conv.type === 'GROUP'
      ? (conv.name || 'Nhóm chưa đặt tên')
      : (otherUser?.fullName || otherUser?.username || 'Unknown'),
  
    avatar: conv.type === 'GROUP'
      ? (conv.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.name || 'Group')}&background=00b894&color=fff`)
      : (otherUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.fullName || 'U')}&background=0084ff&color=fff`),
    lastMessage: conv.lastMessage?.content || '',
    time: conv.lastMessage?.createdAt,
    online: otherUser?.isOnline || false,
    unread: conv.unreadCount || 0,
    type: conv.type || 'PRIVATE',
    group: conv.type === 'GROUP',
    isMock: false,
  };
};

// Helper: normalize message từ API
const normalizeApiMessage = (m, conversationId) => ({
  id: m._id || m.id,
  _id: m._id || m.id,
  conversationId: m.conversation || m.conversationId || conversationId,
  content: m.content,
  senderId: m.sender?._id || m.sender?.id || m.senderId,
  sender: m.sender,
  type: m.type || 'TEXT',
  imageUrl: m.imageUrl,
  attachments: m.attachments,
  isRead: m.isRead,
  createdAt: m.createdAt,
});

// ============================================================
// CONTEXT
// ============================================================
export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [selectedChat, setSelectedChat] = useState(MOCK_CONVERSATIONS[0]);
  const [messages, setMessages] = useState(MOCK_MESSAGES['mock-conv-1']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Map());

  const selectedChatRef = useRef(MOCK_CONVERSATIONS[0]);
  const currentUserRef = useRef(null);

  useEffect(() => { selectedChatRef.current = selectedChat; }, [selectedChat]);
  useEffect(() => { currentUserRef.current = currentUser; }, [currentUser]);

  // ============ INIT ============
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const normalized = { ...user, id: user.id || user._id };
        setCurrentUser(normalized);
        currentUserRef.current = normalized;
        // Fetch API data và merge với mock
        fetchConversations(normalized.id);
        initializeSocket(normalized.id);
      } catch (e) {
        console.error('Parse user error:', e);
      }
    }
    return () => socketService.disconnect();
  }, []);

  // ============ CONVERSATIONS ============
  const fetchConversations = useCallback(async (userId) => {
    
    try {
       const res = await api.get('/chat/conversations');
    // api.js unwrap 1 lần → res = { success, data: [...] } hoặc res = [...]
    const raw = res?.data || (Array.isArray(res) ? res : []);
    
    const currentId = userId || currentUserRef.current?.id;
    const apiConvs = raw.map(conv => normalizeApiConversation(conv, currentId));

      // Merge: API data đứng trước, mock data đứng sau (bổ sung)
      setConversations(prev => {
        const mockOnly = prev.filter(c => c.isMock);
        // Dedupe: nếu API đã có conv trùng tên với mock thì giữ API
        const merged = [...apiConvs, ...mockOnly];
        return merged;
      });

      // Nếu đang chọn mock-conv và API có data → chuyển sang conv đầu API
      if (apiConvs.length > 0 && selectedChatRef.current?.isMock) {
        selectChat(apiConvs[0]);
      }
    } catch (err) {
      console.error('fetchConversations error:', err);
      // Giữ nguyên mock data khi API lỗi
    }
  }, []);

  // ============ MESSAGES ============
  const fetchMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;

    // Nếu là mock conversation → dùng mock messages ngay, không gọi API
    if (String(conversationId).startsWith('mock-')) {
      setMessages(MOCK_MESSAGES[conversationId] || []);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/chat/conversations/${conversationId}/messages?page=1&limit=20`);
// api.js unwrap 1 lần → res = { success, data: { messages: [...] } }
const msgs = res?.data?.messages || res?.messages || res?.data || [];
      const normalized = Array.isArray(msgs)
        ? msgs.map(m => normalizeApiMessage(m, conversationId)).reverse()
        : [];
      setMessages(normalized);
    } catch (err) {
      console.error('fetchMessages error:', err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============ SELECT CHAT ============
  const selectChat = useCallback((chat) => {
    setSelectedChat(chat);
    selectedChatRef.current = chat;
    if (chat?.id) {
      if (!String(chat.id).startsWith('mock-')) {
        socketService.joinConversation(chat.id);
      }
      fetchMessages(chat.id);
    }
  }, [fetchMessages]);

  // Create conversation with a user
  const createConversation = useCallback(async (participantId, participantUser = null) => {
  try {
    // Dùng api.js để tự động thêm Authorization header
    const res = await api.post('/chat/conversations', { participantId: parseInt(participantId) });

    // api.js unwrap 1 lần → res = { success, data: conv }
    const convData = res?.data || res;

    if (!convData?.id) throw new Error('Không lấy được conversation id');

    const currentId = currentUserRef.current?.id;
    const newConv = normalizeApiConversation(convData, currentId);

    if ((!newConv.name || newConv.name === 'Unknown') && participantUser) {
      newConv.name = participantUser.fullName || participantUser.username || `User ${participantId}`;
    }
    if ((!newConv.avatar || newConv.avatar.includes('/api/?name=U')) && participantUser) {
      newConv.avatar = participantUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(participantUser.fullName || participantUser.username || 'U')}&background=0084ff&color=fff`;
    }

    setConversations(prev => {
      const exists = prev.some(c => String(c.id) === String(newConv.id));
      return exists ? prev : [newConv, ...prev.filter(c => !c.isMock)];
    });

    selectChat(newConv);
    return newConv;

  } catch (err) {
    console.error('createConversation error:', err?.response?.data || err.message);
    console.error('createConversation error:', err?.response?.data || err.message);
    
    // Fallback mock conversation (giữ nguyên logic cũ)
    const mockConvId = `mock-conv-${participantId}-${Date.now()}`;
    const mockConv = {
      id: mockConvId,
      userId: participantId,
      name: participantUser?.fullName || participantUser?.username || `User ${participantId}`,
      avatar: participantUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(participantUser?.fullName || participantUser?.username || `User ${participantId}`)}&background=0084ff&color=fff`,
      lastMessage: '',
      time: 'Vừa xong',
      online: false,
      unread: 0,
      type: 'PRIVATE',
      group: false,
      isMock: true,
    };
    MOCK_MESSAGES[mockConvId] = [];
    setConversations(prev => [mockConv, ...prev]);
    selectChat(mockConv);
    return mockConv;
  }
}, [selectChat]);

  // ============ SEND MESSAGE ============
  const sendMessage = useCallback(async (content, contentType = 'TEXT') => {
    const chat = selectedChatRef.current;
    const user = currentUserRef.current;
    if (!chat?.id || !content?.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const tempMsg = {
      id: tempId, _id: tempId,
      conversationId: chat.id,
      content,
      senderId: user?.id || 'me',
      sender: user ? { _id: user.id, fullName: user.fullName, avatar: user.avatar } : null,
      type: contentType.toUpperCase(),
      isRead: false,
      createdAt: new Date().toISOString(),
      status: 'sending',
    };

    setMessages(prev => [...prev, tempMsg]);

    // Mock conversation → lưu local, không gọi API
    if (String(chat.id).startsWith('mock-')) {
      setMessages(prev =>
        prev.map(m => m.id === tempId ? { ...m, status: 'sent' } : m)
      );
      setConversations(prev =>
        prev.map(c => c.id === chat.id
          ? { ...c, lastMessage: content, time: 'Vừa xong' }
          : c
        )
      );
      return;
    }

    // Real conversation → gọi API
    try {
      const res = await api.post('/chat/messages', {
        conversationId: chat.id,
        content,
        type: contentType.toUpperCase(),
      });
      const saved = res?.data || res;
      const realId = saved?._id || saved?.id;
      if (realId) {
        setMessages(prev =>
          prev.map(m => m.id === tempId
            ? { ...normalizeApiMessage(saved, chat.id), id: realId, _id: realId }
            : m
          )
        );
      }
    } catch (err) {
      console.error('sendMessage error:', err?.response?.data);
      setMessages(prev =>
        prev.map(m => m.id === tempId ? { ...m, status: 'failed' } : m)
      );
    }
  }, []);

  // ============ SOCKET ============
  const handleNewMessage = useCallback((message) => {
    const incomingConvId = message.conversationId || message.conversation_id;
    if (String(incomingConvId) !== String(selectedChatRef.current?.id)) return;

    setMessages(prev => {
      const msgId = message._id || message.id;
      if (prev.some(m => String(m._id || m.id) === String(msgId))) return prev;

      const tempIdx = prev.findIndex(
        m => String(m.id).startsWith('temp-') &&
          m.senderId === (message.senderId || message.sender?._id) &&
          m.content === message.content
      );
      if (tempIdx !== -1) {
        const updated = [...prev];
        updated[tempIdx] = { ...message, id: msgId, _id: msgId };
        return updated;
      }
      return [...prev, { ...message, id: msgId, _id: msgId }];
    });
  }, []);

  const initializeSocket = useCallback((userId) => {
    try {
      const token = localStorage.getItem('token');
      socketService.connect(token);
      socketService.on('new_message', handleNewMessage);
      socketService.on('user_status_changed', ({ userId: uid, isOnline }) => {
        setOnlineUsers(prev => {
          const s = new Set(prev);
          isOnline ? s.add(uid) : s.delete(uid);
          return s;
        });
      });
    } catch (err) {
      console.error('Socket init error:', err);
    }
  }, [handleNewMessage]);

  // ============ FILE UPLOAD ============
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res;
  };

  // ============ TYPING ============
  const startTyping = () => {
    if (selectedChat && !String(selectedChat.id).startsWith('mock-')) {
      socketService.emit('typing', { conversationId: selectedChat.id });
    }
  };
  const stopTyping = () => {
    if (selectedChat && !String(selectedChat.id).startsWith('mock-')) {
      socketService.emit('stop_typing', { conversationId: selectedChat.id });
    }
  };

  const value = {
    conversations,
    selectedChat,
    messages,
    loading,
    error,
    currentUser,
    conversations,
    onlineUsers,
    typingUsers,
    fetchConversations,
    createConversation,
    selectChat,
    setSelectedChat: selectChat,
    fetchMessages,
    sendMessage,
    uploadFile,
    startTyping,
    stopTyping,
    isUserOnline: (uid) => onlineUsers.has(uid),
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};

export default ChatContext;