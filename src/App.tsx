import { useCallback, useEffect, useRef, useState } from 'react';
import { AuthControls } from './components/AuthControls';
import { LanguageSwitch } from './components/LanguageSwitch';
import { PlayMusicButton } from './components/PlayMusicButton';
import { RecordingPanel } from './components/RecordingPanel';
import { ShareRecordButton } from './components/ShareRecordButton';
import { Soundboard } from './components/Soundboard';
import { handleArrowKey, playRecordedAction } from './lib/djControls';
import { playMusicTrack } from './lib/musicTrack';
import { createMusicPerformance } from './lib/randomMusic';
import type { NewRecordedAction, RecordedAction } from './lib/recording';
import { supabase } from './lib/supabase';
import { playMemeSound, soundKeys, soundNames, updateDiscSound } from './lib/soundButtons';

type Language = 'en' | 'ru';
export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [discAngle, setDiscAngle] = useState(0);
  const [spinSpeed, setSpinSpeed] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
  const [recording, setRecording] = useState<RecordedAction[]>([]);
  const recordingStart = useRef(0);
  const nextRecordingId = useRef(1);
  const playbackTimers = useRef<number[]>([]);
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
    supabase.auth.getUser().then(({ data }) => {
      const username = data.user?.user_metadata.username;
      if (typeof username === 'string') setProfileName(username);
    });
    setProfileAvatar(localStorage.getItem('profile-avatar') ?? '');
  }, []);

  const updateProfileAvatar = (avatarUrl: string) => {
    setProfileAvatar(avatarUrl);
    localStorage.setItem('profile-avatar', avatarUrl);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isSignInOpen) return;
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
  }, [isSignInOpen, recordAction, recordSound]);

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
      <AuthControls
        avatarUrl={profileAvatar}
        isSignInOpen={isSignInOpen}
        onAvatarChange={updateProfileAvatar}
        onCloseSignIn={() => setIsSignInOpen(false)}
        onOpenSignIn={() => setIsSignInOpen(true)}
        onProfileCreated={setProfileName}
        username={profileName}
      />
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
      <LanguageSwitch language={language} onLanguageChange={setLanguage} />
      <Soundboard discAngle={discAngle} language={language} onRecordSound={recordSound} spinSpeed={spinSpeed} />
    </main>
  );
}
