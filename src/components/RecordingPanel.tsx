import type { RecordedAction } from '../lib/recording';

type RecordingPanelProps = {
  isRecording: boolean;
  recording: RecordedAction[];
  isPlaying: boolean;
  onStart: () => void;
  onStop: () => void;
  onPlay: () => void;
};

export function RecordingPanel({
  isRecording,
  recording,
  isPlaying,
  onStart,
  onStop,
  onPlay,
}: RecordingPanelProps) {
  return (
    <section className="record-panel" aria-label="Recording controls">
      <div className="record-actions">
        <button type="button" onClick={onStart} disabled={isRecording}>Record</button>
        <button type="button" onClick={onStop} disabled={!isRecording}>Stop Record</button>
        <button type="button" onClick={onPlay} disabled={isRecording || isPlaying || recording.length === 0}>
          Play Record
        </button>
      </div>
      <p>{getStatus(isRecording, isPlaying, recording.length)}</p>
    </section>
  );
}

function getStatus(isRecording: boolean, isPlaying: boolean, actionCount: number) {
  if (isRecording) return `Recording ${actionCount} sounds`;
  if (isPlaying) return 'Playing your record';
  return actionCount > 0 ? 'Saved record is ready' : 'No record yet';
}
