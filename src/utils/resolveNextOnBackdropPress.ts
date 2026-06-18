import type { Tour, TourStep } from '../core/types';

export function resolveNextOnBackdropPress(
  step?: TourStep,
  tour?: Tour | null
): boolean {
  return step?.nextOnBackdropPress ?? tour?.nextOnBackdropPress ?? true;
}
