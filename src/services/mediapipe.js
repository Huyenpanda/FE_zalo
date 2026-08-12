const HOLISTIC_VERSION = "0.5.1675471629";
const SEQUENCE_FEATURES = 225;
const HOLISTIC_CDN = `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@${HOLISTIC_VERSION}`;
const HOLISTIC_SCRIPT_ID = "mediapipe-holistic-script";

function loadHolisticConstructor() {
  if (typeof window.Holistic === "function") {
    return Promise.resolve(window.Holistic);
  }

  return new Promise((resolve, reject) => {
    const resolveConstructor = () => {
      if (typeof window.Holistic === "function") {
        resolve(window.Holistic);
      } else {
        reject(new TypeError("Holistic constructor is unavailable after script load"));
      }
    };

    const existingScript = document.getElementById(HOLISTIC_SCRIPT_ID);
    if (existingScript) {
      if (existingScript.dataset.loaded === "true")
        return resolveConstructor();
      existingScript.addEventListener("load", resolveConstructor, { once: true });
      existingScript.addEventListener("error", () =>
        reject(new Error("CDN fail")),
        { once: true },
      );
      return;
    }
    const script = document.createElement("script");
    script.id = HOLISTIC_SCRIPT_ID;
    script.src = `${HOLISTIC_CDN}/holistic.js`;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      script.dataset.loaded = "true";
      resolveConstructor();
    };
    script.onerror = () => reject(new Error("Failed to load"));
    document.body.appendChild(script);
  });
}

class MediaPipeService {
  constructor() {
    this.holistic = null;
    this.initPromise = null;
    this.ready = false;
    this.video = null;
    this.canvas = null;
    this.ctx = null;
    this.running = false;
    this.onLandmarks = null;
    this.animFrameId = null;
    this.runId = 0;
    this.processing = false;
  }

  init() {
    if (this.ready && this.holistic) return Promise.resolve(true);
    if (this.initPromise) return this.initPromise;

    this.initPromise = this.initializeHolistic();
    return this.initPromise;
  }

  async initializeHolistic() {
    let holistic = null;
    try {
      const Holistic = await loadHolisticConstructor();
      holistic = new Holistic({
        locateFile: (file) => `${HOLISTIC_CDN}/${file}`,
      });

      holistic.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        refineFaceLandmarks: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
        // Train and Python inference both process the original, unmirrored frame.
        // The local preview may still be mirrored with CSS without changing landmarks.
        selfieMode: false,
      });

      holistic.onResults((results) => {
        if (this.canvas && this.ctx) this.drawLandmarks(results);

        if (
          this.onLandmarks &&
          (results.poseLandmarks ||
            results.leftHandLandmarks ||
            results.rightHandLandmarks)
        ) {
          const landmarks225 = this.extractKeypoints(results);
          this.onLandmarks(landmarks225);
        }
      });

      await holistic.initialize();
      this.holistic = holistic;
      this.ready = true;
      console.log("MediaPipe Holistic ready (unmirrored model input)");
      return true;
    } catch (err) {
      console.error("❌ MediaPipe init error:", err);
      try {
        await holistic?.close();
      } catch (closeError) {
        console.warn("MediaPipe cleanup failed:", closeError);
      }
      this.holistic = null;
      this.ready = false;
      return false;
    } finally {
      this.initPromise = null;
    }
  }

  extractKeypoints(results) {
    // 1. Pose (33 điểm * 3 = 99 số) - Ép chặt chỉ lấy x, y, z
    let pose = new Array(99).fill(0);
    if (results.poseLandmarks) {
      pose = results.poseLandmarks.map((lm) => [lm.x, lm.y, lm.z]).flat();
    }

    // 2. Tay Trái (21 điểm * 3 = 63 số)
    let leftHand = new Array(63).fill(0);
    if (results.leftHandLandmarks) {
      leftHand = results.leftHandLandmarks
        .map((lm) => [lm.x, lm.y, lm.z])
        .flat();
    }

    // 3. Tay Phải (21 điểm * 3 = 63 số)
    let rightHand = new Array(63).fill(0);
    if (results.rightHandLandmarks) {
      rightHand = results.rightHandLandmarks
        .map((lm) => [lm.x, lm.y, lm.z])
        .flat();
    }

    // Tổng cộng đúng 225 giá trị (99 + 63 + 63)
    const keypoints = [...pose, ...leftHand, ...rightHand];
    if (
      keypoints.length !== SEQUENCE_FEATURES ||
      !keypoints.every(Number.isFinite)
    ) {
      throw new Error(
        `Invalid landmark payload: expected ${SEQUENCE_FEATURES} finite values`,
      );
    }
    return keypoints;
  }

  drawLandmarks(results) {
    if (!this.canvas || !this.ctx || !this.video) return;

    if (
      this.canvas.width !== this.video.videoWidth ||
      this.canvas.height !== this.video.videoHeight
    ) {
      this.canvas.width = this.video.videoWidth || 640;
      this.canvas.height = this.video.videoHeight || 480;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (results.poseLandmarks) {
      this.ctx.fillStyle = "#00FF00";
      for (const lm of results.poseLandmarks) {
        this.ctx.beginPath();
        this.ctx.arc(
          lm.x * this.canvas.width,
          lm.y * this.canvas.height,
          3,
          0,
          2 * Math.PI,
        );
        this.ctx.fill();
      }
    }

    this.ctx.fillStyle = "#00FFFF";
    this.ctx.strokeStyle = "#000000";
    this.ctx.lineWidth = 1;

    if (results.leftHandLandmarks) {
      for (const lm of results.leftHandLandmarks) {
        this.ctx.beginPath();
        this.ctx.arc(
          lm.x * this.canvas.width,
          lm.y * this.canvas.height,
          5,
          0,
          2 * Math.PI,
        );
        this.ctx.fill();
        this.ctx.stroke();
      }
    }
    if (results.rightHandLandmarks) {
      for (const lm of results.rightHandLandmarks) {
        this.ctx.beginPath();
        this.ctx.arc(
          lm.x * this.canvas.width,
          lm.y * this.canvas.height,
          5,
          0,
          2 * Math.PI,
        );
        this.ctx.fill();
        this.ctx.stroke();
      }
    }
  }

  start(videoElement, canvasElement) {
    if (!this.ready) return false;

    this.video = videoElement?.current ? videoElement.current : videoElement;
    const rawCanvas = canvasElement?.current
      ? canvasElement.current
      : canvasElement;

    if (rawCanvas && typeof rawCanvas.getContext === "function") {
      this.canvas = rawCanvas;
      this.ctx = this.canvas.getContext("2d");
    }

    if (!this.video) return false;

    this.running = true;
    this.runId++;
    const currentRunId = this.runId;
    let lastVideoTime = -1;
    let lastProcessedAt = 0;

    // Limit processing cost; the model consumes frame order, not video timestamps.
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;

    const loop = async () => {
      if (!this.running || currentRunId !== this.runId) return;
      const now = performance.now();

      if (
        !this.processing &&
        this.video.readyState >= 2 &&
        this.video.currentTime !== lastVideoTime &&
        now - lastProcessedAt >= frameInterval
      ) {
        lastVideoTime = this.video.currentTime;
        lastProcessedAt = now;
        this.processing = true;

        try {
          await this.holistic.send({ image: this.video });
        } catch (error) {
          console.error("MediaPipe Holistic frame failed:", error);
        } finally {
          this.processing = false;
        }
      }

      if (this.running && currentRunId === this.runId) {
        this.animFrameId = requestAnimationFrame(loop);
      }
    };

    this.animFrameId = requestAnimationFrame(loop);
    return true;
  }

  stop() {
    this.running = false;
    this.runId++;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

const mediapipeService = new MediaPipeService();
export default mediapipeService;
