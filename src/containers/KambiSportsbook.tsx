import React, {
  useEffect,
  useState,
  useRef,
  createContext,
  useContext,
  useMemo,
} from 'react';
import { useConfig } from '../hooks/useConfig';
import useDesktopWidth from '../hooks/useDesktopWidth';
import clsx from 'clsx';
import RailsApiResponse from '../types/api/RailsApiResponse';
import { getApi } from '../utils/apiUtils';
import { WidgetAPI } from '../types/KambiConfig';
import Spinner from 'react-bootstrap/Spinner';
import { KambiSbLocales, PagesName } from '../constants';
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import { hideKambiSportsbook, showKambiSportsbook } from '../utils/uiUtils';
import { useAuth } from '../hooks/useAuth';
import { usePrevious, useRoutePath } from '../hooks';
import { useDispatch } from 'react-redux';
import { setBalance } from '../state/reducers/user';

interface KambiContext {
  sportsbookLoaded: boolean;
  setSportsbookLoaded: (loaded: boolean) => void;
  api: WidgetAPI | null;
  setApi: (api: WidgetAPI | null) => void;
  kambiUserLoggedIn: boolean;
}

const kambiContext = createContext<KambiContext>({
  sportsbookLoaded: false,
  setSportsbookLoaded: () => {},
  api: null,
  setApi: () => {},
  kambiUserLoggedIn: false,
});

const kambiLogin = (api: WidgetAPI, locale: string, userId?: string) => {
  getSBParams(locale, userId).then(kambiConfig => {
    api.request(api.LOGIN, {
      punterId: kambiConfig.playerId,
      ticket: kambiConfig.ticket,
      market: kambiConfig.market,
      currency: kambiConfig.currency,
      locale: kambiConfig.locale,
    });
  });
};
const kambiLogout = (api: WidgetAPI) => api.request(api.LOGOUT);

export const KambiProvider = ({ children }) => {
  const { routes, locale, cookies } = useConfig((prev, next) => {
    const routesEqual = prev.routes.length === next.routes.length;
    const localeEqual = prev.locale === next.locale;
    const cookiesEqual = prev.cookies.analytics === next.cookies.analytics;
    return routesEqual && localeEqual && cookiesEqual;
  });
  const apiLoadedIntervalRef = useRef<number>(0);
  const { user } = useAuth();
  const [sportsbookLoaded, setSportsbookLoaded] = useState(false);
  const [api, setApi] = useState<WidgetAPI | null>(null);
  const [kambiUserLoggedIn, setKambiUserLoggedIn] = useState(false);
  const { hash, key: locationKey, pathname } = useLocation();
  const visibleSportsbook = useMemo(
    () =>
      [PagesName.SportsPage, PagesName.SportsPlayRetailPage].includes(
        routes.find(route =>
          matchPath(pathname, {
            path: route.path,
            exact: route.exact ?? true,
          }),
        )?.id || PagesName.Null,
      ),
    [pathname, routes, locationKey],
  );
  useEffect(() => {
    window['ga-disable-UA-45067452-1'] = !cookies.analytics;
    window['ga-disable-UA-45067452-4'] = !cookies.analytics;
  }, [cookies.analytics]);
  useEffect(() => {
    if (!!api && locale && user.logged_in !== kambiUserLoggedIn) {
      setSportsbookLoaded(false);
      setTimeout(() => setSportsbookLoaded(true), 20000);
      if (user.logged_in) {
        kambiLogin(api, locale, user.id!.toString());
      } else {
        kambiLogout(api);
      }
    }
  }, [user.logged_in, kambiUserLoggedIn]);

  useEffect(() => {
    if (!api) {
      window.KambiWidget?.ready.then(wapi => {
        setApi(wapi);
      });
    }
  }, [sportsbookLoaded]);

  useEffect(() => {
    if (api) {
      if (apiLoadedIntervalRef.current)
        clearInterval(apiLoadedIntervalRef.current);

      api.request(api.USER_SESSION_CHANGE);
      api.subscribe(response => {
        switch (response.type) {
          case api.USER_SESSION_CHANGE: {
            setKambiUserLoggedIn(!!response.data?.isLoggedIn);
            setSportsbookLoaded(true);
            break;
          }
        }
      });
    } else if (!apiLoadedIntervalRef.current && visibleSportsbook) {
      apiLoadedIntervalRef.current = setInterval(() => {
        window.KambiWidget?.ready.then(wapi => {
          setApi(wapi);
          setSportsbookLoaded(true);
        });
      }, 1000);
    }
  }, [!!api]);

  useEffect(() => {
    if (api && locationKey && visibleSportsbook) {
      api.navigateClient(hash || 'home', 'sportsbook');
    }
  }, [hash, !!api]);
  useEffect(() => {
    if (visibleSportsbook && sportsbookLoaded) {
      showKambiSportsbook();
    } else {
      hideKambiSportsbook();
    }
    if (api) {
      api.set(
        visibleSportsbook && sportsbookLoaded
          ? api.CLIENT_SHOW
          : api.CLIENT_HIDE,
      );
      api.set(
        visibleSportsbook && sportsbookLoaded
          ? api.BETSLIP_SHOW
          : api.BETSLIP_HIDE,
      );
    }
  }, [api, visibleSportsbook, sportsbookLoaded]);

  const value: KambiContext = {
    sportsbookLoaded,
    setSportsbookLoaded,
    api,
    setApi,
    kambiUserLoggedIn,
  };
  return <kambiContext.Provider value={value} children={children} />;
};

interface SetCustomerSettingsProps {
  getApiBalance: string;
  updateBalance: (balance: number) => void;
  setKambiLoaded: () => void;
  urlChangeRequested: (page: PagesName) => void;
  locale: string;
}

interface KambiSportsbookProps {
  locale: string;
  playerId?: string;
  ticket: string;
  getApiBalance: string;
  currency: string;
  market: string;
  retail?: boolean;
}

const updateWindowKambiConfig = (params: KambiSportsbookProps) => {
  window._kc = {
    currency: params.currency,
    locale: params.locale,
    market: params.market,
    playerId: params.playerId || '',
    ticket: params.ticket,
    oddsFormat: 'decimal',
    streamingAllowedForPlayer: 'false',
    racingMode: 'false',
  };
  if (params.retail) {
    window._kc = { ...window._kc, channelId: 7, betslipBarcodeMode: true };
  }
};

const setCustomerSettings = ({
  getApiBalance,
  updateBalance,
  setKambiLoaded,
  urlChangeRequested,
  locale,
}: SetCustomerSettingsProps) => {
  window.customerSettings = {
    getBalance: function (successFunc, failureFunc) {
      getApi<string>(getApiBalance, { responseText: true })
        .then(res => {
          const balance = parseFloat(res);
          if (!isNaN(balance)) {
            updateBalance(balance);
            successFunc(balance);
          } else {
            failureFunc();
          }
        })
        .catch(e => {
          failureFunc(e);
        });
    },
    notification: function (event) {
      switch (event.name) {
        case 'KambiMaintenance':
        case 'pageRendered': {
          setKambiLoaded();
          break;
        }
        case 'loginRequested': {
          urlChangeRequested(PagesName.LoginPage);
          break;
        }
      }
    },
    loginUrl: 'notification',
    showEventStatistics: function (eventId) {
      const url = `https://s5.sir.sportradar.com/scooorebe/${locale}/match/m${eventId}`;
      const newStatisticsTab = window.open(url, '_blank');
      newStatisticsTab?.focus();
    },
    hideHeader: true,
    enableOddsFormatSelector: true,
    enableMyBetsHarmonization: false,
  };
};

let kambiLock = false;
const insertKambiBootstrap = async (retail?: boolean): Promise<void> => {
  return new Promise(resolve => {
    if (kambiLock) return resolve();
    kambiLock = true;
    if (!window.__config__.kambi) return resolve();
    document.body.classList.add('body-background');
    const scriptElement = document.createElement('script');
    scriptElement.setAttribute('type', 'text/javascript');
    scriptElement.defer = true;
    const bootstrapUrl = retail
      ? window.__config__.kambi.retail
      : window.__config__.kambi.online;
    scriptElement.setAttribute('src', `${bootstrapUrl}?cb=${Date.now()}`);
    document.head.appendChild(scriptElement);
    if (!window.KambiWidget) {
      const scriptElement = document.createElement('script');
      scriptElement.setAttribute('type', 'text/javascript');
      scriptElement.setAttribute(
        'src',
        `${window.__config__.kambi?.api}?cb=${Date.now()}`,
      );
      scriptElement.defer = true;
      scriptElement.addEventListener('load', () => resolve());
      document.head.appendChild(scriptElement);
    } else {
      resolve();
    }
  });
};

const getSBParams = async (
  locale: string,
  playerId?: string,
  retail?: boolean,
) => {
  const data =
    playerId && !retail
      ? await getApi<RailsApiResponse<string>>(
          '/restapi/v1/kambi/get_token',
        ).catch((res: RailsApiResponse<null>) => {
          return res;
        })
      : null;
  return {
    locale: KambiSbLocales[locale.toLocaleLowerCase()] || 'en_GB',
    playerId,
    ticket: data?.Data || '',
    currency: 'EUR',
    market: 'BE',
    getApiBalance: '/restapi/v1/user/balance',
    retail,
  };
};

const disposeKambi = async () =>
  window._kbc?.dispose({ clearLocalStorage: true });

const kambiId = 'KambiBC';

const KambiSportsbook = ({ retail }: { retail?: boolean }) => {
  const context = useContext(kambiContext);
  const { locale } = useConfig((prev, next) => prev.locale === next.locale);
  const prevLocale = usePrevious(locale);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const loginPagePath = useRoutePath(PagesName.LoginPage, true);
  const history = useHistory();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const desktopWidth = useDesktopWidth(1199);

  useEffect(() => {
    (async () => {
      if (retail !== window._kc?.betslipBarcodeMode || prevLocale !== locale) {
        await disposeKambi();
        context.setApi(null);
        context.setSportsbookLoaded(false);
        kambiLock = false;
      }
      if (!user.loading && containerRef.current && locale) {
        if (!context.api && !document.getElementById(kambiId)) {
          getSBParams(locale, user.id?.toString(), retail).then(kambiConfig => {
            setCustomerSettings({
              getApiBalance: kambiConfig?.getApiBalance,
              updateBalance: (balance: number) => dispatch(setBalance(balance)),
              setKambiLoaded: () => context.setSportsbookLoaded(true),
              urlChangeRequested: (page: PagesName) => {
                if (page === PagesName.LoginPage) {
                  history.push(loginPagePath);
                }
              },
              locale,
            });
            const kambiContainer = document.createElement('div');
            kambiContainer.id = 'KambiBC';
            kambiContainer.classList.add('kambiHidden');
            containerRef.current?.parentNode?.insertBefore(
              kambiContainer,
              containerRef.current.nextSibling,
            );
            updateWindowKambiConfig(kambiConfig);
            insertKambiBootstrap(retail);
          });
        } else {
          const kambiContainer = document.getElementById(kambiId);
          if (kambiContainer) {
            containerRef.current?.parentNode?.insertBefore(
              kambiContainer as Node,
              containerRef.current.nextSibling,
            );
          }
        }
      }
    })();
  }, [user.loading, locale, containerRef.current]);

  return (
    <>
      <div ref={containerRef} className={clsx(desktopWidth && 'mt-5')} />
      {!context.sportsbookLoaded && (
        <div className="position-relative mt-5 min-vh-70">
          <div className="position-absolute w-100 d-flex justify-content-center pt-4 pb-3">
            <Spinner animation="border" variant="black" className="mx-auto" />
          </div>
        </div>
      )}
    </>
  );
};
export default KambiSportsbook;
