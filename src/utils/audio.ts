/**
 * LUMA Sound Engine
 * Uses Web Audio API for organic, offline-safe soothing sound synthesis.
 */

export type AmbientSoundType =
  | "rain"
  | "waves"
  | "campfire"
  | "breeze"
  | "stream"
  | "night"
  | "whitenoise";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientSource: {
    noise?: AudioBufferSourceNode;
    filter?: BiquadFilterNode;
    gain?: GainNode;
    stop?: () => void;
  } | null = null;
  private currentAmbientType: string | null = null;
  private currentVolume: number = 0.5;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  /**
   * Gentle singing-bowl chime for mindfulness and breath transitions
   */
  playChime(freq = 432, duration = 2.5) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Soft sine harmonic
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      // Gentle frequency bend for singing bowl resonance
      osc.frequency.exponentialRampToValueAtTime(freq * 0.995, this.ctx.currentTime + duration);

      // Warm harmonic overtone
      const oscHarmonic = this.ctx.createOscillator();
      const harmonicGain = this.ctx.createGain();
      oscHarmonic.type = "sine";
      oscHarmonic.frequency.setValueAtTime(freq * 2.01, this.ctx.currentTime);
      harmonicGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      harmonicGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration * 0.7);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.05); // smooth attack
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      oscHarmonic.connect(harmonicGain);
      harmonicGain.connect(this.ctx.destination);
      gain.connect(this.ctx.destination);

      osc.start();
      oscHarmonic.start();
      osc.stop(this.ctx.currentTime + duration);
      oscHarmonic.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  /**
   * Soft UI bubble pop sound for micro-interactions
   */
  playPop() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(480, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(720, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {
      // Ignore audio policy restriction
    }
  }

  /**
   * Synthesize natural ambient soundscapes
   */
  startAmbient(type: AmbientSoundType, volume = 0.5) {
    this.stopAmbient();
    try {
      this.initCtx();
      if (!this.ctx) return;

      this.currentAmbientType = type;
      this.currentVolume = volume;
      const bufferSize = this.ctx.sampleRate * 3;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate brown / pink / white noise
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === "rain" || type === "waves" || type === "stream") {
          // Brown noise
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        } else if (type === "campfire" || type === "night") {
          // Crackle / chirp bursts + warm low rumble
          const crackle = Math.random() > 0.996 ? (Math.random() * 2 - 1) * 0.9 : 0;
          data[i] = (lastOut + 0.04 * white) / 1.04 + crackle;
          lastOut = data[i];
        } else {
          // Breeze / whitenoise (soft pink noise)
          data[i] = (lastOut + 0.03 * white) / 1.03;
          lastOut = data[i];
        }
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      const baseGain = 0.15 * volume;

      if (type === "rain") {
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, this.ctx.currentTime);
        gain.gain.setValueAtTime(baseGain * 1.2, this.ctx.currentTime);
      } else if (type === "waves") {
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(420, this.ctx.currentTime);
        filter.Q.setValueAtTime(1.5, this.ctx.currentTime);
        gain.gain.setValueAtTime(baseGain * 1.4, this.ctx.currentTime);

        // LFO for wave swelling
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
        lfoGain.gain.setValueAtTime(baseGain * 0.8, this.ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        lfo.start();
      } else if (type === "stream") {
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(950, this.ctx.currentTime);
        filter.Q.setValueAtTime(2.0, this.ctx.currentTime);
        gain.gain.setValueAtTime(baseGain * 1.1, this.ctx.currentTime);
      } else if (type === "campfire" || type === "night") {
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(700, this.ctx.currentTime);
        gain.gain.setValueAtTime(baseGain * 1.3, this.ctx.currentTime);
      } else {
        // breeze / whitenoise
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(550, this.ctx.currentTime);
        gain.gain.setValueAtTime(baseGain, this.ctx.currentTime);
      }

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();

      this.ambientSource = {
        noise,
        filter,
        gain,
        stop: () => {
          try {
            noise.stop();
            noise.disconnect();
          } catch {}
        },
      };
    } catch {
      // Audio autoplay policy
    }
  }

  setAmbientVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.ambientSource?.gain && this.ctx) {
      this.ambientSource.gain.gain.setValueAtTime(
        0.18 * this.currentVolume,
        this.ctx.currentTime
      );
    }
  }

  stopAmbient() {
    if (this.ambientSource?.stop) {
      this.ambientSource.stop();
      this.ambientSource = null;
    }
    this.currentAmbientType = null;
  }

  getCurrentAmbient(): string | null {
    return this.currentAmbientType;
  }
}

export const soundEngine = new SoundEngine();
