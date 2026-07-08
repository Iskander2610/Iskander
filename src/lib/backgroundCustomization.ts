import type { CSSProperties } from 'react';

export type BackgroundChoice = 'cream' | 'mint' | 'night' | 'sunset' | 'photo';

const CHOICE_KEY = 'iskander-background-choice';
const PHOTO_KEY = 'iskander-background-photo';

export function loadBackgroundChoice(): BackgroundChoice {
  const saved = localStorage.getItem(CHOICE_KEY);
  if (saved === 'mint' || saved === 'night' || saved === 'sunset' || saved === 'photo') return saved;
  return 'cream';
}

export function loadBackgroundPhoto() {
  return localStorage.getItem(PHOTO_KEY) || '';
}

export function saveBackgroundChoice(choice: BackgroundChoice) {
  localStorage.setItem(CHOICE_KEY, choice);
}

export function saveBackgroundPhoto(photo: string) {
  localStorage.setItem(PHOTO_KEY, photo);
}

export function getBackgroundStyle(choice: BackgroundChoice, photo: string) {
  if (choice === 'photo' && photo) {
    return {
      '--page-background': `linear-gradient(rgba(251,251,245,0.22), rgba(212,249,224,0.3)), url("${photo}") center / cover fixed`,
    } as CSSProperties;
  }

  const presetChoice = choice === 'photo' ? 'cream' : choice;
  return { '--page-background': backgroundMap[presetChoice] } as CSSProperties;
}

const backgroundMap: Record<Exclude<BackgroundChoice, 'photo'>, string> = {
  cream: 'linear-gradient(180deg, var(--bg) 0%, #ffffff 54%, var(--pistachio) 100%)',
  mint: 'linear-gradient(135deg, #c1fbd4 0%, #ffffff 48%, #d4f9e0 100%)',
  night: 'linear-gradient(135deg, #000 0%, #1e2c31 48%, #0a0a0a 100%)',
  sunset: 'linear-gradient(135deg, #ffd8a8 0%, #ffa8a8 44%, #b197fc 100%)',
};
