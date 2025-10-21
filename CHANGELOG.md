# @edwardloopez/react-native-coachmark

## 0.4.1

### Patch Changes

- [`cf793d1`](https://github.com/edwardloopez/react-native-coachmark/commit/cf793d1d652cba4bbbd53bb9bfa8d970144d507f) Thanks [@edwardloopez](https://github.com/edwardloopez)! - Fix monorepo setup with PNPM workspace configuration

- [`3b36f54`](https://github.com/edwardloopez/react-native-coachmark/commit/3b36f5498c7999c675059d3129aa0ff565a1cd37) Thanks [@edwardloopez](https://github.com/edwardloopez)! - Fix Android coordinate alignment with StatusBar offset

## 0.4.0

### Minor Changes

- [`ff7d165`](https://github.com/edwardloopez/react-native-coachmark/commit/ff7d16512a10ddf9cb27176759d93046c20ee4b1) Thanks [@edwardloopez](https://github.com/edwardloopez)! - Add `scrollDelay` parameter to TourStep for smoother auto-scroll transitions. Eliminates visual jumpiness by adding a configurable delay (default: 150ms) between scroll completion and mask rendering.

## 0.3.0

### Minor Changes

- [`2e19377`](https://github.com/edwardloopez/react-native-coachmark/commit/2e19377cfb536e5d136930639ca3f92e7f1612a6) Thanks [@edwardloopez](https://github.com/edwardloopez)! - Add auto-focus feature for automatic scrolling to off-screen coachmark anchors
  - Add autoFocus prop ('always' | 'ifNeeded') to TourStep
  - Add scrollRef prop on CoachmarkAnchor for linking ScrollView/FlatList
  - Implement automatic viewport detection and smooth scrolling
  - Add scrollBehavior, scrollPadding, and onBeforeScroll options
  - Include comprehensive tests and documentation
