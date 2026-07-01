import type { Dispatch, SetStateAction } from 'react';
import type { NewRecordedAction, RecordedAction } from './recording';
import { playDiscScratch, playMemeSound } from './soundButtons';

type RecordAction = (action: NewRecordedAction) => void;

export function handleArrowKey(
  key: string,
  setDiscAngle: Dispatch<SetStateAction<number>>,
  setSpinSpeed: Dispatch<SetStateAction<number>>,
  recordAction: RecordAction,
) {
  if (key === 'ArrowLeft') {
    setDiscAngle((angle) => angle - 24);
    playDiscScratch('backward');
    recordAction({ type: 'scratch', direction: 'backward', label: 'ArrowLeft Backward DJ scratch' });
  } else if (key === 'ArrowRight') {
    setDiscAngle((angle) => angle + 24);
    playDiscScratch('forward');
    recordAction({ type: 'scratch', direction: 'forward', label: 'ArrowRight Forward DJ scratch' });
  } else if (key === 'ArrowUp') {
    setSpinSpeed((speed) => Math.min(speed + 0.4, 3));
    recordAction({ type: 'spin', direction: 'up', label: 'ArrowUp Speed up spin' });
  } else if (key === 'ArrowDown') {
    setSpinSpeed((speed) => Math.max(speed - 0.4, 0));
    recordAction({ type: 'spin', direction: 'down', label: 'ArrowDown Slow down spin' });
  } else return false;
  return true;
}

export function playRecordedAction(
  action: RecordedAction,
  setDiscAngle: Dispatch<SetStateAction<number>>,
  setSpinSpeed: Dispatch<SetStateAction<number>>,
) {
  if (action.type === 'sound') playMemeSound(action.index);
  else if (action.type === 'scratch') {
    setDiscAngle((angle) => angle + (action.direction === 'forward' ? 24 : -24));
    playDiscScratch(action.direction);
  } else if (action.direction === 'up') setSpinSpeed((speed) => Math.min(speed + 0.4, 3));
  else setSpinSpeed((speed) => Math.max(speed - 0.4, 0));
}
