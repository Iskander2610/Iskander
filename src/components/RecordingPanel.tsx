import type { RecordedAction } from '../lib/recording';
import type { SavedDjRecord } from '../lib/djRecords';

type RecordingPanelProps = {
  isRecording: boolean;
  recording: RecordedAction[];
  isPlaying: boolean;
  isSaving: boolean;
  message: string;
  onDeleteSaved: (id: string) => void;
  onLoadSaved: (recording: RecordedAction[]) => void;
  onStart: () => void;
  onStop: () => void;
  onPlay: () => void;
  onSave: () => void;
  savedRecords: SavedDjRecord[];
};

export function RecordingPanel({
  isRecording,
  isSaving,
  message,
  onDeleteSaved,
  onLoadSaved,
  recording,
  isPlaying,
  onStart,
  onStop,
  onPlay,
  onSave,
  savedRecords,
}: RecordingPanelProps) {
  return (
    <section className="record-panel" aria-label="Recording controls">
      <div className="record-actions">
        <button type="button" onClick={onStart} disabled={isRecording}>Record</button>
        <button type="button" onClick={onStop} disabled={!isRecording}>Stop Record</button>
        <button type="button" onClick={onPlay} disabled={isRecording || isPlaying || recording.length === 0}>
          Play Record
        </button>
        <button type="button" onClick={onSave} disabled={isRecording || isSaving || recording.length === 0}>
          {isSaving ? 'Saving' : 'Save Record'}
        </button>
      </div>
      <p>{message || getStatus(isRecording, isPlaying, recording.length)}</p>
      {savedRecords.length > 0 && (
        <ol className="saved-records">
          {savedRecords.map((record) => (
            <li key={record.id}>
              <button type="button" onClick={() => onLoadSaved(record.actions)}>{record.title}</button>
              <button type="button" onClick={() => onDeleteSaved(record.id)}>Delete</button>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function getStatus(isRecording: boolean, isPlaying: boolean, actionCount: number) {
  if (isRecording) return `Recording ${actionCount} sounds`;
  if (isPlaying) return 'Playing your record';
  return actionCount > 0 ? 'Saved record is ready' : 'No record yet';
}
