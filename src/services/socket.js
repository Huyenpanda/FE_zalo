//socket.js
import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  /**
   * Kết nối đến WebSocket server
   * @param {string} userId - ID của user hiện tại
   */
  connect(userId) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return this.socket;
    }

    const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:50646';
    const token = localStorage.getItem('token');

    this.socket = io(socketUrl, {
      auth: {
        token: token,
        userId: userId
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    // Event: Kết nối thành công
    this.socket.on('connect', () => {
      console.log('✅ Connected to socket server');
      this.socket.emit('user:online', userId);
    });

    // Event: Ngắt kết nối
    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from socket server:', reason);
    });

    // Event: Lỗi kết nối
    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Event: Reconnecting
    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnected after', attemptNumber, 'attempts');
    });

    return this.socket;
  }

  /**
   * Ngắt kết nối
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
      console.log('Socket disconnected');
    }
  }

  /**
   * Kiểm tra trạng thái kết nối
   */
  isConnected() {
    return this.socket?.connected || false;
  }

  // ============= MESSAGE EVENTS =============

  /**
   * Gửi tin nhắn
   * @param {Object} messageData - Dữ liệu tin nhắn
   */
  sendMessage(messageData) {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('message:send', messageData);
  }

  /**
   * Lắng nghe tin nhắn mới
   * @param {Function} callback - Callback khi nhận tin nhắn mới
   */
  onNewMessage(callback) {
    if (!this.socket) return;
    
    this.socket.on('message:new', callback);
    this.listeners.set('message:new', callback);
  }

  /**
   * Lắng nghe tin nhắn bị xóa
   * @param {Function} callback
   */
  onMessageDeleted(callback) {
    if (!this.socket) return;
    
    this.socket.on('message:deleted', callback);
    this.listeners.set('message:deleted', callback);
  }

  /**
   * Lắng nghe tin nhắn bị sửa
   * @param {Function} callback
   */
  onMessageUpdated(callback) {
    if (!this.socket) return;
    
    this.socket.on('message:updated', callback);
    this.listeners.set('message:updated', callback);
  }

  // ============= TYPING INDICATOR =============

  /**
   * Gửi trạng thái đang gõ
   * @param {string} conversationId - ID cuộc trò chuyện
   */
  emitTyping(conversationId) {
    if (!this.socket) return;
    this.socket.emit('user:typing', { conversationId });
  }

  /**
   * Gửi trạng thái ngừng gõ
   * @param {string} conversationId - ID cuộc trò chuyện
   */
  emitStopTyping(conversationId) {
    if (!this.socket) return;
    this.socket.emit('user:stop_typing', { conversationId });
  }

  /**
   * Lắng nghe khi có người đang gõ
   * @param {Function} callback - Callback nhận { userId, conversationId, isTyping }
   */
  onTyping(callback) {
    if (!this.socket) return;
    
    this.socket.on('user:typing', callback);
    this.listeners.set('user:typing', callback);
  }

  // ============= READ RECEIPTS =============

  /**
   * Đánh dấu tin nhắn đã đọc
   * @param {string} messageId - ID tin nhắn
   * @param {string} conversationId - ID cuộc trò chuyện
   */
  markAsRead(messageId, conversationId) {
    if (!this.socket) return;
    this.socket.emit('message:read', { messageId, conversationId });
  }

  /**
   * Lắng nghe khi tin nhắn được đọc
   * @param {Function} callback - Callback nhận { messageId, userId, readAt }
   */
  onMessageRead(callback) {
    if (!this.socket) return;
    
    this.socket.on('message:read', callback);
    this.listeners.set('message:read', callback);
  }

  // ============= USER STATUS =============

  /**
   * Cập nhật trạng thái online
   * @param {string} status - 'online' | 'offline' | 'away'
   */
  updateStatus(status) {
    if (!this.socket) return;
    this.socket.emit('user:status', { status });
  }

  /**
   * Lắng nghe thay đổi trạng thái user
   * @param {Function} callback - Callback nhận { userId, status }
   */
  onUserStatusChange(callback) {
    if (!this.socket) return;
    
    this.socket.on('user:status_change', callback);
    this.listeners.set('user:status_change', callback);
  }

  // ============= CONVERSATION EVENTS =============

  /**
   * Tham gia vào một conversation room
   * @param {string} conversationId
   */
  joinConversation(conversationId) {
    if (!this.socket) return;
    this.socket.emit('conversation:join', conversationId);
  }

  /**
   * Tham gia user room
   * @param {string|number} userId
   */
  joinUser(userId) {
    if (!this.socket) return;
    if (!userId) return;
    this.socket.emit('user:join', userId);
  }

  /**
   * Rời khỏi conversation room
   * @param {string} conversationId
   */
  leaveConversation(conversationId) {
    if (!this.socket) return;
    this.socket.emit('conversation:leave', conversationId);
  }

  /**
   * Lắng nghe khi có người tham gia/rời conversation
   * @param {Function} callback
   */
  onConversationUpdate(callback) {
    if (!this.socket) return;
    
    this.socket.on('conversation:updated', callback);
    this.listeners.set('conversation:updated', callback);
  }

  // ============= VIDEO/VOICE CALL =============

  /**
   * Gửi lời mời gọi
   * @param {Object} callData - { conversationId, type: 'video' | 'voice' }
   */
  initiateCall(callData) {
    if (!this.socket) return;
    this.socket.emit('call:initiate', callData);
  }

  /**
   * Trả lời cuộc gọi
   * @param {Object} callData - { callId, accepted: boolean }
   */
  answerCall(callData) {
    if (!this.socket) return;
    this.socket.emit('call:answer', callData);
  }

  /**
   * Kết thúc cuộc gọi
   * @param {string} callId
   */
  endCall(callId) {
    if (!this.socket) return;
    this.socket.emit('call:end', { callId });
  }

  /**
   * Lắng nghe cuộc gọi đến
   * @param {Function} callback
   */
  onIncomingCall(callback) {
    if (!this.socket) return;
    
    this.socket.on('call:incoming', callback);
    this.listeners.set('call:incoming', callback);
  }

  // ============= UTILITY METHODS =============

  /**
   * Emit custom event
   * @param {string} event - Tên event
   * @param {*} data - Dữ liệu gửi đi
   */
  emit(event, data) {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit(event, data);
  }

  /**
   * Listen to custom event
   * @param {string} event - Tên event
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    if (!this.socket) return;
    
    this.socket.on(event, callback);
    this.listeners.set(event, callback);
  }

  /**
   * Remove event listener
   * @param {string} event - Tên event
   */
  off(event) {
    if (!this.socket) return;
    
    const callback = this.listeners.get(event);
    if (callback) {
      this.socket.off(event, callback);
      this.listeners.delete(event);
    }
  }

  /**
   * Remove all listeners
   */
  removeAllListeners() {
    if (!this.socket) return;
    
    this.listeners.forEach((callback, event) => {
      this.socket.off(event, callback);
    });
    this.listeners.clear();
  }
}

// Export singleton instance
export default new SocketService();