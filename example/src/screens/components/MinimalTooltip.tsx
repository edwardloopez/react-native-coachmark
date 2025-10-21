import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { TooltipRenderProps } from '@edwardloopez/react-native-coachmark';

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
});
