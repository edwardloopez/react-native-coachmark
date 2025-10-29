import { useEffect, useState, useCallback } from 'react';

import { Dimensions } from 'react-native';

import { withTiming, Easing } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import type { TourStep } from '../core/types';
import { inset } from '../ui/shapes';
import { isRectVisible } from '../utils/autoScroll';
import { measureInWindowByRef } from '../utils/measure';

type AnchorGetter = (id: string) => any;

type UseTourMeasurementParams = {
  activeStep: TourStep | undefined;
  index: number;
  tourKey: string | undefined;
  getAnchor: AnchorGetter;
  setMeasured: (id: string, rect: any) => void;
  next: () => void;
  reduceMotion: boolean;
  durationMs: number;
  holeX: SharedValue<number>;
  holeY: SharedValue<number>;
  holeWidth: SharedValue<number>;
  holeHeight: SharedValue<number>;
};

type MeasurementResult = {
  targetRect: { x: number; y: number; width: number; height: number } | null;
  holeShape: 'rect' | 'circle' | 'pill';
  holeRadius: number;
};

/**
 * Custom hook that handles measurement and positioning of tour steps/coachmarks.
 *
 * This hook manages the lifecycle of measuring target elements, auto-scrolling to them if needed,
 * and animating the highlight hole to focus on the target. It runs whenever the active step changes
 * or window dimensions update.
 *
 * @param activeStep - The current active step in the tour, or null if no step is active
 * @param index - The index of the current step in the tour sequence
 * @param tourKey - Unique identifier for the tour instance
 * @param getAnchor - Function to retrieve an anchor element by its ID
 * @param setMeasured - Callback to store measured dimensions for a step
 * @param next - Function to proceed to the next step in the tour
 * @param reduceMotion - Whether to disable animations for accessibility
 * @param durationMs - Duration in milliseconds for hole animations
 * @param holeX - Reanimated shared value for the x-coordinate of the highlight hole
 * @param holeY - Reanimated shared value for the y-coordinate of the highlight hole
 * @param holeWidth - Reanimated shared value for the width of the highlight hole
 * @param holeHeight - Reanimated shared value for the height of the highlight hole
 *
 * @returns Object containing the measured target rectangle, hole shape configuration, hole radius, and a remeasure function
 *
 * @example
 * ```typescript
 * const { targetRect, holeShape, holeRadius, remeasure } = useTourMeasurement({
 *   activeStep: currentStep,
 *   index: 0,
 *   tourKey: 'onboarding-tour',
 *   getAnchor: (id) => anchors.get(id),
 *   setMeasured: (id, rect) => measurements.set(id, rect),
 *   next: goToNextStep,
 *   reduceMotion: false,
 *   durationMs: 300,
 *   holeX: holeXValue,
 *   holeY: holeYValue,
 *   holeWidth: holeWidthValue,
 *   holeHeight: holeHeightValue,
 * });
 * ```
 */
export function useTourMeasurement({
  activeStep,
  index,
  tourKey,
  getAnchor,
  setMeasured,
  next,
  reduceMotion,
  durationMs,
  holeX,
  holeY,
  holeWidth,
  holeHeight,
}: UseTourMeasurementParams) {
  const [result, setResult] = useState<MeasurementResult>({
    targetRect: null,
    holeShape: 'rect',
    holeRadius: 12,
  });

  const { width: W, height: H } = Dimensions.get('window');

  const remeasure = useCallback(async () => {
    if (!activeStep) return;

    if (activeStep.onBeforeEnter) {
      const proceed = await activeStep.onBeforeEnter();
      if (proceed === false) {
        next();
        return;
      }
    }

    const anchor = getAnchor(activeStep.id);
    if (!anchor) {
      console.warn(`[Coachmark] Anchor "${activeStep.id}" not found`);
      return;
    }

    const ref = anchor.getRef();
    if (!ref) {
      console.warn(`[Coachmark] Ref for "${activeStep.id}" is null`);
      return;
    }

    const autoFocus = activeStep.autoFocus;
    if (autoFocus === 'ifNeeded' || autoFocus === 'always') {
      await activeStep.onBeforeScroll?.();

      if (!anchor.scrollRef?.current) {
        console.warn(
          `[Coachmark] autoFocus is set for step "${activeStep.id}" but no scrollRef provided in CoachmarkAnchor. ` +
            `Please add scrollRef prop to enable auto-scrolling.`
        );
      } else {
        const behavior = activeStep.scrollBehavior ?? 'smooth';
        const padding = activeStep.scrollPadding ?? 20;
        const force = autoFocus === 'always';

        const rect = await measureInWindowByRef(ref);
        const { isVisible } = isRectVisible(rect, padding);

        if (!isVisible || force) {
          const targetY = rect.y - H / 2 + rect.height / 2;
          const scrollY = Math.max(0, targetY);
          const animated = behavior === 'smooth';

          anchor.scrollRef.current?.scrollTo?.({
            y: scrollY,
            animated,
          });
          anchor.scrollRef.current?.scrollToOffset?.({
            offset: scrollY,
            animated,
          });

          await new Promise((resolve) =>
            setTimeout(resolve, animated ? 300 : 50)
          );

          const scrollDelay = activeStep.scrollDelay ?? 150;
          if (scrollDelay > 0) {
            await new Promise((resolve) => setTimeout(resolve, scrollDelay));
          }
        }
      }
    }

    const rect = await measureInWindowByRef(ref);
    const padded = inset(rect, anchor.padding ?? 10);
    setMeasured(activeStep.id, rect);

    const shape = anchor.shape ?? activeStep.shape ?? 'rect';
    const radius = anchor.radius ?? activeStep.radius ?? 12;

    setResult({
      targetRect: padded,
      holeShape: shape,
      holeRadius: radius,
    });

    const duration = reduceMotion ? 0 : durationMs;
    const ease = Easing.out(Easing.cubic);

    holeX.value = withTiming(padded.x, { duration, easing: ease });
    holeY.value = withTiming(padded.y, { duration, easing: ease });
    holeWidth.value = withTiming(padded.width, { duration, easing: ease });
    holeHeight.value = withTiming(padded.height, { duration, easing: ease });

    activeStep.onEnter?.();
  }, [
    activeStep,
    getAnchor,
    next,
    setMeasured,
    reduceMotion,
    durationMs,
    holeX,
    holeY,
    holeWidth,
    holeHeight,
    H,
  ]);

  useEffect(() => {
    let cancelled = false;

    const runMeasurement = async () => {
      await remeasure();
      if (cancelled) return;
    };

    runMeasurement();

    return () => {
      cancelled = true;
      activeStep?.onExit?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, tourKey, activeStep?.id, W, H]);

  return { ...result, remeasure };
}
