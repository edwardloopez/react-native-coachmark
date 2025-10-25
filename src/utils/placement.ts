import type { Placement, Rect } from '../core/types';

type TooltipPosition = {
  x: number;
  y: number;
  placement: 'top' | 'bottom' | 'left' | 'right';
};

/**
 * Computes the optimal position for a tooltip relative to a target element.
 *
 * This function calculates the best position for a tooltip based on available screen space,
 * attempting to place it according to the specified placement preference. If the preferred
 * placement doesn't fit, it will try alternative placements (when using 'auto' mode) or
 * fallback to bottom placement with adjustments to fit within screen bounds.
 *
 * @param screenW - The width of the screen in pixels
 * @param screenH - The height of the screen in pixels
 * @param target - The rectangle dimensions and position of the target element
 * @param placement - The preferred placement direction ('auto', 'top', 'bottom', 'left', 'right')
 * @param tooltipSize - An object containing the width (w) and height (h) of the tooltip
 * @param gap - The spacing between the tooltip and target element in pixels (default: 12)
 *
 * @returns An object containing:
 *   - x: The horizontal position of the tooltip
 *   - y: The vertical position of the tooltip
 *   - placement: The final placement direction used ('top' | 'bottom' | 'left' | 'right')
 *
 * @remarks
 * - When placement is 'auto', the function tries placements in order: bottom, top, right, left
 * - The tooltip is automatically adjusted to stay within screen bounds with a 12px margin
 * - If no placement fits perfectly, defaults to bottom placement with position adjustments
 */
export function computeTooltipPosition(
  screenW: number,
  screenH: number,
  target: Rect,
  placement: Placement,
  tooltipSize: { w: number; h: number },
  gap = 12
): TooltipPosition {
  const cx = target.x + target.width / 2;
  const cy = target.y + target.height / 2;
  const pref: Placement[] =
    placement === 'auto' ? ['bottom', 'top', 'right', 'left'] : [placement];

  for (const p of pref) {
    if (
      p === 'bottom' &&
      target.y + target.height + gap + tooltipSize.h <= screenH
    ) {
      return {
        x: Math.min(
          Math.max(cx - tooltipSize.w / 2, 12),
          screenW - tooltipSize.w - 12
        ),
        y: target.y + target.height + gap,
        placement: 'bottom' as const,
      };
    }
    if (p === 'top' && target.y - gap - tooltipSize.h >= 0) {
      return {
        x: Math.min(
          Math.max(cx - tooltipSize.w / 2, 12),
          screenW - tooltipSize.w - 12
        ),
        y: Math.max(target.y - gap - tooltipSize.h, 12),
        placement: 'top' as const,
      };
    }
    if (
      p === 'right' &&
      target.x + target.width + gap + tooltipSize.w <= screenW
    ) {
      return {
        x: target.x + target.width + gap,
        y: Math.min(
          Math.max(cy - tooltipSize.h / 2, 12),
          screenH - tooltipSize.h - 12
        ),
        placement: 'right' as const,
      };
    }
    if (p === 'left' && target.x - gap - tooltipSize.w >= 0) {
      return {
        x: target.x - gap - tooltipSize.w,
        y: Math.min(
          Math.max(cy - tooltipSize.h / 2, 12),
          screenH - tooltipSize.h - 12
        ),
        placement: 'left' as const,
      };
    }
  }

  return {
    x: Math.min(
      Math.max(cx - tooltipSize.w / 2, 12),
      screenW - tooltipSize.w - 12
    ),
    y: Math.min(target.y + target.height + gap, screenH - tooltipSize.h - 12),
    placement: 'bottom' as const,
  };
}
