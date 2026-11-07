import { useState, type ReactNode } from 'react';

import { Dimensions, Pressable, Text } from 'react-native';

import { act, fireEvent, render } from '@testing-library/react-native';
import { withTiming } from 'react-native-reanimated';

import { CoachmarkAnchor } from '../anchors/CoachmarkAnchor';
import {
  CoachmarkProvider,
  useCoachmarkContext,
  type CoachmarkContextValue,
} from '../core/CoachmarkContext';
import { memoryStorage } from '../core/storage';
import type { Plugin, Rect, StorageAdapter, Tour } from '../core/types';
import { useCoachmark } from '../hooks/useCoachmark';
import { CoachmarkOverlay } from '../ui/CoachmarkOverlay';
import { measureInWindowByRef } from '../utils/measure';

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: { View },
    Easing: { out: (easing: unknown) => easing, cubic: () => 0 },
    useAnimatedStyle: (updater: () => object) => updater(),
    useSharedValue: (value: number) => React.useRef({ value }).current,
    withTiming: jest.fn((value: number) => value),
  };
});

jest.mock('../utils/measure', () => ({
  measureInWindowByRef: jest.fn(),
}));

jest.mock('../ui/Mask', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    AnimatedMask: () => React.createElement(View, { testID: 'mask' }),
  };
});

const ANCHOR_TIMEOUT_MS = 2000;
const RECT: Rect = { x: 10, y: 20, width: 100, height: 40 };

const measure = measureInWindowByRef as jest.Mock;

const advance = (ms: number) =>
  act(async () => {
    await jest.advanceTimersByTimeAsync(ms);
  });

const deferred = <T,>() => {
  let resolve: (value: T) => void = () => {};
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
};

const scrollStep = {
  autoFocus: 'always',
  scrollBehavior: 'instant',
  scrollDelay: 0,
} as const;

describe('CoachmarkOverlay', () => {
  let coachmark: CoachmarkContextValue;
  let storage: StorageAdapter;
  let plugin: Required<Plugin>;
  let plugins: Plugin[];
  let warnSpy: jest.SpyInstance;

  const Capture = () => {
    coachmark = useCoachmarkContext();
    return null;
  };

  const App = ({ children }: { children?: ReactNode }) => (
    <CoachmarkProvider storage={storage} plugins={plugins}>
      <Capture />
      {children}
      <CoachmarkOverlay />
    </CoachmarkProvider>
  );

  const start = (tour: Tour) =>
    act(async () => {
      await coachmark.start(tour);
    });

  beforeEach(() => {
    jest.useFakeTimers();
    measure.mockReset();
    measure.mockResolvedValue(RECT);
    (withTiming as jest.Mock).mockClear();
    storage = memoryStorage();
    plugin = {
      onStart: jest.fn(),
      onStep: jest.fn(),
      onFinish: jest.fn(),
    };
    plugins = [plugin];
    warnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    warnSpy.mockRestore();
    jest.useRealTimers();
  });

  describe('with a mounted anchor', () => {
    it('should show the tooltip and call onEnter once measured', async () => {
      const onEnter = jest.fn();
      const { getByTestId, getByText } = render(
        <App>
          <CoachmarkAnchor id="a" />
        </App>
      );

      await start({
        key: 'tour',
        steps: [{ id: 'a', title: 'Step 1', onEnter }],
      });

      expect(getByTestId('mask')).toBeTruthy();
      expect(getByText('Step 1')).toBeTruthy();
      expect(onEnter).toHaveBeenCalledTimes(1);
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('should show the overlay before the anchor is measured', async () => {
      const measured = deferred<Rect>();
      measure.mockReturnValue(measured.promise);
      const onEnter = jest.fn();
      const { getByTestId, getByText } = render(
        <App>
          <CoachmarkAnchor id="a" />
        </App>
      );

      await start({
        key: 'tour',
        steps: [{ id: 'a', title: 'Step 1', onEnter }],
      });

      expect(getByTestId('mask')).toBeTruthy();
      expect(getByText('Step 1')).toBeTruthy();
      expect(onEnter).not.toHaveBeenCalled();

      await act(async () => {
        measured.resolve(RECT);
      });

      expect(onEnter).toHaveBeenCalledTimes(1);
    });

    it('should run the tour with the React Native jest mocks', () => {
      measure.mockImplementation(
        jest.requireActual('../utils/measure').measureInWindowByRef
      );
      const Screen = () => {
        const { start: startTour } = useCoachmark();
        return (
          <>
            <CoachmarkAnchor id="a" />
            <CoachmarkAnchor id="b" />
            <Pressable
              onPress={() =>
                startTour([
                  { id: 'a', title: 'Step 1' },
                  { id: 'b', title: 'Step 2' },
                ])
              }
            >
              <Text>Start Tour</Text>
            </Pressable>
          </>
        );
      };
      const { getByText } = render(
        <App>
          <Screen />
        </App>
      );

      fireEvent.press(getByText('Start Tour'));

      expect(getByText('Step 1')).toBeTruthy();

      fireEvent.press(getByText('Next'));

      expect(getByText('Step 2')).toBeTruthy();
    });

    it('should keep the overlay up during a slow onBeforeEnter', async () => {
      const entered = deferred<void>();
      const { getByTestId } = render(
        <App>
          <CoachmarkAnchor id="a" />
        </App>
      );

      await start({
        key: 'tour',
        steps: [
          { id: 'a', title: 'Step 1', onBeforeEnter: () => entered.promise },
        ],
      });

      expect(getByTestId('mask')).toBeTruthy();
      expect(measure).not.toHaveBeenCalled();
    });

    it('should keep the overlay up during the first auto-scroll', async () => {
      const scrollRef = { current: { scrollTo: jest.fn() } };
      const { getByTestId } = render(
        <App>
          <CoachmarkAnchor id="a" scrollRef={scrollRef} />
        </App>
      );

      await start({
        key: 'tour',
        steps: [{ id: 'a', title: 'Step 1', ...scrollStep }],
      });

      expect(scrollRef.current.scrollTo).toHaveBeenCalledTimes(1);
      expect(getByTestId('mask')).toBeTruthy();
    });

    it('should keep the overlay up between steps', async () => {
      const { getByTestId, getByText } = render(
        <App>
          <CoachmarkAnchor id="a" />
          <CoachmarkAnchor id="b" />
        </App>
      );

      await start({
        key: 'tour',
        steps: [
          { id: 'a', title: 'Step 1' },
          { id: 'b', title: 'Step 2' },
        ],
      });
      measure.mockReturnValue(deferred<Rect>().promise);
      await act(async () => coachmark.next());

      expect(getByTestId('mask')).toBeTruthy();
      expect(getByText('Step 2')).toBeTruthy();
    });

    it('should complete the tour and persist showOnce', async () => {
      render(
        <App>
          <CoachmarkAnchor id="a" />
        </App>
      );
      const tour: Tour = {
        key: 'tour',
        showOnce: true,
        steps: [{ id: 'a', title: 'Step 1' }],
      };

      await start(tour);
      await act(async () => coachmark.next());

      expect(coachmark.state.isActive).toBe(false);
      expect(plugin.onFinish).toHaveBeenCalledWith(tour, 'completed');
      expect(await storage.get('coachmark:tour')).toBe('true');
    });
  });

  describe('with a missing anchor', () => {
    it('should not show the overlay while waiting for the anchor', async () => {
      const { queryByTestId, queryByText } = render(<App />);

      await start({
        key: 'tour',
        steps: [{ id: 'missing', title: 'Step 1' }],
      });
      await advance(ANCHOR_TIMEOUT_MS / 2);

      expect(queryByTestId('mask')).toBeNull();
      expect(queryByText('Step 1')).toBeNull();
      expect(withTiming).not.toHaveBeenCalledWith(1, expect.anything());
      expect(coachmark.state.isActive).toBe(true);
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('should show a step whose anchor registers late', async () => {
      const onEnter = jest.fn();
      const { getByText, rerender } = render(<App />);

      await start({
        key: 'tour',
        steps: [{ id: 'late', title: 'Step 1', onEnter }],
      });
      await advance(ANCHOR_TIMEOUT_MS / 2);

      rerender(
        <App>
          <CoachmarkAnchor id="late" />
        </App>
      );
      await advance(100);

      expect(getByText('Step 1')).toBeTruthy();
      expect(withTiming).toHaveBeenCalledWith(1, expect.anything());
      expect(onEnter).toHaveBeenCalledTimes(1);
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('should skip to the next step when the anchor never registers', async () => {
      const onEnter = jest.fn();
      const onExit = jest.fn();
      const { getByText, queryByText } = render(
        <App>
          <CoachmarkAnchor id="b" />
        </App>
      );
      const tour: Tour = {
        key: 'tour',
        steps: [
          { id: 'missing', title: 'Step 1', onEnter, onExit },
          { id: 'b', title: 'Step 2' },
        ],
      };

      await start(tour);
      await advance(ANCHOR_TIMEOUT_MS);

      expect(queryByText('Step 1')).toBeNull();
      expect(getByText('Step 2')).toBeTruthy();
      expect(coachmark.state.index).toBe(1);
      expect(plugin.onStep).toHaveBeenCalledWith(tour, 1, tour.steps[1]);
      expect(onEnter).not.toHaveBeenCalled();
      expect(onExit).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledWith(
        '[Coachmark] Anchor "missing" not found'
      );
    });

    it('should end the tour as skipped when no step could be shown', async () => {
      const { queryByTestId } = render(<App />);
      const tour: Tour = {
        key: 'tour',
        showOnce: true,
        steps: [
          { id: 'missing-1', title: 'Step 1' },
          { id: 'missing-2', title: 'Step 2' },
        ],
      };

      await start(tour);
      await advance(ANCHOR_TIMEOUT_MS);
      await advance(ANCHOR_TIMEOUT_MS);

      expect(queryByTestId('mask')).toBeNull();
      expect(coachmark.state.isActive).toBe(false);
      expect(plugin.onFinish).toHaveBeenCalledTimes(1);
      expect(plugin.onFinish).toHaveBeenCalledWith(tour, 'skipped');
      expect(await storage.get('coachmark:tour')).toBeNull();
    });

    it('should skip when the anchor unmounts in the same commit the tour starts', async () => {
      let hideAnchor = () => {};
      const Screen = () => {
        const [visible, setVisible] = useState(true);
        hideAnchor = () => setVisible(false);
        return visible ? <CoachmarkAnchor id="a" /> : null;
      };
      const { queryByTestId } = render(
        <App>
          <Screen />
        </App>
      );
      const tour: Tour = { key: 'tour', steps: [{ id: 'a', title: 'Step 1' }] };

      await act(async () => {
        coachmark.start(tour);
        hideAnchor();
      });

      expect(queryByTestId('mask')).toBeNull();

      await advance(ANCHOR_TIMEOUT_MS);

      expect(queryByTestId('mask')).toBeNull();
      expect(coachmark.state.isActive).toBe(false);
      expect(plugin.onFinish).toHaveBeenCalledWith(tour, 'skipped');
    });

    it('should hide the overlay when the anchor unmounts during onBeforeEnter', async () => {
      const entered = deferred<void>();
      const { getByTestId, queryByTestId, rerender } = render(
        <App>
          <CoachmarkAnchor id="a" />
        </App>
      );
      const tour: Tour = {
        key: 'tour',
        steps: [
          { id: 'a', title: 'Step 1', onBeforeEnter: () => entered.promise },
        ],
      };

      await start(tour);
      expect(getByTestId('mask')).toBeTruthy();

      rerender(<App />);
      await act(async () => {
        entered.resolve();
      });

      expect(queryByTestId('mask')).toBeNull();

      await advance(ANCHOR_TIMEOUT_MS);

      expect(coachmark.state.isActive).toBe(false);
      expect(plugin.onFinish).toHaveBeenCalledWith(tour, 'skipped');
    });

    it('should skip when the anchor unmounts while being measured', async () => {
      const measured = deferred<Rect>();
      measure.mockReturnValue(measured.promise);
      const onEnter = jest.fn();
      const { queryByTestId, rerender } = render(
        <App>
          <CoachmarkAnchor id="a" />
        </App>
      );
      const tour: Tour = {
        key: 'tour',
        steps: [{ id: 'a', title: 'Step 1', onEnter }],
      };

      await start(tour);
      rerender(<App />);
      await act(async () => {
        measured.resolve({ x: 0, y: 0, width: 0, height: 0 });
      });

      expect(queryByTestId('mask')).toBeNull();
      expect(onEnter).not.toHaveBeenCalled();
      expect(coachmark.state.isActive).toBe(false);
      expect(plugin.onFinish).toHaveBeenCalledWith(tour, 'skipped');
    });

    it('should skip when the anchor unmounts during auto-scroll', async () => {
      const deadRefs = new Set();
      measure.mockImplementation((ref) =>
        deadRefs.has(ref) ? new Promise(() => {}) : Promise.resolve(RECT)
      );
      const onEnter = jest.fn();
      const scrollRef = { current: { scrollTo: jest.fn() } };
      const { queryByTestId, rerender } = render(
        <App>
          <CoachmarkAnchor id="a" scrollRef={scrollRef} />
        </App>
      );
      const tour: Tour = {
        key: 'tour',
        steps: [{ id: 'a', title: 'Step 1', onEnter, ...scrollStep }],
      };

      await start(tour);
      deadRefs.add(measure.mock.calls[0][0]);
      rerender(<App />);
      await advance(100);

      expect(queryByTestId('mask')).toBeNull();
      expect(onEnter).not.toHaveBeenCalled();
      expect(coachmark.state.isActive).toBe(false);
      expect(plugin.onFinish).toHaveBeenCalledWith(tour, 'skipped');
    });

    it('should measure the new anchor when it remounts during auto-scroll', async () => {
      const deadRefs = new Set();
      measure.mockImplementation((ref) =>
        deadRefs.has(ref) ? new Promise(() => {}) : Promise.resolve(RECT)
      );
      const onEnter = jest.fn();
      const scrollRef = { current: { scrollTo: jest.fn() } };
      const { getByText, rerender } = render(
        <App>
          <CoachmarkAnchor key="old" id="a" scrollRef={scrollRef} />
        </App>
      );

      await start({
        key: 'tour',
        steps: [{ id: 'a', title: 'Step 1', onEnter, ...scrollStep }],
      });
      deadRefs.add(measure.mock.calls[0][0]);
      rerender(
        <App>
          <CoachmarkAnchor key="new" id="a" scrollRef={scrollRef} />
        </App>
      );
      await advance(100);

      expect(getByText('Step 1')).toBeTruthy();
      expect(onEnter).toHaveBeenCalledTimes(1);
      expect(coachmark.state.isActive).toBe(true);
    });

    it('should keep the tooltip when a later step has no anchor', async () => {
      const { getByTestId, getByText } = render(
        <App>
          <CoachmarkAnchor id="a" />
        </App>
      );

      await start({
        key: 'tour',
        steps: [
          { id: 'a', title: 'Step 1' },
          { id: 'missing', title: 'Step 2' },
        ],
      });
      await act(async () => coachmark.next());
      await advance(ANCHOR_TIMEOUT_MS * 2);

      expect(getByTestId('mask')).toBeTruthy();
      expect(getByText('Step 2')).toBeTruthy();
      expect(coachmark.state.index).toBe(1);
      expect(plugin.onFinish).not.toHaveBeenCalled();
    });

    it('should keep the tooltip when its anchor is gone on rotation', async () => {
      const listen = jest.spyOn(Dimensions, 'addEventListener');
      const { getByTestId, getByText, rerender } = render(
        <App>
          <CoachmarkAnchor id="a" />
        </App>
      );

      await start({ key: 'tour', steps: [{ id: 'a', title: 'Step 1' }] });
      rerender(<App />);
      const onRotate = listen.mock.calls.at(-1)?.[1] as () => void;
      await act(async () => onRotate());
      await advance(ANCHOR_TIMEOUT_MS * 2);

      expect(warnSpy).toHaveBeenCalledWith('[Coachmark] Anchor "a" not found');
      expect(getByTestId('mask')).toBeTruthy();
      expect(getByText('Step 1')).toBeTruthy();
      expect(coachmark.state.isActive).toBe(true);

      listen.mockRestore();
    });

    it('should stop waiting when the tour is stopped', async () => {
      render(<App />);
      const tour: Tour = {
        key: 'tour',
        steps: [{ id: 'missing', title: 'Step 1' }],
      };

      await start(tour);
      await advance(100);
      await act(async () => {
        await coachmark.stop('completed');
      });
      await advance(ANCHOR_TIMEOUT_MS);

      expect(plugin.onFinish).toHaveBeenCalledTimes(1);
      expect(plugin.onFinish).toHaveBeenCalledWith(tour, 'completed');
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('should not touch the next tour after a stop', async () => {
      render(
        <App>
          <CoachmarkAnchor id="a" />
          <CoachmarkAnchor id="b" />
        </App>
      );

      await start({
        key: 'first',
        steps: [{ id: 'missing', title: 'First' }],
      });
      await advance(100);
      await act(async () => {
        await coachmark.stop('skipped');
      });
      await start({
        key: 'second',
        steps: [
          { id: 'a', title: 'Step 1' },
          { id: 'b', title: 'Step 2' },
        ],
      });
      await advance(ANCHOR_TIMEOUT_MS);

      expect(coachmark.state.activeTour?.key).toBe('second');
      expect(coachmark.state.index).toBe(0);
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('should ignore onBeforeEnter when its tour already ended', async () => {
      const entered = deferred<boolean>();
      render(
        <App>
          <CoachmarkAnchor id="a" />
          <CoachmarkAnchor id="b" />
        </App>
      );

      await start({
        key: 'first',
        steps: [
          { id: 'a', title: 'First', onBeforeEnter: () => entered.promise },
        ],
      });
      await act(async () => {
        await coachmark.stop('skipped');
      });
      await start({
        key: 'second',
        steps: [
          { id: 'a', title: 'Step 1' },
          { id: 'b', title: 'Step 2' },
        ],
      });
      await act(async () => {
        entered.resolve(false);
      });

      expect(coachmark.state.activeTour?.key).toBe('second');
      expect(coachmark.state.index).toBe(0);
    });

    it('should not reuse the target of a previous tour', async () => {
      const { queryByTestId, queryByText } = render(
        <App>
          <CoachmarkAnchor id="a" />
        </App>
      );

      await start({ key: 'first', steps: [{ id: 'a', title: 'First' }] });
      await act(async () => coachmark.next());
      await start({
        key: 'second',
        steps: [{ id: 'missing', title: 'Second' }],
      });

      expect(queryByTestId('mask')).toBeNull();
      expect(queryByText('Second')).toBeNull();
    });

    it('should ignore a measurement that lands after its step was left', async () => {
      const measured = deferred<Rect>();
      measure.mockReturnValueOnce(measured.promise);
      const { rerender } = render(
        <App>
          <CoachmarkAnchor id="a" />
          <CoachmarkAnchor id="b" />
          <CoachmarkAnchor id="c" />
        </App>
      );

      await start({
        key: 'tour',
        steps: [
          { id: 'a', title: 'Step 1' },
          { id: 'b', title: 'Step 2' },
          { id: 'c', title: 'Step 3' },
        ],
      });
      await act(async () => coachmark.next());
      rerender(
        <App>
          <CoachmarkAnchor id="b" />
          <CoachmarkAnchor id="c" />
        </App>
      );
      await act(async () => {
        measured.resolve(RECT);
      });

      expect(coachmark.state.index).toBe(1);
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('should ignore a measurement that lands after the tour ended', async () => {
      const measured = deferred<Rect>();
      measure.mockReturnValueOnce(measured.promise);
      const { queryByTestId } = render(
        <App>
          <CoachmarkAnchor id="a" />
        </App>
      );

      await start({ key: 'first', steps: [{ id: 'a', title: 'First' }] });
      await act(async () => {
        await coachmark.stop('skipped');
      });
      await act(async () => {
        measured.resolve(RECT);
      });
      await start({
        key: 'second',
        steps: [{ id: 'missing', title: 'Second' }],
      });

      expect(queryByTestId('mask')).toBeNull();
    });
  });
});
