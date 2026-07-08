import { buttonColors } from './soundData';

export type ButtonColor = readonly [string, string, string];
export type ButtonColorMap = Record<number, ButtonColor>;

const STORAGE_KEY = 'iskander-button-colors';

export const customColorChoices = [
  ['#ff4b4b', '#ff2424', '#a81414'],
  ['#b45cff', '#8a2be2', '#5b159b'],
  ['#4dabff', '#1c7ed6', '#0b4f8a'],
  ['#51cf66', '#2f9e44', '#1f6b2d'],
  ['#ffd43b', '#f59f00', '#a96800'],
  ['#111827', '#000000', '#2f2f35'],
] as const;

export function loadButtonColors() {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (!isRecord(saved)) return {};
    return Object.fromEntries(
      Object.entries(saved).flatMap(([key, value]) => (isButtonColor(value) ? [[Number(key), value]] : [])),
    ) as ButtonColorMap;
  } catch {
    return {};
  }
}

export function saveButtonColors(colors: ButtonColorMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
}

export function getNextButtonColor(index: number, currentColors: ButtonColorMap) {
  const current = currentColors[index] ?? buttonColors[index];
  const currentIndex = customColorChoices.findIndex((choice) => sameColor(choice, current));
  return customColorChoices[(currentIndex + 1) % customColorChoices.length];
}

function sameColor(left: ButtonColor, right: ButtonColor) {
  return left.every((color, index) => color === right[index]);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isButtonColor(value: unknown): value is ButtonColor {
  return Array.isArray(value) && value.length === 3 && value.every((item) => typeof item === 'string');
}
