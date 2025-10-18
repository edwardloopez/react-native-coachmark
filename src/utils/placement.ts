import type { Placement, Rect } from '../core/types';

export function computeTooltipPosition(
  screenW: number,
  screenH: number,
  target: Rect,
  placement: Placement,
  tooltipSize: { w: number; h: number },
  gap = 12
) {
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
        y: target.y - gap - tooltipSize.h,
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
