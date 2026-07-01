import type { CSSProperties } from 'react';
import { buttonColors, playMemeSound, soundKeys } from '../lib/soundButtons';

type SoundButtonProps = {
  index: number;
  name: string;
  onRecordSound: (index: number) => void;
};

export function SoundButton({ index, name, onRecordSound }: SoundButtonProps) {
  const playSound = () => {
    playMemeSound(index);
    onRecordSound(index);
  };

  return (
    <div className="sound-button">
      <button
        className="big-red-button"
        type="button"
        aria-label={`${name}, keyboard key ${soundKeys[index]}`}
        onClick={playSound}
        style={getButtonStyle(buttonColors[index])}
      >
        <span />
      </button>
      <p>{name}</p>
      <kbd>{soundKeys[index].toUpperCase()}</kbd>
    </div>
  );
}

function getButtonStyle(colors: readonly [string, string, string]) {
  return {
    '--button-top': colors[0],
    '--button-middle': colors[1],
    '--button-side': colors[2],
  } as CSSProperties;
}
