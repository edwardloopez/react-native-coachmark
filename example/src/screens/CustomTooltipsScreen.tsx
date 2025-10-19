import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import {
  CoachmarkAnchor,
  useCoachmark,
  type TooltipRenderProps,
} from 'react-native-coachmark';
import {
  MinimalTooltip,
  CardTooltip,
  AnimatedTooltip,
} from './components/CustomTooltipExamples';

const GradientTooltip = ({
  title,
  description,
  index,
  count,
  onNext,
  onBack,
  onSkip,
  isFirst,
  isLast,
}: TooltipRenderProps) => {
  return (
    <View style={styles.gradientTooltip}>
      <View style={styles.gradientHeader}>
        <Text style={styles.gradientBadge}>
          {index + 1} / {count}
        </Text>
      </View>
      <Text style={styles.gradientTitle}>{title}</Text>
      <Text style={styles.gradientDesc}>{description}</Text>
      <View style={styles.gradientActions}>
        {!isFirst && (
          <Pressable onPress={onBack} style={styles.gradientBackButton}>
            <Text style={styles.gradientBackText}>← Back</Text>
          </Pressable>
        )}

        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{ flex: 1 }}
        />
        <Pressable onPress={onSkip} style={styles.gradientSkipButton}>
          <Text style={styles.gradientSkipText}>Skip</Text>
        </Pressable>
        <Pressable onPress={onNext} style={styles.gradientNextButton}>
          <Text style={styles.gradientNextText}>
            {isLast ? 'Done ✓' : 'Next →'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

function CustomTooltipDemoContent() {
  const { start } = useCoachmark();

  const startMinimalTour = () => {
    start({
      key: 'minimal-tour',
      renderTooltip: MinimalTooltip,
      steps: [
        {
          id: 'profile',
          title: 'Your Profile',
          description: 'Access your account settings and preferences here.',
          placement: 'bottom',
        },
        {
          id: 'notifications',
          title: 'Stay Updated',
          description: 'Get notified about important updates and messages.',
          placement: 'bottom',
        },
      ],
    });
  };

  const startCardTour = () => {
    start({
      key: 'card-tour',
      renderTooltip: CardTooltip,
      steps: [
        {
          id: 'search',
          title: 'Search Feature',
          description: 'Quickly find what you need with our powerful search.',
          placement: 'bottom',
        },
        {
          id: 'filter',
          title: 'Smart Filters',
          description: 'Narrow down results with advanced filtering options.',
          placement: 'bottom',
        },
      ],
    });
  };

  const startAnimatedTour = () => {
    start({
      key: 'animated-tour',
      renderTooltip: AnimatedTooltip,
      steps: [
        {
          id: 'favorites',
          title: 'Add to Favorites',
          description: 'Save items for quick access later.',
          placement: 'bottom',
        },
        {
          id: 'share',
          title: 'Share Content',
          description: 'Share with friends and colleagues easily.',
          placement: 'bottom',
        },
      ],
    });
  };

  const startGradientTour = () => {
    start({
      key: 'gradient-tour',
      renderTooltip: GradientTooltip,
      steps: [
        {
          id: 'settings',
          title: 'Customize Settings',
          description: 'Personalize your experience with custom settings.',
          placement: 'bottom',
        },
        {
          id: 'help',
          title: 'Need Help?',
          description: 'Access our help center and support resources.',
          placement: 'bottom',
        },
      ],
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.mainTitle}>Custom Tooltip Demos</Text>
      <Text style={styles.subtitle}>
        Tap any button below to see different custom tooltip styles
      </Text>

      {/* Demo Section 1 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pre-built Styles</Text>

        <Pressable onPress={startMinimalTour} style={styles.demoButton}>
          <Text style={styles.demoButtonText}>Minimal Tooltip</Text>
          <Text style={styles.demoButtonDesc}>
            Dark, clean, minimalist design
          </Text>
        </Pressable>

        <View style={styles.anchorRow}>
          <CoachmarkAnchor id="profile">
            <View style={styles.iconButton}>
              <Text style={styles.icon}>👤</Text>
            </View>
          </CoachmarkAnchor>
          <CoachmarkAnchor id="notifications">
            <View style={styles.iconButton}>
              <Text style={styles.icon}>🔔</Text>
            </View>
          </CoachmarkAnchor>
        </View>

        <Pressable onPress={startCardTour} style={styles.demoButton}>
          <Text style={styles.demoButtonText}>Card Tooltip</Text>
          <Text style={styles.demoButtonDesc}>
            Modern card with progress bar
          </Text>
        </Pressable>

        <View style={styles.anchorRow}>
          <CoachmarkAnchor id="search">
            <View style={styles.iconButton}>
              <Text style={styles.icon}>🔍</Text>
            </View>
          </CoachmarkAnchor>
          <CoachmarkAnchor id="filter">
            <View style={styles.iconButton}>
              <Text style={styles.icon}>⚙️</Text>
            </View>
          </CoachmarkAnchor>
        </View>

        <Pressable onPress={startAnimatedTour} style={styles.demoButton}>
          <Text style={styles.demoButtonText}>Animated Tooltip</Text>
          <Text style={styles.demoButtonDesc}>Spring entrance animation</Text>
        </Pressable>

        <View style={styles.anchorRow}>
          <CoachmarkAnchor id="favorites">
            <View style={styles.iconButton}>
              <Text style={styles.icon}>⭐</Text>
            </View>
          </CoachmarkAnchor>
          <CoachmarkAnchor id="share">
            <View style={styles.iconButton}>
              <Text style={styles.icon}>📤</Text>
            </View>
          </CoachmarkAnchor>
        </View>
      </View>

      {/* Demo Section 2 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Style</Text>

        <Pressable onPress={startGradientTour} style={styles.demoButton}>
          <Text style={styles.demoButtonText}>Gradient Tooltip</Text>
          <Text style={styles.demoButtonDesc}>Custom gradient background</Text>
        </Pressable>

        <View style={styles.anchorRow}>
          <CoachmarkAnchor id="settings">
            <View style={styles.iconButton}>
              <Text style={styles.icon}>⚙️</Text>
            </View>
          </CoachmarkAnchor>
          <CoachmarkAnchor id="help">
            <View style={styles.iconButton}>
              <Text style={styles.icon}>❓</Text>
            </View>
          </CoachmarkAnchor>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>💡 Custom Tooltips</Text>
        <Text style={styles.infoText}>
          You can create fully custom tooltip designs while keeping automatic
          positioning, animations, and state management.
        </Text>
      </View>
    </ScrollView>
  );
}

export function CustomTooltipsScreen() {
  return <CustomTooltipDemoContent />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  demoButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  demoButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  demoButtonDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  anchorRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  iconButton: {
    width: 56,
    height: 56,
    backgroundColor: '#f0f0f0',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  infoBox: {
    backgroundColor: '#FFF3CD',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#856404',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#856404',
    lineHeight: 18,
  },

  gradientTooltip: {
    maxWidth: 320,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#667eea',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  gradientHeader: {
    marginBottom: 12,
  },
  gradientBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  gradientTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  gradientDesc: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.95,
    lineHeight: 20,
    marginBottom: 20,
  },
  gradientActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gradientBackButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  gradientBackText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
  },
  gradientSkipButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  gradientSkipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
  gradientNextButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  gradientNextText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '700',
  },
});
