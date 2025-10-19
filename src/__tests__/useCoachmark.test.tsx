import { render } from '@testing-library/react-native';
import { CoachmarkProvider } from '../core/CoachmarkContext';
import { useCoachmark } from '../hooks/useCoachmark';
import { Text } from 'react-native';

describe('useCoachmark', () => {
  it('should provide hook interface', () => {
    const TestComponent = () => {
      const hook = useCoachmark();
      return (
        <Text>
          {typeof hook.start},{typeof hook.next},{typeof hook.stop}
        </Text>
      );
    };

    const { getByText } = render(
      <CoachmarkProvider>
        <TestComponent />
      </CoachmarkProvider>
    );

    expect(getByText('function,function,function')).toBeTruthy();
  });

  it('should start with inactive state', () => {
    const TestComponent = () => {
      const { isActive } = useCoachmark();
      return <Text>{isActive ? 'Active' : 'Inactive'}</Text>;
    };

    const { getByText } = render(
      <CoachmarkProvider>
        <TestComponent />
      </CoachmarkProvider>
    );

    expect(getByText('Inactive')).toBeTruthy();
  });

  it('should provide step count and index', () => {
    const TestComponent = () => {
      const { count, index } = useCoachmark();
      return (
        <Text>
          Count: {count}, Index: {index}
        </Text>
      );
    };

    const { getByText } = render(
      <CoachmarkProvider>
        <TestComponent />
      </CoachmarkProvider>
    );

    expect(getByText('Count: 0, Index: 0')).toBeTruthy();
  });
});
