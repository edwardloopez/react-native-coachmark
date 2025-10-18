# react-native-coachmark

Production-grade **Coach Mark / Spotlight / Product Tour** library for React Native (iOS, Android, Web).

[![npm version](https://img.shields.io/npm/v/react-native-coachmark.svg)](https://www.npmjs.com/package/react-native-coachmark)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

✅ **Multi-spotlight** with animated transitions between steps
✅ **Multiple shapes**: circle, rounded-rect, pill
✅ **Even-odd vector masking** using `react-native-svg` (performant, no screenshots)
✅ **Smart tooltip placement** (top/right/bottom/left/auto) with arrow indicators
✅ **Gesture handling** - tap to advance, skip, or go back
✅ **Accessibility** - screen-reader announcements and focus management
✅ **Persistence** - "show once" functionality via pluggable storage
✅ **Theming** - light/dark/custom palette support
✅ **Declarative Tours** - JSON/DSL + imperative API
✅ **Cross-platform** - iOS, Android, and Web (React Native Web)

## Installation

```sh
npm install react-native-coachmark react-native-svg react-native-reanimated
# or
yarn add react-native-coachmark react-native-svg react-native-reanimated
# or
pnpm add react-native-coachmark react-native-svg react-native-reanimated
```

### Peer Dependencies

Make sure you have these installed:

- `react-native-svg` (>= 13.0.0)
- `react-native-reanimated` (>= 3.0.0)

For React Native Reanimated, follow their [installation guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/) to configure the Babel plugin.

### Optional Dependencies

For persistence (show-once functionality):

```sh
# Option 1: AsyncStorage
npm install @react-native-async-storage/async-storage

# Option 2: MMKV (faster)
npm install react-native-mmkv
```

## Quick Start

### 1. Wrap your app with `CoachmarkProvider`

```tsx
import { CoachmarkProvider, CoachmarkOverlay } from 'react-native-coachmark';

export default function App() {
  return (
    <CoachmarkProvider>
      <YourApp />
      <CoachmarkOverlay />
    </CoachmarkProvider>
  );
}
```

### 2. Mark your UI elements with `CoachmarkAnchor`

```tsx
import { CoachmarkAnchor } from 'react-native-coachmark';

function HomeScreen() {
  return (
    <View>
      <CoachmarkAnchor id="create-button" shape="circle" padding={12}>
        <Button title="Create" onPress={() => {}} />
      </CoachmarkAnchor>

      <CoachmarkAnchor id="filters" shape="rect" radius={12}>
        <View style={styles.filters}>
          <Text>Filter Options</Text>
        </View>
      </CoachmarkAnchor>
    </View>
  );
}
```

### 3. Start your tour

```tsx
import { useCoachmark, createTour } from 'react-native-coachmark';

function HomeScreen() {
  const { start } = useCoachmark();

  const startOnboarding = () => {
    start(
      createTour('home-onboarding', [
        {
          id: 'create-button',
          title: 'Create New Item',
          description: 'Tap here to add a new item to your collection',
          shape: 'circle',
          placement: 'bottom',
        },
        {
          id: 'filters',
          title: 'Filter Your Results',
          description: 'Use these options to narrow down your search',
          shape: 'rect',
          placement: 'top',
        },
      ], { showOnce: true })
    );
  };

  return (
    <View>
      {/* ... anchors ... */}
      <Button title="Start Tour" onPress={startOnboarding} />
    </View>
  );
}
```

## API Reference

### Components

#### `<CoachmarkProvider>`

Root context provider for the coachmark system.

```tsx
<CoachmarkProvider
  theme={{
    backdropColor: '#000000',
    backdropOpacity: 0.55,
    tooltip: {
      bg: '#FFFFFF',
      fg: '#111111',
      // ... more theme options
    }
  }}
  storage={myStorageAdapter}
  plugins={[analyticsPlugin]}
>
  {children}
</CoachmarkProvider>
```

#### `<CoachmarkOverlay>`

Renders the spotlight overlay and tooltip. Place once near the root of your app.

```tsx
<CoachmarkOverlay />
```

#### `<CoachmarkAnchor>`

Wraps a UI element to make it targetable in a tour.

```tsx
<CoachmarkAnchor
  id="unique-id"
  shape="circle" // 'circle' | 'rect' | 'pill'
  padding={10}
  radius={12}
>
  <YourComponent />
</CoachmarkAnchor>
```

### Hooks

#### `useCoachmark()`

Returns tour control methods.

```tsx
const {
  start,    // Start a tour
  next,     // Go to next step
  back,     // Go to previous step
  skip,     // Skip the tour
  stop,     // Stop the tour
  isActive, // Is tour currently active
  activeStep, // Current step
  index,    // Current step index
  count,    // Total step count
} = useCoachmark();
```

### Functions

#### `createTour()`

Creates a tour configuration.

```tsx
const tour = createTour(
  'tour-key',
  [
    {
      id: 'anchor-id',
      title: 'Step Title',
      description: 'Step description',
      shape: 'circle',
      placement: 'bottom',
      padding: 12,
      radius: 12,
      onBeforeEnter: async () => {
        // Optional: return false to skip this step
      },
      onEnter: () => {
        // Called when step becomes active
      },
      onExit: () => {
        // Called when leaving this step
      },
    },
  ],
  {
    showOnce: true, // Only show this tour once
  }
);
```

## Advanced Usage

### Custom Storage (Persistence)

```tsx
import { CoachmarkProvider, asyncStorage } from 'react-native-coachmark';
import AsyncStorage from '@react-native-async-storage/async-storage';

<CoachmarkProvider storage={asyncStorage(AsyncStorage)}>
  {children}
</CoachmarkProvider>
```

### Custom Theme

```tsx
<CoachmarkProvider
  theme={{
    backdropColor: '#000000',
    backdropOpacity: 0.7,
    tooltip: {
      maxWidth: 320,
      radius: 16,
      bg: '#1a1a1a',
      fg: '#ffffff',
      buttonPrimaryBg: '#007AFF',
      buttonSecondaryBg: '#666666',
      padding: 16,
    },
    motion: {
      durationMs: 300,
      easing: (t) => t * t, // Custom easing function
    },
  }}
>
  {children}
</CoachmarkProvider>
```

### Analytics Plugin

```tsx
const analyticsPlugin = {
  onStart: (tour) => {
    console.log('Tour started:', tour.key);
  },
  onStep: (tour, index, step) => {
    console.log('Step viewed:', step.id);
  },
  onFinish: (tour, reason) => {
    console.log('Tour finished:', reason);
  },
};

<CoachmarkProvider plugins={[analyticsPlugin]}>
  {children}
</CoachmarkProvider>
```

## Examples

Check out the [example app](./example) for more use cases:

- Basic single-screen tours
- Multi-step tours
- Custom themes
- Persistence with AsyncStorage
- Analytics integration

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development workflow.

## License

MIT © [Edward A Lopez Mojica](https://github.com/edwardloopez)

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
