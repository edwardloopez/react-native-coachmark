import { createTour } from '../dsl/createTour';
import type { TourStep } from '../core/types';

describe('createTour', () => {
  const mockSteps: TourStep[] = [
    { id: 'step1', title: 'Step 1', description: 'First step' },
    { id: 'step2', title: 'Step 2', description: 'Second step' },
  ];

  it('should create a tour with required properties', () => {
    const tour = createTour('test-tour', mockSteps);

    expect(tour).toHaveProperty('key', 'test-tour');
    expect(tour.steps).toHaveLength(2);
    expect(tour.steps).toEqual(mockSteps);
  });

  it('should create a tour with showOnce option', () => {
    const tour = createTour('test-tour', mockSteps, { showOnce: true });

    expect(tour.showOnce).toBe(true);
  });

  it('should create a tour with delay option', () => {
    const tour = createTour('test-tour', mockSteps, { delay: 500 });

    expect(tour.delay).toBe(500);
  });

  it('should create a tour with all options', () => {
    const tour = createTour('test-tour', mockSteps, {
      showOnce: true,
      delay: 1000,
    });

    expect(tour.showOnce).toBe(true);
    expect(tour.delay).toBe(1000);
    expect(tour.steps).toEqual(mockSteps);
  });

  it('should handle steps with various properties', () => {
    const complexSteps: TourStep[] = [
      {
        id: 'step1',
        title: 'Welcome',
        description: 'First step',
        shape: 'circle',
        padding: 20,
        radius: 15,
      },
      {
        id: 'step2',
        title: 'Features',
        description: 'Second step',
        shape: 'rect',
      },
    ];

    const tour = createTour('complex-tour', complexSteps);

    expect(tour.steps[0]?.shape).toBe('circle');
    expect(tour.steps[0]?.padding).toBe(20);
    expect(tour.steps[0]?.radius).toBe(15);
    expect(tour.steps[1]?.shape).toBe('rect');
  });

  it('should handle empty options', () => {
    const tour = createTour('test-tour', mockSteps, {});

    expect(tour.key).toBe('test-tour');
    expect(tour.steps).toEqual(mockSteps);
    expect(tour.showOnce).toBeUndefined();
    expect(tour.delay).toBeUndefined();
  });

  it('should handle tours without options', () => {
    const tour = createTour('test-tour', mockSteps);

    expect(tour.key).toBe('test-tour');
    expect(tour.steps).toEqual(mockSteps);
  });
});
