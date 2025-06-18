/**
 * Audio feedback utilities for immersive user experience
 */

export class AudioFeedback {
  private static audioContext: AudioContext | null = null;
  private static enabled = true;
  private static audioFeedbackEnabled = true;

  static setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  static setAudioFeedbackEnabled(enabled: boolean) {
    this.audioFeedbackEnabled = enabled;
  }

  private static shouldPlay(): boolean {
    return this.enabled && this.audioFeedbackEnabled;
  }

  private static getAudioContext(): AudioContext | null {
    if (!this.audioContext && typeof window !== 'undefined') {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio API not supported');
        return null;
      }
    }
    return this.audioContext;
  }

  // Task completion sound - satisfying "ding"
  static playTaskComplete() {
    if (!this.shouldPlay()) return;
    this.playTone(800, 0.1, 'sine', [
      { time: 0, frequency: 800, volume: 0.3 },
      { time: 0.1, frequency: 1000, volume: 0.2 },
      { time: 0.2, frequency: 1200, volume: 0.1 }
    ]);
  }

  // Task creation sound - gentle "pop"
  static playTaskCreate() {
    if (!this.shouldPlay()) return;
    this.playTone(600, 0.15, 'sine', [
      { time: 0, frequency: 600, volume: 0.2 },
      { time: 0.05, frequency: 800, volume: 0.15 }
    ]);
  }

  // Button hover sound - subtle "tick"
  static playHover() {
    if (!this.shouldPlay()) return;
    this.playTone(1200, 0.05, 'sine', [
      { time: 0, frequency: 1200, volume: 0.1 }
    ]);
  }
  // Button click sound - satisfying "click"
  static playClick() {
    if (!this.shouldPlay()) return;
    this.playTone(800, 0.08, 'square', [
      { time: 0, frequency: 800, volume: 0.15 },
      { time: 0.04, frequency: 600, volume: 0.1 }
    ]);
  }

  // Error sound - warning "beep"
  static playError() {
    if (!this.shouldPlay()) return;
    this.playTone(400, 0.2, 'square', [
      { time: 0, frequency: 400, volume: 0.2 },
      { time: 0.1, frequency: 350, volume: 0.15 },
      { time: 0.2, frequency: 300, volume: 0.1 }
    ]);
  }

  // Success sound - triumphant "chime"
  static playSuccess() {
    if (!this.shouldPlay()) return;
    this.playTone(800, 0.3, 'sine', [
      { time: 0, frequency: 800, volume: 0.2 },
      { time: 0.1, frequency: 1000, volume: 0.25 },
      { time: 0.2, frequency: 1200, volume: 0.2 },
      { time: 0.3, frequency: 1600, volume: 0.15 }
    ]);
  }

  private static playTone(
    frequency: number, 
    duration: number, 
    type: OscillatorType = 'sine',
    envelope?: Array<{time: number, frequency: number, volume: number}>
  ) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    if (envelope) {
      envelope.forEach(point => {
        oscillator.frequency.setValueAtTime(point.frequency, ctx.currentTime + point.time);
        gainNode.gain.setValueAtTime(point.volume, ctx.currentTime + point.time);
      });
    } else {
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    }
    
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }
}

// Haptic feedback for mobile devices
export class HapticFeedback {
  private static enabled = true;

  static setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private static shouldVibrate(): boolean {
    return this.enabled && 'vibrate' in navigator;
  }

  static light() {
    if (this.shouldVibrate()) {
      navigator.vibrate(10);
    }
  }

  static medium() {
    if (this.shouldVibrate()) {
      navigator.vibrate(20);
    }
  }

  static heavy() {
    if (this.shouldVibrate()) {
      navigator.vibrate([30, 10, 30]);
    }
  }

  static success() {
    if (this.shouldVibrate()) {
      navigator.vibrate([10, 10, 10, 10, 30]);
    }
  }

  static error() {
    if (this.shouldVibrate()) {
      navigator.vibrate([50, 20, 50]);
    }
  }
}
