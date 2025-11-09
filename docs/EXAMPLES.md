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
## Example 4: Multiple Tours in One App

Manage different tours for different user flows (onboarding, feature discovery, etc).

```tsx
import { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import {
  CoachmarkProvider,
  CoachmarkAnchor,
  CoachmarkOverlay,
  createTour,
  useCoachmark,
} from '@edwardloopez/react-native-coachmark';

function MainApp() {
  const [userType, setUserType] = useState<'new' | 'returning'>('new');
  const { start, isActive } = useCoachmark();

  // Tour 1: First-time user onboarding
  const onboardingTour = createTour('onboarding-new-user', [
    {
      id: 'welcome-banner',
      title: '🎉 Welcome!',
      description: 'This is your new dashboard. Let\'s explore key features.',
      placement: 'bottom',
      shape: 'rect',
    },
    {
      id: 'main-actions',
      title: 'Main Actions',
      description: 'Create, edit, or view your content here',
      placement: 'top',
      shape: 'rect',
      radius: 12,
    },
    {
      id: 'profile-menu',
      title: 'Your Profile',
      description: 'Access settings, preferences, and account info',
      placement: 'bottom',
      shape: 'circle',
      padding: 16,
    },
  ], {
    delay: 500,
    showOnce: true, // Only show once per user
  });

  // Tour 2: Feature discovery for returning users
  const featureDiscoveryTour = createTour('feature-discovery', [
    {
      id: 'new-feature-badge',
      title: '✨ New Feature!',
      description: 'We\'ve added a powerful new search capability',
      placement: 'bottom',
    },
    {
      id: 'search-bar',
      title: 'Advanced Search',
      description: 'Find anything instantly with smart filters',
      placement: 'bottom',
      autoFocus: 'ifNeeded',
    },
  ], {
    delay: 2000,
    showOnce: true,
  });

  // Tour 3: Quick tips (can be triggered manually)
  const quickTipsTour = createTour('quick-tips', [
    {
      id: 'bulk-actions',
      title: 'Pro Tip: Bulk Actions',
      description: 'Select multiple items with checkboxes, then act on all at once',
      placement: 'top',
      onEnter: () => console.log('Tip viewed: Bulk Actions'),
    },
    {
      id: 'keyboard-shortcuts',
      title: 'Pro Tip: Shortcuts',
      description: 'Press ? to see all keyboard shortcuts',
      placement: 'bottom',
    },
  ]);

  useEffect(() => {
    // Auto-start appropriate tour based on user type
    if (!isActive) {
      if (userType === 'new') {
        start(onboardingTour);
      } else {
        start(featureDiscoveryTour);
      }
    }
  }, [userType]);

  const handleStartTips = () => {
    start(quickTipsTour);
  };

  const toggleUserType = () => {
    setUserType(userType === 'new' ? 'returning' : 'new');
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ padding: 20 }}>
        {/* Welcome Banner */}
        <CoachmarkAnchor id="welcome-banner">
          <View style={{
            backgroundColor: '#007AFF',
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
          }}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
              Welcome, User!
            </Text>
            <Text style={{ color: '#fff', marginTop: 8 }}>
              {userType === 'new' ? 'First time here? Let\'s get started!' : 'Welcome back!'}
            </Text>
          </View>
        </CoachmarkAnchor>

        {/* Main Actions */}
        <CoachmarkAnchor id="main-actions">
          <View style={{
            flexDirection: 'row',
            gap: 12,
            marginBottom: 20,
          }}>
            <Button title="Create" color="#34C759" />
            <Button title="Edit" color="#FF9500" />
            <Button title="View" color="#5856D6" />
          </View>
        </CoachmarkAnchor>

        {/* New Feature Badge */}
        <CoachmarkAnchor id="new-feature-badge">
          <View style={{
            backgroundColor: '#fff',
            borderLeftWidth: 4,
            borderLeftColor: '#34C759',
            padding: 16,
            marginBottom: 20,
            borderRadius: 8,
          }}>
            <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 4 }}>
              ✨ New: Advanced Search
            </Text>
            <Text style={{ fontSize: 12, color: '#666' }}>
              Discover the new search feature
            </Text>
          </View>
        </CoachmarkAnchor>

        {/* Search Bar */}
        <CoachmarkAnchor id="search-bar">
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 8,
            padding: 12,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: '#ddd',
          }}>
            <Text style={{ color: '#999' }}>🔍 Search everything...</Text>
          </View>
        </CoachmarkAnchor>

        {/* Bulk Actions Section */}
        <CoachmarkAnchor id="bulk-actions">
          <View style={{
            backgroundColor: '#fff',
            padding: 16,
            borderRadius: 8,
            marginBottom: 20,
          }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
              Select Multiple Items
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Text>☐ Item 1</Text>
              <Text>☐ Item 2</Text>
              <Text>☐ Item 3</Text>
            </View>
          </View>
        </CoachmarkAnchor>

        {/* Keyboard Shortcuts Info */}
        <CoachmarkAnchor id="keyboard-shortcuts">
          <View style={{
            backgroundColor: '#f9f9f9',
            padding: 12,
            borderRadius: 8,
            marginBottom: 20,
          }}>
            <Text style={{ fontSize: 12, color: '#666' }}>
              💡 Press ? anywhere to view keyboard shortcuts
            </Text>
          </View>
        </CoachmarkAnchor>

        {/* Action Buttons */}
        <CoachmarkAnchor id="profile-menu">
          <View style={{
            backgroundColor: '#fff',
            padding: 12,
            borderRadius: 8,
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 20,
          }}>
            <Button
              title="Quick Tips"
              color="#007AFF"
              onPress={handleStartTips}
            />
            <Button
              title={`Switch to ${userType === 'new' ? 'Returning' : 'New'} User`}
              color="#666"
              onPress={toggleUserType}
            />
          </View>
        </CoachmarkAnchor>
      </View>

      <CoachmarkOverlay />
    </ScrollView>
  );
}

export default MainApp;
```
