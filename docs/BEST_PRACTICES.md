# Best Practices

Tips and guidelines for creating effective, performant coachmarks.

## Design

### ✅ Keep Tours Short

**Recommended:** 3-5 steps maximum

```tsx
// ❌ Bad - Too long
steps: Array(15).fill(null).map((_, i) => ({
  id: `step-${i}`,
  title: `Step ${i + 1}`,
}));

// ✅ Good - Focused
steps: [
  { id: 'create', title: 'Create Items' },
  { id: 'filter', title: 'Filter Results' },
  { id: 'share', title: 'Share Your List' },
];
```

### ✅ Use Clear Language

Write for your users, not yourself:

```tsx
// ❌ Bad - Technical jargon
description: 'Invoke the persistence layer to synchronize data state'

// ✅ Good - User-friendly
description: 'Save your changes to the cloud so they appear on all devices'
```

### ✅ Show, Don't Tell

Use coachmarks to highlight UI, not explain product strategy:

```tsx
// ❌ Bad - Too much info
description: 'Our platform leverages advanced ML algorithms...'

// ✅ Good - Action-focused
description: 'Click here to find recommendations for you'
```

## Timing

### ✅ Add Appropriate Delays

Give users time to understand:

```tsx
const tour = createTour('onboarding', steps, {
  delay: 1000,  // Wait 1 second before showing tour
});

// Per-step delays
{
  id: 'complex-feature',
  scrollDelay: 400,  // Extra time after scrolling
}
```

### ✅ Skip on First Launch Issues

```tsx
// Only show tour if app launched successfully
const tour = createTour('welcome', steps, {
  delay: 3000,  // Let app settle first
  showOnce: true,
});
```

## Performance

### ✅ Memoize Custom Tooltips

```tsx
import { memo } from 'react';

const CustomTooltip = memo(function CustomTooltip(props) {
  // Component only re-renders if props change
  return <Tooltip {...props} />;
});
```

### ✅ Use MMKV for Storage

```tsx
// ❌ Slower - AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
<CoachmarkProvider storage={asyncStorage(AsyncStorage)}>

// ✅ Faster - MMKV
import { MMKV } from 'react-native-mmkv';
<CoachmarkProvider storage={mmkvStorage(new MMKV())}>
```

### ✅ Lazy Load Tours

Only create tours when needed:

```tsx
// ❌ Bad - Creates all tours upfront
const tours = {
  onboarding: createTour(...),
  feature1: createTour(...),
  feature2: createTour(...),
  feature3: createTour(...),
};

// ✅ Good - Creates on demand
function useTour(name) {
  return useMemo(() => {
    switch (name) {
      case 'onboarding':
        return createTour('onboarding', [...]);
      case 'feature1':
        return createTour('feature1', [...]);
      // ...
    }
  }, [name]);
}
```

## Analytics

### ✅ Track Tour Events

```tsx
const analyticsPlugin: Plugin = {
  onStart: (tour) => {
    analytics.track('tour_started', {
      tour_name: tour.key,
      step_count: tour.steps.length,
      timestamp: Date.now(),
    });
  },

  onStep: (tour, index, step) => {
    analytics.track('tour_step_viewed', {
      tour_name: tour.key,
      step_id: step.id,
      step_number: index + 1,
      timestamp: Date.now(),
    });
  },

  onFinish: (tour, reason) => {
    analytics.track('tour_completed', {
      tour_name: tour.key,
      completion: reason === 'completed' ? 'finished' : 'skipped',
      duration: Date.now() - startTime,
    });
  },
};
```

### ✅ Monitor Engagement

```tsx
// Track skips vs completions
const metrics = {
  skipped: 0,
  completed: 0,
};

const trackingPlugin: Plugin = {
  onFinish: (tour, reason) => {
    if (reason === 'skipped') metrics.skipped++;
    if (reason === 'completed') metrics.completed++;

    const completionRate = metrics.completed / (metrics.completed + metrics.skipped);
    console.log(`Tour completion rate: ${(completionRate * 100).toFixed(1)}%`);
  },
};
```

## Testing

### ✅ Test Tours Before Release

```tsx
import { render } from '@testing-library/react-native';
import { fireEvent } from '@testing-library/react-native';

test('tour navigates correctly', async () => {
  const { getByText } = render(<MyTourScreen />);

  fireEvent.press(getByText('Start Tour'));

  // Should show first step
  expect(getByText('Step Title')).toBeTruthy();

  // Navigate to next
  fireEvent.press(getByText('Next'));

  // Should update step
  expect(getByText('Step 2 Title')).toBeTruthy();
});
```

## Accessibility

### ✅ Use Semantic Elements

```tsx
// ✅ Good
<CoachmarkAnchor
  id="button"
  shape="circle"
>
  <TouchableOpacity accessibilityRole="button">
    <Text>Click Me</Text>
  </TouchableOpacity>
</CoachmarkAnchor>
```

### ✅ Respect System Settings

```tsx
// Your library automatically respects:
// - Reduced Motion
// - Screen reader enabled
// - Text size preferences
// - High contrast mode
```

### ✅ Always Provide Context

```tsx
// ❌ Bad
{ id: 'button', title: 'Click Here' }

// ✅ Good
{ id: 'create-post', title: 'Create New Post', description: 'Write and share with friends' }
```

## Common Pitfalls

| Issue | Problem | Solution |
|-------|---------|----------|
| ❌ Tours too long | Users get bored after 3-5 steps | Split into multiple focused tours |
| ❌ Tours appear without warning | No time for app to settle | Always add a `delay` to let app load |
| ❌ Forcing tours on every user | Repetitive and annoying | Use `showOnce: true` to show only once |
| ❌ Complex conditions | Logic becomes hard to maintain | Keep `onBeforeEnter` simple; consider optional help |
| ❌ Testing only on simulator | Performance and UX differ significantly | Always test on real devices |
