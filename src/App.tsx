import { useCallback, useEffect, useRef, useState } from 'react';
import { AuthControls } from './components/AuthControls';
import { PlayMusicButton } from './components/PlayMusicButton';
import { RecordingPanel } from './components/RecordingPanel';
import { ShareRecordButton } from './components/ShareRecordButton';
import { Soundboard } from './components/Soundboard';
import { playRecordedAction } from './lib/djControls';
import { playMusicTrack } from './lib/musicTrack';
import { createMusicPerformance } from './lib/randomMusic';
import type { NewRecordedAction, RecordedAction } from './lib/recording';
import { soundKeys, soundNames, updateDiscSound } from './lib/soundButtons';
import { useInspectBlocker } from './lib/useInspectBlocker';
import { useKeyboardSounds } from './lib/useKeyboardSounds';
import { useProfile } from './lib/useProfile';

export default function App() {
  useInspectBlocker();
  const [discAngle, setDiscAngle] = useState(0);
  const [spinSpeed, setSpinSpeed] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [recording, setRecording] = useState<RecordedAction[]>([]);
  const profile = useProfile();
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
    recordAction({ type: 'sound', index, label: `${soundKeys[index].toUpperCase()} ${soundNames[index]}` });
  }, [recordAction]);
  useEffect(() => {
    updateDiscSound(spinSpeed);
  }, [spinSpeed]);
  useEffect(() => clearPlayback, [clearPlayback]);

  useKeyboardSounds({
    isDisabled: profile.isBlocked || profile.isLogInOpen || profile.isSignInOpen || !profile.profileName,
    recordAction,
    recordSound,
    setDiscAngle,
    setSpinSpeed,
  });

  const authControls = (
    <AuthControls
      avatarUrl={profile.profileAvatar}
      isLogInOpen={profile.isLogInOpen}
      isSignInOpen={profile.isSignInOpen}
      onAvatarChange={profile.updateProfileAvatar}
      onCloseLogIn={() => profile.setIsLogInOpen(false)}
      onCloseSignIn={() => profile.setIsSignInOpen(false)}
      onLogIn={profile.setProfileName}
      onOpenLogIn={() => {
        profile.setIsSignInOpen(false);
        profile.setIsLogInOpen(true);
      }}
      onOpenSignIn={() => {
        profile.setIsLogInOpen(false);
        profile.setIsSignInOpen(true);
      }}
      onProfileCreated={profile.setProfileName}
      username={profile.profileName}
    />
  );

  if (profile.isBlocked) {
    return (
      <main className="blocked-page">
        <section>
          <h1>You are banned from this game.</h1>
          <p>This account cannot join Iskander DJ.</p>
        </section>
      </main>
    );
  }
  if (!profile.profileName) {
    return (
      <main className="join-page">
        {authControls}
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
      {authControls}
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
