// Audio feedback system for enhanced user experience
export class AudioSystem {
  private static instance: AudioSystem;
  private isEnabled: boolean = true;
  private volume: number = 0.5;

  private constructor() {}

  static getInstance(): AudioSystem {
    if (!AudioSystem.instance) {
      AudioSystem.instance = new AudioSystem();
    }
    return AudioSystem.instance;
  }

  // Enable/disable audio feedback
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    localStorage.setItem('audio_enabled', enabled.toString());
  }

  // Set volume (0-1)
  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('audio_volume', this.volume.toString());
  }

  // Load settings from localStorage
  loadSettings() {
    const savedEnabled = localStorage.getItem('audio_enabled');
    const savedVolume = localStorage.getItem('audio_volume');
    
    if (savedEnabled !== null) {
      this.isEnabled = savedEnabled === 'true';
    }
    if (savedVolume !== null) {
      this.volume = parseFloat(savedVolume);
    }
  }

  // Create audio context and play tone
  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.isEnabled) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }

  // Play success sound
  playSuccess() {
    // C major chord progression
    setTimeout(() => this.playTone(523.25, 0.15), 0);   // C5
    setTimeout(() => this.playTone(659.25, 0.15), 50);  // E5
    setTimeout(() => this.playTone(783.99, 0.2), 100);  // G5
  }

  // Play notification sound
  playNotification() {
    // Gentle notification bell
    setTimeout(() => this.playTone(800, 0.1), 0);
    setTimeout(() => this.playTone(1000, 0.1), 100);
  }

  // Play error sound
  playError() {
    // Descending warning tone
    setTimeout(() => this.playTone(400, 0.1), 0);
    setTimeout(() => this.playTone(350, 0.1), 80);
    setTimeout(() => this.playTone(300, 0.15), 160);
  }

  // Play message sent sound
  playMessageSent() {
    // Quick ascending beep
    this.playTone(600, 0.08);
    setTimeout(() => this.playTone(800, 0.08), 50);
  }

  // Play message received sound
  playMessageReceived() {
    // Soft notification
    this.playTone(500, 0.12);
  }

  // Play button click sound
  playButtonClick() {
    // Quick click
    this.playTone(1200, 0.05, 'square');
  }

  // Play task completion sound
  playTaskComplete() {
    // Achievement sound
    setTimeout(() => this.playTone(659.25, 0.1), 0);   // E5
    setTimeout(() => this.playTone(783.99, 0.1), 100); // G5
    setTimeout(() => this.playTone(1046.5, 0.15), 200); // C6
  }

  // Play automation trigger sound
  playAutomationTrigger() {
    // Tech/robot sound
    setTimeout(() => this.playTone(440, 0.05, 'square'), 0);
    setTimeout(() => this.playTone(880, 0.05, 'square'), 60);
    setTimeout(() => this.playTone(1320, 0.08, 'square'), 120);
  }

  // Play milestone reached sound
  playMilestone() {
    // Celebration fanfare
    setTimeout(() => this.playTone(523.25, 0.1), 0);   // C5
    setTimeout(() => this.playTone(659.25, 0.1), 100); // E5
    setTimeout(() => this.playTone(783.99, 0.1), 200); // G5
    setTimeout(() => this.playTone(1046.5, 0.15), 300); // C6
    setTimeout(() => this.playTone(1318.5, 0.2), 400);  // E6
  }

  // Play typing sound
  playTyping() {
    // Subtle keyboard sound
    this.playTone(800 + Math.random() * 200, 0.03, 'square');
  }

  // Play hover sound
  playHover() {
    // Very subtle hover feedback
    this.playTone(1000, 0.02, 'sine');
  }

  // Get current settings
  getSettings() {
    return {
      enabled: this.isEnabled,
      volume: this.volume
    };
  }
}

export const audioSystem = AudioSystem.getInstance();
