// MediaPipe Service — dùng @mediapipe/tasks-vision PoseLandmarker

class MediaPipeService {
  constructor() {
    this.holistic = null;
    this.ready = false;
    this.video = null;
    this.running = false;
    this.onLandmarks = null;
    this.animFrameId = null;
  }

  async init() {
    try {
      const vision = await import('@mediapipe/tasks-vision');
      const wasmFileset = await vision.FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );
      this.holistic = await vision.PoseLandmarker.createFromOptions(wasmFileset, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        minPoseDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      this.ready = true;
      console.log('✅ MediaPipe PoseLandmarker ready');
      return true;
    } catch (err) {
      console.error('❌ MediaPipe init error:', err);
      return false;
    }
  }

  extractKeypoints(result) {
    const poseLandmarks = result.landmarks?.[0] || [];
    const pose = poseLandmarks.map(lm => [lm.x, lm.y, lm.z]).flat();
    return [...pose, ...new Array(225 - pose.length).fill(0)].slice(0, 225);
  }

  start(videoElement, intervalMs = 100) {
    if (!this.ready || !videoElement) return;
    this.video = videoElement;
    this.running = true;
    let lastTime = -1;
    const loop = () => {
      if (!this.running) return;
      if (this.video.readyState >= 2 && this.video.currentTime !== lastTime) {
        lastTime = this.video.currentTime;
        const result = this.holistic.detectForVideo(this.video, performance.now());
        if (result.landmarks?.length > 0 && this.onLandmarks) {
          this.onLandmarks(this.extractKeypoints(result));
        }
      }
      this.animFrameId = setTimeout(loop, intervalMs);
    };
    loop();
  }

  stop() {
    this.running = false;
    if (this.animFrameId) { clearTimeout(this.animFrameId); this.animFrameId = null; }
  }
}

const mediapipe = new MediaPipeService();
export default mediapipe;
