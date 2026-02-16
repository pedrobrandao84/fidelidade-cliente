import type { AppDatabase } from '../services/types';

const KEY = 'fidelidade-db';

export const readDb = (): AppDatabase | null => {
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as AppDatabase) : null;
};

export const writeDb = (data: AppDatabase) => {
  localStorage.setItem(KEY, JSON.stringify(data));
};
