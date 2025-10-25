import { Text, View } from 'react-native';

import { render } from '@testing-library/react-native';

import { CoachmarkAnchor } from '../anchors/CoachmarkAnchor';
import { CoachmarkProvider } from '../core/CoachmarkContext';

describe('CoachmarkAnchor', () => {
  it('should render children', () => {
    const { getByText } = render(
      <CoachmarkProvider>
        <CoachmarkAnchor id="test-step">
          <Text>Anchor Content</Text>
        </CoachmarkAnchor>
      </CoachmarkProvider>
    );

    expect(getByText('Anchor Content')).toBeTruthy();
  });

  it('should accept shape prop', () => {
    const { getByTestId } = render(
      <CoachmarkProvider>
        <CoachmarkAnchor id="test-step" shape="circle">
          <View testID="anchor-view">
            <Text>Content</Text>
          </View>
        </CoachmarkAnchor>
      </CoachmarkProvider>
    );

    expect(getByTestId('anchor-view')).toBeTruthy();
  });

  it('should accept padding prop', () => {
    const { getByTestId } = render(
      <CoachmarkProvider>
        <CoachmarkAnchor id="test-step" padding={20}>
          <View testID="anchor-view">
            <Text>Content</Text>
          </View>
        </CoachmarkAnchor>
      </CoachmarkProvider>
    );

    expect(getByTestId('anchor-view')).toBeTruthy();
  });

  it('should accept radius prop', () => {
    const { getByTestId } = render(
      <CoachmarkProvider>
        <CoachmarkAnchor id="test-step" radius={15}>
          <View testID="anchor-view">
            <Text>Content</Text>
          </View>
        </CoachmarkAnchor>
      </CoachmarkProvider>
    );

    expect(getByTestId('anchor-view')).toBeTruthy();
  });

  it('should accept all shape options', () => {
    const shapes: Array<'rect' | 'circle' | 'pill'> = [
      'rect',
      'circle',
      'pill',
    ];

    shapes.forEach((shape) => {
      const { getByTestId } = render(
        <CoachmarkProvider>
          <CoachmarkAnchor id={`step-${shape}`} shape={shape}>
            <View testID={`anchor-${shape}`}>
              <Text>Content</Text>
            </View>
          </CoachmarkAnchor>
        </CoachmarkProvider>
      );

      expect(getByTestId(`anchor-${shape}`)).toBeTruthy();
    });
  });

  it('should render multiple anchors', () => {
    const { getByText } = render(
      <CoachmarkProvider>
        <View>
          <CoachmarkAnchor id="step1">
            <Text>Anchor 1</Text>
          </CoachmarkAnchor>
          <CoachmarkAnchor id="step2">
            <Text>Anchor 2</Text>
          </CoachmarkAnchor>
          <CoachmarkAnchor id="step3">
            <Text>Anchor 3</Text>
          </CoachmarkAnchor>
        </View>
      </CoachmarkProvider>
    );

    expect(getByText('Anchor 1')).toBeTruthy();
    expect(getByText('Anchor 2')).toBeTruthy();
    expect(getByText('Anchor 3')).toBeTruthy();
  });

  it('should handle custom styles', () => {
    const customStyle = {
      backgroundColor: 'red',
      padding: 10,
    };

    const { getByTestId } = render(
      <CoachmarkProvider>
        <CoachmarkAnchor id="test-step">
          <View testID="styled-view" style={customStyle}>
            <Text>Styled Content</Text>
          </View>
        </CoachmarkAnchor>
      </CoachmarkProvider>
    );

    const view = getByTestId('styled-view');
    expect(view).toBeTruthy();
    expect(view.props.style).toMatchObject(customStyle);
  });
});
