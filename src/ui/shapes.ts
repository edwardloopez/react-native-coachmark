import type { Rect } from '@core/types';

/**
 * Expands a rectangle by adding padding on all sides.
 *
 * @param rect - The rectangle to inset (expand)
 * @param pad - The padding amount to add on all sides. Positive values expand the rectangle, negative values shrink it.
 * @returns A new rectangle with the padding applied to all sides
 *
 * @example
 * ```typescript
 * const rect = { x: 10, y: 10, width: 100, height: 100 };
 * const expanded = inset(rect, 5);
 * // Result: { x: 5, y: 5, width: 110, height: 110 }
 * ```
 */
export function inset(rect: Rect, pad: number): Rect {
  return {
    x: rect.x - pad,
    y: rect.y - pad,
    width: rect.width + pad * 2,
    height: rect.height + pad * 2,
  };
}

/**
 * Generates an SVG path string for a circle that fits within the given rectangle.
 *
 * The circle is centered within the rectangle and its radius is determined by half
 * of the rectangle's largest dimension (width or height).
 *
 * @param rect - The bounding rectangle for the circle, containing x, y coordinates and width, height dimensions
 * @returns An SVG path string representing a circle using arc commands
 *
 * @example
 * ```typescript
 * const rect = { x: 10, y: 10, width: 100, height: 100 };
 * const path = pathForCircle(rect);
 * // Returns: "M 60 60 m -50, 0 a 50,50 0 1,0 100,0 a 50,50 0 1,0 -100,0"
 * ```
 */
export function pathForCircle(rect: Rect): string {
  const cx = rect.x + rect.width / 2;
  const cy = rect.y + rect.height / 2;
  const r = Math.max(rect.width, rect.height) / 2;
  return `M ${cx} ${cy} m -${r}, 0 a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0`;
}

/**
 * Generates an SVG path string for a rectangle with rounded corners.
 *
 * @param rect - The rectangle dimensions and position containing x, y, width, and height properties
 * @param radius - The radius of the rounded corners. Defaults to 12. Will be clamped to half the smaller dimension of the rectangle
 * @returns An SVG path string representing a rounded rectangle that can be used in the `d` attribute of a `<path>` element
 *
 * @example
 * ```typescript
 * const rect = { x: 10, y: 20, width: 100, height: 50 };
 * const path = pathForRect(rect, 8);
 * // Returns: "M 18 20 H 102 A 8 8 0 0 1 110 28 V 62 A 8 8 0 0 1 102 70 H 18 A 8 8 0 0 1 10 62 V 28 A 8 8 0 0 1 18 20 Z"
 * ```
 */
export function pathForRect(rect: Rect, radius = 12): string {
  const { x, y, width: w, height: h } = rect;
  const r = Math.min(radius, Math.min(w, h) / 2);
  return `M ${x + r} ${y} H ${x + w - r} A ${r} ${r} 0 0 1 ${x + w} ${y + r} V ${y + h - r} A ${r} ${r} 0 0 1 ${x + w - r} ${y + h} H ${x + r} A ${r} ${r} 0 0 1 ${x} ${y + h - r} V ${y + r} A ${r} ${r} 0 0 1 ${x + r} ${y} Z`;
}

/**
 * Generates an SVG path string for a pill-shaped element (rounded rectangle with maximum corner radius).
 *
 * The pill shape is created by calculating the maximum possible radius based on the smaller dimension
 * (height or width) of the rectangle, ensuring the shape has fully rounded ends.
 *
 * @param rect - The rectangle dimensions and position to create the pill shape from
 * @returns An SVG path string representing the pill shape
 *
 * @example
 * ```typescript
 * const pillPath = pathForPill({ x: 0, y: 0, width: 100, height: 50 });
 * // Returns a path with 25px corner radius (half of the smaller dimension)
 * ```
 */
export function pathForPill(rect: Rect): string {
  const r = Math.min(rect.height / 2, rect.width / 2);
  return pathForRect(rect, r);
}
