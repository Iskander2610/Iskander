import { useCallback, useEffect, useRef, useState } from 'react';
import { DjDeck } from './components/DjDeck';
import { PlayMusicButton } from './components/PlayMusicButton';
import { RecordingPanel } from './components/RecordingPanel';
import { ShareRecordButton } from './components/ShareRecordButton';
import { SoundButton } from './components/SoundButton';
import { handleArrowKey, playRecordedAction } from './lib/djControls';
import { playMusicTrack } from './lib/musicTrack';
import { createMusicPerformance } from './lib/randomMusic';
import type { NewRecordedAction, RecordedAction } from './lib/recording';
import {
  playMemeSound,
  russianSoundNames,
  soundKeys,
  soundNames,
  updateDiscSound,
} from './lib/soundButtons';

type Language = 'en' | 'ru';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [discAngle, setDiscAngle] = useState(0);
  const [spinSpeed, setSpinSpeed] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [recording, setRecording] = useState<RecordedAction[]>([]);
  const recordingStart = useRef(0);
  const nextRecordingId = useRef(1);
  const playbackTimers = useRef<number[]>([]);
  const visibleNames = language === 'en' ? soundNames : russianSoundNames;

  const clearPlayback = useCallback(() => {
    playbackTimers.current.forEach((timer) => window.clearTimeout(timer));
    playbackTimers.current = [];
    setIsPlaying(false);
    setIsMusicPlaying(false);
  }, []);

  const recordAction = useCallback((action: NewRecordedAction) => {
    if (!recordingStart.current) return;
    const time = Number(((performance.now() - recordingStart.current) / 1000).toFixed(1));
    setRecording((actions) => [...actions, { ...action, id: nextRecordingId.current, time }]);
    nextRecordingId.current += 1;
  }, []);

  const recordSound = useCallback((index: number) => {
    recordAction({
      type: 'sound',
      index,
      label: `${soundKeys[index].toUpperCase()} ${soundNames[index]}`,
    });
  }, [recordAction]);

  useEffect(() => {
    updateDiscSound(spinSpeed);
  }, [spinSpeed]);

  useEffect(() => clearPlayback, [clearPlayback]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (handleArrowKey(event.key, setDiscAngle, setSpinSpeed, recordAction)) {
        event.preventDefault();
        return;
      }
      const soundIndex = soundKeys.indexOf(event.key.toLowerCase() as (typeof soundKeys)[number]);
      if (soundIndex < 0) return;
      event.preventDefault();
      playMemeSound(soundIndex);
      recordSound(soundIndex);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [recordAction, recordSound]);

  const startRecording = () => {
    clearPlayback();
    recordingStart.current = performance.now();
    nextRecordingId.current = 1;
    setRecording([]);
    setIsRecording(true);
  };

  const stopRecording = () => {
    recordingStart.current = 0;
    setIsRecording(false);
  };

  const playRecording = () => {
    if (recording.length === 0) return;
    playActions(recording, () => setIsPlaying(false));
    setIsPlaying(true);
  };

  const playRandomMusic = () => {
    const music = createMusicPerformance();
    const musicDuration = playMusicTrack();
    playActions(music, () => setIsMusicPlaying(false));
    setIsMusicPlaying(true);
    playbackTimers.current.push(window.setTimeout(() => setIsMusicPlaying(false), musicDuration * 1000));
  };

  const playActions = (actions: RecordedAction[], onFinish: () => void) => {
    clearPlayback();
    playbackTimers.current = actions.map((action) => (
      window.setTimeout(() => playRecordedAction(action, setDiscAngle, setSpinSpeed), action.time * 1000)
    ));
    const finalTime = Math.max(...actions.map((action) => action.time)) * 1000 + 500;
    playbackTimers.current.push(window.setTimeout(onFinish, finalTime));
  };

  return (
    <main className="button-page">
      <ShareRecordButton recording={recording} />
      <PlayMusicButton isPlaying={isMusicPlaying} onPlay={playRandomMusic} />
      <p className="copyright-label">Copyright Iskander</p>
      <RecordingPanel
        isRecording={isRecording}
        recording={recording}
        isPlaying={isPlaying}
        onStart={startRecording}
        onStop={stopRecording}
        onPlay={playRecording}
      />
      <div className="language-switch" aria-label="Language switch">
        <button className={language === 'en' ? 'active' : ''} type="button" onClick={() => setLanguage('en')}>
          English
        </button>
        <button className={language === 'ru' ? 'active' : ''} type="button" onClick={() => setLanguage('ru')}>
          Русский
        </button>
      </div>
      <div className="button-sides">
        <div className="button-grid button-grid--left">
          {visibleNames.slice(0, 10).map((name, index) => (
            <SoundButton index={index} key={soundNames[index]} name={name} onRecordSound={recordSound} />
          ))}
        </div>
        <DjDeck discAngle={discAngle} spinSpeed={spinSpeed} />
        <div className="button-grid button-grid--right">
          {visibleNames.slice(10).map((name, index) => (
            <SoundButton index={index + 10} key={soundNames[index + 10]} name={name} onRecordSound={recordSound} />
          ))}
        </div>
      </div>
    </main>
  );
}
