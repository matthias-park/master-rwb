import { UIBackdrop, UIBackdropState } from '../types/UIConfig';
import { ComponentName } from '../constants';
import { throttle } from './index';

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

let setNewBackdropCallback;
export const createBackdropProviderValues = (
  backdrop: UIBackdropState,
  setBackdrop: (newState: UIBackdropState) => void,
): UIBackdrop => {
  if (!setNewBackdropCallback) {
    setNewBackdropCallback = throttle(setBackdrop, 300);
  }
  const toggle = (show?: boolean, ignoredComponents: ComponentName[] = []) => {
    const active = show ?? !backdrop.active;
    setNewBackdropCallback({
      active,
      ignoredComponents: active ? ignoredComponents : [],
    });
  };
  const show = (ignoredComponents: ComponentName[] = []) =>
    setNewBackdropCallback({ active: true, ignoredComponents });
  const hide = () =>
    setNewBackdropCallback({ active: false, ignoredComponents: [] });

  return {
    ...backdrop,
    toggle,
    show,
    hide,
  };
};

export const enterKeyPress = (e: any, callback: any) => {
  const charCode = typeof e.which === 'number' ? e.which : e.keyCode;
  const enterKey = 13;
  if (charCode === enterKey) {
    callback();
  }
};
