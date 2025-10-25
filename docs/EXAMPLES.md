# Complete Examples

Real-world examples you can copy and adapt for your app.

## Example 1: ScrollView with Auto-Scroll

```tsx
import { useRef, useState } from 'react';
import { ScrollView, View, Text, Button } from 'react-native';
import {
  CoachmarkAnchor,
  CoachmarkOverlay,
  createTour,
  useCoachmark,
} from '@edwardloopez/react-native-coachmark';

function ScrollableList() {
  const scrollRef = useRef<ScrollView>(null);
  const { start, state } = useCoachmark();

  const startTour = () => {
    start(
      createTour('scroll-demo', [
        {
          id: 'header',
          title: 'Welcome to the Tour',
          description: 'This list has many items, some hidden below',
          placement: 'bottom',
        },
        {
          id: 'item-50',
          title: 'Hidden Item',
          description: 'This was way down the list, but we scrolled here!',
          placement: 'top',
          autoFocus: 'ifNeeded',
          scrollBehavior: 'smooth',
          scrollDelay: 200,
        },
      ])
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {!state.isActive && (
        <CoachmarkAnchor id="header">
          <View style={{ padding: 20 }}>
            <Button title="Start Tour" onPress={startTour} />
          </View>
        </CoachmarkAnchor>
      )}

      <ScrollView ref={scrollRef}>
        {Array.from({ length: 100 }).map((_, i) => (
          <CoachmarkAnchor
            key={i}
            id={i === 50 ? 'item-50' : `item-${i}`}
            scrollRef={scrollRef}
          >
            <View style={{
              padding: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
            }}>
              <Text>Item {i + 1}</Text>
            </View>
          </CoachmarkAnchor>
        ))}
      </ScrollView>

      <CoachmarkOverlay />
    </View>
  );
}
```

## Example 2: Conditional Steps with Lifecycle Hooks

```tsx
import { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import {
  CoachmarkAnchor,
  CoachmarkOverlay,
  createTour,
  useCoachmark,
} from '@edwardloopez/react-native-coachmark';

function OnboardingScreen() {
  const [isPremium, setIsPremium] = useState(false);
  const { start, state } = useCoachmark();

  const startOnboarding = () => {
    start(
      createTour('onboarding', [
        {
          id: 'welcome',
          title: 'Welcome!',
          description: 'Let\'s get you started with our app',
          placement: 'bottom',
          onEnter: () => {
            console.log('Step 1: Welcome');
            // Track analytics
          },
        },
        {
          id: 'basic-features',
          title: 'Basic Features',
          description: 'These are available to all users',
          placement: 'top',
        },
        {
          id: 'premium-feature',
          title: 'Premium Feature',
          description: 'Upgrade to unlock advanced features',
          onBeforeEnter: async () => {
            // Skip if not premium
            const premium = await checkPremiumStatus();
            return premium;
          },
          onEnter: () => {
            console.log('Showing premium feature');
          },
        },
        {
          id: 'settings',
          title: 'Customize Your Experience',
          description: 'Visit settings to personalize the app',
          placement: 'top',
        },
      ], {
        delay: 1000,
      })
    );
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {!state.isActive && (
        <Button title="Start Onboarding" onPress={startOnboarding} />
      )}

      <CoachmarkAnchor id="welcome">
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
            Welcome to MyApp
          </Text>
        </View>
      </CoachmarkAnchor>

      <CoachmarkAnchor id="basic-features">
        <View style={{ marginTop: 20, padding: 15, backgroundColor: '#f0f0f0' }}>
          <Text>📱 Basic Features Available</Text>
        </View>
      </CoachmarkAnchor>

      {isPremium && (
        <CoachmarkAnchor id="premium-feature">
          <View style={{ marginTop: 20, padding: 15, backgroundColor: '#ffd700' }}>
            <Text>⭐ Premium Feature</Text>
          </View>
        </CoachmarkAnchor>
      )}

      <CoachmarkAnchor id="settings">
        <View style={{ marginTop: 20, padding: 15, backgroundColor: '#e0e0e0' }}>
          <Text>⚙️ Settings</Text>
        </View>
      </CoachmarkAnchor>

      <CoachmarkOverlay />
    </View>
  );
}

async function checkPremiumStatus(): Promise<boolean> {
  // Your logic here
  return false;
}
```

## Example 3: Custom Theme and Tooltip

```tsx
import { View, Text, TouchableOpacity } from 'react-native';
import {
  CoachmarkProvider,
  CoachmarkAnchor,
  CoachmarkOverlay,
  createTour,
  useCoachmark,
} from '@edwardloopez/react-native-coachmark';
import type { TooltipRenderProps } from '@edwardloopez/react-native-coachmark';

function CustomTooltip({
  title,
  description,
  index,
  count,
  isLast,
  onNext,
  onSkip,
}: TooltipRenderProps) {
  return (
    <View style={{
      backgroundColor: '#2c3e50',
      borderRadius: 12,
      padding: 16,
      maxWidth: 300,
    }}>
      <Text style={{
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
      }}>
        {title}
      </Text>

      <Text style={{
        color: '#ecf0f1',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
      }}>
        {description}
      </Text>

      <Text style={{
        color: '#95a5a6',
        fontSize: 12,
        marginBottom: 16,
      }}>
        Step {index + 1} of {count}
      </Text>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: '#e74c3c',
            borderRadius: 6,
          }}
          onPress={onSkip}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>
            Skip
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: '#3498db',
            borderRadius: 6,
          }}
          onPress={onNext}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>
            {isLast ? 'Done' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ThemeDemo() {
  const { start } = useCoachmark();

  const startTour = () => {
    start(
      createTour('theme-demo', [
        {
          id: 'button-1',
          title: 'Custom Tooltip',
          description: 'This uses our custom design',
          placement: 'bottom',
        },
        {
          id: 'button-2',
          title: 'Still Custom',
          description: 'All steps use the same custom design',
          placement: 'top',
        },
      ])
    );
  };

  return (
    <CoachmarkProvider
      theme={{
        backdropColor: '#1a1a1a',
        backdropOpacity: 0.85,
        holeShadowOpacity: 0.4,
        tooltip: {
          maxWidth: 300,
          radius: 12,
          bg: '#2c3e50',
          fg: '#ffffff',
          arrowSize: 10,
          padding: 16,
          buttonPrimaryBg: '#3498db',
          buttonSecondaryBg: '#e74c3c',
        },
        motion: {
          durationMs: 400,
          easing: (t) => 1 - Math.pow(1 - t, 4), // Ease-out quart
        },
      }}
    >
      <View style={{ flex: 1, padding: 20 }}>
        <Button title="Start Tour" onPress={startTour} />

        <CoachmarkAnchor id="button-1">
          <View style={{ marginTop: 30, padding: 15, backgroundColor: '#3498db' }}>
            <Text style={{ color: '#fff' }}>Button 1</Text>
          </View>
        </CoachmarkAnchor>

        <CoachmarkAnchor id="button-2">
          <View style={{ marginTop: 20, padding: 15, backgroundColor: '#2ecc71' }}>
            <Text style={{ color: '#fff' }}>Button 2</Text>
          </View>
        </CoachmarkAnchor>

        <CoachmarkOverlay />
      </View>
    </CoachmarkProvider>
  );
}
```
