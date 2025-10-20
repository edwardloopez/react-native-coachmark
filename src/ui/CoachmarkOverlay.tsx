import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { useCoachmarkContext } from '../core/CoachmarkContext';
import { measureInWindowByRef } from '../utils/measure';
import { isRectVisible } from '../utils/autoScroll';
import { AnimatedMask } from './Mask';
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
  if (renderer) {
    return <>{renderer(props)}</>;
  }
  return fallback;
};

export const CoachmarkOverlay: React.FC = () => {
  const { state, getAnchor, setMeasured, next, back, stop, theme } =
    useCoachmarkContext();
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

  const holeX = useSharedValue(0);
  const holeY = useSharedValue(0);
  const holeWidth = useSharedValue(1);
  const holeHeight = useSharedValue(1);
  const [holeShape, setHoleShape] = useState<'rect' | 'circle' | 'pill'>(
    'rect'
  );
  const [holeRadius, setHoleRadius] = useState(12);

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

      const autoFocus = activeStep.autoFocus;
      if (autoFocus === 'ifNeeded' || autoFocus === 'always') {
        await activeStep.onBeforeScroll?.();

        if (!anchor.scrollRef?.current) {
          console.warn(
            `[Coachmark] autoFocus is set for step "${activeStep.id}" but no scrollRef provided in CoachmarkAnchor. ` +
              `Please add scrollRef prop to enable auto-scrolling.`
          );
        } else {
          const behavior = activeStep.scrollBehavior ?? 'smooth';
          const padding = activeStep.scrollPadding ?? 20;
          const force = autoFocus === 'always';

          const rect = await measureInWindowByRef(ref);
          if (cancelled) return;

          const { isVisible } = isRectVisible(rect, padding);

          if (!isVisible || force) {
            const targetY = rect.y - H / 2 + rect.height / 2;
            const scrollY = Math.max(0, targetY);
            const animated = behavior === 'smooth';

            anchor.scrollRef.current?.scrollTo?.({
              y: scrollY,
              animated,
            });
            anchor.scrollRef.current?.scrollToOffset?.({
              offset: scrollY,
              animated,
            });

            await new Promise((resolve) =>
              setTimeout(resolve, animated ? 300 : 50)
            );

            const scrollDelay = activeStep.scrollDelay ?? 150;
            if (scrollDelay > 0) {
              await new Promise((resolve) => setTimeout(resolve, scrollDelay));
            }
          }
        }
      }

      if (cancelled) return;

      const rect = await measureInWindowByRef(ref);
      if (cancelled) return;

      const padded = inset(rect, anchor.padding ?? 10);
      setMeasured(activeStep.id, rect);
      setTargetRect(padded);

      const shape = anchor.shape ?? activeStep.shape ?? 'rect';
      const radius = anchor.radius ?? activeStep.radius ?? 12;

      setHoleShape(shape);
      setHoleRadius(radius);

      const duration = reduceMotion ? 0 : theme.motion.durationMs;
      const ease = Easing.out(Easing.cubic);

      holeX.value = withTiming(padded.x, { duration, easing: ease });
      holeY.value = withTiming(padded.y, { duration, easing: ease });
      holeWidth.value = withTiming(padded.width, { duration, easing: ease });
      holeHeight.value = withTiming(padded.height, { duration, easing: ease });

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
