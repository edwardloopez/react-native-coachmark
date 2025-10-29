import { Text } from 'react-native';

import { render } from '@testing-library/react-native';

import { CoachmarkErrorBoundary } from '../ui/CoachmarkErrorBoundary';

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error from custom tooltip');
  }
  return <Text>No error</Text>;
};

describe('CoachmarkErrorBoundary', () => {
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it('should render children when no error occurs', () => {
    const { getByText } = render(
      <CoachmarkErrorBoundary>
        <Text>Test content</Text>
      </CoachmarkErrorBoundary>
    );

    expect(getByText('Test content')).toBeTruthy();
  });

  it('should catch errors and display error UI', () => {
    const { getByText } = render(
      <CoachmarkErrorBoundary>
        <ThrowError shouldThrow={true} />
      </CoachmarkErrorBoundary>
    );

    expect(getByText('⚠️ Tooltip Error')).toBeTruthy();
    expect(getByText('Test error from custom tooltip')).toBeTruthy();
  });

  it('should call onError callback when error is caught', () => {
    const onError = jest.fn();

    render(
      <CoachmarkErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </CoachmarkErrorBoundary>
    );

    expect(onError).toHaveBeenCalled();
    expect(onError.mock.calls[0][0].message).toBe(
      'Test error from custom tooltip'
    );
  });

  it('should render custom fallback when provided', () => {
    const fallback = (error: Error) => (
      <Text>Custom error: {error.message}</Text>
    );

    const { getByText } = render(
      <CoachmarkErrorBoundary fallback={fallback}>
        <ThrowError shouldThrow={true} />
      </CoachmarkErrorBoundary>
    );

    expect(
      getByText('Custom error: Test error from custom tooltip')
    ).toBeTruthy();
  });

  it('should show dismiss button when error is caught', () => {
    const { getByText } = render(
      <CoachmarkErrorBoundary>
        <ThrowError shouldThrow={true} />
      </CoachmarkErrorBoundary>
    );

    expect(getByText('Dismiss')).toBeTruthy();
  });
});
