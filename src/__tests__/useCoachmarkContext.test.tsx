import React from 'react';

import { renderHook } from '@testing-library/react-native';

import {
  CoachmarkProvider,
  useCoachmarkContext,
} from '../core/CoachmarkContext';

describe('useCoachmarkContext', () => {
  it('should throw error when used outside provider', () => {
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      renderHook(() => useCoachmarkContext());
    }).toThrow('useCoachmarkContext must be used within a CoachmarkProvider');

    console.error = originalError;
  });

  it('should return context when used inside provider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CoachmarkProvider>{children}</CoachmarkProvider>
    );

    const { result } = renderHook(() => useCoachmarkContext(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current.state).toBeDefined();
    expect(result.current.theme).toBeDefined();
    expect(result.current.storage).toBeDefined();
  });

  it('should provide all required functions', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CoachmarkProvider>{children}</CoachmarkProvider>
    );

    const { result } = renderHook(() => useCoachmarkContext(), { wrapper });

    expect(typeof result.current.start).toBe('function');
    expect(typeof result.current.stop).toBe('function');
    expect(typeof result.current.next).toBe('function');
    expect(typeof result.current.back).toBe('function');
    expect(typeof result.current.getAnchor).toBe('function');
    expect(typeof result.current.register).toBe('function');
    expect(typeof result.current.unregister).toBe('function');
  });
});
