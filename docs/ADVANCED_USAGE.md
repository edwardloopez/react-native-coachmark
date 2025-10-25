# Advanced Usage

Learn about powerful features like auto-scroll, lifecycle hooks, custom themes, and plugins.

## Table of Contents

- [Auto-Scroll to Off-Screen Elements](#auto-scroll-to-off-screen-elements)
- [Lifecycle Hooks](#lifecycle-hooks)
- [Custom Theme](#custom-theme)
- [Custom Tooltips](#custom-tooltips)
- [Plugins & Analytics](#plugins--analytics)

## Auto-Scroll to Off-Screen Elements

Automatically scroll to coachmark anchors that are outside the viewport. Perfect for long lists and scrollable content!

### Basic Setup

Link your `ScrollView` or `FlatList` to the anchor:

```tsx
import { useRef } from 'react';
import { ScrollView } from 'react-native';
import { CoachmarkAnchor } from '@edwardloopez/react-native-coachmark';

function MyScreen() {
  const scrollRef = useRef<ScrollView>(null);

  return (
    <ScrollView ref={scrollRef}>
      <CoachmarkAnchor id="item-1" scrollRef={scrollRef}>
        <View>Item 1</View>
      </CoachmarkAnchor>

      {/* ... lots of content ... */}

      <CoachmarkAnchor id="item-100" scrollRef={scrollRef}>
        <View>Item 100 (will scroll into view automatically)</View>
      </CoachmarkAnchor>
    </ScrollView>
  );
}
```

### Auto-Focus Configuration

Control when and how scrolling happens:

```tsx
const tour = createTour('scroll-tour', [
  {
    id: 'hidden-item',
    title: 'Hidden Item',
    description: 'This will scroll into view',

    // When to scroll
    autoFocus: 'ifNeeded',      // Scroll only if off-screen (recommended)
    // autoFocus: 'always',      // Always scroll, even if visible
    // undefined (no auto-scroll)

    // How to scroll
    scrollBehavior: 'smooth',   // Animated scroll (default)
    // scrollBehavior: 'instant', // Jump immediately

    // Fine-tuning
    scrollPadding: 50,          // Space from screen edges (default: 20)
    scrollDelay: 200,           // Wait after scroll before showing tooltip

    // Hook before scrolling
    onBeforeScroll: async () => {
      console.log('About to scroll');
      // Collapse sections, prepare UI, etc.
    },
  },
]);
```

**Auto-Focus Modes:**
- `'ifNeeded'` - Scroll only if element is outside viewport (best for UX)
- `'always'` - Always scroll to element, even if visible
- `undefined` - No auto-scrolling (default)

**Scroll Behavior:**
- `'smooth'` - Animated scrolling with easing (~300ms)
- `'instant'` - Immediate jump (~50ms)

### FlatList Example

```tsx
import { FlatList } from 'react-native';

function MyList() {
  const listRef = useRef<FlatList>(null);

  return (
    <FlatList
      ref={listRef}
      data={items}
      renderItem={({ item }) => (
        <CoachmarkAnchor
          id={`item-${item.id}`}
          scrollRef={listRef}
        >
          <ItemComponent item={item} />
        </CoachmarkAnchor>
      )}
      keyExtractor={(item) => item.id}
    />
  );
}
```

> **⚠️ Important:** Without `scrollRef`, the `autoFocus` feature won't work!

## Lifecycle Hooks

Control tour flow and add custom logic at different stages.

### Available Hooks

| Hook | When It Fires | Use Cases | Can Skip? |
|------|---------------|-----------|-----------|
| `onBeforeEnter` | Before step activates | Validate conditions, check permissions | ✅ Yes |
| `onBeforeScroll` | Before auto-scrolling | Collapse sections, close modals | ❌ No |
| `onEnter` | After step activates | Analytics, highlight elements | ❌ No |
| `onExit` | When leaving step | Cleanup, log duration | ❌ No |

### onBeforeEnter - Conditional Steps

**Skip a step by returning `false`:**

```tsx
const tour = createTour('conditional-tour', [
  {
    id: 'premium-feature',
    title: 'Premium Only',

    onBeforeEnter: async () => {
      // Check if user has permission
      const isPremium = await checkUserStatus();
      if (!isPremium) {
        return false;  // Skip this step
      }
      // Return true (or nothing) to continue
    },
  },
]);
```

### onEnter - Analytics & Highlighting

```tsx
const tour = createTour('analytics-tour', [
  {
    id: 'important-feature',
    title: 'Check This Out',

    onEnter: async () => {
      // Track analytics
      analytics.track('tour_step_viewed', {
        tourKey: 'analytics-tour',
        stepId: 'important-feature',
      });

      // Highlight or prepare UI
      await highlightElement('important-feature');
    },
  },
]);
```

### onBeforeScroll - Prepare UI

```tsx
const tour = createTour('scroll-tour', [
  {
    id: 'nested-item',
    autoFocus: 'ifNeeded',

    onBeforeScroll: async () => {
      // Collapse accordion sections
      await collapseAccordions();

      // Close modals
      await dismissModals();

      // Dismiss keyboards
      Keyboard.dismiss();
    },
  },
]);
```

### onExit - Cleanup

```tsx
const tour = createTour('cleanup-tour', [
  {
    id: 'demo-content',
    title: 'Demo Feature',

    onExit: async () => {
      // Save user progress
      await saveProgress({ tourCompleted: true });

      // Remove temporary UI
      await removeDemoContent();

      // Navigate away
      navigation.navigate('Home');
    },
  },
]);
```

## Custom Theme

Customize colors, animations, and styling for your brand.

### Basic Theme

```tsx
<CoachmarkProvider
  theme={{
    // Backdrop
    backdropColor: '#000000',
    backdropOpacity: 0.7,
    holeShadowOpacity: 0.3,

    // Tooltip styling
    tooltip: {
      maxWidth: 320,
      radius: 16,
      bg: '#1a1a1a',
      fg: '#ffffff',
      arrowSize: 10,
      padding: 16,
      buttonPrimaryBg: '#007AFF',
      buttonSecondaryBg: '#666',
    },

    // Animations
    motion: {
      durationMs: 300,
      easing: (t) => t * t,  // Ease-in
    },
  }}
>
  {children}
</CoachmarkProvider>
```

### Easing Functions

The `easing` function controls animation feel. It takes a value 0-1 (progress) and returns 0-1 (transformed progress).

**Linear (constant speed):**
```tsx
easing: (t) => t
```

**Ease-out (recommended - starts fast, slows at end):**
```tsx
easing: (t) => 1 - Math.pow(1 - t, 3)
```

**Ease-in (starts slow, speeds up):**
```tsx
easing: (t) => t * t * t
```

**Ease-in-out (smooth start and end):**
```tsx
easing: (t) => t < 0.5
  ? 4 * t * t * t
  : 1 - Math.pow(-2 * t + 2, 3) / 2
```

**Bounce (playful):**
```tsx
easing: (t) => 1 - Math.cos(t * Math.PI) / 2
```

### Dark/Light Themes

```tsx
const lightTheme = {
  backdropColor: '#ffffff',
  backdropOpacity: 0.7,
  tooltip: {
    bg: '#ffffff',
    fg: '#000000',
    buttonPrimaryBg: '#007AFF',
    buttonSecondaryBg: '#e0e0e0',
  },
  // ...
};

const darkTheme = {
  backdropColor: '#000000',
  backdropOpacity: 0.85,
  tooltip: {
    bg: '#2c3e50',
    fg: '#ffffff',
    buttonPrimaryBg: '#3498db',
    buttonSecondaryBg: '#34495e',
  },
  // ...
};
```

## Custom Tooltips

Build your own tooltip UI with full control:

```tsx
import type { TooltipRenderProps } from '@edwardloopez/react-native-coachmark';

function CustomTooltip({
  theme,
  title,
  description,
  index,
  count,
  isFirst,
  isLast,
  onNext,
  onBack,
  onSkip,
}: TooltipRenderProps) {
  return (
    <View style={{
      backgroundColor: theme.tooltip.bg,
      borderRadius: theme.tooltip.radius,
      padding: theme.tooltip.padding,
    }}>
      <Text style={{ color: theme.tooltip.fg, fontSize: 18, fontWeight: 'bold' }}>
        {title}
      </Text>

      <Text style={{ color: theme.tooltip.fg, marginTop: 8 }}>
        {description}
      </Text>

      <Text style={{ color: theme.tooltip.fg, marginTop: 12, opacity: 0.7 }}>
        {index + 1} of {count}
      </Text>

      <View style={{ flexDirection: 'row', marginTop: 16, gap: 8 }}>
        {!isFirst && (
          <TouchableOpacity
            onPress={onBack}
            style={{ flex: 1, padding: 10, backgroundColor: theme.tooltip.buttonSecondaryBg }}
          >
            <Text style={{ color: '#fff', textAlign: 'center' }}>Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={onSkip}
          style={{ flex: 1, padding: 10, backgroundColor: theme.tooltip.buttonSecondaryBg }}
        >
          <Text style={{ color: '#fff', textAlign: 'center' }}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onNext}
          style={{ flex: 1, padding: 10, backgroundColor: theme.tooltip.buttonPrimaryBg }}
        >
          <Text style={{ color: '#fff', textAlign: 'center' }}>
            {isLast ? 'Done' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Use globally
<CoachmarkProvider theme={customTheme}>
  <YourApp renderTooltip={CustomTooltip} />
</CoachmarkProvider>

// Or per-step
const steps = [
  {
    id: 'special',
    renderTooltip: CustomTooltip,  // Just this step
  },
];
```

## Plugins & Analytics

Use plugins to hook into tour lifecycle events across your app.

### Analytics Plugin

```tsx
const analyticsPlugin: Plugin = {
  onStart: (tour) => {
    analytics.track('tour_started', {
      tourKey: tour.key,
      stepCount: tour.steps.length,
    });
  },

  onStep: (tour, index, step) => {
    analytics.track('tour_step_viewed', {
      tourKey: tour.key,
      stepId: step.id,
      stepNumber: index + 1,
      totalSteps: tour.steps.length,
    });
  },

  onFinish: (tour, reason) => {
    analytics.track('tour_finished', {
      tourKey: tour.key,
      reason,  // 'completed' or 'skipped'
      completionRate: reason === 'completed' ? 100 : 0,
    });
  },
};

<CoachmarkProvider plugins={[analyticsPlugin]}>
  {children}
</CoachmarkProvider>
```

### Logging Plugin

```tsx
const loggingPlugin: Plugin = {
  onStart: (tour) => console.log('🎯 Tour started:', tour.key),
  onStep: (tour, index, step) => console.log(`📍 Step ${index + 1}/${tour.steps.length}:`, step.id),
  onFinish: (tour, reason) => console.log(`✅ Tour finished (${reason}):`, tour.key),
};
```

### User Progress Plugin

```tsx
const progressPlugin: Plugin = {
  onStep: async (tour, index) => {
    // Save progress
    await AsyncStorage.setItem(
      `tour_${tour.key}_progress`,
      String(index)
    );
  },

  onFinish: async (tour, reason) => {
    if (reason === 'completed') {
      // Mark as completed
      await AsyncStorage.setItem(
        `tour_${tour.key}_completed`,
        'true'
      );
    }
  },
};
```
