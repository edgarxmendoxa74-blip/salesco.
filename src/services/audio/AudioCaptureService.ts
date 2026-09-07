import { AudioCaptureProvider } from '../../types';

export class MicrophoneAudioProvider implements AudioCaptureProvider {
  name = 'Browser Microphone (WebRTC)';
  private mediaStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private dataListeners: Array<(data: Blob | Float32Array) => void> = [];
  private errorListeners: Array<(err: Error) => void> = [];

  async start(): Promise<void> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.mediaStream);
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.dataListeners.forEach((listener) => listener(event.data));
        }
      };
      this.mediaRecorder.start(1000); // chunk every 1 second
    } catch (err: any) {
      const error = new Error(
        err.name === 'NotAllowedError'
          ? 'Microphone permission denied. Please enable microphone access.'
          : err.message || 'Failed to access audio hardware.'
      );
      this.errorListeners.forEach((l) => l(error));
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }
  }

  pause(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
    }
  }

  resume(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
    }
  }

  onAudioData(callback: (data: Blob | Float32Array) => void): void {
    this.dataListeners.push(callback);
  }

  onError(callback: (err: Error) => void): void {
    this.errorListeners.push(callback);
  }
}

export class DemoAudioProvider implements AudioCaptureProvider {
  name = 'Demo Mode Audio Simulator';
  private timer: number | null = null;
  private dataListeners: Array<(data: Blob | Float32Array) => void> = [];
  private errorListeners: Array<(err: Error) => void> = [];
  private isPaused = false;

  async start(): Promise<void> {
    this.isPaused = false;
    this.timer = window.setInterval(() => {
      if (!this.isPaused) {
        // Emit dummy audio tick blob
        const dummyBlob = new Blob(['demo-audio-tick'], { type: 'audio/webm' });
        this.dataListeners.forEach((l) => l(dummyBlob));
      }
    }, 1000);
  }

  async stop(): Promise<void> {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  pause(): void {
    this.isPaused = true;
  }

  resume(): void {
    this.isPaused = false;
  }

  onAudioData(callback: (data: Blob | Float32Array) => void): void {
    this.dataListeners.push(callback);
  }

  onError(callback: (err: Error) => void): void {
    this.errorListeners.push(callback);
  }
}
