# react-native-coachmark

A beautiful, performant, and accessible **Coach Mark / Spotlight / Onboarding Tour** library for React Native. Create engaging product tours with smooth animations, smart positioning, and full customization support.

[![npm version](https://img.shields.io/npm/v/edwardloopez/react-native-coachmark.svg)](https://www.npmjs.com/package/react-native-coachmark)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<p align="center">
  <img src="./docs/demo.gif" alt="Demo" width="300" />
</p>

## Features

- **Single spotlight** with smooth animated transitions between steps
- **Multiple shapes**: circle, rounded-rect, pill
- **Even-odd vector masking** using `react-native-svg` (performant, no screenshots)
- **Smart tooltip placement** with auto-positioning and screen boundary detection
- **Gesture handling** - tap to advance, skip, or go back
- **Accessibility** - screen-reader announcements, focus management, reduced motion
- **Persistence** - "show once" functionality via pluggable storage
- **Theming** - light/dark/custom palette support
- **Custom Tooltips** - Render your own tooltip components with render props
- **Tour Delay** - Optional delay before tour starts
- **Declarative Tours** - JSON/DSL + imperative API
- **Lifecycle Hooks** - `onBeforeEnter`, `onEnter`, `onExit` callbacks
- **Analytics Plugins** - Track tour interactions
- **Cross-platform** - iOS, Android, and Web (React Native Web)

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
      ], {
        showOnce: true, // Only show once
        delay: 500,     // Wait 500ms before starting
      })
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

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [Components](#components)
  - [Hooks](#hooks)
  - [Functions](#functions)
  - [Types](#types)
- [Advanced Usage](#advanced-usage)
  - [Custom Storage](#custom-storage-persistence)
  - [Custom Theme](#custom-theme)
  - [Custom Tooltips](#custom-tooltips)
  - [Tour Delay](#tour-delay)
  - [Lifecycle Hooks](#lifecycle-hooks)
  - [Accessibility](#accessibility)
- [Contributing](#contributing)
- [License](#license)

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

Returns tour control methods and state.

```tsx
const {
  start,        // (tour: Tour) => void - Start a tour
  next,         // () => void - Go to next step
  back,         // () => void - Go to previous step
  skip,         // () => void - Skip the tour
  stop,         // (reason: 'completed' | 'skipped') => void - Stop the tour
  state,        // CoachmarkState - Current state
} = useCoachmark();
```

**Properties:**
- `start(tour)` - Start a tour
- `next()` - Advance to the next step
- `back()` - Go back to the previous step
- `skip()` - Skip and end the tour
- `stop(reason)` - Stop the tour with a reason ('completed' or 'skipped')
- `state.isActive` - Boolean indicating if a tour is currently active
- `state.activeTour` - The currently active tour (or null)
- `state.index` - Current step index (0-based)
- `state.measured` - Record of measured anchor positions

### Functions

#### `createTour()`

Creates a tour configuration.

```tsx
const tour = createTour(
  'tour-key',          // Unique tour identifier
  [                    // Array of tour steps
    {
      id: 'anchor-id',           // ID of the CoachmarkAnchor
      title: 'Step Title',       // Optional title
      description: 'Description', // Optional description
      shape: 'circle',           // 'circle' | 'rect' | 'pill'
      placement: 'bottom',       // 'top' | 'bottom' | 'left' | 'right' | 'auto'
      padding: 12,               // Spacing around the spotlight
      radius: 12,                // Corner radius for 'rect' shape
      renderTooltip: (props) => <CustomTooltip {...props} />, // Custom tooltip renderer
      onBeforeEnter: async () => {
        // Optional: return false to skip this step
        // Useful for conditional steps
        return true;
      },
      onEnter: () => {
        // Called when step becomes active
        console.log('Step entered');
      },
      onExit: () => {
        // Called when leaving this step
        console.log('Step exited');
      },
    },
  ],
  {
    showOnce: true,    // Only show this tour once (persisted)
    delay: 1000,       // Wait 1000ms before starting the tour
    renderTooltip: (props) => <GlobalCustomTooltip {...props} />, // Global custom renderer
  }
);
```

**Tour Options:**
- `showOnce?: boolean` - If true, tour will only be shown once per user
- `delay?: number` - Milliseconds to wait before starting the tour
- `renderTooltip?: TooltipRenderer` - Global custom tooltip renderer (can be overridden per step)

### Types

#### `TourStep`

```tsx
type TourStep = {
  id: string;                                    // Required: Anchor ID
  title?: string;                                // Tooltip title
  description?: string;                          // Tooltip description
  shape?: 'circle' | 'rect' | 'pill';           // Spotlight shape
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto'; // Tooltip position
  padding?: number;                              // Spotlight padding
  radius?: number;                               // Corner radius for rect/pill
  renderTooltip?: (props: TooltipRenderProps) => React.ReactElement; // Custom renderer
  onBeforeEnter?: () => Promise<boolean | void>; // Pre-step hook
  onEnter?: () => void;                          // Step enter hook
  onExit?: () => void;                           // Step exit hook
};
```

#### `TooltipRenderProps`

Props passed to custom tooltip renderers:

```tsx
type TooltipRenderProps = {
  theme: CoachmarkTheme;    // Current theme
  title?: string;           // Step title
  description?: string;     // Step description
  index: number;            // Current step index (0-based)
  count: number;            // Total number of steps
  isFirst: boolean;         // Is this the first step?
  isLast: boolean;          // Is this the last step?
  onNext: () => void;       // Advance to next step
  onBack: () => void;       // Go back to previous step
  onSkip: () => void;       // Skip the tour
  currentStep: TourStep;    // Current step configuration
};
```

#### `CoachmarkTheme`

```tsx
type CoachmarkTheme = {
  backdropColor: string;           // Backdrop color
  backdropOpacity: number;         // Backdrop opacity (0-1)
  holeShadowOpacity: number;       // Shadow around spotlight
  tooltip: {
    maxWidth: number;              // Max tooltip width
    radius: number;                // Tooltip corner radius
    bg: string;                    // Background color
    fg: string;                    // Foreground/text color
    arrowSize: number;             // Arrow indicator size
    padding: number;               // Internal padding
    buttonPrimaryBg: string;       // Primary button color
    buttonSecondaryBg: string;     // Secondary button color
  };
  motion: {
    durationMs: number;            // Animation duration
    easing: (t: number) => number; // Easing function
  };
};
```

## Advanced Usage

### Custom Storage (Persistence)

By default, tours use in-memory storage. For persistent "show once" functionality, use AsyncStorage or MMKV:

**AsyncStorage:**

```tsx
import { CoachmarkProvider, asyncStorage } from 'react-native-coachmark';
import AsyncStorage from '@react-native-async-storage/async-storage';

<CoachmarkProvider storage={asyncStorage(AsyncStorage)}>
  {children}
</CoachmarkProvider>
```

**MMKV (faster):**

```tsx
import { CoachmarkProvider, mmkvStorage } from 'react-native-coachmark';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

<CoachmarkProvider storage={mmkvStorage(storage)}>
  {children}
</CoachmarkProvider>
```

**Custom Storage Adapter:**

Implement your own storage:

```tsx
const customStorage = {
  get: async (key: string) => {
    // Return stored value or null
    return await myDatabase.get(key);
  },
  set: async (key: string, value: string) => {
    // Store the value
    await myDatabase.set(key, value);
  },
};

<CoachmarkProvider storage={customStorage}>
  {children}
</CoachmarkProvider>
```

### Custom Theme

Customize the look and feel:

```tsx
<CoachmarkProvider
  theme={{
    backdropColor: '#000000',
    backdropOpacity: 0.7,
    holeShadowOpacity: 0.3,
    tooltip: {
      maxWidth: 320,
      radius: 16,
      bg: '#1a1a1a',
      fg: '#ffffff',
      arrowSize: 8,
      padding: 16,
      buttonPrimaryBg: '#007AFF',
      buttonSecondaryBg: '#666666',
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

### Custom Tooltips

Create fully custom tooltip components using render props:

```tsx
import type { TooltipRenderProps } from 'react-native-coachmark';

function MyCustomTooltip(props: TooltipRenderProps) {
  const { title, description, index, count, isLast, onNext, onSkip } = props;

  return (
    <View style={{ padding: 20, backgroundColor: '#fff', borderRadius: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{title}</Text>
      <Text style={{ marginTop: 8 }}>{description}</Text>

      <View style={{ flexDirection: 'row', marginTop: 16, gap: 8 }}>
        <Button title="Skip" onPress={onSkip} />
        <Button
          title={isLast ? 'Done' : 'Next'}
          onPress={onNext}
        />
      </View>

      <Text style={{ marginTop: 8, textAlign: 'center' }}>
        {index + 1} / {count}
      </Text>
    </View>
  );
}

// Use in a tour:
const tour = createTour('my-tour', steps, {
  renderTooltip: MyCustomTooltip, // Apply to all steps
});

// Or per step:
const steps = [
  {
    id: 'step-1',
    title: 'Custom Step',
    renderTooltip: MyCustomTooltip, // Apply to this step only
  },
];
```

### Tour Delay

Add a delay before the tour starts (useful for transitions):

```tsx
const tour = createTour('delayed-tour', steps, {
  delay: 1000, // Wait 1 second before starting
  showOnce: true,
});
```

The delay is applied **after** the `showOnce` check, so already-seen tours exit immediately without waiting.

### Lifecycle Hooks

Use lifecycle hooks to control tour flow:

```tsx
const tour = createTour('conditional-tour', [
  {
    id: 'step-1',
    title: 'Step 1',
    onEnter: () => {
      // Track analytics
      analytics.track('tour_step_viewed', { step: 'step-1' });
    },
    onExit: () => {
      console.log('Leaving step 1');
    },
  },
  {
    id: 'step-2',
    title: 'Conditional Step',
    onBeforeEnter: async () => {
      // Skip this step if condition not met
      const shouldShow = await checkSomeCondition();
      if (!shouldShow) {
        return false; // Skip this step
      }
      return true; // Show this step
    },
  },
]);
```

### Accessibility

The library includes built-in accessibility features:

- **Screen Reader Announcements**: Each step is announced with `AccessibilityInfo.announceForAccessibility()`
- **Focus Management**: Automatically focuses the tooltip when steps change
- **Reduced Motion**: Respects system reduce motion settings
- **Accessible Labels**: All buttons have descriptive labels and hints
- **Live Region**: Tooltip uses `accessibilityLiveRegion="polite"` for announcements

**Checking Reduce Motion:**

```tsx
import { isReduceMotionEnabled } from 'react-native-coachmark';

const reduceMotion = await isReduceMotionEnabled();
if (reduceMotion) {
  // Disable or simplify animations
}
```

### Running the Example

```bash
git clone https://github.com/edwardloopez/react-native-coachmark.git
cd react-native-coachmark
pnpm install
pnpm example start
```

Then run on your desired platform:
- `pnpm example ios`
- `pnpm example android`
- `pnpm example web`

## Performance Tips

1. **Use `showOnce`** to avoid showing tours repeatedly
2. **Limit tour length** - 3-5 steps is optimal for user retention
3. **Add delays for transitions** - Allow screen animations to complete
4. **Memoize custom tooltips** - Use `React.memo()` for complex custom components
5. **Prefer MMKV over AsyncStorage** - Faster synchronous storage

## Roadmap

- [ ] Multiple holes per step (highlight multiple elements simultaneously)
- [ ] Arrow indicators pointing from tooltip to target
- [ ] Cross-screen tour support with lazy anchor resolution
- [ ] Animation presets (spring, bounce, slide)
- [ ] Video/GIF support in tooltips
- [ ] Swipe gestures for navigation
- [ ] Progress bar customization
- [ ] Confetti/celebration effects on completion

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development workflow.

## License

MIT © [Edward A Lopez Mojica](https://github.com/edwardloopez)

---
