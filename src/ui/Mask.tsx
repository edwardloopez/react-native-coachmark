import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { Rect, SpotlightShape } from '../core/types';
import { pathForCircle, pathForRect, pathForPill } from './shapes';
import { StyleSheet } from 'react-native';

export type Hole = {
  rect: Rect;
  shape: SpotlightShape;
  radius?: number;
};

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

  // Even-odd fill: one big rect minus the holes path
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

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});
