export type ID = string;
export type SpotlightShape = 'circle' | 'rect' | 'pill';
export type Placement = 'top' | 'bottom' | 'left' | 'right' | 'auto';

export type Rect = { x: number; y: number; width: number; height: number };

export type AnchorRegistration = {
  id: ID;
  shape?: SpotlightShape;
  padding?: number;
  radius?: number;
  getRef: () => any;
};

export type TourStep = {
  id: ID;
  title?: string;
  description?: string;
  shape?: SpotlightShape;
  placement?: Placement;
  padding?: number;
  radius?: number;
  allowPassthrough?: boolean;
  onBeforeEnter?: () => Promise<boolean | void>;
  onEnter?: () => void;
  onExit?: () => void;
};

export type Tour = {
  key: string;
  steps: TourStep[];
  showOnce?: boolean;
};

export type CoachmarkTheme = {
  backdropColor: string;
  backdropOpacity: number;
  holeShadowOpacity: number;
  tooltip: {
    maxWidth: number;
    radius: number;
    bg: string;
    fg: string;
    arrowSize: number;
    padding: number;
    buttonPrimaryBg: string;
    buttonSecondaryBg: string;
  };
  motion: {
    durationMs: number;
    easing: (t: number) => number;
  };
};

export type CoachmarkState = {
  activeTour: Tour | null;
  index: number;
  isActive: boolean;
  measured: Record<ID, Rect>;
};

export type StorageAdapter = {
  get: (k: string) => Promise<string | null>;
  set: (k: string, v: string) => Promise<void>;
};

export type Plugin = {
  onStart?: (tour: Tour) => void;
  onStep?: (tour: Tour, index: number, step: TourStep) => void;
  onFinish?: (tour: Tour, reason: 'completed' | 'skipped') => void;
};
