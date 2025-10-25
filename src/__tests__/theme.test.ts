import { defaultTheme } from '@core/theme';

describe('defaultTheme', () => {
  it('should have backdrop properties', () => {
    expect(defaultTheme).toHaveProperty('backdropColor');
    expect(defaultTheme).toHaveProperty('backdropOpacity');
    expect(defaultTheme).toHaveProperty('holeShadowOpacity');
  });

  it('should have valid backdrop values', () => {
    expect(typeof defaultTheme.backdropColor).toBe('string');
    expect(typeof defaultTheme.backdropOpacity).toBe('number');
    expect(typeof defaultTheme.holeShadowOpacity).toBe('number');

    expect(defaultTheme.backdropOpacity).toBeGreaterThanOrEqual(0);
    expect(defaultTheme.backdropOpacity).toBeLessThanOrEqual(1);
    expect(defaultTheme.holeShadowOpacity).toBeGreaterThanOrEqual(0);
    expect(defaultTheme.holeShadowOpacity).toBeLessThanOrEqual(1);
  });

  it('should have tooltip configuration', () => {
    expect(defaultTheme).toHaveProperty('tooltip');
    expect(defaultTheme.tooltip).toHaveProperty('maxWidth');
    expect(defaultTheme.tooltip).toHaveProperty('radius');
    expect(defaultTheme.tooltip).toHaveProperty('bg');
    expect(defaultTheme.tooltip).toHaveProperty('fg');
    expect(defaultTheme.tooltip).toHaveProperty('arrowSize');
    expect(defaultTheme.tooltip).toHaveProperty('padding');
    expect(defaultTheme.tooltip).toHaveProperty('buttonPrimaryBg');
    expect(defaultTheme.tooltip).toHaveProperty('buttonSecondaryBg');
  });

  it('should have valid tooltip values', () => {
    expect(typeof defaultTheme.tooltip.maxWidth).toBe('number');
    expect(typeof defaultTheme.tooltip.radius).toBe('number');
    expect(typeof defaultTheme.tooltip.bg).toBe('string');
    expect(typeof defaultTheme.tooltip.fg).toBe('string');
    expect(typeof defaultTheme.tooltip.arrowSize).toBe('number');
    expect(typeof defaultTheme.tooltip.padding).toBe('number');

    expect(defaultTheme.tooltip.maxWidth).toBeGreaterThan(0);
    expect(defaultTheme.tooltip.radius).toBeGreaterThanOrEqual(0);
    expect(defaultTheme.tooltip.arrowSize).toBeGreaterThan(0);
    expect(defaultTheme.tooltip.padding).toBeGreaterThan(0);
  });

  it('should have motion configuration', () => {
    expect(defaultTheme).toHaveProperty('motion');
    expect(defaultTheme.motion).toHaveProperty('durationMs');
    expect(defaultTheme.motion).toHaveProperty('easing');
  });

  it('should have valid motion values', () => {
    expect(typeof defaultTheme.motion.durationMs).toBe('number');
    expect(typeof defaultTheme.motion.easing).toBe('function');
    expect(defaultTheme.motion.durationMs).toBeGreaterThan(0);
  });

  it('should have working easing function', () => {
    const easing = defaultTheme.motion.easing;

    expect(easing(0)).toBe(0);
    expect(easing(1)).toBe(1);
    expect(easing(0.5)).toBeGreaterThan(0);
    expect(easing(0.5)).toBeLessThan(1);
  });

  it('should support theme customization', () => {
    const customTheme = {
      ...defaultTheme,
      backdropColor: '#FF0000',
      backdropOpacity: 0.8,
    };

    expect(customTheme.backdropColor).toBe('#FF0000');
    expect(customTheme.backdropOpacity).toBe(0.8);
    expect(customTheme.tooltip.bg).toBe(defaultTheme.tooltip.bg);
  });

  it('should support partial theme overrides', () => {
    const partialTheme = {
      ...defaultTheme,
      tooltip: {
        ...defaultTheme.tooltip,
        bg: '#FF5733',
        radius: 20,
      },
    };

    expect(partialTheme.tooltip.bg).toBe('#FF5733');
    expect(partialTheme.tooltip.radius).toBe(20);
    expect(partialTheme.tooltip.fg).toBe(defaultTheme.tooltip.fg);
    expect(partialTheme.tooltip.padding).toBe(defaultTheme.tooltip.padding);
  });
});
