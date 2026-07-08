import type { RecordedAction } from '../lib/recording';

type SharedReplayPanelProps = {
  isPlaying: boolean;
  onPause: () => void;
  onPlay: () => void;
  recording: RecordedAction[];
  username: string;
};

export function SharedReplayPanel({ isPlaying, onPause, onPlay, recording, username }: SharedReplayPanelProps) {
  return (
    <section className="shared-replay" aria-label="Shared record replay">
      <div>
        <span>Shared record</span>
        <h1>{username}'s DJ record</h1>
        <p>{recording.length} sounds saved in this link</p>
      </div>
      <button type="button" onClick={isPlaying ? onPause : onPlay} disabled={recording.length === 0}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <ol>
        {recording.map((action) => (
          <li key={action.id}>
            <span>{action.time.toFixed(1)}s</span>
            {action.label}
          </li>
        ))}
      </ol>
    </section>
  );
}
