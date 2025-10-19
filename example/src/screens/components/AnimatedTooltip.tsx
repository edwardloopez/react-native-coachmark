import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { TooltipRenderProps } from 'react-native-coachmark';

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
  }, [props.index, scaleAnim]);

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
});
