import type { AppDatabase } from '../services/types';
import { seedDb } from './seed';
import { readDb, writeDb } from './storage';

let db: AppDatabase = readDb() ?? seedDb();
writeDb(db);

export const getDb = () => db;
export const setDb = (next: AppDatabase) => {
  db = next;
  writeDb(db);
};
