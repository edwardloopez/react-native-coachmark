import type { StorageAdapter } from './types';

/**
 * Creates an in-memory storage adapter that implements the StorageAdapter interface.
 *
 * This function returns a storage adapter that stores key-value pairs in memory using a Map.
 * The stored data will be lost when the application is closed or restarted.
 *
 * @returns {StorageAdapter} A storage adapter with get and set methods for managing key-value pairs in memory.
 *
 * @example
 * ```typescript
 * const storage = memoryStorage();
 * await storage.set('key', 'value');
 * const value = await storage.get('key');
 * ```
 */
export const memoryStorage = (): StorageAdapter => {
  const m = new Map<string, string>();
  return {
    get: async (k) => m.get(k) ?? null,
    set: async (k, v) => {
      m.set(k, v);
    },
  };
};

/**
 * Creates a storage adapter that wraps AsyncStorage with a standardized interface.
 *
 * @param AsyncStorage - The AsyncStorage implementation to wrap (e.g., from @react-native-async-storage/async-storage)
 * @returns A StorageAdapter object with get and set methods
 *
 * @example
 * ```typescript
 * import AsyncStorage from '@react-native-async-storage/async-storage';
 * import { asyncStorage } from '@edwardloopez/react-native-coachmark';
 *
 * const App = () => (
 *   <CoachmarkProvider storage={asyncStorage(AsyncStorage)}>
 *     {children}
 *   </CoachmarkProvider>
 * );
 */
export const asyncStorage = (AsyncStorage: any): StorageAdapter => ({
  get: (k) => AsyncStorage.getItem(k),
  set: (k, v) => AsyncStorage.setItem(k, v),
});

/**
 * Creates a storage adapter for MMKV storage.
 *
 * This function wraps an MMKV storage instance to provide a consistent
 * `StorageAdapter` interface with async get/set operations.
 *
 * @param mmkv - An object containing MMKV storage methods
 * @param mmkv.getString - Function to retrieve a string value by key
 * @param mmkv.set - Function to store a string value with a key
 *
 * @returns A `StorageAdapter` instance with async get and set methods
 *
 * @example
 * ```typescript
 * import { mmkvStorage } from '@edwardloopez/react-native-coachmark';
 * import { MMKV } from 'react-native-mmkv';
 *
 * const App = () => (
 *   <CoachmarkProvider storage={mmkvStorage(new MMKV())}>
 *     {children}
 *   </CoachmarkProvider>
 * );
 */
export const mmkvStorage = (mmkv: {
  getString: (k: string) => string | undefined;
  set: (k: string, v: string) => void;
}): StorageAdapter => ({
  get: async (k) => mmkv.getString(k) ?? null,
  set: async (k, v) => {
    mmkv.set(k, v);
  },
});
