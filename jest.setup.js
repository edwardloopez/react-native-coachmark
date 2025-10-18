/* global jest */

// Mock react-native-reanimated
global._frameTimestamp = null;

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const React = require('react');
  return {
    Svg: ({ children, ...props }) =>
      React.createElement('Svg', props, children),
    Path: (props) => React.createElement('Path', props),
    Rect: (props) => React.createElement('Rect', props),
    Circle: (props) => React.createElement('Circle', props),
    Defs: ({ children, ...props }) =>
      React.createElement('Defs', props, children),
    Mask: ({ children, ...props }) =>
      React.createElement('Mask', props, children),
  };
});
