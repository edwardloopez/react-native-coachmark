import type { CoachmarkTheme } from './types';

export const defaultTheme: CoachmarkTheme = {
  backdropColor: '#000000',
  backdropOpacity: 0.55,
  holeShadowOpacity: 0.2,
  tooltip: {
    maxWidth: 320,
    radius: 14,
    bg: '#FFFFFF',
    fg: '#111111',
    arrowSize: 10,
    padding: 14,
    buttonPrimaryBg: '#111111',
    buttonSecondaryBg: '#666666',
  },
  motion: {
    durationMs: 280,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  },
};
