import { Text } from 'react-native';

import { render, waitFor } from '@testing-library/react-native';

import { CoachmarkProvider, useCoachmarkContext } from '@core/CoachmarkContext';

describe('CoachmarkProvider', () => {
  it('should render children', () => {
    const { getByText } = render(
      <CoachmarkProvider>
        <Text>Test Child</Text>
      </CoachmarkProvider>
    );

    expect(getByText('Test Child')).toBeTruthy();
  });

  it('should provide context to children', () => {
    const TestComponent = () => {
      const context = useCoachmarkContext();
      return <Text>{context ? 'Context Available' : 'No Context'}</Text>;
    };

    const { getByText } = render(
      <CoachmarkProvider>
        <TestComponent />
      </CoachmarkProvider>
    );

    expect(getByText('Context Available')).toBeTruthy();
  });

  it('should throw error when useCoachmarkContext is used outside provider', () => {
    const TestComponent = () => {
      useCoachmarkContext();
      return null;
    };

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    try {
      render(<TestComponent />);
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeDefined();
    }

    consoleSpy.mockRestore();
  });

  it('should initialize with no active tour', () => {
    const TestComponent = () => {
      const { state } = useCoachmarkContext();
      return <Text>{state.isActive ? 'Has Tour' : 'No Tour'}</Text>;
    };

    const { getByText } = render(
      <CoachmarkProvider>
        <TestComponent />
      </CoachmarkProvider>
    );

    expect(getByText('No Tour')).toBeTruthy();
  });

  it('should accept custom theme', () => {
    const customTheme = {
      backdropColor: '#FF0000',
      backdropOpacity: 0.8,
    };

    const TestComponent = () => {
      useCoachmarkContext();
      return <Text>Mounted</Text>;
    };

    const { getByText } = render(
      <CoachmarkProvider theme={customTheme}>
        <TestComponent />
      </CoachmarkProvider>
    );

    expect(getByText('Mounted')).toBeTruthy();
  });

  it('should accept custom storage adapter', async () => {
    const mockStorage = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
    };

    const TestComponent = () => {
      const context = useCoachmarkContext();
      return <Text>{context ? 'Mounted' : 'Not Mounted'}</Text>;
    };

    const { getByText } = render(
      <CoachmarkProvider storage={mockStorage}>
        <TestComponent />
      </CoachmarkProvider>
    );

    await waitFor(() => {
      expect(getByText('Mounted')).toBeTruthy();
    });
  });
});
