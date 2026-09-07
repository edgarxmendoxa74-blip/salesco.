import { TranscriptItem, TranscriptionProvider } from '../../types';

export class WebSpeechTranscriptionProvider implements TranscriptionProvider {
  name = 'Web Speech Recognition API';
  private recognition: any = null;
  private transcriptListeners: Array<(item: TranscriptItem) => void> = [];
  private errorListeners: Array<(err: Error) => void> = [];
  private isListening = false;

  constructor() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US'; // Supports Taglish/English phonetics

      this.recognition.onresult = (event: any) => {
        const lastIndex = event.results.length - 1;
        const text = event.results[lastIndex][0].transcript.trim();
        const confidence = event.results[lastIndex][0].confidence || 0.92;

        if (text) {
          const item: TranscriptItem = {
            id: `ts_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            speaker: 'prospect', // Default assuming customer speaking into device
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            confidence,
          };
          this.transcriptListeners.forEach((l) => l(item));
        }
      };

      this.recognition.onerror = (event: any) => {
        const err = new Error(`Speech recognition error: ${event.error}`);
        this.errorListeners.forEach((l) => l(err));
      };
    }
  }

  async start(): Promise<void> {
    if (!this.recognition) {
      throw new Error('Web Speech API is not supported in this browser. Switching to Demo Mode or WebRTC microphone stream.');
    }
    this.isListening = true;
    try {
      this.recognition.start();
    } catch (e) {
      // Ignore if already started
    }
  }

  async stop(): Promise<void> {
    this.isListening = false;
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  pause(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  resume(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.start();
      } catch (e) {}
    }
  }

  onTranscript(callback: (item: TranscriptItem) => void): void {
    this.transcriptListeners.push(callback);
  }

  onError(callback: (err: Error) => void): void {
    this.errorListeners.push(callback);
  }
}

export interface DemoStep {
  speaker: 'prospect' | 'closer';
  text: string;
  delayMs?: number;
}

export class DemoTranscriptionProvider implements TranscriptionProvider {
  name = 'Interactive Demo Call Simulator';
  private transcriptListeners: Array<(item: TranscriptItem) => void> = [];
  private errorListeners: Array<(err: Error) => void> = [];
  private currentStepIndex = 0;
  private autoPlayTimer: number | null = null;

  private demoScript: DemoStep[] = [
    { speaker: 'prospect', text: 'May QR menu na kami ngayon.' },
    { speaker: 'closer', text: 'Ah okay po, Sir.' },
    { speaker: 'prospect', text: 'Pero static lang siya.' },
    { speaker: 'prospect', text: 'Magkano naman ang Smart Menu niyo?' },
    { speaker: 'prospect', text: 'Medyo mahal naman.' },
    { speaker: 'prospect', text: 'Sige po, pwede ba makita ang demo video or setup?' },
  ];

  async start(): Promise<void> {
    this.currentStepIndex = 0;
  }

  async stop(): Promise<void> {
    if (this.autoPlayTimer !== null) {
      clearTimeout(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  pause(): void {}
  resume(): void {}

  /** Advance to next transcript line manually or programmatically */
  emitNextStep(): TranscriptItem | null {
    if (this.currentStepIndex >= this.demoScript.length) {
      return null;
    }

    const step = this.demoScript[this.currentStepIndex];
    this.currentStepIndex++;

    const item: TranscriptItem = {
      id: `demo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      speaker: step.speaker,
      text: step.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      confidence: 0.98,
    };

    this.transcriptListeners.forEach((l) => l(item));
    return item;
  }

  /** Emit custom transcript text entered by closer */
  emitCustomText(speaker: 'prospect' | 'closer', text: string): TranscriptItem {
    const item: TranscriptItem = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      speaker,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      confidence: 0.99,
    };
    this.transcriptListeners.forEach((l) => l(item));
    return item;
  }

  getCurrentStepIndex(): number {
    return this.currentStepIndex;
  }

  getTotalSteps(): number {
    return this.demoScript.length;
  }

  onTranscript(callback: (item: TranscriptItem) => void): void {
    this.transcriptListeners.push(callback);
  }

  onError(callback: (err: Error) => void): void {
    this.errorListeners.push(callback);
  }
}
