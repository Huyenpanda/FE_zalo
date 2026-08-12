// ChatContext.js
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import socketService from '../socket';
import aiSocket from '../aiSocket';
import mediapipe from '../mediapipe';
import api from '../api';

const ChatContext = createContext();
const AI_GESTURE_DELAY_MS = 2000;

// ============================================================
// MOCK DATA
// ============================================================
const MOCK_CONVERSATIONS = [
  {
    id: 'mock-conv-1', userId: 'mock-user-1', name: 'Nguyễn Thị Lan',
    avatar: 'https://ui-avatars.com/api/?name=Nguyen+Thi+Lan&background=0084ff&color=fff',
    lastMessage: 'Bạn ơi tối nay rảnh không?', time: '2 phút',
    online: true, unread: 2, type: 'PRIVATE', group: false, isMock: true,
  },
  {
    id: 'mock-conv-2', userId: 'mock-user-2', name: 'Trần Văn Minh',
    avatar: 'https://ui-avatars.com/api/?name=Tran+Van+Minh&background=ff6b6b&color=fff',
    lastMessage: 'Ok bạn nhé, để tôi xem lại code', time: '1 giờ',
    online: false, unread: 0, type: 'PRIVATE', group: false, isMock: true,
  },
  {
    id: 'mock-conv-3', userId: null, name: 'Nhóm Dự Án Zola',
    avatar: 'https://ui-avatars.com/api/?name=Zola+Team&background=00b894&color=fff',
    lastMessage: 'Minh: Đã push code lên rồi nhé mọi người', time: '3 giờ',
    online: false, unread: 5, type: 'GROUP', group: true, isMock: true,
  },
  {
    id: 'mock-conv-4', userId: 'mock-user-4', name: 'Lê Hoàng Nam',
    avatar: 'https://ui-avatars.com/api/?name=Le+Hoang+Nam&background=6c5ce7&color=fff',
    lastMessage: 'Cảm ơn bạn nhiều lắm!', time: '1 ngày',
    online: true, unread: 0, type: 'PRIVATE', group: false, isMock: true,
  },
];

const MOCK_MESSAGES = {
  'mock-conv-1': [
    {
      id: 'mock-msg-1-1', _id: 'mock-msg-1-1', conversationId: 'mock-conv-1',
      content: 'Chào bạn! 👋', senderId: 'mock-user-1',
      sender: { _id: 'mock-user-1', fullName: 'Nguyễn Thị Lan', avatar: 'https://ui-avatars.com/api/?name=Lan&background=0084ff&color=fff' },
      type: 'TEXT', isRead: true, createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'mock-msg-1-2', _id: 'mock-msg-1-2', conversationId: 'mock-conv-1',
      content: 'Chào Lan! Lâu rồi không gặp 😄', senderId: 'me', sender: null,
      type: 'TEXT', isRead: true, createdAt: new Date(Date.now() - 3600000 * 1.9).toISOString(),
    },
    {
      id: 'mock-msg-1-3', _id: 'mock-msg-1-3', conversationId: 'mock-conv-1',
      content: 'Bạn ơi tối nay rảnh không?', senderId: 'mock-user-1',
      sender: { _id: 'mock-user-1', fullName: 'Nguyễn Thị Lan', avatar: 'https://ui-avatars.com/api/?name=Lan&background=0084ff&color=fff' },
      type: 'TEXT', isRead: false, createdAt: new Date(Date.now() - 120000).toISOString(),
    },
  ],
  'mock-conv-2': [
    {
      id: 'mock-msg-2-1', _id: 'mock-msg-2-1', conversationId: 'mock-conv-2',
      content: 'Minh ơi, cái bug hôm qua fix chưa?', senderId: 'me', sender: null,
      type: 'TEXT', isRead: true, createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: 'mock-msg-2-2', _id: 'mock-msg-2-2', conversationId: 'mock-conv-2',
      content: 'Ok bạn nhé, để tôi xem lại code', senderId: 'mock-user-2',
      sender: { _id: 'mock-user-2', fullName: 'Trần Văn Minh', avatar: 'https://ui-avatars.com/api/?name=Minh&background=ff6b6b&color=fff' },
      type: 'TEXT', isRead: true, createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
  'mock-conv-3': [
    {
      id: 'mock-msg-3-1', _id: 'mock-msg-3-1', conversationId: 'mock-conv-3',
      content: 'Mọi người ơi, họp lúc 3h chiều nhé!', senderId: 'mock-user-1',
      sender: { _id: 'mock-user-1', fullName: 'Nguyễn Thị Lan', avatar: 'https://ui-avatars.com/api/?name=Lan&background=0084ff&color=fff' },
      type: 'TEXT', isRead: true, createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: 'mock-msg-3-2', _id: 'mock-msg-3-2', conversationId: 'mock-conv-3',
      content: 'Đã push code lên rồi nhé mọi người', senderId: 'mock-user-2',
      sender: { _id: 'mock-user-2', fullName: 'Trần Văn Minh', avatar: 'https://ui-avatars.com/api/?name=Minh&background=ff6b6b&color=fff' },
      type: 'TEXT', isRead: false, createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
  ],
  'mock-conv-4': [
    {
      id: 'mock-msg-4-1', _id: 'mock-msg-4-1', conversationId: 'mock-conv-4',
      content: 'Bạn giúp mình vấn đề này được không?', senderId: 'mock-user-4',
      sender: { _id: 'mock-user-4', fullName: 'Lê Hoàng Nam', avatar: 'https://ui-avatars.com/api/?name=Nam&background=6c5ce7&color=fff' },
      type: 'TEXT', isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'mock-msg-4-2', _id: 'mock-msg-4-2', conversationId: 'mock-conv-4',
      content: 'Được, bạn cứ nói đi nhé!', senderId: 'me', sender: null,
      type: 'TEXT', isRead: true, createdAt: new Date(Date.now() - 86400000 + 60000).toISOString(),
    },
    {
      id: 'mock-msg-4-3', _id: 'mock-msg-4-3', conversationId: 'mock-conv-4',
      content: 'Cảm ơn bạn nhiều lắm!', senderId: 'mock-user-4',
      sender: { _id: 'mock-user-4', fullName: 'Lê Hoàng Nam', avatar: 'https://ui-avatars.com/api/?name=Nam&background=6c5ce7&color=fff' },
      type: 'TEXT', isRead: true, createdAt: new Date(Date.now() - 86400000 + 120000).toISOString(),
    },
  ],
};

// ============================================================
// Helpers
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
    lastMessage: typeof conv.lastMessage === 'string'
      ? conv.lastMessage
      : conv.lastMessage?.content || conv.lastMessagePreview || '',
    time: formatConvTime(conv.lastMessageAt || conv.lastMessage?.createdAt),
    online: otherUser?.isOnline || false,
    unread: conv.unreadCount || 0,
    type: conv.type || 'PRIVATE',
    group: conv.type === 'GROUP',
    isMock: false,
  };
};
const formatConvTime = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút`;
  if (diffHours < 24) return `${diffHours} giờ`;
  if (diffDays < 7) return `${diffDays} ngày`;
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
};

  const normalizeApiMessage = (m, conversationId) => ({
    id: m._id || m.id,
    _id: m._id || m.id,
    conversationId: m.conversation || m.conversationId || conversationId,
    content: m.content,
    senderId: String(m.senderId || m.sender?.id || m.sender?._id || ''),
    sender: m.sender,
    type: m.type || 'TEXT',
    imageUrl: m.imageUrl,
    attachments: m.attachments,
    isRead: m.isRead,
    createdAt: m.createdAt,
  });

// ============================================================
// CONTEXT PROVIDER
// ============================================================
export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Thay thế phần useState khởi tạo currentUser
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      const user = JSON.parse(userStr);
      const id = user.id || user._id;
      return { ...user, id: String(id), _id: String(id) }; // ← String() cả hai
    } catch {
      return null;
    }
  });
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Map());

  const selectedChatRef = useRef(null);
  const currentUserRef = useRef(null);

  useEffect(() => { selectedChatRef.current = selectedChat; }, [selectedChat]);
  useEffect(() => { currentUserRef.current = currentUser; }, [currentUser]);

  // ============ FETCH MESSAGES ============
  // Khai báo trước vì selectChat phụ thuộc vào nó
  const fetchMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;

    if (String(conversationId).startsWith('mock-')) {
      setMessages(MOCK_MESSAGES[conversationId] || []);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/chat/conversations/${conversationId}/messages?page=1&limit=20`);
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
  // Khai báo sau fetchMessages vì phụ thuộc vào nó
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

  // ============ FETCH CONVERSATIONS ============
  // Khai báo sau selectChat vì phụ thuộc vào nó
  // ChatContext.js - chỉ sửa fetchConversations
const fetchConversations = useCallback(async (userId) => {
  setIsInitializing(true); // ← bắt đầu loading
  try {
    const res = await api.get('/chat/conversations');
    const raw = res?.data || (Array.isArray(res) ? res : []);

    const currentId = userId || currentUserRef.current?.id;
    const apiConvs = Array.isArray(raw)
      ? raw.map(conv => normalizeApiConversation(conv, currentId))
      : [];

    if (apiConvs.length > 0) {
      setConversations(apiConvs);
      selectChat(apiConvs[0]);
    } else {
      setConversations([]);
      setSelectedChat(null);
    }
  } catch (err) {
    console.error('fetchConversations error:', err);
    setConversations(MOCK_CONVERSATIONS);
    setSelectedChat(MOCK_CONVERSATIONS[0]);
    setMessages(MOCK_MESSAGES['mock-conv-1']);
  } finally {
    setIsInitializing(false); // ← xong thì tắt loading
  }
}, [selectChat]);

  // ============ INIT ============
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const normalized = {
          ...user,
          id: String(user.id || user._id),
          _id: String(user.id || user._id),
        };
        // KHÔNG setCurrentUser ở đây nữa — useState lazy init đã đọc đúng rồi
        currentUserRef.current = normalized; // chỉ update ref để các callback dùng
        fetchConversations(normalized.id).finally(() => setIsInitializing(false));
        initializeSocket(normalized.id);
      } catch (e) {
        console.error('Parse user error:', e);
        setIsInitializing(false);
        setConversations(MOCK_CONVERSATIONS);
        setSelectedChat(MOCK_CONVERSATIONS[0]);
        setMessages(MOCK_MESSAGES['mock-conv-1']);
      }
    } else {
      // Không có token → demo mode với mock data
      setIsInitializing(false);
      setConversations(MOCK_CONVERSATIONS);
      setSelectedChat(MOCK_CONVERSATIONS[0]);
      setMessages(MOCK_MESSAGES['mock-conv-1']);
    }
    return () => socketService.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // ☝️ bỏ qua warning vì fetchConversations/initializeSocket ổn định sau mount

  // ============ CREATE CONVERSATION ============
  const createConversation = useCallback(async (participantId, participantUser = null) => {
    try {
      const res = await api.post('/chat/conversations', { participantId: parseInt(participantId) });
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

      const mockConvId = `mock-conv-${participantId}-${Date.now()}`;
      const mockConv = {
        id: mockConvId,
        userId: participantId,
        name: participantUser?.fullName || participantUser?.username || `User ${participantId}`,
        avatar: participantUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(participantUser?.fullName || participantUser?.username || `User ${participantId}`)}&background=0084ff&color=fff`,
        lastMessage: '', time: 'Vừa xong', online: false, unread: 0,
        type: 'PRIVATE', group: false, isMock: true,
      };
      MOCK_MESSAGES[mockConvId] = [];
      setConversations(prev => [mockConv, ...prev]);
      selectChat(mockConv);
      return mockConv;
    }
  }, [selectChat]);

  // ============ CREATE GROUP ============
  const createGroupConversation = useCallback(async ({ name, memberIds }) => {
    try {
      const payload = {
        name: name?.trim(),
        memberIds: (memberIds || []).filter(Boolean),
        type: 'GROUP',
      };

      if (!payload.name || payload.memberIds.length === 0) {
        throw new Error('Thiếu tên nhóm hoặc thành viên');
      }

      const created = await api.post('/chat/conversations/group', payload);
      const convData = created?.data || created;

      if (!convData?.id && !convData?._id) throw new Error('Không nhận được dữ liệu nhóm');

      const currentId = currentUserRef.current?.id;
      const newConv = normalizeApiConversation(convData, currentId);
      newConv.name = newConv.name || payload.name;
      newConv.type = 'GROUP';
      newConv.group = true;

      setConversations(prev => {
        const exists = prev.some(c => String(c.id) === String(newConv.id));
        return exists ? prev : [newConv, ...prev.filter(c => !c.isMock)];
      });

      selectChat(newConv);
      return newConv;
    } catch (err) {
      console.error('createGroupConversation error:', err?.response?.data || err.message);

      const mockConvId = `mock-group-${Date.now()}`;
      const mockConv = {
        id: mockConvId, userId: null,
        name: name?.trim() || 'Nhóm mới',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name?.trim() || 'Group')}&background=00b894&color=fff`,
        lastMessage: '', time: 'Vừa xong', online: false, unread: 0,
        type: 'GROUP', group: true, isMock: true,
      };
      MOCK_MESSAGES[mockConvId] = [];
      setConversations(prev => [mockConv, ...prev]);
      selectChat(mockConv);
      return mockConv;
    }
  }, [selectChat]);

  // ============ SEND MESSAGE ============
  const sendMessage = useCallback(async (content, contentType = 'TEXT', attachments = []) => {
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
      attachments,
      isRead: false,
      createdAt: new Date().toISOString(),
      status: 'sending',
    };

    setMessages(prev => [...prev, tempMsg]);

    if (String(chat.id).startsWith('mock-')) {
      setMessages(prev => prev.map(m => m.id === tempId ? { ...m, status: 'sent' } : m));
      setConversations(prev =>
        prev.map(c => c.id === chat.id ? { ...c, lastMessage: content, time: 'Vừa xong' } : c)
      );
      return;
    }

    try {
      const res = await api.post('/chat/messages', {
        conversationId: chat.id,
        content,
        type: contentType.toUpperCase(),
        attachments: attachments.length ? attachments : undefined,
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
      setMessages(prev => prev.map(m => m.id === tempId ? { ...m, status: 'failed' } : m));
    }
  }, []);

  // ============ SOCKET & WEBRTC CALL ============
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

  // ============ AI RECOGNITION — phải khai báo trước endCall ============
  const [aiText, setAiText] = useState('');
  const [aiPreview, setAiPreview] = useState(null);
  const [aiStatus, setAiStatus] = useState('Đang chờ ký hiệu...');
  const [aiActive, setAiActive] = useState(false);
  const aiSocketConnected = useRef(false);
  const aiCooldownUntil = useRef(0);
  const aiCooldownTimer = useRef(null);

  const stopAI = useCallback(() => {
    if (aiCooldownTimer.current) {
      clearTimeout(aiCooldownTimer.current);
      aiCooldownTimer.current = null;
    }
    aiCooldownUntil.current = 0;
    mediapipe.stop();
    aiSocket.offPrediction();
    setAiActive(false);
    setAiText('');
    setAiPreview(null);
    setAiStatus('Đang chờ ký hiệu...');
    aiSocketConnected.current = false;
  }, []);

  const clearAIText = useCallback(() => {
    if (aiCooldownTimer.current) {
      clearTimeout(aiCooldownTimer.current);
      aiCooldownTimer.current = null;
    }
    aiCooldownUntil.current = 0;
    setAiText('');
    setAiPreview(null);
    setAiStatus('Đang chờ ký hiệu...');
    aiSocket.clearRecognition();
  }, []);

  const startAI = useCallback(async () => {
    aiSocket.connect();
    setAiStatus('Đang kết nối AI server...');
    try {
      await aiSocket.waitUntilConnected();
      aiSocketConnected.current = true;
    } catch (error) {
      aiSocketConnected.current = false;
      setAiActive(false);
      setAiStatus('Không kết nối được AI server');
      console.error('AI server connection failed:', error);
      return;
    }
    if (!mediapipe.ready) {
      const ok = await mediapipe.init();
      if (!ok) {
        console.error('❌ MediaPipe init failed');
        aiSocketConnected.current = false;
        setAiStatus('Không thể khởi tạo MediaPipe');
        return;
      }
    }
    aiSocket.offPrediction();
    aiSocket.onPrediction((data) => {
      if (Date.now() < aiCooldownUntil.current) return;

      if (data.state === 'recognized' && data.text?.trim()) {
        const word = data.text.trim();
        setAiPreview(null);
        setAiText(prev => prev ? `${prev} ${word}` : word);
        aiCooldownUntil.current = Date.now() + AI_GESTURE_DELAY_MS;
        aiSocket.clearRecognition();
        setAiStatus(`Đã nhận diện "${word}". Chờ ${AI_GESTURE_DELAY_MS / 1000} giây...`);

        if (aiCooldownTimer.current) clearTimeout(aiCooldownTimer.current);
        aiCooldownTimer.current = setTimeout(() => {
          aiCooldownUntil.current = 0;
          aiCooldownTimer.current = null;
          setAiStatus('Đang chờ ký hiệu tiếp theo...');
        }, AI_GESTURE_DELAY_MS);
        return;
      }
      if (data.state === 'collecting') {
        setAiPreview(null);
        const percent = Math.round((data.progress || 0) * 100);
        setAiStatus(`Đang nhận diện... ${percent}%`);
      } else if (data.state === 'confirming') {
        const predictedSign = data.text?.trim();
        setAiPreview(predictedSign ? {
          text: predictedSign,
          confidence: Number(data.confidence) || 0,
          confirmations: Number(data.confirmations) || 0,
          requiredConfirmations: Number(data.requiredConfirmations) || 0,
        } : null);
        setAiStatus('Đang xác nhận ký hiệu...');
      } else if (data.state === 'uncertain') {
        setAiPreview(null);
        setAiStatus('Chưa nhận diện rõ');
      } else if (data.state === 'waiting') {
        setAiPreview(null);
        setAiStatus('Đang chờ ký hiệu...');
      } else if (data.state === 'error') {
        console.warn('AI payload error:', data.error);
      }
    });
    mediapipe.onLandmarks = (landmarks) => {
      // console.log('🗺️ landmarks:', landmarks.length, 'first:', landmarks[0], 'non-zero:', landmarks.filter(v => v !== 0).length);
      if (
        aiSocketConnected.current &&
        Date.now() >= aiCooldownUntil.current
      ) {
        aiSocket.sendLandmarks(landmarks, currentUser?.id);
      }
    };
    // Chọn nguồn video cho AI: chưa nghe → local (ký hiệu của mình), đã nghe → remote (ký hiệu đối phương)
    const localVideo = document.getElementById('localVideo');
    const remoteVideo = document.getElementById('remoteVideo');
    // Dùng callStateRef thay vì callState để tránh stale closure
    const hasRemoteStream = remoteVideo?.srcObject && remoteVideo.readyState >= 1;
    const video = callStateRef.current.status === 'connected' && hasRemoteStream
      ? remoteVideo
      : localVideo;
    if (video && mediapipe.start(video, null)) {
      setAiActive(true);
      setAiStatus('Đang chờ ký hiệu...');
    } else {
      setAiStatus('Chưa có video để nhận diện');
    }
  }, [currentUser]);

  const attachRemoteStream = useCallback((stream) => {
    const tryAttach = (retry = 5) => {
      const remoteVideo = window.__remoteVideo;
      if (!remoteVideo) {
        if (retry > 0) setTimeout(() => tryAttach(retry - 1), 300);
        return;
      }

      remoteVideo.srcObject = stream;
      remoteVideo.style.display = 'block';
      remoteVideo.play().then(() => {
        console.log('✅ Remote video attached');
        if (mediapipe.running) {
          aiSocket.clearRecognition();
          mediapipe.start(remoteVideo, null);
          setAiStatus('Đang chờ ký hiệu từ người đối diện...');
        }
      }).catch(error => console.warn('Remote video play failed:', error));
    };
    tryAttach();
  }, []);

  const [callState, setCallState] = useState({
    active: false, type: null, status: '',
    remoteStream: null, remoteUser: null,
  });
  const callStateRef = useRef(callState);
  // Đồng bộ ref với state — ưu tiên dùng ref cho những nơi cần đọc giá trị mới trong closure
  useEffect(() => { callStateRef.current = callState; }, [callState]);

  const endCall = useCallback(() => {
    if (window.__callEnding) return;
    window.__callEnding = true;
    const remoteId = window.__callRemoteUserId;
    import('../../services/webrtc').then(mod => mod.default.endCall());
    if (remoteId) {
      socketService.emit('end_call', {
        toUserId: remoteId,
        conversationId: selectedChatRef.current?.id,
        callerId: currentUser?.id,
        duration: 0,
        status: 'ENDED',
      });
    }
    // Dừng AI recognition hoàn toàn
    stopAI();
    console.log("🧹 Clearing AI text");
    setAiText("");
    setAiPreview(null);
    setCallState({ active: false, type: null, status: '', remoteStream: null, remoteUser: null });
    setTimeout(() => { window.__callEnding = false; }, 2000);
  }, []);

  const handleIncomingCall = useCallback(async (data) => {
    console.log('📞 incoming_call:', JSON.stringify(data));
    const uid = data.fromUserId;
    if (uid) window.__callRemoteUserId = uid;
    setCallState({ active: true, type: data.isVideo ? 'video' : 'voice', status: 'ringing', remoteStream: null, remoteUser: { id: uid } });
    window.__pendingCallOffer = { offer: data.offer, fromUserId: uid };
  }, []);

  const handleCallAnswered = useCallback(async (data) => {
    console.log('📞 call_answered:', { hasAnswer: !!data.answer });
    if (window.__callAnswered) return;
    window.__callAnswered = true;
    // Clear text từ giai đoạn chưa nghe máy
    setAiText("");
    setAiPreview(null);
    setCallState(prev => ({ ...prev, status: 'connected' }));
    setTimeout(() => { window.__callAnswered = false; }, 3000);
    try { const w = (await import('../../services/webrtc')).default; if (data.answer) w.handleAnswer(data.answer); } catch (e) {}
  }, []);

  const handleCallEnded = useCallback(() => {
    endCall();
  }, [endCall]);

  const handleIceCandidate = useCallback(async (data) => {
    try { const w = (await import('../../services/webrtc')).default; w.addIceCandidate(data.candidate); } catch (e) {}
  }, []);

  const startCall = useCallback(async (targetUserId, isVideo = true) => {
    // Reset aiText từ cuộc gọi trước nếu còn sót
    setAiText("");
    setAiPreview(null);
    console.log("📞 startCall to", targetUserId);
    window.__callRemoteUserId = targetUserId;
    // Render overlay TRƯỚC để DOM video tồn tại
    setCallState({ active: true, type: isVideo ? 'video' : 'voice', status: 'calling', remoteStream: null, remoteUser: { id: targetUserId } });
    await new Promise(r => setTimeout(r, 100)); // Đợi React render DOM
    try {
      const webrtc = (await import('../../services/webrtc')).default;
      webrtc.pc = null;
      await webrtc.startLocalStream(isVideo);
      webrtc.onCallEnded = () => endCall();
      webrtc.onRemoteStream = (stream) => {
        console.log('📹 Remote stream received');
        attachRemoteStream(stream);
      };
      // Gắn local video ngay (DOM đã render)
      var lv = window.__localVideo;
      if (lv && webrtc.localStream) { lv.srcObject = webrtc.localStream; console.log('✅ Local video attached'); }
      await startAI();
      webrtc.onIceCandidate = (candidate) => {
        socketService.emit('ice_candidate', { toUserId: targetUserId, candidate: candidate.toJSON() });
      };
      const offer = await webrtc.createOffer();
      socketService.emit('call_user', { toUserId: targetUserId, fromUserId: currentUser?.id, offer, isVideo });
    } catch (err) {
      console.error('call error:', err);
      setCallState({ active: false, type: null, status: '', remoteStream: null, remoteUser: null });
    }
  }, [currentUser, endCall, startAI, attachRemoteStream]);

  const acceptCall = useCallback(async () => {
    try {
      const { offer, fromUserId } = window.__pendingCallOffer || {};
      if (!offer) return;
      window.__callRemoteUserId = fromUserId;
      const webrtc = (await import('../../services/webrtc')).default;
      webrtc.pc = null;
      await webrtc.startLocalStream(callState.type === 'video');
      webrtc.onCallConnected = () => {
        setAiText("");
        setAiPreview(null);
        setCallState(prev => ({ ...prev, status: 'connected' }));
      };
      webrtc.onCallEnded = () => endCall();
      webrtc.onRemoteStream = (stream) => {
        console.log('📹 Remote stream received');
        attachRemoteStream(stream);
      };
      const lv = window.__localVideo;
      if (lv && webrtc.localStream) { lv.srcObject = webrtc.localStream; } else { setTimeout(function() { var lv2 = window.__localVideo; if (lv2 && webrtc.localStream) lv2.srcObject = webrtc.localStream; }, 500); }
      await startAI();
      webrtc.onIceCandidate = (candidate) => {
        socketService.emit('ice_candidate', { toUserId: fromUserId, candidate: candidate.toJSON() });
      };
      if (window.__pendingIceCandidates) {
        for (const c of window.__pendingIceCandidates) await webrtc.addIceCandidate(c);
        window.__pendingIceCandidates = [];
      }
      setAiText("");
      setAiPreview(null);
      setCallState(prev => ({ ...prev, status: 'connected' }));
      const answer = await webrtc.handleOffer(offer);
      socketService.emit('answer_call', { toUserId: fromUserId, answer });
      window.__pendingCallOffer = null;
    } catch (err) { console.error('accept call error:', err); }
  }, [callState.type, endCall, startAI, attachRemoteStream]);

  const initializeSocket = useCallback((userId) => {
    try {
      const token = localStorage.getItem('token');
      socketService.connect();

      // Kết nối Python signaling cho WebRTC

      socketService.on('new_message', handleNewMessage);

      // WebRTC events qua Python socket
      socketService.on('incoming_call', handleIncomingCall);
      socketService.on('call_answered', handleCallAnswered);
      socketService.on('call_ended', handleCallEnded);
      socketService.on('ice_candidate', handleIceCandidate);

      socketService.on('user_status_changed', ({ userId: uid, isOnline }) => {
        setOnlineUsers(prev => { const s = new Set(prev); isOnline ? s.add(uid) : s.delete(uid); return s; });
      });
    } catch (err) { console.error('Socket init error:', err); }
  }, [handleNewMessage, handleIncomingCall, handleCallAnswered, handleCallEnded, handleIceCandidate, endCall]);

  // ============ FILE UPLOAD ============
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  };

  // ============ TYPING ============
  const startTyping = () => {
    if (selectedChat && !String(selectedChat.id).startsWith('mock-')) socketService.emit('typing', { conversationId: selectedChat.id });
  };
  const stopTyping = () => {
    if (selectedChat && !String(selectedChat.id).startsWith('mock-')) socketService.emit('stop_typing', { conversationId: selectedChat.id });
  };

  const value = {
    conversations, selectedChat, messages, loading, error, currentUser,
    onlineUsers, typingUsers, isInitializing, callState,
    startCall, acceptCall, endCall,
    fetchConversations, createConversation, createGroupConversation,
    selectChat, setSelectedChat: selectChat, fetchMessages, sendMessage,
    uploadFile, startTyping, stopTyping,
    isUserOnline: (uid) => onlineUsers.has(uid),
    aiText, aiPreview, aiStatus, aiActive, startAI, stopAI, clearAIText,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};

export default ChatContext;
