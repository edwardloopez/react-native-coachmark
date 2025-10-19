import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { TooltipRenderProps } from 'react-native-coachmark';

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
});
