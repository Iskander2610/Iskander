import type { ReactNode } from 'react';

type InitialPageProps = {
  authControls: ReactNode;
};

export function InitialPage({ authControls }: InitialPageProps) {
  return (
    <main className="join-page join-page--initial">
      <section className="join-hero">
        <div>
          <div className="join-preview" aria-hidden="true">
            <div className="join-disc">
              <span />
            </div>
            <div className="join-equalizer">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="join-pads">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
        <div>
          <span className="join-kicker">Iskander DJ Studio</span>
          <h1>Build a beat, save the drop, send the replay.</h1>
          <p>A colorful soundboard for quick mixes, custom buttons, saved records, and shareable DJ links.</p>
        </div>
        {authControls}
        <div className="join-features" aria-label="App features">
          <span>36 sounds</span>
          <span>2 music tracks</span>
          <span>Replay links</span>
          <span>Custom studio</span>
        </div>
      </section>
      <p className="copyright-label">Copyright Iskander</p>
    </main>
  );
}
