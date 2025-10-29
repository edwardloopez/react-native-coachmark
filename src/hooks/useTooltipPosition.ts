import { useEffect, useState } from 'react';

import { Dimensions } from 'react-native';

import type { TourStep } from '../core/types';
import { computeTooltipPosition } from '../utils/placement';

type UseTooltipPositionParams = {
  targetRect: { x: number; y: number; width: number; height: number } | null;
  tooltipSize: { width: number; height: number } | null;
  activeStep: TourStep | undefined;
};

/**
 * Custom hook that calculates and manages the position of a tooltip relative to a target element.
 *
 * The hook computes the optimal tooltip position based on the target rectangle, tooltip size,
 * and placement preferences. It automatically recalculates the position when dependencies change
 * or when the window dimensions are updated.
 *
 * @param targetRect - The bounding rectangle of the target element
 * @param tooltipSize - The dimensions (width and height) of the tooltip
 * @param activeStep - The active step configuration containing placement preferences
 *
 * @returns An object containing the x and y coordinates for the tooltip position.
 *          Returns `{ x: -9999, y: -9999 }` when position hasn't been calculated yet.
 *
 * @example
 * ```typescript
 * const tooltipPosition = useTooltipPosition({
 *   targetRect: { x: 100, y: 200, width: 50, height: 30 },
 *   tooltipSize: { width: 150, height: 80 },
 *   activeStep: { placement: 'top' }
 * });
 * ```
 */
export function useTooltipPosition({
  targetRect,
  tooltipSize,
  activeStep,
}: UseTooltipPositionParams) {
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({
    x: -9999,
    y: -9999,
  });

  const { width: W, height: H } = Dimensions.get('window');

  useEffect(() => {
    if (!targetRect || !tooltipSize || !activeStep) return;

    const pos = computeTooltipPosition(
      W,
      H,
      targetRect,
      activeStep.placement ?? 'auto',
      { w: tooltipSize.width, h: tooltipSize.height },
      20
    );

    setTooltipPos({ x: pos.x, y: pos.y });
  }, [targetRect, tooltipSize, W, H, activeStep]);

  return tooltipPos;
}
