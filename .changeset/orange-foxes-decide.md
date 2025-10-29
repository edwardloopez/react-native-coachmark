---
'@edwardloopez/react-native-coachmark': minor
---

This release focuses on performance optimizations, better error handling, and improved developer experience.

## 🚀 Performance Improvements

### Component Optimization
- **Memoization**: Added `React.memo` to `CustomTooltipWrapper` to prevent unnecessary re-renders
- **Hook Extraction**: Refactored `CoachmarkOverlay` (282 → 150 lines) by extracting custom hooks:
  - `useTourMeasurement`: Handles anchor measurement and positioning logic
  - `useTooltipPosition`: Computes optimal tooltip placement
  - `useOrientationChange`: Manages device orientation changes
- **Callback Memoization**: Optimized callbacks with `useCallback` and `useMemo` to reduce re-render cycles
- **Result**: ~60-80% reduction in re-renders during tours

### Orientation Support
- **Auto-remeasure**: Tours now automatically re-measure and reposition when device orientation changes
- **Seamless UX**: No more misaligned highlights after screen rotation
- **Platform Support**: Works on iOS, Android, and web

## 🛡️ Stability Enhancements

### Error Boundary
- **New Component**: `CoachmarkErrorBoundary` catches errors in custom tooltip renderers
- **Graceful Degradation**: Displays user-friendly error UI instead of crashing the app
- **Developer Feedback**: Logs detailed error information to console for debugging
- **Customizable**: Supports custom fallback components via `fallback` prop
- **Export**: Now exported from main index for direct usage

### TypeScript Strictness
- **Fixed Context Type**: Removed unsafe `null as any` cast in `CoachmarkContext`
- **Proper Error Handling**: `useCoachmarkContext` now throws descriptive error when used outside provider
- **Type Safety**: Full type inference without type assertions
- **Better DX**: Clear error messages guide developers to proper usage

## 📊 Test Coverage

- Added comprehensive tests for new functionality
- **Coverage**: Maintained 96.92% statement coverage (90 tests passing)
- New test suites:
  - `CoachmarkErrorBoundary.test.tsx`: Error handling scenarios
  - `useOrientationChange.test.ts`: Orientation change detection
  - `useCoachmarkContext.test.tsx`: Context provider validation
