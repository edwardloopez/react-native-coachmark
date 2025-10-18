import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { defaultTheme } from './theme';
import type { CoachmarkTheme, Plugin, StorageAdapter } from './types';
import { useCoachmarkStore } from './store';
import { memoryStorage } from './storage';

export type CoachmarkContextValue = ReturnType<typeof useCoachmarkStore> & {
  theme: CoachmarkTheme;
  storage: StorageAdapter;
};

const Ctx = createContext<CoachmarkContextValue>(null as any);

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
  }, [store, plugins]);

  return (
    <Ctx.Provider value={{ ...store, theme: mergedTheme, storage: memStorage }}>
      {children}
    </Ctx.Provider>
  );
};

export const useCoachmarkContext = () => useContext(Ctx);
