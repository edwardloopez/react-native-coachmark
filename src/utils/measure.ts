import type { Rect } from '../core/types';

export function measureInWindowByRef(ref: any): Promise<Rect> {
  return new Promise((resolve, reject) => {
    if (!ref || !ref.measureInWindow) {
      reject(new Error('Invalid ref or measureInWindow not available'));
      return;
    }
    ref.measureInWindow(
      (x: number, y: number, width: number, height: number) => {
        resolve({ x, y, width, height });
      }
    );
  });
}
