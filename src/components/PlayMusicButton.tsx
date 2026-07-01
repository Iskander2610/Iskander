type PlayMusicButtonProps = {
  isPlaying: boolean;
  onPlay: () => void;
};

export function PlayMusicButton({ isPlaying, onPlay }: PlayMusicButtonProps) {
  return (
    <button className="play-music-button" type="button" onClick={onPlay} disabled={isPlaying}>
      {isPlaying ? 'Playing Music' : 'Play Music'}
    </button>
  );
}
