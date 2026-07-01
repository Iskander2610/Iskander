import type { RecordedAction } from './recording';
import { soundNames } from './soundButtons';

const performance = [
  { time: 0, index: 9 },
  { time: 0.72, index: 15 },
  { time: 1.44, index: 10 },
  { time: 2.16, index: 17 },
  { time: 2.88, index: 3 },
  { time: 3.6, index: 11 },
  { time: 4.32, index: 12 },
  { time: 5.04, index: 19 },
] as const;

export function createMusicPerformance() {
  const actions: RecordedAction[] = [
    { id: 1, time: 0, label: 'ArrowUp Speed up spin', type: 'spin', direction: 'up' },
    { id: 2, time: 0.36, label: 'ArrowUp Speed up spin', type: 'spin', direction: 'up' },
  ];

  performance.forEach((cue, index) => {
    actions.push(createSound(index + 3, cue.time, cue.index));
  });

  actions.push(createScratch(20, 1.08, 'forward'));
  actions.push(createScratch(21, 2.52, 'backward'));
  actions.push(createScratch(22, 4.68, 'forward'));
  actions.push({ id: 90, time: 5.8, label: 'ArrowDown Slow down spin', type: 'spin', direction: 'down' });
  actions.push({ id: 91, time: 6.1, label: 'ArrowDown Slow down spin', type: 'spin', direction: 'down' });
  return actions.sort((first, second) => first.time - second.time);
}

function createSound(id: number, time: number, index: number): RecordedAction {
  return {
    id,
    time,
    label: soundNames[index],
    type: 'sound',
    index,
  };
}

function createScratch(id: number, time: number, direction: 'forward' | 'backward'): RecordedAction {
  return {
    id,
    time,
    label: direction === 'forward' ? 'ArrowRight Forward DJ scratch' : 'ArrowLeft Backward DJ scratch',
    type: 'scratch',
    direction,
  };
}
