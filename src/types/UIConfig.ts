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

type UIConfig = {
  backdrop: UIBackdrop;
};

export default UIConfig;