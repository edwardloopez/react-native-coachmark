jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 812 })),
  },
  findNodeHandle: jest.fn(),
  UIManager: {
    measureInWindow: jest.fn(),
  },
}));

import { isRectVisible } from '../utils/autoScroll';

describe('autoScroll utilities', () => {
  describe('isRectVisible', () => {
    it('returns true when rect is fully visible', () => {
      const rect = { x: 100, y: 200, width: 100, height: 50 };
      const result = isRectVisible(rect, 20);

      expect(result.isVisible).toBe(true);
      expect(result.scrollY).toBeUndefined();
    });

    it('returns false when rect is above visible area', () => {
      const rect = { x: 100, y: 5, width: 100, height: 50 };
      const result = isRectVisible(rect, 20);

      expect(result.isVisible).toBe(false);
      expect(result.scrollY).toBeDefined();
    });

    it('returns false when rect is below visible area', () => {
      const screenHeight = 812;
      const rect = { x: 100, y: screenHeight - 10, width: 100, height: 50 };
      const result = isRectVisible(rect, 20);

      expect(result.isVisible).toBe(false);
      expect(result.scrollY).toBeDefined();
    });

    it('calculates scroll position to center the element', () => {
      const screenHeight = 812;
      const rect = { x: 100, y: screenHeight + 100, width: 100, height: 50 };
      const result = isRectVisible(rect, 20);

      expect(result.isVisible).toBe(false);
      const expectedScrollY = rect.y - screenHeight / 2 + rect.height / 2;
      expect(result.scrollY).toBe(expectedScrollY);
    });

    it('respects custom padding', () => {
      const rect = { x: 100, y: 25, width: 100, height: 50 };
      const result1 = isRectVisible(rect, 20);
      expect(result1.isVisible).toBe(true);

      const result2 = isRectVisible(rect, 50);
      expect(result2.isVisible).toBe(false);
    });

    it('ensures scrollY is never negative', () => {
      const rect = { x: 100, y: 10, width: 100, height: 50 };
      const result = isRectVisible(rect, 20);

      if (result.scrollY !== undefined) {
        expect(result.scrollY).toBeGreaterThanOrEqual(0);
      }
    });
  });
});
