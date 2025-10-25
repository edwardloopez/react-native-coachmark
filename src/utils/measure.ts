import { Platform, StatusBar } from 'react-native';

import type { Rect } from '@core/types';

/**
 * Measures the position and dimensions of a component relative to the window.
 *
 * @param ref - A reference to a React Native component that supports `measureInWindow` method
 * @returns A Promise that resolves to a `Rect` object containing x, y coordinates, width, and height
 *
 * @remarks
 * On Android, this function adjusts the Y coordinate by adding the StatusBar height.
 * This is necessary because `measureInWindow` excludes the StatusBar height on Android,
 * but Modal components include it in their positioning.
 *
 * @throws Will reject with an Error if the ref is invalid or doesn't have the `measureInWindow` method
 *
 * @example
 * ```typescript
 * const viewRef = useRef(null);
 * const rect = await measureInWindowByRef(viewRef.current);
 * console.log(rect); // { x: 0, y: 100, width: 200, height: 50 }
 * ```
 */
export function measureInWindowByRef(ref: any): Promise<Rect> {
  return new Promise((resolve, reject) => {
    if (!ref || !ref.measureInWindow) {
      reject(new Error('Invalid ref or measureInWindow not available'));
      return;
    }
    ref.measureInWindow(
      (x: number, y: number, width: number, height: number) => {
        // On Android, measureInWindow excludes StatusBar but Modal includes it
        // So we need to ADD the StatusBar height to Y coordinate
        // Round up to avoid subpixel alignment issues
        const statusBarHeight =
          Platform.OS === 'android'
            ? Math.ceil(StatusBar.currentHeight || 0)
            : 0;

        resolve({
          x,
          y: y + statusBarHeight,
          width,
          height,
        });
      }
    );
  });
}
