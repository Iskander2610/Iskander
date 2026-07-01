import { useCallback, useEffect, useRef, useState } from 'react';
import { AuthControls } from './components/AuthControls';
import { PlayMusicButton } from './components/PlayMusicButton';
import { RecordingPanel } from './components/RecordingPanel';
import { ShareRecordButton } from './components/ShareRecordButton';
import { Soundboard } from './components/Soundboard';
import { isBannedUser } from './lib/bans';
import { handleArrowKey, playRecordedAction } from './lib/djControls';
import { playMusicTrack } from './lib/musicTrack';
import { createMusicPerformance } from './lib/randomMusic';
import type { NewRecordedAction, RecordedAction } from './lib/recording';
import { supabase } from './lib/supabase';
import { playMemeSound, soundKeys, soundNames, updateDiscSound } from './lib/soundButtons';

export default function App() {
  const [discAngle, setDiscAngle] = useState(0);
  const [spinSpeed, setSpinSpeed] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
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
      if (data.user && isBannedUser(data.user)) {
        setIsBlocked(true);
        void supabase.auth.signOut();
        return;
      }
      const metadata = data.user?.user_metadata;
      const username = metadata?.username ?? metadata?.name ?? metadata?.full_name ?? data.user?.email?.split('@')[0];
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
      if (isBlocked) return;
      if (!profileName) return;
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
  }, [isBlocked, isSignInOpen, profileName, recordAction, recordSound]);

  if (isBlocked) {
    return (
      <main className="blocked-page">
        <section>
          <h1>You are banned from this game.</h1>
          <p>This account cannot join Iskander DJ.</p>
        </section>
      </main>
    );
  }

  if (!profileName) {
    return (
      <main className="join-page">
        <AuthControls
          avatarUrl={profileAvatar}
          isSignInOpen={isSignInOpen}
          onAvatarChange={updateProfileAvatar}
          onCloseSignIn={() => setIsSignInOpen(false)}
          onOpenSignIn={() => setIsSignInOpen(true)}
          onProfileCreated={setProfileName}
          username={profileName}
        />
        <section>
          <h1>Join Iskander DJ</h1>
          <p>Sign in first to play the game.</p>
        </section>
        <p className="copyright-label">Copyright Iskander</p>
      </main>
    );
  }

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
      <Soundboard discAngle={discAngle} onRecordSound={recordSound} spinSpeed={spinSpeed} />
    </main>
  );
}
