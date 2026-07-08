let musicAudio: AudioContext | undefined;

export async function playMusicTrack(choice: 'music-1' | 'music-2') {
  const audio = await getMusicAudio();
  const start = audio.currentTime + 0.05;
  const beat = choice === 'music-1' ? 0.36 : 0.3;
  const notes = choice === 'music-1'
    ? [392, 494, 587, 659, 587, 494, 440, 392]
    : [523.25, 659.25, 783.99, 987.77, 880, 783.99, 659.25, 587.33];
  const bass = choice === 'music-1'
    ? [98, 98, 130.81, 130.81, 146.83, 146.83, 130.81, 98]
    : [130.81, 164.81, 196, 164.81, 146.83, 196, 220, 196];

  for (let index = 0; index < 16; index += 1) {
    const time = start + index * beat;
    playKick(audio, time);
    if (index % 2 === 1 || (choice === 'music-2' && index % 4 === 0)) playSnare(audio, time);
    playHat(audio, time + beat * 0.5);
    playTone(audio, bass[index % bass.length], time, beat * 0.78, 'sawtooth', choice === 'music-1' ? 0.12 : 0.1);
    playTone(audio, notes[index % notes.length], time + beat * 0.08, beat * 0.45, choice === 'music-1' ? 'square' : 'triangle', 0.07);
  }

  playTone(audio, choice === 'music-1' ? 784 : 1046.5, start + 16 * beat, beat * 1.2, 'triangle', 0.08);
  return 16 * beat + 0.7;
}

async function getMusicAudio() {
  const audio = musicAudio ??= new AudioContext();
  if (audio.state === 'suspended') await audio.resume();
  return audio;
}

function playKick(audio: AudioContext, time: number) {
  const volume = audio.createGain();
  const tone = audio.createOscillator();
  tone.type = 'sine';
  tone.frequency.setValueAtTime(150, time);
  tone.frequency.exponentialRampToValueAtTime(45, time + 0.16);
  volume.gain.setValueAtTime(0.5, time);
  volume.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
  tone.connect(volume);
  volume.connect(audio.destination);
  tone.start(time);
  tone.stop(time + 0.2);
}

function playSnare(audio: AudioContext, time: number) {
  const volume = audio.createGain();
  volume.gain.setValueAtTime(0.22, time);
  volume.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
  makeNoise(audio, time, 0.12, volume);
}

function playHat(audio: AudioContext, time: number) {
  const volume = audio.createGain();
  volume.gain.setValueAtTime(0.09, time);
  volume.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
  makeNoise(audio, time, 0.05, volume);
}

function playTone(
  audio: AudioContext,
  frequency: number,
  time: number,
  duration: number,
  type: OscillatorType,
  loudness: number,
) {
  const volume = audio.createGain();
  const tone = audio.createOscillator();
  tone.type = type;
  tone.frequency.setValueAtTime(frequency, time);
  volume.gain.setValueAtTime(0.001, time);
  volume.gain.exponentialRampToValueAtTime(loudness, time + 0.02);
  volume.gain.exponentialRampToValueAtTime(0.001, time + duration);
  tone.connect(volume);
  volume.connect(audio.destination);
  tone.start(time);
  tone.stop(time + duration + 0.02);
}

function makeNoise(audio: AudioContext, time: number, duration: number, volume: GainNode) {
  const buffer = audio.createBuffer(1, audio.sampleRate * duration, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;
  const noise = audio.createBufferSource();
  noise.buffer = buffer;
  noise.connect(volume);
  volume.connect(audio.destination);
  noise.start(time);
}
