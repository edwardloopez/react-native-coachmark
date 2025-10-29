import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';

import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  type LayoutChangeEvent,
} from 'react-native';

import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { useCoachmarkContext } from '../core/CoachmarkContext';
import type { TooltipRenderProps, TooltipRenderer } from '../core/types';
import { useOrientationChange } from '../hooks/useOrientationChange';
import { useTooltipPosition } from '../hooks/useTooltipPosition';
import { useTourMeasurement } from '../hooks/useTourMeasurement';
import { isReduceMotionEnabled } from '../utils/accessibility';

import { CoachmarkErrorBoundary } from './CoachmarkErrorBoundary';
import { AnimatedMask } from './Mask';
import { Tooltip } from './Tooltip';

/**
 * Memoized wrapper component to safely render custom tooltips with hooks
 * This ensures hooks are always called in the same order by always mounting the same component
 */
const CustomTooltipWrapper = memo<{
  renderer: TooltipRenderer | undefined;
  props: TooltipRenderProps;
  fallback: React.ReactElement;
}>(({ renderer, props, fallback }) => {
  if (renderer) {
    return <>{renderer(props)}</>;
  }
  return fallback;
});

CustomTooltipWrapper.displayName = 'CustomTooltipWrapper';

/**
 * Main overlay component for displaying coachmarks
 * Optimized with React.memo and custom hooks to reduce re-renders
 */
export const CoachmarkOverlay: React.FC = () => {
  const { state, getAnchor, setMeasured, next, back, stop, theme } =
    useCoachmarkContext();

  const [tooltipSize, setTooltipSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  const opacity = useSharedValue(0);
  const holeX = useSharedValue(0);
  const holeY = useSharedValue(0);
  const holeWidth = useSharedValue(1);
  const holeHeight = useSharedValue(1);

  const { width: W, height: H } = Dimensions.get('window');
  const activeStep = state.activeTour?.steps[state.index];

  useEffect(() => {
    isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  useEffect(() => {
    const duration = reduceMotion ? 0 : theme.motion.durationMs;
    opacity.value = withTiming(state.isActive ? 1 : 0, {
      duration,
    });
  }, [opacity, state.isActive, theme.motion.durationMs, reduceMotion]);

  const { targetRect, holeShape, holeRadius, remeasure } = useTourMeasurement({
    activeStep,
    index: state.index,
    tourKey: state.activeTour?.key,
    getAnchor,
    setMeasured,
    next,
    reduceMotion,
    durationMs: theme.motion.durationMs,
    holeX,
    holeY,
    holeWidth,
    holeHeight,
  });

  const tooltipPos = useTooltipPosition({
    targetRect,
    tooltipSize,
    activeStep,
  });

  const handleOrientationChange = useCallback(() => {
    remeasure();
  }, [remeasure]);

  useOrientationChange(state.isActive, handleOrientationChange);

  const aStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const handleTooltipLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setTooltipSize({ width, height });
  }, []);

  const handleSkip = useCallback(() => stop('skipped'), [stop]);

  const tooltipRenderProps: TooltipRenderProps | null = useMemo(() => {
    if (!activeStep || !state.activeTour) return null;
    return {
      theme,
      title: activeStep.title,
      description: activeStep.description,
      index: state.index,
      count: state.activeTour.steps.length,
      isFirst: state.index === 0,
      isLast: state.index === state.activeTour.steps.length - 1,
      onNext: next,
      onBack: back,
      onSkip: handleSkip,
      currentStep: activeStep,
    };
  }, [
    theme,
    activeStep,
    state.index,
    state.activeTour,
    next,
    back,
    handleSkip,
  ]);

  if (!state.isActive || !activeStep || !tooltipRenderProps) return null;

  const customRenderer =
    activeStep.renderTooltip || state.activeTour?.renderTooltip;

  return (
    <Modal transparent visible animationType="none">
      <Animated.View style={[StyleSheet.absoluteFill, aStyle]}>
        <AnimatedMask
          width={W}
          height={H}
          holes={[
            {
              x: holeX,
              y: holeY,
              width: holeWidth,
              height: holeHeight,
              shape: holeShape,
              radius: holeRadius,
            },
          ]}
          backdropColor={theme.backdropColor}
          backdropOpacity={theme.backdropOpacity}
        />

        <Pressable style={StyleSheet.absoluteFill} onPress={next} />

        <Animated.View
          style={[
            styles.tooltipContainer,
            { left: tooltipPos.x, top: tooltipPos.y },
          ]}
          onLayout={handleTooltipLayout}
        >
          <CoachmarkErrorBoundary
            onError={(error) => {
              console.error('[Coachmark] Custom tooltip error:', error);
            }}
            onReset={next}
          >
            <CustomTooltipWrapper
              renderer={customRenderer}
              props={tooltipRenderProps}
              fallback={
                <Tooltip
                  theme={theme}
                  title={activeStep.title}
                  description={activeStep.description}
                  pos={{ x: 0, y: 0 }}
                  index={state.index}
                  count={state.activeTour?.steps.length ?? 0}
                  onNext={next}
                  onBack={state.index > 0 ? back : undefined}
                  onSkip={handleSkip}
                  onLayout={(size) => setTooltipSize(size)}
                />
              }
            />
          </CoachmarkErrorBoundary>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  tooltipContainer: {
    position: 'absolute',
  },
});
