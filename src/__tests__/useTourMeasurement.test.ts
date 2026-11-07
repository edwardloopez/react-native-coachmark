import { act, renderHook } from '@testing-library/react-native';

import type { AnchorRegistration, Rect, TourStep } from '../core/types';
import { useTourMeasurement } from '../hooks/useTourMeasurement';
import { measureInWindowByRef } from '../utils/measure';

jest.mock('react-native-reanimated', () => ({
  Easing: { out: (easing: unknown) => easing, cubic: () => 0 },
  withTiming: (value: number) => value,
}));

jest.mock('../utils/measure', () => ({
  measureInWindowByRef: jest.fn(),
}));

const ANCHOR_TIMEOUT_MS = 2000;
const RECT: Rect = { x: 10, y: 20, width: 100, height: 40 };

const measure = measureInWindowByRef as jest.Mock;

const advance = (ms: number) =>
  act(async () => {
    await jest.advanceTimersByTimeAsync(ms);
  });

describe('useTourMeasurement', () => {
  let anchors: Map<string, AnchorRegistration>;
  let warnSpy: jest.SpyInstance;

  const baseParams = () => ({
    index: 0,
    tourKey: 'tour',
    getAnchor: (id: string) => anchors.get(id),
    setMeasured: jest.fn(),
    next: jest.fn(),
    reduceMotion: true,
    durationMs: 0,
    holeX: { value: 0 } as any,
    holeY: { value: 0 } as any,
    holeWidth: { value: 1 } as any,
    holeHeight: { value: 1 } as any,
  });

  const anchor = (id: string, getRef: () => any = () => ({})) => ({
    id,
    getRef,
  });

  beforeEach(() => {
    jest.useFakeTimers();
    anchors = new Map();
    measure.mockReset();
    measure.mockResolvedValue(RECT);
    warnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    warnSpy.mockRestore();
    jest.useRealTimers();
  });

  it('should measure a registered anchor without waiting', async () => {
    anchors.set('a', anchor('a'));
    const onEnter = jest.fn();

    const { result } = renderHook(() =>
      useTourMeasurement({
        ...baseParams(),
        activeStep: { id: 'a', onEnter },
      })
    );

    expect(measure).toHaveBeenCalledTimes(1);

    await act(async () => {});

    expect(result.current.targetRect).not.toBeNull();
    expect(onEnter).toHaveBeenCalledTimes(1);
  });

  it('should call onAnchorMissing once after the timeout', async () => {
    const onAnchorMissing = jest.fn();

    renderHook(() =>
      useTourMeasurement({
        ...baseParams(),
        activeStep: { id: 'missing' },
        onAnchorMissing,
      })
    );

    await advance(ANCHOR_TIMEOUT_MS - 50);
    expect(onAnchorMissing).not.toHaveBeenCalled();

    await advance(ANCHOR_TIMEOUT_MS);
    expect(onAnchorMissing).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it('should only warn when onAnchorMissing is not provided', async () => {
    const params = baseParams();

    renderHook(() =>
      useTourMeasurement({ ...params, activeStep: { id: 'missing' } })
    );
    await advance(ANCHOR_TIMEOUT_MS);

    expect(warnSpy).toHaveBeenCalledWith(
      '[Coachmark] Anchor "missing" not found'
    );
    expect(params.next).not.toHaveBeenCalled();
  });

  it('should wait for an anchor whose ref is not attached yet', async () => {
    let ref: object | null = null;
    anchors.set(
      'a',
      anchor('a', () => ref)
    );
    const onAnchorMissing = jest.fn();

    const { result } = renderHook(() =>
      useTourMeasurement({
        ...baseParams(),
        activeStep: { id: 'a' },
        onAnchorMissing,
      })
    );

    await advance(200);
    ref = {};
    await advance(50);

    expect(result.current.targetRect).not.toBeNull();
    expect(onAnchorMissing).not.toHaveBeenCalled();
  });

  it('should report a ref that never attaches', async () => {
    anchors.set(
      'a',
      anchor('a', () => null)
    );
    const onAnchorMissing = jest.fn();

    renderHook(() =>
      useTourMeasurement({
        ...baseParams(),
        activeStep: { id: 'a' },
        onAnchorMissing,
      })
    );
    await advance(ANCHOR_TIMEOUT_MS);

    expect(warnSpy).toHaveBeenCalledWith('[Coachmark] Anchor "a" not found');
    expect(onAnchorMissing).toHaveBeenCalledTimes(1);
  });

  it('should report a ref that detaches while being measured', async () => {
    let ref: object | null = {};
    anchors.set(
      'a',
      anchor('a', () => ref)
    );
    let resolveMeasure: (rect: Rect) => void = () => {};
    measure.mockReturnValue(
      new Promise((resolve) => {
        resolveMeasure = resolve;
      })
    );
    const onAnchorMissing = jest.fn();

    const { result } = renderHook(() =>
      useTourMeasurement({
        ...baseParams(),
        activeStep: { id: 'a' },
        onAnchorMissing,
      })
    );

    ref = null;
    await act(async () => {
      resolveMeasure(RECT);
    });

    expect(result.current.targetRect).toBeNull();
    expect(result.current.hasAnchor).toBe(false);
    expect(onAnchorMissing).toHaveBeenCalledTimes(1);
  });

  it('should report whether the anchor is mounted', async () => {
    const { result } = renderHook(() =>
      useTourMeasurement({ ...baseParams(), activeStep: { id: 'late' } })
    );

    await advance(100);
    expect(result.current.hasAnchor).toBe(false);

    anchors.set('late', anchor('late'));
    await advance(50);
    expect(result.current.hasAnchor).toBe(true);
  });

  it('should call onBeforeEnter once while waiting', async () => {
    const onBeforeEnter = jest.fn().mockResolvedValue(undefined);

    renderHook(() =>
      useTourMeasurement({
        ...baseParams(),
        activeStep: { id: 'missing', onBeforeEnter },
      })
    );
    await advance(ANCHOR_TIMEOUT_MS);

    expect(onBeforeEnter).toHaveBeenCalledTimes(1);
  });

  it('should find an anchor mounted by onBeforeEnter', async () => {
    const onBeforeEnter = async () => {
      anchors.set('a', anchor('a'));
    };

    const { result } = renderHook(() =>
      useTourMeasurement({
        ...baseParams(),
        activeStep: { id: 'a', onBeforeEnter },
      })
    );
    await act(async () => {});

    expect(result.current.targetRect).not.toBeNull();
  });

  it('should not call onAnchorMissing with a target on screen', async () => {
    anchors.set('a', anchor('a'));
    const onAnchorMissing = jest.fn();
    const params = baseParams();

    const { result, rerender } = renderHook(
      ({ step, index }: { step: TourStep; index: number }) =>
        useTourMeasurement({
          ...params,
          index,
          activeStep: step,
          onAnchorMissing,
        }),
      { initialProps: { step: { id: 'a' }, index: 0 } }
    );
    await act(async () => {});

    rerender({ step: { id: 'missing' }, index: 1 });
    await advance(ANCHOR_TIMEOUT_MS);

    expect(result.current.targetRect).not.toBeNull();
    expect(onAnchorMissing).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it('should measure an anchor that shows up on a later step', async () => {
    anchors.set('a', anchor('a'));
    const params = baseParams();

    const { rerender } = renderHook(
      ({ step, index }: { step: TourStep; index: number }) =>
        useTourMeasurement({ ...params, index, activeStep: step }),
      { initialProps: { step: { id: 'a' }, index: 0 } }
    );
    await act(async () => {});

    rerender({ step: { id: 'late' }, index: 1 });
    await advance(500);
    anchors.set('late', anchor('late'));
    await advance(50);

    expect(params.setMeasured).toHaveBeenCalledWith('late', RECT);
  });

  it('should stop waiting when the step changes', async () => {
    anchors.set('b', anchor('b'));
    const onAnchorMissing = jest.fn();
    const params = baseParams();

    const { rerender } = renderHook(
      ({ step, index }: { step: TourStep; index: number }) =>
        useTourMeasurement({
          ...params,
          index,
          activeStep: step,
          onAnchorMissing,
        }),
      { initialProps: { step: { id: 'missing' } as TourStep, index: 0 } }
    );

    await advance(100);
    rerender({ step: { id: 'b' }, index: 1 });
    await advance(ANCHOR_TIMEOUT_MS);

    expect(onAnchorMissing).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('should not keep going for a step it left', async () => {
    const onBeforeScroll = jest.fn();
    const params = baseParams();

    const { rerender } = renderHook(
      ({ step, index }: { step: TourStep; index: number }) =>
        useTourMeasurement({ ...params, index, activeStep: step }),
      {
        initialProps: {
          step: { id: 'late', autoFocus: 'always', onBeforeScroll } as TourStep,
          index: 0,
        },
      }
    );

    await advance(100);
    rerender({ step: { id: 'other' }, index: 1 });
    anchors.set('late', anchor('late'));
    await advance(ANCHOR_TIMEOUT_MS * 2);

    expect(onBeforeScroll).not.toHaveBeenCalled();
  });

  it('should restart the wait on remeasure without skipping twice', async () => {
    const onAnchorMissing = jest.fn();

    const { result } = renderHook(() =>
      useTourMeasurement({
        ...baseParams(),
        activeStep: { id: 'missing' },
        onAnchorMissing,
      })
    );

    await advance(ANCHOR_TIMEOUT_MS / 2);
    act(() => {
      result.current.remeasure();
    });
    await advance(ANCHOR_TIMEOUT_MS * 2);

    expect(onAnchorMissing).toHaveBeenCalledTimes(1);
  });

  it('should clear the target when the tour ends', async () => {
    anchors.set('a', anchor('a'));
    const params = baseParams();

    const { result, rerender } = renderHook(
      ({ step, tourKey }: { step?: TourStep; tourKey?: string }) =>
        useTourMeasurement({ ...params, tourKey, activeStep: step }),
      {
        initialProps: { step: { id: 'a' }, tourKey: 'tour' } as {
          step?: TourStep;
          tourKey?: string;
        },
      }
    );
    await act(async () => {});
    expect(result.current.targetRect).not.toBeNull();
    expect(result.current.hasAnchor).toBe(true);

    rerender({});

    expect(result.current.targetRect).toBeNull();
    expect(result.current.hasAnchor).toBe(false);
  });
});
