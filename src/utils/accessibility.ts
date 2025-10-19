import { AccessibilityInfo, Platform } from 'react-native';

export async function isScreenReaderEnabled(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }
  return await AccessibilityInfo.isScreenReaderEnabled();
}

export async function isReduceMotionEnabled(): Promise<boolean> {
  if (Platform.OS === 'web') {
    // @ts-ignore - window is available on web
    if (typeof window !== 'undefined' && window.matchMedia) {
      // @ts-ignore
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  }
  return await AccessibilityInfo.isReduceMotionEnabled();
}

export function announce(message: string) {
  if (Platform.OS === 'web') {
    announceWeb(message);
  } else {
    AccessibilityInfo.announceForAccessibility(message);
  }
}

function announceWeb(message: string) {
  // @ts-ignore - document is available on web
  if (typeof document === 'undefined') return;

  // @ts-ignore
  const liveRegion =
    // @ts-ignore
    document.getElementById('coachmark-sr-live') || createLiveRegion();

  liveRegion.textContent = '';
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 100);
}

function createLiveRegion(): any {
  // @ts-ignore - document is available on web
  if (typeof document === 'undefined') {
    throw new Error('Document is not available');
  }

  // @ts-ignore
  const liveRegion = document.createElement('div');
  liveRegion.id = 'coachmark-sr-live';
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.style.position = 'absolute';
  liveRegion.style.left = '-10000px';
  liveRegion.style.width = '1px';
  liveRegion.style.height = '1px';
  liveRegion.style.overflow = 'hidden';
  // @ts-ignore
  document.body.appendChild(liveRegion);
  return liveRegion;
}

export function formatStepAnnouncement(
  step: { title?: string; description?: string },
  index: number,
  total: number
): string {
  const position = `Step ${index + 1} of ${total}`;
  const title = step.title || 'Tour step';
  const description = step.description || '';

  return `${position}. ${title}. ${description}`;
}

export function getButtonLabel(
  action: 'next' | 'back' | 'skip' | 'done',
  context?: { current: number; total: number }
): string {
  switch (action) {
    case 'next':
      return context
        ? `Next. Go to step ${context.current + 2} of ${context.total}`
        : 'Next step';
    case 'back':
      return context
        ? `Back. Go to step ${context.current} of ${context.total}`
        : 'Previous step';
    case 'skip':
      return 'Skip tour';
    case 'done':
      return 'Finish tour';
    default:
      return action;
  }
}
