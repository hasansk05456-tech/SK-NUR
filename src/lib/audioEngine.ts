export interface AudioTrackState {
  isPlaying: boolean;
  title: string;
  subtitle: string;
  src: string | null;
  mode: 'quran' | 'adhan' | 'nasheed' | 'idle';
  surahNumber?: number;
  ayahNumber?: number;
  repeat: boolean;
}

class IslamicAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private listeners: Set<(state: AudioTrackState) => void> = new Set();
  private state: AudioTrackState = {
    isPlaying: false,
    title: '',
    subtitle: '',
    src: null,
    mode: 'idle',
    repeat: false,
  };
  private onEndedCallback: (() => void) | null = null;
  private synthTimers: number[] = [];

  private ensureAudio() {
    if (!this.audio && typeof Audio !== 'undefined') {
      this.audio = new Audio();
      this.audio.preload = 'auto';
      this.audio.addEventListener('ended', () => {
        if (this.state.repeat && this.audio) {
          this.audio.currentTime = 0;
          this.audio.play().catch(() => {});
          return;
        }
        if (this.onEndedCallback) {
          this.onEndedCallback();
        } else {
          this.updateState({isPlaying: false});
        }
      });
      this.audio.addEventListener('error', () => {
        this.updateState({isPlaying: false});
      });
    }
  }

  subscribe(cb: (state: AudioTrackState) => void): () => void {
    this.listeners.add(cb);
    cb(this.state);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private updateState(partial: Partial<AudioTrackState>) {
    this.state = {...this.state, ...partial};
    for (const cb of this.listeners) {
      cb(this.state);
    }
  }

  getState(): AudioTrackState {
    return this.state;
  }

  toggleRepeat() {
    this.updateState({repeat: !this.state.repeat});
  }

  playUrl(
    url: string,
    meta: {
      title: string;
      subtitle: string;
      mode: AudioTrackState['mode'];
      surahNumber?: number;
      ayahNumber?: number;
    },
    onEnded?: () => void
  ) {
    this.clearSynth();
    this.ensureAudio();
    this.onEndedCallback = onEnded || null;
    if (!this.audio) return;

    if (this.state.src === url && !this.audio.paused) {
      this.audio.pause();
      this.updateState({isPlaying: false});
      return;
    }

    this.audio.src = url;
    this.audio.play().catch(() => {
      this.updateState({isPlaying: false});
    });
    this.updateState({
      isPlaying: true,
      src: url,
      title: meta.title,
      subtitle: meta.subtitle,
      mode: meta.mode,
      surahNumber: meta.surahNumber,
      ayahNumber: meta.ayahNumber,
    });
  }

  togglePlayPause() {
    if (!this.audio || !this.state.src) return;
    if (this.audio.paused) {
      this.audio.play().catch(() => {});
      this.updateState({isPlaying: true});
    } else {
      this.audio.pause();
      this.updateState({isPlaying: false});
    }
  }

  stop() {
    this.clearSynth();
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.onEndedCallback = null;
    this.updateState({isPlaying: false, mode: 'idle', src: null});
  }

  private clearSynth() {
    for (const id of this.synthTimers) {
      window.clearTimeout(id);
    }
    this.synthTimers = [];
  }

  /**
   * Plays a gentle, authentic Hijaz-maqam inspired Adhan / Dhikr chime using Web Audio API.
   * Works 100% offline with zero external dependency failures.
   */
  playAdhanChime(label = 'Adhan Reminder Chime') {
    this.stop();
    if (typeof window === 'undefined') return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as {webkitAudioContext?: typeof AudioContext}).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    // Maqam Hijaz notes (D4, Eb4, F#4, G4, A4, Bb4, C5, D5)
    const sequence = [
      {freq: 293.66, delay: 0, dur: 0.7},
      {freq: 369.99, delay: 0.55, dur: 0.65},
      {freq: 392.0, delay: 1.1, dur: 0.9},
      {freq: 440.0, delay: 1.9, dur: 0.75},
      {freq: 392.0, delay: 2.6, dur: 0.65},
      {freq: 369.99, delay: 3.2, dur: 0.65},
      {freq: 311.13, delay: 3.8, dur: 0.6},
      {freq: 293.66, delay: 4.35, dur: 1.3},
    ];

    this.updateState({
      isPlaying: true,
      title: label,
      subtitle: 'Maqam Hijaz Acoustic Chime',
      mode: 'adhan',
      src: 'synth://adhan-hijaz',
    });

    sequence.forEach((note) => {
      const id = window.setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + note.dur + 0.05);
      }, note.delay * 1000);
      this.synthTimers.push(id);
    });

    const endId = window.setTimeout(() => {
      this.updateState({isPlaying: false});
      ctx.close().catch(() => {});
    }, 5800);
    this.synthTimers.push(endId);
  }
}

export const islamicAudio = new IslamicAudioEngine();
