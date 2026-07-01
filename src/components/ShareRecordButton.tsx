import { useState } from 'react';
import type { RecordedAction } from '../lib/recording';

type ShareRecordButtonProps = {
  recording: RecordedAction[];
};

export function ShareRecordButton({ recording }: ShareRecordButtonProps) {
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showSocialOptions, setShowSocialOptions] = useState(false);
  const [target, setTarget] = useState('');
  const hasRecord = recording.length > 0;

  const shareRecord = async (mode: 'copy' | 'email') => {
    if (!hasRecord) return;
    const text = buildShareText(recording, target);
    try {
      if (mode === 'email') {
        window.location.href = buildEmailLink(text, target);
        setMessage('Email opened');
      } else {
        await navigator.clipboard.writeText(text);
        setMessage('Copied');
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setMessage('Try again');
    }
  };

  const shareToSocial = async (social: 'Telegram' | 'Instagram' | 'TikTok' | 'YouTube') => {
    const text = buildShareText(recording, target);
    if (social === 'Telegram') {
      window.open(`https://t.me/share/url?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
      setMessage('Telegram opened');
      return;
    }
    await navigator.clipboard.writeText(text);
    setMessage(`Copied for ${social}`);
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

function buildShareText(recording: RecordedAction[], target: string) {
  const lines = recording.map((action) => `${action.time.toFixed(1)}s - ${action.label}`);
  const targetLine = target.trim() ? [`To: ${target.trim()}`] : [];
  return ['My DJ record:', ...targetLine, ...lines].join('\n');
}

function buildEmailLink(text: string, target: string) {
  const email = target.includes('@') && !target.startsWith('@') ? target.trim() : '';
  const subject = encodeURIComponent('My DJ Record');
  const body = encodeURIComponent(text);
  return `mailto:${encodeURIComponent(email)}?subject=${subject}&body=${body}`;
}
