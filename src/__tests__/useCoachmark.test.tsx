import { render, waitFor, act } from '@testing-library/react-native';
import { CoachmarkProvider } from '../core/CoachmarkContext';
import { useCoachmark } from '../hooks/useCoachmark';
import { Text, View } from 'react-native';
import type { Tour, TourStep } from '../core/types';
import { memoryStorage } from '../core/storage';

describe('useCoachmark', () => {
  const mockStorage = memoryStorage();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should start with inactive state', () => {
    const TestComponent = () => {
      const { isActive } = useCoachmark();
      return <Text>{isActive ? 'Active' : 'Inactive'}</Text>;
    };

    const { getByText } = render(
      <CoachmarkProvider storage={mockStorage}>
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
      <CoachmarkProvider storage={mockStorage}>
        <TestComponent />
      </CoachmarkProvider>
    );

    expect(getByText('Count: 0, Index: 0')).toBeTruthy();
  });

  it('should start a tour with Tour object', async () => {
    const tour: Tour = {
      key: 'test-tour',
      steps: [
        { id: 'step1', title: 'Step 1' },
        { id: 'step2', title: 'Step 2' },
      ],
    };

    const TestComponent = () => {
      const { start, isActive, count, activeStep } = useCoachmark();

      return (
        <View>
          <Text testID="status">{isActive ? 'Active' : 'Inactive'}</Text>
          <Text testID="count">Count: {count}</Text>
          <Text testID="activeStep">
            {activeStep ? activeStep.title : 'None'}
          </Text>
          <Text testID="start-btn" onPress={() => start(tour)}>
            Start
          </Text>
        </View>
      );
    };

    const { getByTestId } = render(
      <CoachmarkProvider storage={mockStorage}>
        <TestComponent />
      </CoachmarkProvider>
    );

    expect(getByTestId('status').children[0]).toBe('Inactive');

    await act(async () => {
      getByTestId('start-btn').props.onPress();
    });

    await waitFor(() => {
      expect(getByTestId('status').children[0]).toBe('Active');
      expect(getByTestId('count').children[0]).toBe('Count: ');
      expect(getByTestId('count').children[1]).toBe('2');
      expect(getByTestId('activeStep').children[0]).toBe('Step 1');
    });
  });

  it('should start a tour with steps array (adhoc tour)', async () => {
    const steps: TourStep[] = [
      { id: 'step1', title: 'Quick Step 1' },
      { id: 'step2', title: 'Quick Step 2' },
    ];

    const TestComponent = () => {
      const { start, isActive, count, activeStep } = useCoachmark();

      return (
        <View>
          <Text testID="status">{isActive ? 'Active' : 'Inactive'}</Text>
          <Text testID="count">Count: {count}</Text>
          <Text testID="activeStep">
            {activeStep ? activeStep.title : 'None'}
          </Text>
          <Text testID="start-btn" onPress={() => start(steps)}>
            Start
          </Text>
        </View>
      );
    };

    const { getByTestId } = render(
      <CoachmarkProvider storage={mockStorage}>
        <TestComponent />
      </CoachmarkProvider>
    );

    await act(async () => {
      getByTestId('start-btn').props.onPress();
    });

    await waitFor(() => {
      expect(getByTestId('status').children[0]).toBe('Active');
      expect(getByTestId('count').children[0]).toBe('Count: ');
      expect(getByTestId('count').children[1]).toBe('2');
      expect(getByTestId('activeStep').children[0]).toBe('Quick Step 1');
    });
  });

  it('should navigate to next step', async () => {
    const tour: Tour = {
      key: 'test-tour',
      steps: [
        { id: 'step1', title: 'Step 1' },
        { id: 'step2', title: 'Step 2' },
        { id: 'step3', title: 'Step 3' },
      ],
    };

    const TestComponent = () => {
      const { start, next, index, activeStep } = useCoachmark();

      return (
        <View>
          <Text testID="index">Index: {index}</Text>
          <Text testID="activeStep">
            {activeStep ? activeStep.title : 'None'}
          </Text>
          <Text testID="start-btn" onPress={() => start(tour)}>
            Start
          </Text>
          <Text testID="next-btn" onPress={next}>
            Next
          </Text>
        </View>
      );
    };

    const { getByTestId } = render(
      <CoachmarkProvider storage={mockStorage}>
        <TestComponent />
      </CoachmarkProvider>
    );

    await act(async () => {
      getByTestId('start-btn').props.onPress();
    });

    await waitFor(() => {
      expect(getByTestId('activeStep').children[0]).toBe('Step 1');
    });

    await act(async () => {
      getByTestId('next-btn').props.onPress();
    });

    await waitFor(() => {
      expect(getByTestId('index').children[0]).toBe('Index: ');
      expect(getByTestId('index').children[1]).toBe('1');
      expect(getByTestId('activeStep').children[0]).toBe('Step 2');
    });
  });

  it('should navigate to previous step', async () => {
    const tour: Tour = {
      key: 'test-tour',
      steps: [
        { id: 'step1', title: 'Step 1' },
        { id: 'step2', title: 'Step 2' },
        { id: 'step3', title: 'Step 3' },
      ],
    };

    const TestComponent = () => {
      const { start, next, back, index, activeStep } = useCoachmark();

      return (
        <View>
          <Text testID="index">Index: {index}</Text>
          <Text testID="activeStep">
            {activeStep ? activeStep.title : 'None'}
          </Text>
          <Text testID="start-btn" onPress={() => start(tour)}>
            Start
          </Text>
          <Text testID="next-btn" onPress={next}>
            Next
          </Text>
          <Text testID="back-btn" onPress={back}>
            Back
          </Text>
        </View>
      );
    };

    const { getByTestId } = render(
      <CoachmarkProvider storage={mockStorage}>
        <TestComponent />
      </CoachmarkProvider>
    );

    await act(async () => {
      getByTestId('start-btn').props.onPress();
    });

    await waitFor(() => {
      expect(getByTestId('activeStep').children[0]).toBe('Step 1');
    });

    await act(async () => {
      getByTestId('next-btn').props.onPress();
    });

    await waitFor(() => {
      expect(getByTestId('activeStep').children[0]).toBe('Step 2');
    });

    await act(async () => {
      getByTestId('back-btn').props.onPress();
    });

    await waitFor(() => {
      expect(getByTestId('index').children[0]).toBe('Index: ');
      expect(getByTestId('index').children[1]).toBe('0');
      expect(getByTestId('activeStep').children[0]).toBe('Step 1');
    });
  });

  it('should skip tour', async () => {
    const tour: Tour = {
      key: 'test-tour',
      steps: [
        { id: 'step1', title: 'Step 1' },
        { id: 'step2', title: 'Step 2' },
      ],
    };

    const TestComponent = () => {
      const { start, skip, isActive } = useCoachmark();

      return (
        <View>
          <Text testID="status">{isActive ? 'Active' : 'Inactive'}</Text>
          <Text testID="start-btn" onPress={() => start(tour)}>
            Start
          </Text>
          <Text testID="skip-btn" onPress={skip}>
            Skip
          </Text>
        </View>
      );
    };

    const { getByTestId } = render(
      <CoachmarkProvider storage={mockStorage}>
        <TestComponent />
      </CoachmarkProvider>
    );

    await act(async () => {
      getByTestId('start-btn').props.onPress();
    });

    await waitFor(() => {
      expect(getByTestId('status').children[0]).toBe('Active');
    });

    await act(async () => {
      getByTestId('skip-btn').props.onPress();
    });

    await waitFor(() => {
      expect(getByTestId('status').children[0]).toBe('Inactive');
    });
  });

  it('should stop tour', async () => {
    const tour: Tour = {
      key: 'test-tour',
      steps: [
        { id: 'step1', title: 'Step 1' },
        { id: 'step2', title: 'Step 2' },
      ],
    };

    const TestComponent = () => {
      const { start, stop, isActive } = useCoachmark();

      return (
        <View>
          <Text testID="status">{isActive ? 'Active' : 'Inactive'}</Text>
          <Text testID="start-btn" onPress={() => start(tour)}>
            Start
          </Text>
          <Text testID="stop-btn" onPress={stop}>
            Stop
          </Text>
        </View>
      );
    };

    const { getByTestId } = render(
      <CoachmarkProvider storage={mockStorage}>
        <TestComponent />
      </CoachmarkProvider>
    );

    await act(async () => {
      getByTestId('start-btn').props.onPress();
    });

    await waitFor(() => {
      expect(getByTestId('status').children[0]).toBe('Active');
    });

    await act(async () => {
      getByTestId('stop-btn').props.onPress();
    });

    await waitFor(() => {
      expect(getByTestId('status').children[0]).toBe('Inactive');
    });
  });

  it('should return null activeStep when no tour is active', () => {
    const TestComponent = () => {
      const { activeStep } = useCoachmark();
      return <Text testID="activeStep">{activeStep ? 'Has' : 'Null'}</Text>;
    };

    const { getByTestId } = render(
      <CoachmarkProvider storage={mockStorage}>
        <TestComponent />
      </CoachmarkProvider>
    );

    expect(getByTestId('activeStep').children[0]).toBe('Null');
  });
});
