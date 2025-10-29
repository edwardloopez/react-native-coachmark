import React, { createContext, useContext, useMemo, useEffect } from 'react';

import { memoryStorage } from './storage';
import { useCoachmarkStore } from './store';
import { defaultTheme } from './theme';
import type { CoachmarkTheme, Plugin, StorageAdapter } from './types';

export type CoachmarkContextValue = ReturnType<typeof useCoachmarkStore> & {
  theme: CoachmarkTheme;
  storage: StorageAdapter;
};

const Ctx = createContext<CoachmarkContextValue | undefined>(undefined);

export const CoachmarkProvider: React.FC<{
  children: React.ReactNode;
  theme?: Partial<CoachmarkTheme>;
  storage?: StorageAdapter;
  plugins?: Plugin[];
}> = ({ children, theme, storage, plugins = [] }) => {
  const memStorage: StorageAdapter = storage ?? memoryStorage();
  const store = useCoachmarkStore(memStorage);

  const mergedTheme = useMemo(
    () => ({
      ...defaultTheme,
      ...theme,
      tooltip: { ...defaultTheme.tooltip, ...(theme?.tooltip || {}) },
      motion: { ...defaultTheme.motion, ...(theme?.motion || {}) },
    }),
    [theme]
  );

  useEffect(() => {
    store.addPlugins(plugins);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plugins]);

  return (
    <Ctx.Provider value={{ ...store, theme: mergedTheme, storage: memStorage }}>
      {children}
    </Ctx.Provider>
  );
};

/**
 * Hook to access the coachmark context
 * @throws Error if used outside of CoachmarkProvider
 */
export const useCoachmarkContext = (): CoachmarkContextValue => {
  const context = useContext(Ctx);

  if (!context) {
    throw new Error(
      'useCoachmarkContext must be used within a CoachmarkProvider. ' +
        'Make sure your component is wrapped with <CoachmarkProvider>.'
    );
  }

  return context;
};
