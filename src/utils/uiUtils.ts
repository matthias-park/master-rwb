import {
  HeaderActiveNav,
  UIBackdrop,
  UIBackdropState,
} from '../types/UIConfig';
import { ComponentName } from '../constants';
import { HeaderRoute } from '../types/api/PageConfig';
import { isDesktop } from 'react-device-detect';
import { animateScroll as scroll } from 'react-scroll';

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
  const DISABLED_SCROLL_CLASS_DESKTOP = 'modal-open-desktop';
  const classList = document.body.classList;
  if (enabledScroll) {
    return isDesktop
      ? classList.remove(DISABLED_SCROLL_CLASS, DISABLED_SCROLL_CLASS_DESKTOP)
      : classList.remove(DISABLED_SCROLL_CLASS);
  }
  return isDesktop
    ? classList.add(DISABLED_SCROLL_CLASS, DISABLED_SCROLL_CLASS_DESKTOP)
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

export const createHeaderNavProviderValues = (
  activeHeaderNav: string | null,
  setActiveHeaderNav: (newState: string | null) => void,
  currentRoute?: string,
  headerLinks?: HeaderRoute[],
): HeaderActiveNav => {
  const toggle = (name?: string | null) => {
    const navName = name && (name.includes('hover:') ? name : `hover:${name}`);
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
  spinnerEl?.remove();
};

export const setPageLoadingSpinner = () => {
  if (!document.getElementsByClassName('page-loading-spinner')[0]) {
    const body = <HTMLElement>document.querySelector('body');
    const spinnerEl = <HTMLElement>document.createElement('DIV');
    spinnerEl.id = 'page-loading-spinner';
    spinnerEl.classList.add('page-loading-spinner');
    const spinnerImg = <HTMLImageElement>document.createElement('IMG');
    spinnerImg.classList.add('spinner-img');
    spinnerImg.src = '/assets/scoore-loader.svg';
    spinnerEl.appendChild(spinnerImg);
    body?.appendChild(spinnerEl);
  }
};

export const hideKambiSportsbook = () => {
  document.getElementById('root')?.classList.add('sb-hidden');
  if (window.KambiWapi) {
    window.KambiWapi.set(window.KambiWapi.CLIENT_HIDE);
    window.KambiWapi.set(window.KambiWapi.BETSLIP_HIDE);
  }
};

export const showKambiSportsbook = () => {
  document.getElementById('root')?.classList.remove('sb-hidden');
  if (window.KambiWapi) {
    window.KambiWapi.set(window.KambiWapi.CLIENT_SHOW);
    window.KambiWapi.set(window.KambiWapi.BETSLIP_SHOW);
  }
};

export const checkHrOverflow = (containerSelector, itemSelector) => {
  return (
    document.querySelectorAll(itemSelector)[0]?.offsetWidth >=
    document.querySelectorAll(containerSelector)[0]?.offsetWidth
  );
};
