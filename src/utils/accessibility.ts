import { AccessibilityInfo } from 'react-native';

/**
 * Checks whether a screen reader is currently enabled on the device.
 *
 * This function queries the device's accessibility settings to determine if a screen reader
 * (such as VoiceOver on iOS or TalkBack on Android) is currently active.
 *
 * @returns A promise that resolves to `true` if a screen reader is enabled, `false` otherwise.
 *
 * @example
 * ```typescript
 * const isEnabled = await isScreenReaderEnabled();
 * if (isEnabled) {
 *   console.log('Screen reader is active');
 * }
 * ```
 */
export async function isScreenReaderEnabled(): Promise<boolean> {
  return await AccessibilityInfo.isScreenReaderEnabled();
}

/**
 * Checks if the reduce motion accessibility setting is enabled on the device.
 *
 * This function queries the system's accessibility settings to determine if the user
 * has enabled the "reduce motion" preference, which is commonly used to minimize
 * animations and motion effects for users who may experience discomfort from them.
 *
 * @returns A Promise that resolves to `true` if reduce motion is enabled, `false` otherwise.
 *
 * @example
 * ```typescript
 * const isEnabled = await isReduceMotionEnabled();
 * if (isEnabled) {
 *   // Disable or reduce animations
 * }
 * ```
 */
export async function isReduceMotionEnabled(): Promise<boolean> {
  return await AccessibilityInfo.isReduceMotionEnabled();
}

/**
 * Announces a message to screen readers for accessibility purposes.
 *
 * This function uses the native accessibility API to make announcements that will be
 * read aloud by screen readers on both iOS and Android platforms.
 *
 * @param message - The text message to be announced to assistive technologies
 *
 * @example
 * ```typescript
 * announce('Welcome to the app');
 * announce('Item added to cart');
 * ```
 *
 * @remarks
 * This is a wrapper around React Native's `AccessibilityInfo.announceForAccessibility`
 * method, providing a simplified interface for making accessibility announcements.
 *
 * @see {@link https://reactnative.dev/docs/accessibilityinfo#announceforaccessibility | React Native AccessibilityInfo}
 */
export function announce(message: string): void {
  AccessibilityInfo.announceForAccessibility(message);
}

/**
 * Formats a step announcement for accessibility purposes.
 *
 * @param step - The step object containing optional title and description properties
 * @param index - The zero-based index of the current step
 * @param total - The total number of steps in the tour
 * @returns A formatted string announcement in the format: "Step X of Y. Title. Description"
 *
 * @example
 * ```typescript
 * const announcement = formatStepAnnouncement(
 *   { title: 'Welcome', description: 'Click here to start' },
 *   0,
 *   3
 * );
 * // Returns: "Step 1 of 3. Welcome. Click here to start"
 * ```
 */
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

/**
 * Generates an accessible label for coach mark navigation buttons.
 *
 * @param action - The type of button action: 'next', 'back', 'skip', or 'done'
 * @param context - Optional context containing the current step number and total steps
 * @param context.current - The current step index (0-based)
 * @param context.total - The total number of steps in the tour
 *
 * @returns A descriptive string label for the button that includes step information when context is provided
 *
 * @example
 * ```typescript
 * getButtonLabel('next', { current: 0, total: 5 }); // "Next. Go to step 2 of 5"
 * getButtonLabel('back', { current: 2, total: 5 }); // "Back. Go to step 2 of 5"
 * getButtonLabel('skip'); // "Skip tour"
 * getButtonLabel('done'); // "Finish tour"
 * ```
 */
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
