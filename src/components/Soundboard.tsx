import { DjDeck } from './DjDeck';
import { SoundButton } from './SoundButton';
import type { ButtonColorMap } from '../lib/buttonCustomization';
import { soundNames } from '../lib/soundButtons';

type SoundboardProps = {
  buttonColors: ButtonColorMap;
  discAngle: number;
  isCustomizing: boolean;
  onCustomizeButton: (index: number) => void;
  onRecordSound: (index: number) => void;
  spinSpeed: number;
};

export function Soundboard({
  buttonColors,
  discAngle,
  isCustomizing,
  onCustomizeButton,
  onRecordSound,
  spinSpeed,
}: SoundboardProps) {
  const sharedProps = { buttonColors, isCustomizing, onCustomizeButton, onRecordSound };

  return (
    <div className="button-sides">
      <div className="button-grid button-grid--left">
        <ButtonGroup indexes={range(0, 10)} {...sharedProps} />
      </div>
      <div className="deck-stack">
        <NewButtonPanel indexes={range(20, 28)} position="top" {...sharedProps} />
        <DjDeck discAngle={discAngle} spinSpeed={spinSpeed} />
        <NewButtonPanel indexes={range(28, 36)} position="bottom" {...sharedProps} />
      </div>
      <div className="button-grid button-grid--right">
        <ButtonGroup indexes={range(10, 20)} {...sharedProps} />
      </div>
    </div>
  );
}

type ButtonPanelProps = {
  buttonColors: ButtonColorMap;
  indexes: number[];
  isCustomizing: boolean;
  onCustomizeButton: (index: number) => void;
  onRecordSound: (index: number) => void;
};

function ButtonGroup({ buttonColors, indexes, isCustomizing, onCustomizeButton, onRecordSound }: ButtonPanelProps) {
  return (
    <div className="button-group">
      {indexes.map((index) => (
        <SoundButton
          colors={buttonColors[index]}
          index={index}
          isCustomizing={isCustomizing}
          key={soundNames[index]}
          name={soundNames[index]}
          onCustomize={onCustomizeButton}
          onRecordSound={onRecordSound}
        />
      ))}
    </div>
  );
}

function NewButtonPanel({
  indexes,
  isCustomizing,
  onCustomizeButton,
  onRecordSound,
  position,
  buttonColors,
}: ButtonPanelProps & {
  position: 'top' | 'bottom';
}) {
  return (
    <div className={`new-button-row new-button-row--${position}`}>
      {indexes.map((index) => (
        <SoundButton
          colors={buttonColors[index]}
          index={index}
          isCustomizing={isCustomizing}
          key={soundNames[index]}
          name={soundNames[index]}
          onCustomize={onCustomizeButton}
          onRecordSound={onRecordSound}
        />
      ))}
    </div>
  );
}

function range(start: number, end: number) {
  return Array.from({ length: end - start }, (_, index) => index + start);
}
