import {
  HeaderActiveNav,
  UIBackdrop,
  UIBackdropState,
} from '../types/UIConfig';
import { ComponentName } from '../constants';
import { HeaderRoute } from '../types/api/PageConfig';

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

export const createHeaderNavProviderValues = (
  activeHeaderNav: string | null,
  setActiveHeaderNav: (newState: string | null) => void,
  currentRoute?: string,
  headerLinks?: HeaderRoute[],
): HeaderActiveNav => {
  const toggle = (name?: string | null) => {
    const navName = name && (name.includes('click:') ? name : `click:${name}`);
    let activeRouteName =
      navName && navName !== activeHeaderNav ? navName : null;
    if (!activeRouteName && currentRoute && headerLinks) {
      activeRouteName =
        headerLinks.find(
          link => !!link.prefix && currentRoute.startsWith(link.prefix),
        )?.name || null;
    }
    setActiveHeaderNav(activeRouteName);
  };

  return {
    active: activeHeaderNav,
    toggle,
  };
};

export const enterKeyPress = (e: any, callback: any) => {
  const charCode = typeof e.which === 'number' ? e.which : e.keyCode;
  const enterKey = 13;
  if (charCode === enterKey) {
    callback();
  }
};

export const makeCollapsible = (
  mainElClass: string,
  collapseElClass: string,
  headerElClass,
) => {
  Array.from(document.getElementsByClassName(mainElClass)).forEach(el => {
    el.addEventListener('click', e => {
      const currentEl = e.currentTarget as HTMLElement;
      const collapseEl = currentEl.getElementsByClassName(
        collapseElClass,
      )[0] as HTMLElement;
      const collapseHeader = currentEl.getElementsByClassName(
        headerElClass,
      )[0] as HTMLElement;
      if (collapseEl) {
        if (collapseEl.classList.contains('show')) {
          collapseEl.classList.remove('show');
          currentEl.classList.remove('active');
          collapseHeader.classList.remove('active');
        } else {
          collapseEl.classList.add('show');
          currentEl.classList.add('active');
          collapseHeader.classList.add('active');
        }
      }
    });
  });
};

export const removePageLoadingSpinner = () => {
  const spinnerEl = document.getElementById('page-loading-spinner');
  spinnerEl?.remove();
};
