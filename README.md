<h1 align="center">React Native Coachmark</h1>

<p align="center">
  Beautiful, performant Coach Mark library for React Native with smooth animations, customizable tooltips, and TypeScript support. Create engaging product tours and onboarding experiences.
</p>

<p align="center">
  <a href="https://github.com/edwardloopez/react-native-coachmark/actions/workflows/ci.yml"><img src="https://github.com/edwardloopez/react-native-coachmark/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://www.npmjs.com/package/@edwardloopez/react-native-coachmark"><img src="https://img.shields.io/npm/v/@edwardloopez/react-native-coachmark.svg" alt="npm version" /></a>
  <a href="https://bundlephobia.com/package/@edwardloopez/react-native-coachmark"><img src="https://img.shields.io/bundlephobia/minzip/@edwardloopez/react-native-coachmark" alt="Bundle Size" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" /></a>
</p>

<p align="center">
  <img src=".github/assets/demo.gif" alt="React Native Coachmark Demo" width="300" style="border-radius: 16px;" />
</p>

## ✨ Features

- 🎨 **Multiple shapes** - Circle, rounded rectangle, and pill shapes
- 📱 **Smart positioning** - Auto-placement with boundary detection
- 🔄 **Auto-scroll** - Automatically scroll to off-screen elements
- ♿️ **Accessible** - Screen reader support and reduced motion
- 💾 **Show once** - Built-in persistence (never annoy users twice)
- 🎭 **Themeable** - Light/dark modes and custom styling
- 🔧 **Custom tooltips** - Full control with render props
- 🎯 **Lifecycle hooks** - onEnter, onExit, onBeforeEnter, onBeforeScroll
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
  id="button-id"     // Required: Unique identifier
  shape="circle"     // 'circle' | 'rect' | 'pill'
  padding={12}       // Space around element (pixels)
  radius={8}         // Corner radius for rect/pill
  scrollRef={scrollViewRef}  // For auto-scroll feature
>
  {children}
</CoachmarkAnchor>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `id` | string (required) | Unique identifier for this anchor |
| `shape` | `'circle' \| 'rect' \| 'pill'` | Spotlight shape (overrides step config) |
| `padding` | number | Extra space around element (pixels) |
| `radius` | number | Corner radius for rounded shapes (pixels) |
| `scrollRef` | React.Ref | Ref to parent ScrollView/FlatList (required for `autoFocus`) |

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

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `id` | string | required | Anchor ID to highlight |
| `title` | string | - | Tooltip title text |
| `description` | string | - | Tooltip description text |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'auto'` | `'auto'` | Tooltip position |
| `shape` | `'circle' \| 'rect' \| 'pill'` | - | Spotlight shape |
| `padding` | number | - | Space around highlight (pixels) |
| `radius` | number | - | Corner radius for rect/pill shapes (pixels) |
| `autoFocus` | `'always' \| 'ifNeeded'` | - | Auto-scroll behavior |
| `scrollBehavior` | `'smooth' \| 'instant'` | - | Scroll animation |
| `scrollPadding` | number | 20 | Space from screen edges when scrolling (pixels) |
| `scrollDelay` | number | 150 | Delay after scroll before showing tooltip (ms) |
| `onBeforeEnter` | async function | - | Callback before step starts (return `false` to skip) |
| `onBeforeScroll` | async function | - | Callback before auto-scrolling starts |
| `onEnter` | function | - | Callback when step becomes active |
| `onExit` | function | - | Callback when leaving step |
| `renderTooltip` | React.ComponentType | - | Custom tooltip component for this step |

**Tour Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `showOnce` | boolean | false | Show tour only once (requires storage) |
| `delay` | number | 0 | Delay before tour starts (milliseconds) |
| `renderTooltip` | React.ComponentType | - | Global custom tooltip renderer for all steps |

## 📚 Next Steps

Explore advanced features and best practices:

### Learn More
- 🔧 **[Advanced Usage](./docs/ADVANCED_USAGE.md)** - Auto-scroll, lifecycle hooks, custom themes, plugins
- 💡 **[Examples](./docs/EXAMPLES.md)** - Real-world use cases and complete code samples
- ♿️ **[Accessibility](./docs/ACCESSIBILITY.md)** - Make tours inclusive for all users
- ✅ **[Best Practices](./docs/BEST_PRACTICES.md)** - Design, performance, and testing guidelines

### Resources
- 🔗 [NPM Package](https://www.npmjs.com/package/@edwardloopez/react-native-coachmark)
- 🐛 [Report Issues](https://github.com/edwardloopez/react-native-coachmark/issues)
- 💬 [Discussions](https://github.com/edwardloopez/react-native-coachmark/discussions)

---

## 🌟 Showcase

Using this library? [Open a PR](https://github.com/edwardloopez/react-native-coachmark/pulls) to add your app here!

<!-- Add your app:
- **[Your App Name](https://yourapp.com)** - Brief description
-->

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Made with ❤️ for the React Native community**
