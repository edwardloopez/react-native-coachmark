import { useEffect } from 'react';

import { Dimensions } from 'react-native';

/**
 * A custom React hook that listens for device orientation changes and triggers a callback.
 *
 * @param isActive - Controls whether the orientation change listener is active. When `false`, the listener is disabled.
 * @param onOrientationChange - Callback function that is invoked when a device orientation change is detected.
 *
 * @remarks
 * This hook uses React Native's `Dimensions` API to detect screen dimension changes,
 * which typically occur during orientation changes. The event listener is automatically
 * cleaned up when the component unmounts or when `isActive` becomes `false`.
 *
 * @example
 * ```typescript
 * const handleOrientationChange = () => {
 *   console.log('Orientation changed');
 * };
 *
 * useOrientationChange(true, handleOrientationChange);
 * ```
 */
export function useOrientationChange(
  isActive: boolean,
  onOrientationChange: () => void
) {
  useEffect(() => {
    if (!isActive) return;

    const handleChange = () => {
      onOrientationChange();
    };

    const subscription = Dimensions.addEventListener('change', handleChange);

    return () => {
      subscription?.remove();
    };
  }, [isActive, onOrientationChange]);
}
