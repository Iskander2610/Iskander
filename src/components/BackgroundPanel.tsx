import type { ChangeEvent } from 'react';
import type { BackgroundChoice } from '../lib/backgroundCustomization';

type BackgroundPanelProps = {
  onPhotoChange: (photo: string) => void;
  onSelect: (choice: BackgroundChoice) => void;
  selected: BackgroundChoice;
};

const choices: Array<{ label: string; value: BackgroundChoice }> = [
  { label: 'Cream', value: 'cream' },
  { label: 'Mint', value: 'mint' },
  { label: 'Night', value: 'night' },
  { label: 'Sunset', value: 'sunset' },
];

export function BackgroundPanel({ onPhotoChange, onSelect, selected }: BackgroundPanelProps) {
  const uploadPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') onPhotoChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="background-panel" aria-label="Background options">
      {choices.map((choice) => (
        <button
          className={selected === choice.value ? 'active-background' : ''}
          key={choice.value}
          type="button"
          onClick={() => onSelect(choice.value)}
        >
          {choice.label}
        </button>
      ))}
      <label className={selected === 'photo' ? 'active-background' : ''}>
        Photo
        <input accept="image/*" type="file" onChange={uploadPhoto} />
      </label>
    </div>
  );
}
