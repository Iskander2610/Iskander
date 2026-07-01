import type { CSSProperties } from 'react';

type DjDeckProps = {
  discAngle: number;
  spinSpeed: number;
};

export function DjDeck({ discAngle, spinSpeed }: DjDeckProps) {
  return (
    <div className="dj-center">
      <div className="dj-deck" aria-label="DJ record deck">
        <div className="center-disc" style={getDiscStyle(discAngle, spinSpeed)} />
        <div className="tonearm" />
      </div>
      <section className="disc-tutorial" aria-label="Disc controls tutorial">
        <h2>Disc Controls</h2>
        <p><kbd>→</kbd> Forward DJ scratch</p>
        <p><kbd>←</kbd> Backward DJ scratch</p>
        <p><kbd>↑</kbd> Start or speed up spin</p>
        <p><kbd>↓</kbd> Slow down or stop</p>
      </section>
    </div>
  );
}

function getDiscStyle(angle: number, speed: number) {
  return {
    '--disc-angle': `${angle}deg`,
    '--disc-speed': `${Math.max(0.7, 3.2 - speed)}s`,
    animationPlayState: speed > 0 ? 'running' : 'paused',
  } as CSSProperties;
}
