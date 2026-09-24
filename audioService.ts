type SoundName = 'pop' | 'correct' | 'wrong' | 'win';

class AudioService {
  private sounds: Record<SoundName, HTMLAudioElement> | null = null;
  private isMuted: boolean = false;
  private audioCtx: AudioContext | null = null;
  private isUnlocked: boolean = false;

  constructor() {
    this.initAudioElements();
    this.attachUnlockListeners();
  }

  private initAudioElements() {
    if (typeof window === 'undefined') return;

    try {
      this.sounds = {
        pop: new Audio('/sounds/pop.wav'),
        correct: new Audio('/sounds/correct.wav'),
        wrong: new Audio('/sounds/wrong.wav'),
        win: new Audio('/sounds/win.wav')
      };

      Object.entries(this.sounds).forEach(([name, audio]) => {
        audio.preload = 'auto';
        audio.volume = name === 'win' ? 0.65 : 0.55;
        // Handle loading errors gracefully
        audio.addEventListener('error', () => {
          // If the audio element fails, synthesize using Web Audio API
          console.warn(`[AudioService] Audio element for "${name}" reported load issue, using Web Audio synthesizer.`);
        });
      });
    } catch (e) {
      console.warn('[AudioService] Could not initialize HTMLAudioElements:', e);
      this.sounds = null;
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  private attachUnlockListeners() {
    if (typeof window === 'undefined') return;

    const unlock = () => {
      if (this.isUnlocked) return;
      this.isUnlocked = true;
      const ctx = this.getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      // Clean up event listeners after first user interaction
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('keydown', unlock);
    };

    window.addEventListener('click', unlock, { once: true, passive: true });
    window.addEventListener('touchstart', unlock, { once: true, passive: true });
    window.addEventListener('keydown', unlock, { once: true, passive: true });
  }

  setMute(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.sounds) {
      Object.values(this.sounds).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    }
  }

  play(name: SoundName) {
    if (this.isMuted) return;

    // Try HTMLAudioElement first
    const audio = this.sounds ? this.sounds[name] : null;
    if (audio) {
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Autoplay policy or error, fallback to Web Audio API synthesis
          this.synthesizeSound(name);
        });
        return;
      }
    }

    // Direct Web Audio fallback if HTMLAudioElement is unavailable
    this.synthesizeSound(name);
  }

  /**
   * High-fidelity Web Audio synthesis as an instant, zero-latency fallback
   * that works 100% offline and in all modern browsers without CORS or network dependencies.
   */
  private synthesizeSound(name: SoundName) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      if (name === 'pop') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.07);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
      } else if (name === 'correct') {
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const noteStart = now + idx * 0.08;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, noteStart);
          gain.gain.setValueAtTime(0.001, noteStart);
          gain.gain.linearRampToValueAtTime(0.3, noteStart + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(noteStart);
          osc.stop(noteStart + 0.4);
        });
      } else if (name === 'wrong') {
        [160, 130].forEach(freq => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.28);
        });
      } else if (name === 'win') {
        const fanfare = [
          { f: 392.00, delay: 0.00, dur: 0.25 },
          { f: 523.25, delay: 0.12, dur: 0.25 },
          { f: 659.25, delay: 0.24, dur: 0.25 },
          { f: 783.99, delay: 0.36, dur: 0.30 },
          { f: 1046.50, delay: 0.50, dur: 0.80 },
          { f: 1318.51, delay: 0.50, dur: 0.80 }
        ];
        fanfare.forEach(note => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = now + note.delay;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(note.f, start);
          gain.gain.setValueAtTime(0.001, start);
          gain.gain.linearRampToValueAtTime(0.25, start + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, start + note.dur);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + note.dur);
        });
      }
    } catch (e) {
      console.warn('[AudioService] Web Audio synthesis error:', e);
    }
  }
}

export const audioService = new AudioService();
