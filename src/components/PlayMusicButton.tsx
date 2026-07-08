import { useState } from 'react';
import type { MusicChoice } from '../lib/randomMusic';

type PlayMusicButtonProps = {
  isPlaying: boolean;
  onPlay: (choice: MusicChoice) => void;
};

export function PlayMusicButton({ isPlaying, onPlay }: PlayMusicButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const chooseMusic = (choice: MusicChoice) => {
    setIsOpen(false);
    onPlay(choice);
  };

  return (
    <div className="play-music-menu">
      <button
        className="play-music-button"
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        disabled={isPlaying}
      >
        {isPlaying ? 'Playing Music' : 'Play Music'}
      </button>
      {isOpen && (
        <div className="music-options">
          <button type="button" onClick={() => chooseMusic('music-1')}>Music 1</button>
          <button type="button" onClick={() => chooseMusic('music-2')}>Music 2</button>
        </div>
      )}
    </div>
  );
}
