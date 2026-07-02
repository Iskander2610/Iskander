export { buttonColors, soundKeys, soundNames } from './soundData';

let sharedAudio: AudioContext | undefined;
let discNoise: AudioBufferSourceNode | undefined;
let discFilter: BiquadFilterNode | undefined;
let discVolume: GainNode | undefined;

export function playMemeSound(index: number) {
  const audio = getAudio();
  const volume = audio.createGain();
  const peakVolume = index === 12 ? 0.58 : 0.28;
  volume.gain.setValueAtTime(0.0001, audio.currentTime);
  volume.gain.exponentialRampToValueAtTime(peakVolume, audio.currentTime + 0.02);
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
  (audio: AudioContext, volume: GainNode) => playAirhorn(audio, volume),
  (audio: AudioContext, volume: GainNode) => playSweep(audio, volume, 1200, 120, 0, 0.36, 'sawtooth'),
  (audio: AudioContext, volume: GainNode) => playNotes(audio, volume, [55, 82, 110], 0.16, 'sine'),
  (audio: AudioContext, volume: GainNode) => playSweep(audio, volume, 700, 40, 0, 0.62, 'triangle'),
  (audio: AudioContext, volume: GainNode) => playNotes(audio, volume, [330, 440, 330, 440], 0.09, 'square'),
  (audio: AudioContext, volume: GainNode) => playGlitch(audio, volume),
  (audio: AudioContext, volume: GainNode) => playNotes(audio, volume, [880, 620, 880, 620, 1040], 0.035, 'sawtooth'),
  (audio: AudioContext, volume: GainNode) => playNotes(audio, volume, [740, 740, 370, 740], 0.08, 'square'),
  (audio: AudioContext, volume: GainNode) => playSweep(audio, volume, 1600, 420, 0, 0.2, 'sawtooth'),
  (audio: AudioContext, volume: GainNode) => playNotes(audio, volume, [520, 660, 780, 1040], 0.055, 'triangle'),
  (audio: AudioContext, volume: GainNode) => playNotes(audio, volume, [220, 220, 330, 220], 0.075, 'square'),
  (audio: AudioContext, volume: GainNode) => playEchoBlip(audio, volume),
  (audio: AudioContext, volume: GainNode) => playNotes(audio, volume, [392, 523, 659, 784], 0.05, 'sawtooth'),
  (audio: AudioContext, volume: GainNode) => playSweep(audio, volume, 960, 180, 0, 0.3, 'square'),
  (audio: AudioContext, volume: GainNode) => playNotes(audio, volume, [700, 500, 700, 500, 900], 0.045, 'sine'),
  (audio: AudioContext, volume: GainNode) => playDrumRoll(audio, volume),
] as const;

function playSweep(audio: AudioContext, volume: GainNode, start: number, end: number, delay: number, duration: number, type: OscillatorType) {
  const tone = audio.createOscillator();
  tone.type = type;
  tone.frequency.setValueAtTime(start, audio.currentTime + delay);
  tone.frequency.exponentialRampToValueAtTime(end, audio.currentTime + delay + duration);
  tone.connect(volume);
  tone.start(audio.currentTime + delay);
  tone.stop(audio.currentTime + delay + duration);
}

function playNotes(audio: AudioContext, volume: GainNode, notes: number[], step: number, type: OscillatorType) {
  notes.forEach((note, index) => playSweep(audio, volume, note, note * 0.96, index * step, step * 0.8, type));
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

function playAirhorn(audio: AudioContext, volume: GainNode) {
  [420, 520, 620].forEach((note, index) => playSweep(audio, volume, note, note - 30, index * 0.08, 0.16 + index * 0.02, 'sawtooth'));
}
function playGlitch(audio: AudioContext, volume: GainNode) {
  [130, 520, 90, 760, 180, 420].forEach((note, index) => playSweep(audio, volume, note, note * 1.04, index * 0.035, 0.025, index % 2 ? 'square' : 'sawtooth'));
}
function playEchoBlip(audio: AudioContext, volume: GainNode) {
  [760, 570, 430].forEach((note, index) => playSweep(audio, volume, note, note, index * 0.11, 0.06, 'sine'));
}
function playDrumRoll(audio: AudioContext, volume: GainNode) {
  for (let index = 0; index < 8; index += 1) playNoise(audio, volume, 0.035 + index * 0.004);
}
