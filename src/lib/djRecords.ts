import type { RecordedAction } from './recording';
import { supabase } from './supabase';

export type SavedDjRecord = {
  actions: RecordedAction[];
  createdAt: string;
  id: string;
  title: string;
  username: string;
};

type DjRecordRow = {
  actions: unknown;
  created_at: string;
  id: string;
  title: string;
  username: string;
};

export async function loadDjRecords() {
  const { data, error } = await supabase
    .from('dj_records')
    .select('id,title,username,actions,created_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).flatMap(normalizeRecord);
}

export async function saveDjRecord(username: string, actions: RecordedAction[]) {
  const title = `Record ${new Date().toLocaleDateString()}`;
  const { error } = await supabase.from('dj_records').insert({
    actions,
    title,
    username,
  });
  if (error) throw error;
}

export async function deleteDjRecord(id: string) {
  const { error } = await supabase.from('dj_records').delete().eq('id', id);
  if (error) throw error;
}

function normalizeRecord(row: DjRecordRow): SavedDjRecord[] {
  if (!Array.isArray(row.actions)) return [];
  return [{
    actions: row.actions.flatMap(normalizeAction),
    createdAt: row.created_at,
    id: row.id,
    title: row.title,
    username: row.username,
  }];
}

function normalizeAction(action: unknown): RecordedAction[] {
  if (!isRecord(action) || typeof action.id !== 'number' || typeof action.time !== 'number') return [];
  if (typeof action.label !== 'string' || typeof action.type !== 'string') return [];

  if (action.type === 'sound' && typeof action.index === 'number') {
    return [{ id: action.id, index: action.index, label: action.label, time: action.time, type: 'sound' }];
  }
  if (action.type === 'scratch' && isScratchDirection(action.direction)) {
    return [{ direction: action.direction, id: action.id, label: action.label, time: action.time, type: 'scratch' }];
  }
  if (action.type === 'spin' && isSpinDirection(action.direction)) {
    return [{ direction: action.direction, id: action.id, label: action.label, time: action.time, type: 'spin' }];
  }
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
