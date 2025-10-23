# @edwardloopez/react-native-coachmark

## 0.4.3

### Patch Changes

- [#7](https://github.com/edwardloopez/react-native-coachmark/pull/7) [`3a041f6`](https://github.com/edwardloopez/react-native-coachmark/commit/3a041f63fa76df498b09e4930ea32d4ffd63e2ed) Thanks [@edwardloopez](https://github.com/edwardloopez)! - Comprehensive documentation improvements and code cleanup:

  **Documentation Enhancements:**
  - Added detailed Auto-Scroll Features section with ScrollView/FlatList integration examples
  - Documented all lifecycle hooks (onBeforeEnter, onBeforeScroll, onEnter, onExit) with use cases
  - Complete theme customization reference including all properties and easing functions
  - Added ScrollView integration guide with practical examples
  - Added 3 comprehensive real-world examples (auto-scroll, conditional steps, custom theme)
  - Updated features list to highlight auto-scroll and lifecycle hooks

  **Code Improvements:**
  - Added `TooltipPosition` type for better type safety in placement utilities
  - Removed web-specific code from accessibility utils (iOS/Android only)
  - Cleaned up all `@ts-ignore` comments and Platform.OS checks for web
  - Simplified accessibility functions to focus on native platforms

  **Configuration:**
  - Fixed changeset config to remove non-existent monorepo package reference

## 0.4.2

### Patch Changes

- [#5](https://github.com/edwardloopez/react-native-coachmark/pull/5) [`873d562`](https://github.com/edwardloopez/react-native-coachmark/commit/873d562171de5bf93463d96f2346c94676949f62) Thanks [@edwardloopez](https://github.com/edwardloopez)! - Improve test coverage to 99% - added comprehensive tests for useCoachmark hook and CoachmarkAnchor component

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
