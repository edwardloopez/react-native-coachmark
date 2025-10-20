# @edwardloopez/react-native-coachmark

## 0.3.0

### Minor Changes

- [`2e19377`](https://github.com/edwardloopez/react-native-coachmark/commit/2e19377cfb536e5d136930639ca3f92e7f1612a6) Thanks [@edwardloopez](https://github.com/edwardloopez)! - Add auto-focus feature for automatic scrolling to off-screen coachmark anchors
  - Add autoFocus prop ('always' | 'ifNeeded') to TourStep
  - Add scrollRef prop on CoachmarkAnchor for linking ScrollView/FlatList
  - Implement automatic viewport detection and smooth scrolling
  - Add scrollBehavior, scrollPadding, and onBeforeScroll options
  - Include comprehensive tests and documentation
