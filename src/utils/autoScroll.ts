import { Dimensions } from 'react-native';

import type { Rect } from '../core/types';

/**
 * Checks if a rectangle is fully visible within the screen viewport, considering padding.
 *
 * @param rect - The rectangle object containing position (x, y) and dimensions (width, height)
 * @param padding - The padding distance from screen edges in pixels (default: 20)
 *
 * @returns An object containing:
 *   - `isVisible`: boolean indicating if the rectangle is fully visible within the padded viewport
 *   - `scrollY`: (optional) the Y-axis scroll position needed to center the rectangle on screen, only present when `isVisible` is false
 *
 * @remarks
 * The function considers a rectangle fully visible when its top edge is below the top padding
 * and its bottom edge is above the bottom padding. If not visible, it calculates the scroll
 * position needed to vertically center the rectangle on the screen.
 */
export function isRectVisible(
  rect: Rect,
  padding: number = 20
): { isVisible: boolean; scrollY?: number } {
  const { height: screenHeight } = Dimensions.get('window');

  const topEdge = padding;
  const bottomEdge = screenHeight - padding;

  const isFullyVisible =
    rect.y >= topEdge && rect.y + rect.height <= bottomEdge;

  if (!isFullyVisible) {
    const targetY = rect.y - screenHeight / 2 + rect.height / 2;
    return { isVisible: false, scrollY: Math.max(0, targetY) };
  }

  return { isVisible: true };
}
