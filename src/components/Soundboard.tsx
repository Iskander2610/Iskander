import { DjDeck } from './DjDeck';
import { SoundButton } from './SoundButton';
import { russianSoundNames, soundNames } from '../lib/soundButtons';

type SoundboardProps = {
  discAngle: number;
  language: 'en' | 'ru';
  onRecordSound: (index: number) => void;
  spinSpeed: number;
};

export function Soundboard({ discAngle, language, onRecordSound, spinSpeed }: SoundboardProps) {
  const visibleNames = language === 'en' ? soundNames : russianSoundNames;

  return (
    <div className="button-sides">
      <div className="button-grid button-grid--left">
        {visibleNames.slice(0, 10).map((name, index) => (
          <SoundButton index={index} key={soundNames[index]} name={name} onRecordSound={onRecordSound} />
        ))}
      </div>
      <DjDeck discAngle={discAngle} spinSpeed={spinSpeed} />
      <div className="button-grid button-grid--right">
        {visibleNames.slice(10).map((name, index) => (
          <SoundButton index={index + 10} key={soundNames[index + 10]} name={name} onRecordSound={onRecordSound} />
        ))}
      </div>
    </div>
  );
}
