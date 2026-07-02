import { DjDeck } from './DjDeck';
import { SoundButton } from './SoundButton';
import { soundNames } from '../lib/soundButtons';

type SoundboardProps = {
  discAngle: number;
  onRecordSound: (index: number) => void;
  spinSpeed: number;
};

export function Soundboard({ discAngle, onRecordSound, spinSpeed }: SoundboardProps) {
  return (
    <div className="button-sides">
      <div className="button-grid button-grid--left">
        <ButtonColumn indexes={range(0, 10)} onRecordSound={onRecordSound} />
      </div>
      <div className="deck-stack">
        <NewButtonPanel indexes={range(20, 28)} onRecordSound={onRecordSound} />
        <DjDeck discAngle={discAngle} spinSpeed={spinSpeed} />
        <NewButtonPanel indexes={range(28, 36)} onRecordSound={onRecordSound} />
      </div>
      <div className="button-grid button-grid--right">
        <ButtonColumn indexes={range(10, 20)} onRecordSound={onRecordSound} />
      </div>
    </div>
  );
}

function ButtonColumn({ indexes, onRecordSound }: { indexes: number[]; onRecordSound: (index: number) => void }) {
  return (
    <div className="button-column">
      {indexes.map((index) => (
        <SoundButton index={index} key={soundNames[index]} name={soundNames[index]} onRecordSound={onRecordSound} />
      ))}
    </div>
  );
}

function NewButtonPanel({ indexes, onRecordSound }: { indexes: number[]; onRecordSound: (index: number) => void }) {
  return (
    <div className="new-button-row">
      {indexes.map((index) => (
        <SoundButton index={index} key={soundNames[index]} name={soundNames[index]} onRecordSound={onRecordSound} />
      ))}
    </div>
  );
}

function range(start: number, end: number) {
  return Array.from({ length: end - start }, (_, index) => index + start);
}
