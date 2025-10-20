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
    scrollRef?: React.RefObject<any>;
    children?: React.ReactNode;
  }
> = ({ id, shape, padding, radius, scrollRef, children, ...rest }) => {
  const { register, unregister } = useCoachmarkContext();
  const ref = useRef<any>(null);

  useEffect(() => {
    register({
      id,
      shape,
      padding,
      radius,
      getRef: () => ref.current,
      scrollRef,
    });
    return () => {
      unregister(id);
    };
  }, [id, shape, padding, radius, scrollRef, register, unregister]);

  return (
    <View ref={ref} collapsable={false} {...rest}>
      {children}
    </View>
  );
};
