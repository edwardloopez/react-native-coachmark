import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';
import type { TooltipRenderProps } from 'react-native-coachmark';

/**
 * Example 1: Minimal Custom Tooltip
 * Simple, clean design with just essential information
 */
export const MinimalTooltip = ({
  title,
  description,
  index,
  count,
  onNext,
  onSkip,
}: TooltipRenderProps): React.ReactElement => {
  return (
    <View style={[styles.container, styles.minimal]}>
      <Text style={styles.minimalTitle}>{title}</Text>
      <Text style={styles.minimalDesc}>{description}</Text>
      <View style={styles.minimalActions}>
        <Text style={styles.stepIndicator}>
          {index + 1}/{count}
        </Text>
        <View style={styles.buttonRow}>
          <Pressable onPress={onSkip} style={styles.textButton}>
            <Text style={styles.textButtonLabel}>Skip</Text>
          </Pressable>
          <Pressable onPress={onNext} style={styles.primaryButton}>
            <Text style={styles.primaryButtonLabel}>Next →</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

/**
 * Example 2: Card-Style Custom Tooltip
 * Modern card design with elevation and icons
 */
export const CardTooltip = ({
  title,
  description,
  index,
  count,
  onNext,
  onBack,
  isFirst,
}: TooltipRenderProps & { icon?: string }): React.ReactElement => {
  return (
    <View style={[styles.container, styles.card]}>
      <View style={styles.cardHeader}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>💡</Text>
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>

      <Text style={styles.cardDesc}>{description}</Text>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${((index + 1) / count) * 100}%` },
          ]}
        />
      </View>

      <View style={styles.cardActions}>
        {!isFirst && (
          <Pressable onPress={onBack} style={styles.cardButton}>
            <Text style={styles.cardButtonText}>← Back</Text>
          </Pressable>
        )}
        <Pressable
          onPress={onNext}
          style={[styles.cardButton, styles.cardButtonPrimary]}
        >
          <Text style={[styles.cardButtonText, styles.cardButtonTextPrimary]}>
            Next →
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

/**
 * Example 3: Animated Custom Tooltip
 * Tooltip with entrance animation
 *
 * Note: This component uses hooks (useRef, useEffect) which is safe because
 * CoachmarkOverlay now always renders tooltips through the same code path.
 */
export const AnimatedTooltip = (
  props: TooltipRenderProps
): React.ReactElement => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [props.index, scaleAnim]); // Re-animate when step changes

  return (
    <Animated.View
      style={[
        styles.container,
        styles.animated,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Text style={styles.animatedTitle}>{props.title}</Text>
      <Text style={styles.animatedDesc}>{props.description}</Text>

      <View style={styles.animatedActions}>
        <Text style={styles.stepBadge}>
          Step {props.index + 1} of {props.count}
        </Text>
        <Pressable onPress={props.onNext} style={styles.animatedButton}>
          <Text style={styles.animatedButtonText}>Continue</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

/**
 * Example 4: Image-Based Custom Tooltip
 * Tooltip with image/illustration support
 */
export const ImageTooltip = ({
  title,
  description,
  imageUri,
  onNext,
  onSkip,
  isLast,
}: TooltipRenderProps & { imageUri?: string }): React.ReactElement => {
  return (
    <View style={[styles.container, styles.image]}>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.tooltipImage} />
      )}
      <View style={styles.imageContent}>
        <Text style={styles.imageTitle}>{title}</Text>
        <Text style={styles.imageDesc}>{description}</Text>
        <View style={styles.imageActions}>
          <Pressable onPress={onSkip}>
            <Text style={styles.skipText}>Skip Tour</Text>
          </Pressable>
          <Pressable onPress={onNext} style={styles.imageButton}>
            <Text style={styles.imageButtonText}>
              {isLast ? 'Done' : 'Next'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 320,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  minimal: {
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  minimalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  minimalDesc: {
    fontSize: 14,
    color: '#b0b0b0',
    lineHeight: 20,
    marginBottom: 16,
  },
  minimalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepIndicator: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  textButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textButtonLabel: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  primaryButtonLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  card: {
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3CD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
  },
  cardDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cardButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardButtonPrimary: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  cardButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  cardButtonTextPrimary: {
    color: '#fff',
  },
  animated: {
    padding: 24,
    backgroundColor: '#6C5CE7',
  },
  animatedTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  animatedDesc: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    lineHeight: 20,
    marginBottom: 20,
  },
  animatedActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  animatedButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  animatedButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6C5CE7',
  },
  image: {
    overflow: 'hidden',
  },
  tooltipImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  imageContent: {
    padding: 20,
  },
  imageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  imageDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  imageActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  imageButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  imageButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});
