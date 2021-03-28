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

export type HeaderActiveNav = {
  active: string | null;
  toggle: (name?: string | null) => void;
};

type UIConfig = {
  backdrop: UIBackdrop;
  showModal: ComponentName | null;
  setShowModal: (ComponentName) => void;
  headerNav: HeaderActiveNav;
};

export default UIConfig;
