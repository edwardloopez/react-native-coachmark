import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useCoachmarkContext } from '../core/CoachmarkContext';
import { measureInWindowByRef } from '../utils/measure';
import type { Hole } from './Mask';
import { Mask } from './Mask';
import { inset } from './shapes';
import { computeTooltipPosition } from '../utils/placement';
import { Tooltip } from './Tooltip';
import { isReduceMotionEnabled } from '../utils/accessibility';
import type { TooltipRenderProps, TooltipRenderer } from '../core/types';

/**
 * Wrapper component to safely render custom tooltips with hooks
 * This ensures hooks are always called in the same order by always mounting the same component
 */
const CustomTooltipWrapper: React.FC<{
  renderer: TooltipRenderer | undefined;
  props: TooltipRenderProps;
  fallback: React.ReactElement;
}> = ({ renderer, props, fallback }) => {
  // Always call hooks in the same order
  if (renderer) {
    return <>{renderer(props)}</>;
  }
  return fallback;
};

export const CoachmarkOverlay: React.FC = () => {
  const { state, getAnchor, setMeasured, next, back, stop, theme } =
    useCoachmarkContext();
  const [holes, setHoles] = useState<Hole[]>([]);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({
    x: -9999,
    y: -9999,
  });
  const [tooltipSize, setTooltipSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [targetRect, setTargetRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const opacity = useSharedValue(0);
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

  useEffect(() => {
    let cancelled = false;
    async function remeasure() {
      if (!activeStep) return;

      if (activeStep.onBeforeEnter) {
        const proceed = await activeStep.onBeforeEnter();
        if (proceed === false) {
          next();
          return;
        }
      }

      const anchor = getAnchor(activeStep.id);
      if (!anchor) {
        console.warn(`[Coachmark] Anchor "${activeStep.id}" not found`);
        return;
      }
      const ref = anchor.getRef();
      if (!ref) {
        console.warn(`[Coachmark] Ref for "${activeStep.id}" is null`);
        return;
      }

      const rect = await measureInWindowByRef(ref);
      if (cancelled) return;

      const padded = inset(rect, anchor.padding ?? 10);
      setMeasured(activeStep.id, rect);
      setTargetRect(padded);

      const shape = anchor.shape ?? activeStep.shape ?? 'rect';
      const hole: Hole = {
        rect: padded,
        shape,
        radius: anchor.radius ?? activeStep.radius,
      };
      setHoles([hole]);

      activeStep.onEnter?.();
    }

    remeasure();

    return () => {
      cancelled = true;
      activeStep?.onExit?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.index, state.activeTour, activeStep?.id, W, H]);

  useEffect(() => {
    if (!targetRect || !tooltipSize || !activeStep) return;

    const pos = computeTooltipPosition(
      W,
      H,
      targetRect,
      activeStep.placement ?? 'auto',
      { w: tooltipSize.width, h: tooltipSize.height },
      20
    );

    setTooltipPos({ x: pos.x, y: pos.y });
  }, [targetRect, tooltipSize, W, H, activeStep]);

  const aStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  if (!state.isActive || !activeStep) return null;

  const customRenderer =
    activeStep.renderTooltip || state.activeTour?.renderTooltip;

  const tooltipRenderProps = {
    theme,
    title: activeStep.title,
    description: activeStep.description,
    index: state.index,
    count: state.activeTour?.steps.length ?? 0,
    isFirst: state.index === 0,
    isLast: state.index === (state.activeTour?.steps.length ?? 0) - 1,
    onNext: next,
    onBack: back,
    onSkip: () => stop('skipped'),
    currentStep: activeStep,
  };

  return (
    <Modal transparent visible animationType="none">
      <Animated.View style={[StyleSheet.absoluteFill, aStyle]}>
        <Mask
          width={W}
          height={H}
          holes={holes}
          backdropColor={theme.backdropColor}
          backdropOpacity={theme.backdropOpacity}
        />

        <Pressable style={StyleSheet.absoluteFill} onPress={next} />

        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            position: 'absolute',
            left: tooltipPos.x,
            top: tooltipPos.y,
          }}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setTooltipSize({ width, height });
          }}
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
                onSkip={() => stop('skipped')}
                onLayout={(size) => setTooltipSize(size)}
              />
            }
          />
        </View>
      </Animated.View>
    </Modal>
  );
};
