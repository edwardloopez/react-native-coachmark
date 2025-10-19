# @edwardloopez/react-native-coachmark

Beautiful, performant Coach Mark library for React Native with smooth animations, customizable tooltips, and TypeScript support. Create engaging product tours and onboarding experiences.

[![npm version](https://img.shields.io/npm/v/@edwardloopez/react-native-coachmark.svg)](https://www.npmjs.com/package/@edwardloopez/react-native-coachmark)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<p align="center">
  <video src="./docs/demo.mov" alt="Demo" width="300" autoplay loop muted style="border-radius: 16px;" />
</p>

## ✨ Features

- 🎨 **Multiple shapes** - Circle, rounded rectangle, and pill shapes
- 📱 **Smart positioning** - Auto-placement with boundary detection
- ♿️ **Accessible** - Screen reader support and reduced motion
- 💾 **Show once** - Built-in persistence (never annoy users twice)
- 🎭 **Themeable** - Light/dark modes and custom styling
- 🔧 **Custom tooltips** - Full control with render props
- ⚡️ **Performant** - No screenshots, pure vector masking
- 📦 **TypeScript** - Full type safety included
- 🌐 **Cross-platform** - iOS, Android, and Web

## 📦 Installation

```bash
npm install @edwardloopez/react-native-coachmark react-native-svg react-native-reanimated
```

### Required Dependencies

This library depends on:
- **react-native-svg** (≥13.0.0) - For vector graphics
- **react-native-reanimated** (≥3.0.0) - For smooth animations

> **Note:** Follow the [Reanimated installation guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/) to configure the Babel plugin.

### Optional: Persistence

For "show once" functionality, install one of these:

```bash
# AsyncStorage (most common)
npm install @react-native-async-storage/async-storage

# OR MMKV (faster, recommended)
npm install react-native-mmkv
```

## 🚀 Quick Start

### Step 1: Setup Provider

Wrap your app with the provider and add the overlay:

```tsx
import { CoachmarkProvider, CoachmarkOverlay } from '@edwardloopez/react-native-coachmark';

export default function App() {
  return (
    <CoachmarkProvider>
      <YourApp />
      <CoachmarkOverlay />
    </CoachmarkProvider>
  );
}
```

### Step 2: Mark UI Elements

Wrap elements you want to highlight:

```tsx
import { CoachmarkAnchor } from '@edwardloopez/react-native-coachmark';

<CoachmarkAnchor id="create-button" shape="circle">
  <Button title="Create" onPress={handleCreate} />
</CoachmarkAnchor>

<CoachmarkAnchor id="filters" shape="rect">
  <View style={styles.filters}>
    <Text>Filters</Text>
  </View>
</CoachmarkAnchor>
```

### Step 3: Create and Start Tour

```tsx
import { useCoachmark, createTour } from '@edwardloopez/react-native-coachmark';

function HomeScreen() {
  const { start } = useCoachmark();

  const startTour = () => {
    start(
      createTour('onboarding', [
        {
          id: 'create-button',
          title: 'Create New Item',
          description: 'Tap here to add a new item',
          placement: 'bottom',
        },
        {
          id: 'filters',
          title: 'Filter Results',
          description: 'Use these to narrow your search',
          placement: 'top',
        },
      ], {
        showOnce: true,  // Show only once per user
        delay: 500,      // Wait 500ms before starting
      })
    );
  };

  return <Button title="Start Tour" onPress={startTour} />;
}
```

## 📚 Documentation

- [Quick Start](#-quick-start)
- [API Reference](#-api-reference)
- [Advanced Usage](#-advanced-usage)
- [Examples](#-examples)
- [Contributing](#-contributing)

## 📖 API Reference

### Core Components

#### `<CoachmarkProvider>`
Root provider that manages tour state.

```tsx
<CoachmarkProvider theme={customTheme} storage={storageAdapter}>
  {children}
</CoachmarkProvider>
```

#### `<CoachmarkOverlay>`
Renders the spotlight and tooltip. Add once at app root.

#### `<CoachmarkAnchor>`
Marks elements for highlighting.

```tsx
<CoachmarkAnchor
  id="button-id"
  shape="circle"    // 'circle' | 'rect' | 'pill'
  padding={12}      // Space around element
  radius={8}        // Corner radius for rect/pill
>
  {children}
</CoachmarkAnchor>
```

### Hook

#### `useCoachmark()`
Control tours programmatically.

```tsx
const { start, next, back, skip, stop, state } = useCoachmark();

// Start a tour
start(tour);

// Navigate
next();   // Next step
back();   // Previous step
skip();   // End tour

// Check state
state.isActive   // Is tour running?
state.index      // Current step (0-based)
```

### Functions

#### `createTour(key, steps, options)`
Create a tour configuration.

```tsx
const tour = createTour(
  'my-tour',                    // Unique identifier
  [
    {
      id: 'anchor-id',          // Anchor to highlight
      title: 'Title',           // Tooltip title
      description: 'Info',      // Tooltip description
      placement: 'bottom',      // Tooltip position
      shape: 'circle',          // Spotlight shape
    },
  ],
  {
    showOnce: true,             // Show only once
    delay: 500,                 // Start delay (ms)
  }
);
```

**Step Options:**
- `id` (required) - Anchor ID to highlight
- `title` - Tooltip title text
- `description` - Tooltip description text
- `placement` - `'top' | 'bottom' | 'left' | 'right' | 'auto'`
- `shape` - `'circle' | 'rect' | 'pill'`
- `padding` - Space around highlight
- `radius` - Corner radius for rect/pill
- `onEnter` - Callback when step starts
- `onExit` - Callback when step ends
- `renderTooltip` - Custom tooltip component

**Tour Options:**
- `showOnce` - Show tour only once (requires storage)
- `delay` - Delay before tour starts (milliseconds)
- `renderTooltip` - Global custom tooltip renderer

## 🔧 Advanced Usage

### Persistent Storage

Enable "show once" functionality with storage:

```tsx
import { CoachmarkProvider, asyncStorage } from '@edwardloopez/react-native-coachmark';
import AsyncStorage from '@react-native-async-storage/async-storage';

<CoachmarkProvider storage={asyncStorage(AsyncStorage)}>
  {children}
</CoachmarkProvider>
```

Or use MMKV for better performance:

```tsx
import { mmkvStorage } from '@edwardloopez/react-native-coachmark';
import { MMKV } from 'react-native-mmkv';

<CoachmarkProvider storage={mmkvStorage(new MMKV())}>
  {children}
</CoachmarkProvider>
```

### Custom Theme

Customize colors and animations:

```tsx
<CoachmarkProvider
  theme={{
    backdropColor: '#000',
    backdropOpacity: 0.7,
    tooltip: {
      bg: '#1a1a1a',
      fg: '#ffffff',
      buttonPrimaryBg: '#007AFF',
    },
    motion: {
      durationMs: 300,
    },
  }}
>
  {children}
</CoachmarkProvider>
```

### Custom Tooltips

Build your own tooltip UI:

```tsx
import type { TooltipRenderProps } from '@edwardloopez/react-native-coachmark';

function CustomTooltip({ title, description, isLast, onNext, onSkip }: TooltipRenderProps) {
  return (
    <View style={styles.tooltip}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.buttons}>
        <Button title="Skip" onPress={onSkip} />
        <Button title={isLast ? 'Done' : 'Next'} onPress={onNext} />
      </View>
    </View>
  );
}

// Use globally
const tour = createTour('my-tour', steps, {
  renderTooltip: CustomTooltip,
});

// Or per step
const steps = [
  {
    id: 'special-step',
    renderTooltip: CustomTooltip,
  },
];
```

### Lifecycle Hooks

Track analytics and control flow:

```tsx
const tour = createTour('analytics-tour', [
  {
    id: 'step-1',
    onEnter: () => {
      analytics.track('tour_step_viewed', { step: 1 });
    },
  },
  {
    id: 'step-2',
    onBeforeEnter: async () => {
      // Skip if condition not met
      return await shouldShowStep();
    },
  },
]);
```

### Accessibility

Built-in accessibility features:
- ✅ Screen reader announcements
- ✅ Reduced motion support
- ✅ Focus management
- ✅ Descriptive labels

## 💡 Examples

Run the example app to see all features in action:

```bash
git clone https://github.com/edwardloopez/react-native-coachmark.git
cd react-native-coachmark
pnpm install
pnpm example ios    # or android, web
```

## 💪 Best Practices

- Keep tours **short** (3-5 steps max)
- Use `showOnce` to avoid repetition
- Add delays for screen transitions
- Prefer MMKV over AsyncStorage for performance
- Memoize custom tooltips with `React.memo()`

## 🗺️ Roadmap

- [ ] Multiple spotlights per step
- [ ] Arrow indicators
- [ ] Cross-screen tours
- [ ] Animation presets
- [ ] Video/GIF support
- [ ] Swipe gestures
- [ ] Progress bar customization

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT © [Edward A Lopez Mojica](https://github.com/edwardloopez)

## 🔗 Links

- [npm Package](https://www.npmjs.com/package/@edwardloopez/react-native-coachmark)
- [GitHub Repository](https://github.com/edwardloopez/react-native-coachmark)
- [Issues](https://github.com/edwardloopez/react-native-coachmark/issues)

---

**Made with ❤️ for the React Native community**
