import { renderHook, act, waitFor } from '@testing-library/react-native';

import { useCoachmarkStore } from '@core/store';
import type { Tour, AnchorRegistration, Plugin } from '@core/types';

const mockStorage = {
  get: jest.fn(),
  set: jest.fn(),
};

describe('useCoachmarkStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStorage.get.mockResolvedValue(null);
    mockStorage.set.mockResolvedValue(undefined);
  });

  describe('Anchor registration', () => {
    it('should register an anchor', () => {
      const { result } = renderHook(() => useCoachmarkStore(mockStorage));
      const anchor: AnchorRegistration = {
        id: 'test-anchor',
        getRef: () => ({ current: null }),
        shape: 'rect',
        padding: 10,
      };

      act(() => {
        result.current.register(anchor);
      });

      expect(result.current.getAnchor('test-anchor')).toBe(anchor);
    });

    it('should unregister an anchor', () => {
      const { result } = renderHook(() => useCoachmarkStore(mockStorage));
      const anchor: AnchorRegistration = {
        id: 'test-anchor',
        getRef: () => ({ current: null }),
        shape: 'rect',
        padding: 10,
      };

      act(() => {
        result.current.register(anchor);
        result.current.unregister('test-anchor');
      });

      expect(result.current.getAnchor('test-anchor')).toBeUndefined();
    });

    it('should return undefined for non-existent anchor', () => {
      const { result } = renderHook(() => useCoachmarkStore(mockStorage));

      expect(result.current.getAnchor('non-existent')).toBeUndefined();
    });
  });

  describe('Measured positions', () => {
    it('should store measured anchor positions', () => {
      const { result } = renderHook(() => useCoachmarkStore(mockStorage));
      const rect = { x: 10, y: 20, width: 100, height: 50 };

      act(() => {
        result.current.setMeasured('test-anchor', rect);
      });

      expect(result.current.state.measured['test-anchor']).toEqual(rect);
    });

    it('should update existing measured positions', () => {
      const { result } = renderHook(() => useCoachmarkStore(mockStorage));
      const rect1 = { x: 10, y: 20, width: 100, height: 50 };
      const rect2 = { x: 30, y: 40, width: 150, height: 75 };

      act(() => {
        result.current.setMeasured('test-anchor', rect1);
        result.current.setMeasured('test-anchor', rect2);
      });

      expect(result.current.state.measured['test-anchor']).toEqual(rect2);
    });
  });

  describe('Tour lifecycle', () => {
    const mockTour: Tour = {
      key: 'test-tour',
      steps: [
        { id: 'step1', title: 'Step 1' },
        { id: 'step2', title: 'Step 2' },
        { id: 'step3', title: 'Step 3' },
      ],
    };

    it('should start a tour', async () => {
      const { result } = renderHook(() => useCoachmarkStore(mockStorage));

      await act(async () => {
        await result.current.start(mockTour);
      });

      expect(result.current.state.isActive).toBe(true);
      expect(result.current.state.activeTour).toBe(mockTour);
      expect(result.current.state.index).toBe(0);
    });

    it('should not start a showOnce tour if already seen', async () => {
      const showOnceTour: Tour = {
        ...mockTour,
        showOnce: true,
      };
      mockStorage.get.mockResolvedValue('true');

      const { result } = renderHook(() => useCoachmarkStore(mockStorage));

      await act(async () => {
        await result.current.start(showOnceTour);
      });

      expect(result.current.state.isActive).toBe(false);
      expect(mockStorage.get).toHaveBeenCalledWith('coachmark:test-tour');
    });

    it('should start a showOnce tour if not seen before', async () => {
      const showOnceTour: Tour = {
        ...mockTour,
        showOnce: true,
      };
      mockStorage.get.mockResolvedValue(null);

      const { result } = renderHook(() => useCoachmarkStore(mockStorage));

      await act(async () => {
        await result.current.start(showOnceTour);
      });

      expect(result.current.state.isActive).toBe(true);
      expect(mockStorage.get).toHaveBeenCalledWith('coachmark:test-tour');
    });

    it('should respect tour delay', async () => {
      const delayedTour: Tour = {
        ...mockTour,
        delay: 100,
      };

      const { result } = renderHook(() => useCoachmarkStore(mockStorage));
      const startTime = Date.now();

      await act(async () => {
        await result.current.start(delayedTour);
      });

      const elapsedTime = Date.now() - startTime;
      expect(elapsedTime).toBeGreaterThanOrEqual(100);
      expect(result.current.state.isActive).toBe(true);
    });

    it('should stop a tour and mark as completed', async () => {
      const { result } = renderHook(() => useCoachmarkStore(mockStorage));

      await act(async () => {
        await result.current.start(mockTour);
      });

      expect(result.current.state.isActive).toBe(true);

      await act(async () => {
        await result.current.stop('completed');
      });

      expect(result.current.state.isActive).toBe(false);
      expect(result.current.state.activeTour).toBeNull();
      expect(result.current.state.index).toBe(0);
    });

    it('should store showOnce flag when tour is completed', async () => {
      const showOnceTour: Tour = {
        ...mockTour,
        showOnce: true,
      };

      const { result } = renderHook(() => useCoachmarkStore(mockStorage));

      await act(async () => {
        await result.current.start(showOnceTour);
      });

      await act(async () => {
        await result.current.stop('completed');
      });

      expect(mockStorage.set).toHaveBeenCalledWith(
        'coachmark:test-tour',
        'true'
      );
    });

    it('should not store showOnce flag when tour is skipped', async () => {
      const showOnceTour: Tour = {
        ...mockTour,
        showOnce: true,
      };

      const { result } = renderHook(() => useCoachmarkStore(mockStorage));

      await act(async () => {
        await result.current.start(showOnceTour);
        await result.current.stop('skipped');
      });

      expect(mockStorage.set).not.toHaveBeenCalled();
    });
  });

  describe('Step navigation', () => {
    const mockTour: Tour = {
      key: 'test-tour',
      steps: [
        { id: 'step1', title: 'Step 1' },
        { id: 'step2', title: 'Step 2' },
        { id: 'step3', title: 'Step 3' },
      ],
    };

    it('should navigate to next step', async () => {
      const { result } = renderHook(() => useCoachmarkStore(mockStorage));

      await act(async () => {
        await result.current.start(mockTour);
      });

      expect(result.current.state.index).toBe(0);

      act(() => {
        result.current.next();
      });

      expect(result.current.state.index).toBe(1);

      act(() => {
        result.current.next();
      });

      expect(result.current.state.index).toBe(2);
    });

    it('should auto-complete tour when reaching last step', async () => {
      const { result } = renderHook(() => useCoachmarkStore(mockStorage));

      await act(async () => {
        await result.current.start(mockTour);
      });

      act(() => {
        result.current.next(); // -> step 2
        result.current.next(); // -> step 3
        result.current.next(); // -> complete
      });

      await waitFor(() => {
        expect(result.current.state.isActive).toBe(false);
        expect(result.current.state.activeTour).toBeNull();
        expect(result.current.state.index).toBe(0);
      });
    });

    it('should navigate to previous step', async () => {
      const { result } = renderHook(() => useCoachmarkStore(mockStorage));

      await act(async () => {
        await result.current.start(mockTour);
      });

      act(() => {
        result.current.next();
        result.current.next();
      });

      expect(result.current.state.index).toBe(2);

      act(() => {
        result.current.back();
      });

      expect(result.current.state.index).toBe(1);
    });

    it('should not go below index 0 when going back', async () => {
      const { result } = renderHook(() => useCoachmarkStore(mockStorage));

      await act(async () => {
        await result.current.start(mockTour);
      });

      expect(result.current.state.index).toBe(0);

      act(() => {
        result.current.back();
        result.current.back();
      });

      expect(result.current.state.index).toBe(0);
    });

    it('should handle next with no active tour', () => {
      const { result } = renderHook(() => useCoachmarkStore(mockStorage));

      expect(result.current.state.activeTour).toBeNull();

      act(() => {
        result.current.next();
      });

      expect(result.current.state.index).toBe(0);
      expect(result.current.state.activeTour).toBeNull();
    });
  });

  describe('Plugins', () => {
    const mockTour: Tour = {
      key: 'test-tour',
      steps: [
        { id: 'step1', title: 'Step 1' },
        { id: 'step2', title: 'Step 2' },
      ],
    };

    it('should add plugins', () => {
      const { result } = renderHook(() => useCoachmarkStore(mockStorage));
      const plugin: Plugin = {
        onStart: jest.fn(),
        onFinish: jest.fn(),
        onStep: jest.fn(),
      };

      act(() => {
        result.current.addPlugins([plugin]);
      });

      // Plugins are stored internally, no direct way to verify
      // But we can test that they get called
    });

    it('should call plugin onStart when tour starts', async () => {
      const { result } = renderHook(() => useCoachmarkStore(mockStorage));
      const plugin: Plugin = {
        onStart: jest.fn(),
      };

      act(() => {
        result.current.addPlugins([plugin]);
      });

      await act(async () => {
        await result.current.start(mockTour);
      });

      expect(plugin.onStart).toHaveBeenCalledWith(mockTour);
    });

    it('should call plugin onFinish when tour stops', async () => {
      const { result } = renderHook(() => useCoachmarkStore(mockStorage));
      const plugin: Plugin = {
        onFinish: jest.fn(),
      };

      act(() => {
        result.current.addPlugins([plugin]);
      });

      await act(async () => {
        await result.current.start(mockTour);
      });

      await act(async () => {
        await result.current.stop('completed');
      });

      expect(plugin.onFinish).toHaveBeenCalledWith(mockTour, 'completed');
    });

    it('should call plugin onFinish with skipped reason', async () => {
      const { result } = renderHook(() => useCoachmarkStore(mockStorage));
      const plugin: Plugin = {
        onFinish: jest.fn(),
      };

      act(() => {
        result.current.addPlugins([plugin]);
      });

      await act(async () => {
        await result.current.start(mockTour);
      });

      await act(async () => {
        await result.current.stop('skipped');
      });

      expect(plugin.onFinish).toHaveBeenCalledWith(mockTour, 'skipped');
    });

    it('should call plugin onStep when navigating steps', async () => {
      const { result } = renderHook(() => useCoachmarkStore(mockStorage));
      const plugin: Plugin = {
        onStep: jest.fn(),
      };

      act(() => {
        result.current.addPlugins([plugin]);
      });

      await act(async () => {
        await result.current.start(mockTour);
      });

      act(() => {
        result.current.next();
      });

      expect(plugin.onStep).toHaveBeenCalledWith(
        mockTour,
        1,
        mockTour.steps[1]
      );
    });

    it('should handle multiple plugins', async () => {
      const { result } = renderHook(() => useCoachmarkStore(mockStorage));
      const plugin1: Plugin = {
        onStart: jest.fn(),
        onFinish: jest.fn(),
      };
      const plugin2: Plugin = {
        onStart: jest.fn(),
        onFinish: jest.fn(),
      };

      act(() => {
        result.current.addPlugins([plugin1, plugin2]);
      });

      await act(async () => {
        await result.current.start(mockTour);
      });

      await act(async () => {
        await result.current.stop('completed');
      });

      expect(plugin1.onStart).toHaveBeenCalledWith(mockTour);
      expect(plugin2.onStart).toHaveBeenCalledWith(mockTour);
      expect(plugin1.onFinish).toHaveBeenCalledWith(mockTour, 'completed');
      expect(plugin2.onFinish).toHaveBeenCalledWith(mockTour, 'completed');
    });
  });

  describe('Initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useCoachmarkStore(mockStorage));

      expect(result.current.state).toEqual({
        activeTour: null,
        index: 0,
        isActive: false,
        measured: {},
      });
    });
  });
});
