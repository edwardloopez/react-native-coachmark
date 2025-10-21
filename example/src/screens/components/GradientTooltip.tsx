import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { TooltipRenderProps } from '@edwardloopez/react-native-coachmark';

export const GradientTooltip = ({
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
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientTooltip}
    >
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientTooltip: {
    maxWidth: 320,
    padding: 20,
    borderRadius: 16,
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
