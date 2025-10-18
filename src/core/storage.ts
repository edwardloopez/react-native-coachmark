import type { StorageAdapter } from './types';

export const memoryStorage = (): StorageAdapter => {
  const m = new Map<string, string>();
  return {
    get: async (k) => m.get(k) ?? null,
    set: async (k, v) => {
      m.set(k, v);
    },
  };
};

// AsyncStorage adapter (optional peer dependency)
export const asyncStorage = (AsyncStorage: any): StorageAdapter => ({
  get: (k) => AsyncStorage.getItem(k),
  set: (k, v) => AsyncStorage.setItem(k, v),
});

// MMKV adapter (optional peer dependency)
export const mmkvStorage = (mmkv: {
  getString: (k: string) => string | undefined;
  set: (k: string, v: string) => void;
}): StorageAdapter => ({
  get: async (k) => mmkv.getString(k) ?? null,
  set: async (k, v) => {
    mmkv.set(k, v);
  },
});
