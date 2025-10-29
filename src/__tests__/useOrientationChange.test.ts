import { Dimensions } from 'react-native';

import { renderHook } from '@testing-library/react-native';

import { useOrientationChange } from '../hooks/useOrientationChange';

describe('useOrientationChange', () => {
  it('should accept isActive and callback parameters', () => {
    const callback = jest.fn();

    const { result } = renderHook(() => useOrientationChange(true, callback));

    expect(result.current).toBeUndefined();
  });

  it('should not throw when inactive', () => {
    const callback = jest.fn();

    expect(() => {
      renderHook(() => useOrientationChange(false, callback));
    }).not.toThrow();
  });

  it('should have a subscription when active', () => {
    const callback = jest.fn();
    const addEventListenerSpy = jest.spyOn(Dimensions, 'addEventListener');

    renderHook(() => useOrientationChange(true, callback));

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
  });
});
