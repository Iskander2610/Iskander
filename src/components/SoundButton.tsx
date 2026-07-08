import type { CSSProperties } from 'react';
import type { ButtonColor } from '../lib/buttonCustomization';
import { buttonColors, playMemeSound, soundKeys } from '../lib/soundButtons';

type SoundButtonProps = {
  colors?: ButtonColor;
  index: number;
  isCustomizing: boolean;
  name: string;
  onCustomize: (index: number) => void;
  onRecordSound: (index: number) => void;
};

export function SoundButton({ colors, index, isCustomizing, name, onCustomize, onRecordSound }: SoundButtonProps) {
  const playSound = () => {
    if (isCustomizing) {
      onCustomize(index);
      return;
    }
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
        style={getButtonStyle(colors ?? buttonColors[index])}
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
