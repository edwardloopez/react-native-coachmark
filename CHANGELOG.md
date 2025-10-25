# @edwardloopez/react-native-coachmark

## 0.4.5

### Patch Changes

- [`5b8eb21`](https://github.com/edwardloopez/react-native-coachmark/commit/5b8eb2145dfbbdb339aaa229df82073535687c2a) Thanks [@edwardloopez](https://github.com/edwardloopez)! - Fix broken npm package by removing path aliases from source code.

  **Breaking Issue Fixed:**
  - Version 0.4.4 was broken due to unresolved path aliases (`@core`, `@ui`, `@utils`, etc.) in the published package
  - Metro bundler couldn't resolve these aliases in consuming projects, causing "Unable to resolve module" errors

  **Changes:**
  - Replaced all path alias imports with relative imports throughout the codebase
  - Removed `babel-plugin-module-resolver` and `eslint-import-resolver-babel-module` dependencies
  - Cleaned up path alias configuration from `tsconfig.json`, `babel.config.js`, and `eslint.config.mjs`
  - Verified compiled output (`lib/`) now contains only relative imports

  **Impact:**
  - Package now works correctly in all React Native projects (Expo, bare workflow, Snack)
  - No breaking changes for consumers - the public API remains identical
  - Source code maintainability: Uses standard relative imports (industry best practice for published libraries)

## 0.4.4

### Patch Changes

- [#9](https://github.com/edwardloopez/react-native-coachmark/pull/9) [`e7cc340`](https://github.com/edwardloopez/react-native-coachmark/commit/e7cc34008b9cb20d69eff35b1e3c3cf096f8ff10) Thanks [@edwardloopez](https://github.com/edwardloopez)! - ## Documentation and Configuration Improvements
  - **Documentation**: Reorganized README into modular structure with dedicated docs folder (ADVANCED_USAGE.md, EXAMPLES.md, ACCESSIBILITY.md, BEST_PRACTICES.md)
  - **API Reference**: Converted props and options to table format for better readability
  - **Web Support**: Fixed `findNodeHandle` and ScrollView compatibility issues on web platform
  - **Import Organization**: Added ESLint import ordering with React/React Native prioritization
  - **Path Aliases**: Configured TypeScript and Babel path aliases (@core, @ui, @utils, @anchors) for cleaner imports
  - **Build Configuration**: Added `cardStyle: { flex: 1 }` to Stack Navigator for proper web layout
  - **Git Hooks**: Enhanced lefthook to auto-fix ESLint issues on pre-commit

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
