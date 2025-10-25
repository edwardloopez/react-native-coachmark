import React from 'react';

import { StyleSheet } from 'react-native';

import Animated, { useAnimatedProps } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import type { Rect, SpotlightShape } from '../core/types';

import { pathForCircle, pathForRect, pathForPill } from './shapes';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export type Hole = {
  rect: Rect;
  shape: SpotlightShape;
  radius?: number;
};

export type AnimatedHole = {
  x: SharedValue<number>;
  y: SharedValue<number>;
  width: SharedValue<number>;
  height: SharedValue<number>;
  shape: SpotlightShape;
  radius?: number;
};

/**
 * Static Mask (no animation) - for compatibility
 */
export const Mask: React.FC<{
  width: number;
  height: number;
  holes: Hole[];
  backdropColor: string;
  backdropOpacity: number;
}> = ({ width, height, holes, backdropColor, backdropOpacity }) => {
  const holesPath = holes
    .map((h) => {
      if (h.shape === 'circle') return pathForCircle(h.rect);
      if (h.shape === 'pill') return pathForPill(h.rect);
      return pathForRect(h.rect, h.radius ?? 12);
    })
    .join(' ');

  const fullRect = `M 0 0 H ${width} V ${height} H 0 Z`;
  const d = `${fullRect} ${holesPath}`;

  return (
    <Svg
      width={width}
      height={height}
      style={styles.container}
      pointerEvents="none"
    >
      <Path
        d={d}
        fill={backdropColor}
        opacity={backdropOpacity}
        fillRule="evenodd"
      />
    </Svg>
  );
};

/**
 * Animated Mask - smooth hole transitions with Reanimated
 */
export const AnimatedMask: React.FC<{
  width: number;
  height: number;
  holes: AnimatedHole[];
  backdropColor: string;
  backdropOpacity: number;
}> = ({ width, height, holes, backdropColor, backdropOpacity }) => {
  const animatedProps = useAnimatedProps(() => {
    'worklet';
    const fullRect = `M 0 0 H ${width} V ${height} H 0 Z`;

    const holePaths = holes
      .map((h) => {
        const rect: Rect = {
          x: h.x.value,
          y: h.y.value,
          width: h.width.value,
          height: h.height.value,
        };

        if (h.shape === 'circle') {
          const cx = rect.x + rect.width / 2;
          const cy = rect.y + rect.height / 2;
          const r = Math.max(rect.width, rect.height) / 2;
          return `M ${cx} ${cy} m -${r},0 a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0`;
        }

        if (h.shape === 'pill') {
          const r = Math.min(rect.height / 2, rect.width / 2);
          const rr = Math.min(r, Math.min(rect.width, rect.height) / 2);
          const x = rect.x,
            y = rect.y,
            w = rect.width,
            hh = rect.height;
          return `M ${x + rr} ${y} H ${x + w - rr} A ${rr} ${rr} 0 0 1 ${x + w} ${y + rr} V ${y + hh - rr} A ${rr} ${rr} 0 0 1 ${x + w - rr} ${y + hh} H ${x + rr} A ${rr} ${rr} 0 0 1 ${x} ${y + hh - rr} V ${y + rr} A ${rr} ${rr} 0 0 1 ${x + rr} ${y} Z`;
        }

        const radius = h.radius ?? 12;
        const rr = Math.min(radius, Math.min(rect.width, rect.height) / 2);
        const x = rect.x,
          y = rect.y,
          w = rect.width,
          hh = rect.height;
        return `M ${x + rr} ${y} H ${x + w - rr} A ${rr} ${rr} 0 0 1 ${x + w} ${y + rr} V ${y + hh - rr} A ${rr} ${rr} 0 0 1 ${x + w - rr} ${y + hh} H ${x + rr} A ${rr} ${rr} 0 0 1 ${x} ${y + hh - rr} V ${y + rr} A ${rr} ${rr} 0 0 1 ${x + rr} ${y} Z`;
      })
      .join(' ');

    const d = `${fullRect} ${holePaths}`;
    return { d };
  });

  return (
    <Svg
      width={width}
      height={height}
      style={styles.container}
      pointerEvents="none"
    >
      <AnimatedPath
        animatedProps={animatedProps}
        fill={backdropColor}
        opacity={backdropOpacity}
        fillRule="evenodd"
      />
    </Svg>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});
