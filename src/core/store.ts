import { useRef, useState } from 'react';

import type {
  AnchorRegistration,
  CoachmarkState,
  Plugin,
  Tour,
  StorageAdapter,
} from './types';

/**
 * Custom hook that manages the state and operations for a coachmark/tour system.
 *
 * @param storage - Storage adapter used to persist tour completion state for "show once" tours
 *
 * @returns An object containing:
 * - `state`: Current coachmark state including active tour, step index, and measured anchor positions
 * - `register`: Function to register an anchor point for coachmark positioning
 * - `unregister`: Function to unregister an anchor point by its ID
 * - `getAnchor`: Function to retrieve a registered anchor by its ID
 * - `addPlugins`: Function to add plugins that hook into tour lifecycle events
 * - `setMeasured`: Function to store measured dimensions and position for an anchor
 * - `start`: Async function to start a tour (respects `showOnce` flag and optional delay)
 * - `stop`: Async function to stop the active tour with a reason (completed or skipped)
 * - `next`: Function to advance to the next step in the tour (auto-completes at end)
 * - `back`: Function to go back to the previous step in the tour
 *
 * @example
 * ```typescript
 * const store = useCoachmarkStore(asyncStorageAdapter);
 *
 * // Start a tour
 * await store.start(myTour);
 *
 * // Navigate steps
 * store.next();
 * store.back();
 *
 * // Stop tour
 * await store.stop('completed');
 * ```
 */
export function useCoachmarkStore(storage: StorageAdapter) {
  const anchors = useRef(new Map<string, AnchorRegistration>());
  const plugins = useRef<Plugin[]>([]);
  const [state, setState] = useState<CoachmarkState>({
    activeTour: null,
    index: 0,
    isActive: false,
    measured: {},
  });

  const register = (reg: AnchorRegistration) =>
    anchors.current.set(reg.id, reg);
  const unregister = (id: string) => anchors.current.delete(id);
  const getAnchor = (id: string) => anchors.current.get(id);
  const addPlugins = (p: Plugin[]) => {
    plugins.current = p;
  };

  const setMeasured = (
    id: string,
    rect: { x: number; y: number; width: number; height: number }
  ) => setState((s) => ({ ...s, measured: { ...s.measured, [id]: rect } }));

  const start = async (tour: Tour) => {
    if (tour.showOnce) {
      const key = `coachmark:${tour.key}`;
      const seen = await storage.get(key);
      if (seen === 'true') {
        return;
      }
    }

    if (tour.delay) {
      await new Promise((resolve) => setTimeout(resolve, tour.delay));
    }

    plugins.current.forEach((p) => p.onStart?.(tour));
    setState((s) => ({ ...s, activeTour: tour, index: 0, isActive: true }));
  };

  const stop = async (reason: 'completed' | 'skipped' = 'completed') => {
    const t = state.activeTour;
    if (t) {
      if (t.showOnce && reason === 'completed') {
        const key = `coachmark:${t.key}`;
        await storage.set(key, 'true');
      }
      plugins.current.forEach((p) => p.onFinish?.(t, reason));
    }
    setState((s) => ({
      ...s,
      activeTour: null,
      index: 0,
      isActive: false,
    }));
  };

  const next = () =>
    setState((s) => {
      const t = s.activeTour;
      if (!t) return s;
      const nextIndex = s.index + 1;
      if (nextIndex >= t.steps.length) {
        stop('completed');
        return { ...s, isActive: false, activeTour: null, index: 0 };
      }
      const nextStep = t.steps[nextIndex];
      if (nextStep) {
        plugins.current.forEach((p) => p.onStep?.(t, nextIndex, nextStep));
      }
      return { ...s, index: nextIndex };
    });

  const back = () =>
    setState((s) => ({ ...s, index: Math.max(0, s.index - 1) }));

  return {
    state,
    register,
    unregister,
    getAnchor,
    addPlugins,
    setMeasured,
    start,
    stop,
    next,
    back,
  };
}
