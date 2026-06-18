import type { Tour, TourStep } from '../core/types';
import { resolveNextOnBackdropPress } from '../utils/resolveNextOnBackdropPress';

describe('resolveNextOnBackdropPress', () => {
  const step: TourStep = { id: 'step1' };
  const tour: Tour = { key: 'tour', steps: [step] };

  it('should default to true when no config is provided', () => {
    expect(resolveNextOnBackdropPress()).toBe(true);
    expect(resolveNextOnBackdropPress(step)).toBe(true);
    expect(resolveNextOnBackdropPress(step, tour)).toBe(true);
  });

  it('should use tour-level false', () => {
    expect(
      resolveNextOnBackdropPress(step, { ...tour, nextOnBackdropPress: false })
    ).toBe(false);
  });

  it('should let step override tour false with true', () => {
    expect(
      resolveNextOnBackdropPress(
        { ...step, nextOnBackdropPress: true },
        { ...tour, nextOnBackdropPress: false }
      )
    ).toBe(true);
  });

  it('should let step override tour true with false', () => {
    expect(
      resolveNextOnBackdropPress(
        { ...step, nextOnBackdropPress: false },
        { ...tour, nextOnBackdropPress: true }
      )
    ).toBe(false);
  });
});
