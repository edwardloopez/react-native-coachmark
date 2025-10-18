import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { CoachmarkTheme } from '../core/types';

export const Tooltip: React.FC<{
  theme: CoachmarkTheme;
  title?: string;
  description?: string;
  pos: { x: number; y: number };
  index: number;
  count: number;
  onNext: () => void;
  onBack?: () => void;
  onSkip?: () => void;
}> = ({
  theme,
  title,
  description,
  pos,
  index,
  count,
  onNext,
  onBack,
  onSkip,
}) => {
  const isLast = index === count - 1;

  return (
    <View
      style={[
        styles.container,
        {
          left: pos.x,
          top: pos.y,
          maxWidth: theme.tooltip.maxWidth,
          backgroundColor: theme.tooltip.bg,
          borderRadius: theme.tooltip.radius,
          padding: theme.tooltip.padding,
        },
      ]}
      accessibilityViewIsModal
    >
      {!!title && (
        <Text style={[styles.title, { color: theme.tooltip.fg }]}>{title}</Text>
      )}
      {!!description && (
        <Text style={[styles.desc, { color: theme.tooltip.fg }]}>
          {description}
        </Text>
      )}

      {/* Progress indicator */}
      <View style={styles.progress}>
        {Array(count)
          .fill(0)
          .map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  backgroundColor:
                    i === index
                      ? theme.tooltip.buttonPrimaryBg
                      : theme.tooltip.buttonSecondaryBg,
                  opacity: i === index ? 1 : 0.3,
                },
              ]}
            />
          ))}
      </View>

      <View style={styles.row}>
        {onBack && index > 0 && (
          <Pressable
            onPress={onBack}
            style={[
              styles.btn,
              { backgroundColor: theme.tooltip.buttonSecondaryBg },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.btnText}>Back</Text>
          </Pressable>
        )}
        {onSkip && !isLast && (
          <Pressable
            onPress={onSkip}
            style={[
              styles.btn,
              { backgroundColor: theme.tooltip.buttonSecondaryBg },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Skip tour"
          >
            <Text style={styles.btnText}>Skip</Text>
          </Pressable>
        )}
        <Pressable
          onPress={onNext}
          style={[
            styles.btn,
            { backgroundColor: theme.tooltip.buttonPrimaryBg },
          ]}
          accessibilityRole="button"
          accessibilityLabel={isLast ? 'Finish tour' : 'Next step'}
        >
          <Text style={styles.btnText}>{isLast ? 'Done' : 'Next'}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 6,
  },
  desc: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
