import { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  CoachmarkProvider,
  CoachmarkOverlay,
  CoachmarkAnchor,
  useCoachmark,
  createTour,
} from 'react-native-coachmark';

function HomeScreen() {
  const { start, isActive } = useCoachmark();
  const [counter, setCounter] = useState(0);
  const [liked, setLiked] = useState(false);

  const startBasicTour = () => {
    start(
      createTour(
        'basic-tour',
        [
          {
            id: 'add-button',
            title: 'Add Items',
            description:
              'Tap this button to increment the counter and add items to your list',
            shape: 'circle',
            placement: 'bottom',
            padding: 16,
          },
          {
            id: 'counter-display',
            title: 'Counter Display',
            description:
              "This shows how many times you've tapped the add button",
            shape: 'rect',
            placement: 'bottom',
            radius: 16,
          },
          {
            id: 'like-button',
            title: 'Like Feature',
            description: 'Show your appreciation by tapping the heart icon',
            shape: 'circle',
            placement: 'bottom',
            radius: 16,
          },
          {
            id: 'settings-menu',
            title: 'Settings',
            description: 'Access app settings and preferences from this menu',
            shape: 'pill',
            placement: 'auto',
          },
        ],
        { showOnce: false }
      )
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Coachmark Demo</Text>
          <CoachmarkAnchor id="settings-menu" shape="pill" padding={8}>
            <Pressable style={styles.settingsButton}>
              <Text style={styles.settingsIcon}>⚙️</Text>
            </Pressable>
          </CoachmarkAnchor>
        </View>

        <View style={styles.card}>
          <CoachmarkAnchor id="counter-display" shape="rect" radius={16}>
            <View style={styles.counterBox}>
              <Text style={styles.counterLabel}>Counter</Text>
              <Text style={styles.counterValue}>{counter}</Text>
            </View>
          </CoachmarkAnchor>
        </View>

        <View style={styles.actionsRow}>
          <CoachmarkAnchor id="add-button" shape="circle" padding={16}>
            <Pressable
              style={styles.actionButton}
              onPress={() => setCounter((c) => c + 1)}
            >
              <Text style={styles.actionButtonText}>+</Text>
            </Pressable>
          </CoachmarkAnchor>

          <CoachmarkAnchor
            id="like-button"
            shape="circle"
            padding={12}
            style={styles.centerItems}
          >
            <Pressable
              style={[styles.likeButton, liked && styles.likeButtonActive]}
              onPress={() => setLiked((l) => !l)}
            >
              <Text style={styles.likeIcon}>{liked ? '❤️' : '🤍'}</Text>
            </Pressable>
          </CoachmarkAnchor>
        </View>

        {/* Start Tour Button */}
        <View style={styles.tourSection}>
          <Pressable
            style={[styles.startButton, isActive && styles.startButtonDisabled]}
            onPress={startBasicTour}
            disabled={isActive}
          >
            <Text style={styles.startButtonText}>
              {isActive ? 'Tour in Progress...' : '🎯 Start Tour'}
            </Text>
          </Pressable>
          <Text style={styles.hint}>
            Tap to see how the coachmark library works!
          </Text>
        </View>

        {/* Feature List */}
        <View style={styles.features}>
          <Text style={styles.featuresTitle}>✨ Features</Text>
          <FeatureItem
            icon="🎨"
            title="Beautiful Spotlights"
            desc="Circle, rect, and pill shapes"
          />
          <FeatureItem
            icon="⚡"
            title="Smooth Animations"
            desc="Powered by Reanimated"
          />
          <FeatureItem
            icon="♿"
            title="Accessible"
            desc="Screen reader support"
          />
          <FeatureItem
            icon="💾"
            title="Persistent"
            desc="Show once functionality"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FeatureItem({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{desc}</Text>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <CoachmarkProvider
      theme={{
        backdropOpacity: 0.7,
        tooltip: {
          maxWidth: 300,
          radius: 14,
          bg: '#FFFFFF',
          fg: '#1a1a1a',
          arrowSize: 10,
          padding: 14,
          buttonPrimaryBg: '#007AFF',
          buttonSecondaryBg: '#8E8E93',
        },
      }}
    >
      <HomeScreen />
      <CoachmarkOverlay />
    </CoachmarkProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  settingsIcon: {
    fontSize: 22,
  },
  card: {
    marginBottom: 24,
  },
  counterBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  counterLabel: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 8,
    fontWeight: '600',
  },
  counterValue: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 32,
  },
  actionButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  actionButtonText: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  likeButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  likeButtonActive: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  likeIcon: {
    fontSize: 28,
  },
  tourSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  startButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#34C759',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  startButtonDisabled: {
    backgroundColor: '#8E8E93',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  hint: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  features: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 14,
    color: '#8E8E93',
  },
  centerItems: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
