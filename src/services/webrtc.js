// WebRTC Service — quản lý PeerConnection cho video/voice call

class WebRTCService {
  constructor() {
    this.pc = null;
    this.localStream = null;
    this.remoteStream = new MediaStream();
    this.pendingCandidates = [];
    this.onRemoteStream = null;
    this.onCallEnded = null;
    this.onCallConnected = null;
    this.config = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
      ],
      iceCandidatePoolSize: 10,
    };
  }

  // Tạo PeerConnection mới
  createPC() {
    this.pc = new RTCPeerConnection(this.config);

    this.pc.ontrack = (e) => {
      console.log('📹 ontrack received:', e.track.kind);
      const stream = e.streams?.[0];
      if (stream && this.onRemoteStream) {
        this.onRemoteStream(stream);
      }
    };

    this.pc.onconnectionstatechange = () => {
      const state = this.pc.connectionState;
      console.log('🔗 PC state:', state);
      if (state === 'connected' && this.onCallConnected) this.onCallConnected();
      if (state === 'disconnected' || state === 'failed' || state === 'closed') {
        if (this.onCallEnded) this.onCallEnded();
      }
    };

    this.pc.onicecandidateerror = (e) => console.warn('⚠️ ICE error:', e);

    this.pc.onicecandidate = (e) => {
      if (e.candidate && this.onIceCandidate) {
        this.onIceCandidate(e.candidate);
      }
    };

    this.pc.onicegatheringstatechange = () => {
      console.log('❄️ ICE gathering state:', this.pc.iceGatheringState);
    };

    return this.pc;
  }

  // Lấy local stream (mic + camera)
  async startLocalStream(video = true) {
    try {
      this.localStream = await (window.navigator.mediaDevices || navigator.mediaDevices).getUserMedia({
        video: { facingMode: 'user', width: { ideal: 480 }, height: { ideal: 640 } },
        audio: true,
      });
      console.log('📷 Local stream obtained');
      return this.localStream;
    } catch (err) {
      console.error('❌ getUserMedia error:', err);
      throw err;
    }
  }

  // Thêm local stream vào peer connection
  addLocalStream(stream) {
    if (!this.pc) return;
    stream.getTracks().forEach((track) => {
      this.pc.addTrack(track, stream);
    });
  }

  // Tạo offer (gọi đi)
  async createOffer() {
    if (!this.pc) this.createPC();
    this.addLocalStream(this.localStream);
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    return offer;
  }

  // Nhận offer (nghe máy)
  async handleOffer(offer) {
    if (!this.pc) this.createPC();
    this.addLocalStream(this.localStream);
    await this.pc.setRemoteDescription(new RTCSessionDescription(offer));

    for (const c of this.pendingCandidates) {
      try { await this.pc.addIceCandidate(new RTCIceCandidate(c)); } catch {}
    }
    this.pendingCandidates = [];

    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);
    return answer;
  }

  // Nhận answer
  async handleAnswer(answer) {
    await this.pc.setRemoteDescription(new RTCSessionDescription(answer));

    for (const c of this.pendingCandidates) {
      try { await this.pc.addIceCandidate(new RTCIceCandidate(c)); } catch {}
    }
    this.pendingCandidates = [];
  }

  // Thêm ICE candidate
  async addIceCandidate(candidate) {
    if (this.pc?.currentRemoteDescription) {
      try { await this.pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch {}
    } else {
      this.pendingCandidates.push(candidate);
    }
  }

  // Kết thúc cuộc gọi
  endCall() {
    this.localStream?.getTracks().forEach((t) => t.stop());
    this.pc?.close();
    this.pc = null;
    this.localStream = null;
    this.remoteStream = new MediaStream();
    this.pendingCandidates = [];
  }

  toggleVideo() {
    const track = this.localStream?.getVideoTracks()?.[0];
    if (track) track.enabled = !track.enabled;
    return track?.enabled ?? false;
  }

  toggleAudio() {
    const track = this.localStream?.getAudioTracks()?.[0];
    if (track) track.enabled = !track.enabled;
    return track?.enabled ?? false;
  }
}

const webrtc = new WebRTCService();
export default webrtc;
