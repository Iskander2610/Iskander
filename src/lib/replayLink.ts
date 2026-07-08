import type { RecordedAction } from './recording';

const RECORD_PARAM = 'record';
const USER_PARAM = 'user';

export function buildReplayLink(recording: RecordedAction[], username: string) {
  const url = new URL(getShareBaseUrl());
  url.search = '';
  url.hash = '';
  url.searchParams.set(RECORD_PARAM, encodeRecording(recording));
  if (username.trim()) url.searchParams.set(USER_PARAM, username.trim());
  return url.toString();
}

export function hasReplayLink() {
  return new URLSearchParams(window.location.search).has(RECORD_PARAM);
}

export function readReplayRecording() {
  const encoded = new URLSearchParams(window.location.search).get(RECORD_PARAM);
  if (!encoded) return [];

  try {
    const data: unknown = JSON.parse(decodeRecording(encoded));
    if (!Array.isArray(data)) return [];
    return data.flatMap((item, index) => normalizeAction(item, index));
  } catch {
    return [];
  }
}

export function readReplayUsername() {
  return new URLSearchParams(window.location.search).get(USER_PARAM)?.trim() || 'Someone';
}

function encodeRecording(recording: RecordedAction[]) {
  const bytes = new TextEncoder().encode(JSON.stringify(recording));
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function decodeRecording(encoded: string) {
  const padded = encoded.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(encoded.length / 4) * 4, '=');
  const binary = atob(padded);
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
}

function normalizeAction(item: unknown, index: number): RecordedAction[] {
  if (!isRecord(item) || typeof item.time !== 'number' || typeof item.label !== 'string') return [];
  const base = { id: index + 1, time: item.time, label: item.label };

  if (item.type === 'sound' && typeof item.index === 'number') return [{ ...base, type: 'sound', index: item.index }];
  if (item.type === 'scratch' && isScratchDirection(item.direction)) {
    return [{ ...base, type: 'scratch', direction: item.direction }];
  }
  if (item.type === 'spin' && isSpinDirection(item.direction)) return [{ ...base, type: 'spin', direction: item.direction }];
  return [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isScratchDirection(value: unknown): value is 'forward' | 'backward' {
  return value === 'forward' || value === 'backward';
}

function isSpinDirection(value: unknown): value is 'up' | 'down' {
  return value === 'up' || value === 'down';
}

function getShareBaseUrl() {
  const publicUrl = import.meta.env.VITE_PUBLIC_APP_URL as string | undefined;
  return publicUrl?.trim() || window.location.href;
}
