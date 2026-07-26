// AI Socket Service — kết nối riêng tới AI server (Python, port 5000)
import { io } from 'socket.io-client';

class AISocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.connected = false;
  }

  connect() {
    if (this.socket?.connected) return;
    const url = process.env.REACT_APP_AI_SOCKET_URL || 'https://172.20.10.4:5445';
    this.socket = io(url, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });
    this.socket.on('connect', () => {
      console.log('✅ AI Socket connected');
      this.connected = true;
    });
    this.socket.on('disconnect', () => {
      console.log('❌ AI Socket disconnected');
      this.connected = false;
    });
    this.socket.on('connect_error', (err) => {
      console.warn('⚠️ AI Socket error:', err.message);
    });
    // Lắng nghe prediction từ AI server
    this.socket.on('prediction', (data) => {
      const cbs = this.listeners.get('prediction');
      if (cbs) cbs.forEach(cb => cb(data));
    });
  }

  /**
   * Gửi landmarks lên AI server
   * @param {number[]} landmarks - Mảng 225 số (33 pose*3 + 21 left*3 + 21 right*3)
   * @param {number} userId - ID user hiện tại
   */
  sendLandmarks(landmarks, userId) {
    if (!this.socket?.connected) {
      console.warn('⚠️ AI Socket not connected');
      return;
    }
    this.socket.emit('landmarks', { landmarks, userId });
  }

  onPrediction(callback) {
    if (!this.listeners.has('prediction')) this.listeners.set('prediction', []);
    const cbs = this.listeners.get('prediction');
    if (!cbs.includes(callback)) cbs.push(callback);
  }

  offPrediction(callback) {
    const cbs = this.listeners.get('prediction');
    if (!cbs) return;
    // Không truyền callback → xoá tất cả
    if (!callback) {
      this.listeners.delete('prediction');
      return;
    }
    // Xoá callback cụ thể
    this.listeners.set('prediction', cbs.filter(cb => cb !== callback));
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }
}

const aiSocket = new AISocketService();
export default aiSocket;
