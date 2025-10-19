import { memoryStorage } from '../core/storage';
import { createTour } from '../dsl/createTour';
import { defaultTheme } from '../core/theme';
import type { TourStep } from '../core/types';

describe('react-native-coachmark', () => {
  describe('createTour', () => {
    it('should create a tour with steps', () => {
      const steps: TourStep[] = [
        { id: 'step1', title: 'Step 1', description: 'First step' },
        { id: 'step2', title: 'Step 2', description: 'Second step' },
      ];

      const tour = createTour('test-tour', steps);

      expect(tour.key).toBe('test-tour');
      expect(tour.steps).toEqual(steps);
    });

    it('should create a tour with options', () => {
      const steps: TourStep[] = [
        { id: 'step1', title: 'Step 1', description: 'First step' },
      ];

      const tour = createTour('test-tour', steps, {
        showOnce: true,
        delay: 500,
      });

      expect(tour.showOnce).toBe(true);
      expect(tour.delay).toBe(500);
    });
  });

  describe('memoryStorage', () => {
    it('should store and retrieve values', async () => {
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
  });

  describe('defaultTheme', () => {
    it('should have required properties', () => {
      expect(defaultTheme).toHaveProperty('backdropColor');
      expect(defaultTheme).toHaveProperty('backdropOpacity');
      expect(defaultTheme).toHaveProperty('tooltip');
      expect(defaultTheme).toHaveProperty('motion');
    });

    it('should have valid tooltip configuration', () => {
      expect(defaultTheme.tooltip).toHaveProperty('bg');
      expect(defaultTheme.tooltip).toHaveProperty('fg');
      expect(defaultTheme.tooltip).toHaveProperty('radius');
      expect(defaultTheme.tooltip).toHaveProperty('padding');
    });
  });
});
