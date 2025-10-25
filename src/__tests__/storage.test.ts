import { memoryStorage, asyncStorage, mmkvStorage } from '../core/storage';

describe('Storage Adapters', () => {
  describe('memoryStorage', () => {
    it('should store and retrieve items', async () => {
      const storage = memoryStorage();

      await storage.set('test-key', 'test-value');
      const value = await storage.get('test-key');

      expect(value).toBe('test-value');
    });

    it('should return null for non-existent keys', async () => {
      const storage = memoryStorage();
      const value = await storage.get('non-existent');

      expect(value).toBeNull();
    });

    it('should overwrite existing values', async () => {
      const storage = memoryStorage();

      await storage.set('test-key', 'value1');
      await storage.set('test-key', 'value2');
      const value = await storage.get('test-key');

      expect(value).toBe('value2');
    });

    it('should handle multiple keys independently', async () => {
      const storage = memoryStorage();

      await storage.set('key1', 'value1');
      await storage.set('key2', 'value2');
      await storage.set('key3', 'value3');

      expect(await storage.get('key1')).toBe('value1');
      expect(await storage.get('key2')).toBe('value2');
      expect(await storage.get('key3')).toBe('value3');
    });

    it('should handle complex data as strings', async () => {
      const storage = memoryStorage();
      const complexData = JSON.stringify({ foo: 'bar', count: 42 });

      await storage.set('complex', complexData);
      const value = await storage.get('complex');

      expect(JSON.parse(value as string)).toEqual({ foo: 'bar', count: 42 });
    });
  });

  describe('asyncStorage', () => {
    it('should wrap AsyncStorage interface', async () => {
      const mockAsyncStorage = {
        getItem: jest.fn().mockResolvedValue('mock-value'),
        setItem: jest.fn().mockResolvedValue(undefined),
      };

      const storage = asyncStorage(mockAsyncStorage);

      await storage.set('key', 'value');
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('key', 'value');

      const value = await storage.get('key');
      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('key');
      expect(value).toBe('mock-value');
    });
  });

  describe('mmkvStorage', () => {
    it('should wrap MMKV interface', async () => {
      const mockMMKV = {
        getString: jest.fn().mockReturnValue('mock-value'),
        set: jest.fn(),
      };

      const storage = mmkvStorage(mockMMKV);

      await storage.set('key', 'value');
      expect(mockMMKV.set).toHaveBeenCalledWith('key', 'value');

      const value = await storage.get('key');
      expect(mockMMKV.getString).toHaveBeenCalledWith('key');
      expect(value).toBe('mock-value');
    });

    it('should return null when MMKV returns undefined', async () => {
      const mockMMKV = {
        getString: jest.fn().mockReturnValue(undefined),
        set: jest.fn(),
      };

      const storage = mmkvStorage(mockMMKV);
      const value = await storage.get('non-existent');

      expect(value).toBeNull();
    });
  });
});
