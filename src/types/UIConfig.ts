import { ComponentName } from '../constants';
export type UIBackdropState = {
  active: boolean;
  ignoredComponents: ComponentName[];
};
export type UIBackdrop = {
  toggle: (show?: boolean, ignoredComponents?: ComponentName[]) => void;
  show: (ignoredComponents?: ComponentName[]) => void;
  hide: () => void;
} & UIBackdropState;

export type UIContentStyle = {
  styles: React.CSSProperties;
  set: (styles: React.CSSProperties, clear?: boolean) => void;
  clear: () => void;
};

type UIConfig = {
  backdrop: UIBackdrop;
  contentStyle: UIContentStyle;
};

export default UIConfig;
