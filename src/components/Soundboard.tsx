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
        {soundNames.slice(0, 10).map((name, index) => (
          <SoundButton index={index} key={soundNames[index]} name={name} onRecordSound={onRecordSound} />
        ))}
      </div>
      <DjDeck discAngle={discAngle} spinSpeed={spinSpeed} />
      <div className="button-grid button-grid--right">
        {soundNames.slice(10).map((name, index) => (
          <SoundButton index={index + 10} key={soundNames[index + 10]} name={name} onRecordSound={onRecordSound} />
        ))}
      </div>
    </div>
  );
}
