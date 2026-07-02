import { useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { handleArrowKey } from './djControls';
import type { NewRecordedAction } from './recording';
import { playMemeSound, soundKeys } from './soundButtons';

type UseKeyboardSoundsOptions = {
  isDisabled: boolean;
  recordAction: (action: NewRecordedAction) => void;
  recordSound: (index: number) => void;
  setDiscAngle: Dispatch<SetStateAction<number>>;
  setSpinSpeed: Dispatch<SetStateAction<number>>;
};

export function useKeyboardSounds({
  isDisabled,
  recordAction,
  recordSound,
  setDiscAngle,
  setSpinSpeed,
}: UseKeyboardSoundsOptions) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isDisabled) return;
      if (handleArrowKey(event.key, setDiscAngle, setSpinSpeed, recordAction)) {
        event.preventDefault();
        return;
      }
      const soundIndex = soundKeys.indexOf(event.key.toLowerCase() as (typeof soundKeys)[number]);
      if (soundIndex < 0) return;
      event.preventDefault();
      playMemeSound(soundIndex);
      recordSound(soundIndex);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDisabled, recordAction, recordSound, setDiscAngle, setSpinSpeed]);
}
