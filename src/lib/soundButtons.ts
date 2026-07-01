export const buttonColors = [
  ['#ff4b4b', '#ff2424', '#a81414'], ['#b45cff', '#8a2be2', '#5b159b'],
  ['#4dabff', '#1c7ed6', '#0b4f8a'], ['#51cf66', '#2f9e44', '#1f6b2d'],
  ['#ffd43b', '#f59f00', '#a96800'], ['#ff922b', '#f76707', '#a63f00'],
  ['#f06595', '#d6336c', '#8a1f45'], ['#20c997', '#0ca678', '#087f5b'],
  ['#845ef7', '#5f3dc4', '#3b2582'], ['#22b8cf', '#1098ad', '#0b6978'],
  ['#ff6b6b', '#fa5252', '#b02a37'], ['#cc5de8', '#ae3ec9', '#702184'],
  ['#339af0', '#228be6', '#14599a'], ['#69db7c', '#40c057', '#2b8a3e'],
  ['#ffe066', '#fab005', '#b58100'], ['#ffa94d', '#fd7e14', '#b45100'],
  ['#faa2c1', '#e64980', '#a61e4d'], ['#63e6be', '#12b886', '#087f5b'],
  ['#9775fa', '#7048e8', '#4327a8'], ['#66d9e8', '#15aabf', '#0b7285'],
] as const;

export const soundNames = [
  'Womp Drop', 'Bonk Down', 'Alien Rise', 'Boing Climb', 'Fail Drop',
  'Double Bonk', 'Static Burst', 'Siren Beep', 'Slide Down', 'Bass Steps',
  'Laser Up', 'Robot Beep', 'Slow Rise', 'Sad Slide', 'Tiny Static',
  'Arcade Jump', 'Zap Fall', 'Meme Loop', 'Flat Honk', 'Fast Fall',
] as const;

export const soundKeys = [
  'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
  'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z',
] as const;

let sharedAudio: AudioContext | undefined;
let discNoise: AudioBufferSourceNode | undefined;
let discFilter: BiquadFilterNode | undefined;
let discVolume: GainNode | undefined;

export function playMemeSound(index: number) {
  const audio = getAudio();
  const volume = audio.createGain();
  volume.gain.setValueAtTime(0.0001, audio.currentTime);
  volume.gain.exponentialRampToValueAtTime(0.28, audio.currentTime + 0.02);
  volume.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.72);
  volume.connect(audio.destination);
  soundPatterns[index % soundPatterns.length](audio, volume);
}

export function updateDiscSound(speed: number) {
  const audio = getAudio();
  if (speed <= 0) {
    discVolume?.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.08);
    return;
  }
  if (!discNoise || !discFilter || !discVolume) startDiscSound(audio);
  const strength = Math.min(speed / 3, 1);
  discVolume?.gain.exponentialRampToValueAtTime(0.16 + strength * 0.44, audio.currentTime + 0.08);
  discFilter?.frequency.exponentialRampToValueAtTime(250 + strength * 900, audio.currentTime + 0.08);
}

export function playDiscScratch(direction: 'forward' | 'backward') {
  const audio = getAudio();
  const volume = audio.createGain();
  const filter = audio.createBiquadFilter();
  const start = direction === 'forward' ? 260 : 900;
  const end = direction === 'forward' ? 1100 : 180;
  filter.type = 'highpass';
  filter.frequency.value = 480;
  volume.gain.setValueAtTime(0.0001, audio.currentTime);
  volume.gain.exponentialRampToValueAtTime(0.42, audio.currentTime + 0.015);
  volume.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.2);
  filter.connect(volume);
  volume.connect(audio.destination);
  playSweep(audio, filter, start, end, 0, 0.16, 'sawtooth');
  playNoise(audio, filter, 0.12);
}

function getAudio() {
  const audio = sharedAudio ??= new AudioContext();
  if (audio.state === 'suspended') void audio.resume();
  return audio;
}

function startDiscSound(audio: AudioContext) {
  discNoise = audio.createBufferSource();
  discNoise.buffer = createNoiseBuffer(audio);
  discNoise.loop = true;
  discFilter = audio.createBiquadFilter();
  discFilter.type = 'bandpass';
  discVolume = audio.createGain();
  discVolume.gain.value = 0.0001;
  discNoise.connect(discFilter);
  discFilter.connect(discVolume);
  discVolume.connect(audio.destination);
  discNoise.start();
}

function createNoiseBuffer(audio: AudioContext) {
  const buffer = audio.createBuffer(1, audio.sampleRate, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < data.length; index += 1) {
    data[index] = (Math.random() * 2 - 1) * (index % 23 === 0 ? 1 : 0.18);
  }
  return buffer;
}

const soundPatterns = [
  (audio: AudioContext, volume: GainNode) => playSweep(audio, volume, 180, 80, 0, 0.42, 'sawtooth'),
  (audio: AudioContext, volume: GainNode) => playNotes(audio, volume, [520, 390, 260], 0.08, 'square'),
  (audio: AudioContext, volume: GainNode) => playSweep(audio, volume, 120, 700, 0, 0.35, 'sine'),
  (audio: AudioContext, volume: GainNode) => playNotes(audio, volume, [220, 330, 440, 660], 0.06, 'triangle'),
  (audio: AudioContext, volume: GainNode) => playSweep(audio, volume, 800, 90, 0, 0.5, 'square'),
  (audio: AudioContext, volume: GainNode) => playNotes(audio, volume, [160, 160, 260], 0.12, 'sawtooth'),
  (audio: AudioContext, volume: GainNode) => playNoise(audio, volume, 0.3),
  (audio: AudioContext, volume: GainNode) => playNotes(audio, volume, [740, 580, 740, 580], 0.05, 'sine'),
  (audio: AudioContext, volume: GainNode) => playSweep(audio, volume, 300, 55, 0, 0.32, 'triangle'),
  (audio: AudioContext, volume: GainNode) => playNotes(audio, volume, [98, 147, 196], 0.14, 'square'),
  (audio: AudioContext, volume: GainNode) => playSweep(audio, volume, 440, 880, 0, 0.18, 'sawtooth'),
  (audio: AudioContext, volume: GainNode) => playNotes(audio, volume, [660, 330, 660], 0.07, 'square'),
  (audio: AudioContext, volume: GainNode) => playSweep(audio, volume, 90, 220, 0, 0.55, 'sine'),
  (audio: AudioContext, volume: GainNode) => playNotes(audio, volume, [300, 250, 210, 170], 0.08, 'triangle'),
  (audio: AudioContext, volume: GainNode) => playNoise(audio, volume, 0.16),
  (audio: AudioContext, volume: GainNode) => playNotes(audio, volume, [420, 560, 700], 0.05, 'sawtooth'),
  (audio: AudioContext, volume: GainNode) => playSweep(audio, volume, 1000, 180, 0, 0.25, 'square'),
  (audio: AudioContext, volume: GainNode) => playNotes(audio, volume, [185, 247, 330, 247], 0.1, 'sine'),
  (audio: AudioContext, volume: GainNode) => playSweep(audio, volume, 260, 260, 0, 0.5, 'triangle'),
  (audio: AudioContext, volume: GainNode) => playNotes(audio, volume, [900, 700, 500, 300], 0.045, 'square'),
] as const;

function playNotes(audio: AudioContext, volume: GainNode, notes: number[], step: number, type: OscillatorType) {
  notes.forEach((note, index) => playSweep(audio, volume, note, note * 0.96, index * step, step * 0.8, type));
}

function playSweep(audio: AudioContext, volume: GainNode, start: number, end: number, delay: number, duration: number, type: OscillatorType) {
  const tone = audio.createOscillator();
  tone.type = type;
  tone.frequency.setValueAtTime(start, audio.currentTime + delay);
  tone.frequency.exponentialRampToValueAtTime(end, audio.currentTime + delay + duration);
  tone.connect(volume);
  tone.start(audio.currentTime + delay);
  tone.stop(audio.currentTime + delay + duration);
}

function playNoise(audio: AudioContext, volume: GainNode, duration: number) {
  const buffer = audio.createBuffer(1, audio.sampleRate * duration, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;
  const noise = audio.createBufferSource();
  noise.buffer = buffer;
  noise.connect(volume);
  noise.start();
}
