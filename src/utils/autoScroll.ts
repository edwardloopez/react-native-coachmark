import { Dimensions } from 'react-native';
import type { Rect } from '../core/types';

/**
 * Checks if a rect is fully visible within the viewport
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
