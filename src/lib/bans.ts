import type { User } from '@supabase/supabase-js';

const bannedNames = ['alinur'];

export function isBannedName(name: string) {
  const normalized = name.trim().toLowerCase();
  const parts = normalized.split(/[^a-z0-9]+/).filter(Boolean);
  return bannedNames.includes(normalized) || parts.some((part) => bannedNames.includes(part));
}

export function isBannedUser(user: User) {
  const metadata = user.user_metadata;
  const names = [
    metadata.username,
    metadata.name,
    metadata.full_name,
    user.email?.split('@')[0],
  ];
  return names.some((name) => typeof name === 'string' && isBannedName(name));
}
