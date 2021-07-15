import {
  HeaderActiveNav,
  UIBackdrop,
  UIBackdropState,
} from '../types/UIConfig';
import { ComponentName } from '../constants';
import { HeaderRoute } from '../types/api/PageConfig';
import { isWindows } from 'react-device-detect';

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
  const DISABLED_SCROLL_CLASS_WINDOWS = 'modal-open-windows';
  const classList = document.body.classList;
  if (enabledScroll) {
    return isWindows
      ? classList.remove(DISABLED_SCROLL_CLASS, DISABLED_SCROLL_CLASS_WINDOWS)
      : classList.remove(DISABLED_SCROLL_CLASS);
  }
  return isWindows
    ? classList.add(DISABLED_SCROLL_CLASS, DISABLED_SCROLL_CLASS_WINDOWS)
    : classList.add(DISABLED_SCROLL_CLASS);
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

let activeHeaderNavCopy: string | null = null;
export const createHeaderNavProviderValues = (
  activeHeaderNav: string | null,
  setActiveHeaderNav: (newState: string | null) => void,
  currentRoute?: string,
  headerLinks?: HeaderRoute[],
): HeaderActiveNav => {
  const hoverPrefix = 'hover:';
  const toggle = (name?: string | null, active?: boolean) => {
    let navName = name && active ? name : null;
    if (!navName && currentRoute && headerLinks) {
      navName =
        headerLinks.find(
          link => !!link.prefix && currentRoute.startsWith(link.prefix),
        )?.name || null;
    }
    if (!navName && !name && activeHeaderNavCopy?.includes(hoverPrefix)) return;
    if (
      activeHeaderNavCopy?.includes(hoverPrefix) &&
      activeHeaderNavCopy !== name &&
      !active
    )
      return;
    activeHeaderNavCopy = navName;
    setActiveHeaderNav(navName);
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
  headerElClass: string,
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
  if (!spinnerEl) return;
  if (typeof spinnerEl.remove == 'function') {
    spinnerEl.remove();
  } else {
    spinnerEl.outerHTML = '';
  }
};

export const setPageLoadingSpinner = () => {
  if (!document.getElementsByClassName('page-loading-spinner')[0]) {
    const body = document.querySelector<HTMLElement>('body');
    const spinnerEl = document.createElement('DIV') as HTMLElement;
    spinnerEl.id = 'page-loading-spinner';
    spinnerEl.classList.add('page-loading-spinner');
    const spinnerImg = document.createElement('IMG') as HTMLImageElement;
    spinnerImg.classList.add('spinner-img');
    spinnerImg.src = '/assets/loading-spinner.svg';
    spinnerEl.appendChild(spinnerImg);
    body?.appendChild(spinnerEl);
  }
};

export const hideKambiSportsbook = () =>
  document.getElementById('root')?.classList.add('sb-hidden');

export const showKambiSportsbook = () =>
  document.getElementById('root')?.classList.remove('sb-hidden');

export const checkHrOverflow = (containerSelector, itemSelector) => {
  return (
    document.querySelectorAll(itemSelector)[0]?.offsetWidth >=
    document.querySelectorAll(containerSelector)[0]?.offsetWidth
  );
};
