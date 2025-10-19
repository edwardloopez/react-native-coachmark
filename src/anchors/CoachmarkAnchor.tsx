import React, { useEffect, useRef } from 'react';
import { View, type ViewProps } from 'react-native';
import { useCoachmarkContext } from '../core/CoachmarkContext';
import type { SpotlightShape } from '../core/types';

export const CoachmarkAnchor: React.FC<
  ViewProps & {
    id: string;
    shape?: SpotlightShape;
    padding?: number;
    radius?: number;
    children?: React.ReactNode;
  }
> = ({ id, shape, padding, radius, children, ...rest }) => {
  const { register, unregister } = useCoachmarkContext();
  const ref = useRef<any>(null);

  useEffect(() => {
    register({
      id,
      shape,
      padding,
      radius,
      getRef: () => ref.current,
    });
    return () => {
      unregister(id);
    };
  }, [id, shape, padding, radius, register, unregister]);

  return (
    <View ref={ref} collapsable={false} {...rest}>
      {children}
    </View>
  );
};
