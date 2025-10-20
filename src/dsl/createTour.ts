import type { Tour, TourStep } from '../core/types';

/**
 * Creates a tour configuration object with the specified steps and options.
 *
 * @param key - A unique identifier for the tour
 * @param steps - An array of tour steps to be displayed in sequence
 * @param opts - Optional configuration options for the tour
 * @param opts.showOnce - If true, the tour will only be shown once to the user
 * @param opts.delay - Delay in milliseconds before the tour starts
 * @returns A Tour object containing the key, steps, and optional configuration
 *
 * @example
 * ```typescript
 * const myTour = createTour(
 *   'onboarding',
 *   [step1, step2, step3],
 *   { showOnce: true, delay: 500 }
 * );
 * ```
 */
export function createTour(
  key: string,
  steps: TourStep[],
  opts?: { showOnce?: boolean; delay?: number }
): Tour {
  return { key, steps, showOnce: opts?.showOnce, delay: opts?.delay };
}
