import { Platform, StatusBar } from 'react-native';
import type { Rect } from '../core/types';

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
