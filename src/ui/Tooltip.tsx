import React, { useEffect, useRef } from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
  findNodeHandle,
  AccessibilityInfo,
  Platform,
} from 'react-native';

import type { TooltipProps } from '@core/types';

import {
  announce,
  formatStepAnnouncement,
  getButtonLabel,
} from '@utils/accessibility';

/**
 * A tooltip component that displays step-by-step guidance in a coachmark tour.
 *
 * @remarks
 * This component renders a positioned tooltip with title, description, progress indicators,
 * and navigation buttons. It includes comprehensive accessibility support with screen reader
 * announcements and focus management.
 *
 * @param theme - Theme configuration for styling the tooltip
 * @param title - Optional title text displayed at the top of the tooltip
 * @param description - Optional description text providing additional context
 * @param pos - Position coordinates {x, y} for absolute positioning of the tooltip
 * @param index - Zero-based index of the current step in the tour
 * @param count - Total number of steps in the tour
 * @param onNext - Callback function invoked when the Next/Done button is pressed
 * @param onBack - Optional callback function invoked when the Back button is pressed
 * @param onSkip - Optional callback function invoked when the Skip button is pressed
 * @param onLayout - Optional callback invoked when the tooltip layout is measured, receives width and height
 *
 * @example
 * ```tsx
 * <Tooltip
 *   theme={myTheme}
 *   title="Welcome"
 *   description="This is your first step"
 *   pos={{ x: 100, y: 200 }}
 *   index={0}
 *   count={5}
 *   onNext={() => console.log('Next step')}
 *   onSkip={() => console.log('Skip tour')}
 * />
 * ```
 */
export const Tooltip: React.FC<TooltipProps> = ({
  theme,
  title,
  description,
  pos,
  index,
  count,
  onNext,
  onBack,
  onSkip,
  onLayout,
}) => {
  const isLast = index === count - 1;
  const containerRef = useRef<any>(null);

  useEffect(() => {
    const message = formatStepAnnouncement(
      { title, description },
      index,
      count
    );
    announce(message);

    if (containerRef.current && Platform.OS !== 'web') {
      const reactTag = findNodeHandle(containerRef.current);
      if (reactTag) {
        AccessibilityInfo.setAccessibilityFocus(reactTag);
      }
    }
  }, [index, title, description, count]);

  return (
    <View
      ref={containerRef}
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
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        onLayout?.({ width, height });
      }}
      accessible
      accessibilityRole="alert"
      accessibilityLabel={formatStepAnnouncement(
        { title, description },
        index,
        count
      )}
      accessibilityLiveRegion="polite"
      accessibilityViewIsModal
      importantForAccessibility="yes"
    >
      {!!title && (
        <Text style={[styles.title, { color: theme.tooltip.fg }]}>{title}</Text>
      )}
      {!!description && (
        <Text style={[styles.desc, { color: theme.tooltip.fg }]}>
          {description}
        </Text>
      )}

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
            accessibilityLabel={getButtonLabel('back', {
              current: index + 1,
              total: count,
            })}
            accessibilityHint="Double tap to go to the previous step"
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
            accessibilityLabel={getButtonLabel('skip')}
            accessibilityHint="Double tap to exit the tour"
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
          accessibilityLabel={getButtonLabel(
            isLast ? 'done' : 'next',
            isLast ? undefined : { current: index + 1, total: count }
          )}
          accessibilityHint={
            isLast
              ? 'Double tap to complete the tour'
              : 'Double tap to go to the next step'
          }
        >
          <Text style={styles.btnText}>{isLast ? 'Done' : 'Next'}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
