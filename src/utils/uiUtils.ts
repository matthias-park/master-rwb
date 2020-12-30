import { UIBackdrop, UIBackdropState } from 'types/UIConfig';
import { ComponentName } from '../constants';

export const changeBackdropVisibility = (visibility: boolean) => {
  const SHOW_CLASS = 'show';
  const classList = document.getElementById('backdrop')?.classList;
  changeBodyScroll(!visibility);
  if (visibility) {
    return classList?.add(SHOW_CLASS);
  }
  return classList?.remove(SHOW_CLASS);
};

export const changeBodyScroll = (enabledScroll: boolean) => {
  const DISABLED_SCROLL_CLASS = 'modal-open';
  const classList = document.body.classList;
  if (enabledScroll) {
    return classList.remove(DISABLED_SCROLL_CLASS);
  }
  return classList.add(DISABLED_SCROLL_CLASS);
};

export const createBackdropProviderValues = (
  backdrop: UIBackdropState,
  setBackdrop: (newState: UIBackdropState) => void,
): UIBackdrop => {
  const toggle = (show?: boolean, ignoredComponents: ComponentName[] = []) => {
    const active = show ?? !backdrop.active;
    setBackdrop({
      active,
      ignoredComponents: active ? ignoredComponents : [],
    });
  };
  const show = (ignoredComponents: ComponentName[] = []) =>
    setBackdrop({ active: true, ignoredComponents });
  const hide = () => setBackdrop({ active: false, ignoredComponents: [] });

  return {
    ...backdrop,
    toggle,
    show,
    hide,
  };
};
