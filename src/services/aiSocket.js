// AI Socket Service — kết nối riêng tới AI server (Python, port 5000)
import { io } from "socket.io-client";

class AISocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.connected = false;
    this.debugEnabled =
      process.env.NODE_ENV !== "production" ||
      process.env.REACT_APP_AI_DEBUG === "true";
  }

  connect() {
    if (this.socket?.connected) return;
    if (this.socket) {
      this.socket.connect();
      return;
    }
    const defaultUrl = `${window.location.protocol}//${window.location.hostname}:5000`;
    const url = process.env.REACT_APP_AI_SOCKET_URL || defaultUrl;
    this.socket = io(url, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });
    this.socket.on("connect", () => {
      console.log("AI Socket connected", {
        id: this.socket.id,
        url,
        transport: this.socket.io.engine.transport.name,
      });
      this.connected = true;
    });
    this.socket.on("disconnect", () => {
      console.log("❌ AI Socket disconnected");
      this.connected = false;
    });
    this.socket.on("connect_error", (err) => {
      console.warn("⚠️ AI Socket error:", err.message);
    });
    // Lắng nghe prediction từ AI server
    this.socket.on("prediction", (data) => {
      if (this.debugEnabled) console.debug("[AI Prediction]", data);
      const cbs = this.listeners.get("prediction");
      if (cbs) cbs.forEach((cb) => cb(data));
    });
    return this.socket;
  }

  waitUntilConnected(timeoutMs = 5000) {
    if (this.socket?.connected) return Promise.resolve();
    if (!this.socket) return Promise.reject(new Error("AI socket is not initialized"));

    return new Promise((resolve, reject) => {
      const cleanup = () => {
        clearTimeout(timeoutId);
        this.socket?.off("connect", handleConnect);
        this.socket?.off("connect_error", handleError);
      };
      const handleConnect = () => {
        cleanup();
        resolve();
      };
      const handleError = (error) => {
        cleanup();
        reject(error);
      };
      const timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error("Timed out connecting to AI server"));
      }, timeoutMs);

      this.socket.once("connect", handleConnect);
      this.socket.once("connect_error", handleError);
    });
  }

  /**
   * Gửi landmarks lên AI server
   * @param {number[]} landmarks - Mảng 225 số (33 pose*3 + 21 left*3 + 21 right*3)
   * @param {number} userId - ID user hiện tại
   */
  sendLandmarks(landmarks, userId) {
    if (!this.socket?.connected) {
      console.warn("⚠️ AI Socket not connected");
      return;
    }
    if (
      !Array.isArray(landmarks) ||
      landmarks.length !== 225 ||
      !landmarks.every(Number.isFinite)
    ) {
      console.warn("Invalid landmark payload; expected 225 finite numbers");
      return;
    }
    this.socket.emit("landmarks", { landmarks, userId });
  }

  onPrediction(callback) {
    if (!this.listeners.has("prediction")) this.listeners.set("prediction", []);
    const cbs = this.listeners.get("prediction");
    if (!cbs.includes(callback)) cbs.push(callback);
  }

  offPrediction(callback) {
    const cbs = this.listeners.get("prediction");
    if (!cbs) return;
    // Không truyền callback → xoá tất cả
    if (!callback) {
      this.listeners.delete("prediction");
      return;
    }
    // Xoá callback cụ thể
    this.listeners.set(
      "prediction",
      cbs.filter((cb) => cb !== callback),
    );
  }

  clearRecognition() {
    if (this.socket?.connected) this.socket.emit("clear");
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
