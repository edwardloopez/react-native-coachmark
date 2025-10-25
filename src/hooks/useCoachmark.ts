import { useCoachmarkContext } from '../core/CoachmarkContext';
import type { Tour, TourStep } from '../core/types';

/**
 * Hook that provides access to the coachmark/tour functionality.
 *
 * @returns An object containing methods and state for controlling coachmark tours:
 * - `start` - Starts a tour, accepting either a Tour object or an array of TourStep objects
 * - `next` - Advances to the next step in the active tour
 * - `back` - Goes back to the previous step in the active tour
 * - `skip` - Skips the current tour and marks it as 'skipped'
 * - `stop` - Stops the current tour and marks it as 'completed'
 * - `isActive` - Boolean indicating whether a tour is currently active
 * - `activeStep` - The current active step, or null if no tour is active
 * - `index` - The current step index in the active tour
 * - `count` - The total number of steps in the active tour
 *
 * @example
 * ```typescript
 * const { start, next, skip, isActive, activeStep } = useCoachmark();
 *
 * // Start a tour with steps array
 * start([
 *   { target: 'button1', content: 'Click here' },
 *   { target: 'button2', content: 'Then click here' }
 * ]);
 *
 * // Or start a tour with a Tour object
 * start({ key: 'onboarding', steps: [...] });
 * ```
 */
export function useCoachmark() {
  const ctx = useCoachmarkContext();
  return {
    start: (tourOrSteps: Tour | TourStep[]) => {
      const tour: Tour = Array.isArray(tourOrSteps)
        ? { key: 'adhoc', steps: tourOrSteps }
        : tourOrSteps;
      ctx.start(tour);
    },
    next: ctx.next,
    back: ctx.back,
    skip: () => ctx.stop('skipped'),
    stop: () => ctx.stop('completed'),
    isActive: ctx.state.isActive,
    activeStep: ctx.state.activeTour?.steps[ctx.state.index] ?? null,
    index: ctx.state.index,
    count: ctx.state.activeTour?.steps.length ?? 0,
  };
}
