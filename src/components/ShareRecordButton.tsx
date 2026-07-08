import { useState } from 'react';
import type { RecordedAction } from '../lib/recording';
import { buildReplayLink } from '../lib/replayLink';

type ShareRecordButtonProps = {
  recording: RecordedAction[];
  username: string;
};

export function ShareRecordButton({ recording, username }: ShareRecordButtonProps) {
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showSocialOptions, setShowSocialOptions] = useState(false);
  const [target, setTarget] = useState('');
  const hasRecord = recording.length > 0;

  const shareRecord = async (mode: 'copy' | 'email') => {
    if (!hasRecord) return;
    const link = buildReplayLink(recording, username);
    const text = buildShareText(recording, target, link);
    try {
      if (mode === 'email') {
        window.location.href = buildEmailLink(text, target);
        setMessage('Email opened');
      } else {
        await navigator.clipboard.writeText(link);
        setMessage('Replay link copied');
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setMessage('Try again');
    }
  };

  const shareToSocial = async (social: 'Telegram' | 'Instagram' | 'TikTok' | 'YouTube') => {
    const link = buildReplayLink(recording, username);
    if (social === 'Telegram') {
      window.open(buildTelegramLink(link, username), '_blank', 'noopener,noreferrer');
      setMessage('Choose a chat in Telegram');
      return;
    }
    await navigator.clipboard.writeText(link);
    setMessage(`Replay link copied for ${social}`);
  };

  return (
    <div className="share-record">
      <button
        type="button"
        onClick={() => {
          setIsOpen((open) => !open);
          setShowSocialOptions(false);
        }}
        disabled={!hasRecord}
      >
        Share Record
      </button>
      {isOpen && (
        <div className="share-box">
          <label htmlFor="share-target">Send to account, social media, or email</label>
          <input
            id="share-target"
            value={target}
            onChange={(event) => setTarget(event.target.value)}
            placeholder="@friend, TikTok, or email"
          />
          <div className="share-choices">
            <button type="button" onClick={() => shareRecord('email')}>Email</button>
            <button type="button" onClick={() => setShowSocialOptions((show) => !show)}>Social</button>
            <button type="button" onClick={() => shareRecord('copy')}>Copy</button>
          </div>
          {showSocialOptions && (
            <div className="social-choices" aria-label="Social media choices">
              <button type="button" onClick={() => shareToSocial('Telegram')}>Telegram</button>
              <button type="button" onClick={() => shareToSocial('Instagram')}>Instagram</button>
              <button type="button" onClick={() => shareToSocial('TikTok')}>TikTok</button>
              <button type="button" onClick={() => shareToSocial('YouTube')}>YouTube</button>
            </div>
          )}
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

function buildShareText(recording: RecordedAction[], target: string, link: string) {
  const lines = recording.map((action) => `${action.time.toFixed(1)}s - ${action.label}`);
  const targetLine = target.trim() ? [`To: ${target.trim()}`] : [];
  return ['My DJ record:', link, ...targetLine, ...lines].join('\n');
}

function buildEmailLink(text: string, target: string) {
  const email = target.includes('@') && !target.startsWith('@') ? target.trim() : '';
  const subject = encodeURIComponent('My DJ Record');
  const body = encodeURIComponent(text);
  return `mailto:${encodeURIComponent(email)}?subject=${subject}&body=${body}`;
}

function buildTelegramLink(link: string, username: string) {
  const url = encodeURIComponent(link);
  const shareText = encodeURIComponent(`${username || 'Someone'} made a DJ record. Open it and press Play.`);
  return `https://t.me/share/url?url=${url}&text=${shareText}`;
}
