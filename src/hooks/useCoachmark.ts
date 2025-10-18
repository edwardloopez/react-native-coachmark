import { useCoachmarkContext } from '../core/CoachmarkContext';
import type { Tour, TourStep } from '../core/types';

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
