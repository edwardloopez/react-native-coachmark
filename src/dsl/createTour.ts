import type { Tour, TourStep } from '../core/types';

export function createTour(
  key: string,
  steps: TourStep[],
  opts?: { showOnce?: boolean }
): Tour {
  return { key, steps, showOnce: opts?.showOnce };
}
