import {
  HeaderActiveNav,
  UIBackdrop,
  UIBackdropState,
} from '../types/UIConfig';
import { ComponentName, Franchise } from '../constants';
import { HeaderRoute } from '../types/api/PageConfig';
import { isWindows } from 'react-device-detect';
import * as Sentry from '@sentry/react';
import { formatUrl } from './apiUtils';

export const changeBackdropVisibility = (visibility: boolean) => {
  const SHOW_CLASS = 'show';
  const classList = document.getElementById('backdrop')?.classList;
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
  document.body.setAttribute('style', '');
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
  Array.from(document.getElementsByClassName(headerElClass)).forEach(el => {
    if (el.parentElement?.className === mainElClass) {
      el.addEventListener('click', e => {
        const currentEl = e.currentTarget as HTMLElement;
        const collapseEl = currentEl?.parentElement?.getElementsByClassName(
          collapseElClass,
        )[0] as HTMLElement;
        if (collapseEl) {
          if (collapseEl.classList.contains('show')) {
            collapseEl.classList.remove('show');
            currentEl.classList.remove('active');
          } else {
            collapseEl.classList.add('show');
            currentEl.classList.add('active');
          }
        }
      });
    }
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

export const injectZendeskScript = () => {
  const key = window.__config__.zendesk;
  if (!key) return;
  const scriptTag = document.createElement('script');
  scriptTag.id = 'ze-snippet';
  scriptTag.src = `https://static.zdassets.com/ekr/snippet.js?key=${window.__config__.zendesk}`;
  scriptTag.onerror = e => {
    Sentry.captureEvent(e);
  };
  document.body.appendChild(scriptTag);
};

export const injectWagerGamesScript = () => {
  const url = window.__config__.wagerGames;
  if (!url) return;
  const scriptTag = document.createElement('script');
  scriptTag.id = 'wg-snippet';
  scriptTag.type = 'module';
  scriptTag.defer = true;
  scriptTag.src = url;
  scriptTag.onerror = e => {
    Sentry.captureEvent(e);
  };
  document.body.appendChild(scriptTag);
};

export const injectFullstoryScript = () => {
  const key = window.__config__.fullStory;
  if (!key) return;
  const scriptTag = document.createElement('script');
  scriptTag.id = 'fs-snippet';
  scriptTag.type = 'text/javascript';
  scriptTag.text = `window['_fs_host'] = 'fullstory.com';
  window['_fs_script'] = 'edge.fullstory.com/s/fs.js';
  window['_fs_org'] = 'o-1FK3EA-na1';
  window['_fs_namespace'] = 'FS';
  (function(m,n,e,t,l,o,g,y){
      if (e in m) {if(m.console && m.console.log) { m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');} return;}
      g=m[e]=function(a,b,s){g.q?g.q.push([a,b,s]):g._api(a,b,s);};g.q=[];
      o=n.createElement(t);o.async=1;o.crossOrigin='anonymous';o.src='https://'+_fs_script;
      y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);
      g.identify=function(i,v,s){g(l,{uid:i},s);if(v)g(l,v,s)};g.setUserVars=function(v,s){g(l,v,s)};g.event=function(i,v,s){g('event',{n:i,p:v},s)};
      g.anonymize=function(){g.identify(!!0)};
      g.shutdown=function(){g("rec",!1)};g.restart=function(){g("rec",!0)};
      g.log = function(a,b){g("log",[a,b])};
      g.consent=function(a){g("consent",!arguments.length||a)};
      g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;g(o,v)};
      g.clearUserCookie=function(){};
      g.setVars=function(n, p){g('setVars',[n,p]);};
      g._w={};y='XMLHttpRequest';g._w[y]=m[y];y='fetch';g._w[y]=m[y];
      if(m[y])m[y]=function(){return g._w[y].apply(this,arguments)};
      g._v="1.3.0";
  })(window,document,window['_fs_namespace'],'script','user');`;
  scriptTag.onerror = e => {
    Sentry.captureEvent(e);
  };
  document.head.appendChild(scriptTag);
};

export const injectLeverageMediaScript = () => {
  const key = window.__config__.leverageMedia;
  if (!key) return;
  const scriptTag = document.createElement('script');
  scriptTag.id = 'lm-snippet';
  scriptTag.type = 'text/javascript';
  scriptTag.text = `var _paq = window._paq = window._paq || [];
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
  var u="app.leveragemedia.io/";
  _paq.push(['setTrackerUrl', u+'matomo.php']);
  _paq.push(['setSiteId', '1205']);
  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
  })();`;
  scriptTag.onerror = e => {
    Sentry.captureEvent(e);
  };
  document.head.appendChild(scriptTag);
};

export const injectTrackerScript = (
  url: string,
  id?: number | string,
  currency?: string,
  stake?: number | string,
) => {
  if (!Franchise.desertDiamond) return;
  const oldScript = document.getElementById(`betradar-${url}`);
  if (oldScript) {
    oldScript.remove();
  }

  const currencies = {
    $: 'USD',
    '€': 'EUR',
  };

  const formattedUrl = formatUrl(
    `https://zz.connextra.com/dcs/tagController/tag/81344f961868/${url}`,
    {
      AccountID: id,
      Currency: !!currency && currencies[currency],
      Stake: stake,
    },
  );

  const scriptTag = document.createElement('script');
  scriptTag.src = formattedUrl;
  scriptTag.id = `betradar-${url}`;
  scriptTag.async = true;
  scriptTag.defer = true;
  document.body.appendChild(scriptTag);
};
