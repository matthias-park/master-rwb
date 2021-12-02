import React, {
  useEffect,
  useState,
  useRef,
  createContext,
  useContext,
} from 'react';
import { useConfig } from '../hooks/useConfig';
import useDesktopWidth from '../hooks/useDesktopWidth';
import clsx from 'clsx';
import RailsApiResponse from '../types/api/RailsApiResponse';
import { getApi } from '../utils/apiUtils';
import { WidgetAPI } from '../types/KambiConfig';
import Spinner from 'react-bootstrap/Spinner';
import { Config, Franchise, KambiSbLocales, PagesName } from '../constants';
import { useHistory, useLocation } from 'react-router-dom';
import { hideKambiSportsbook, showKambiSportsbook } from '../utils/uiUtils';
import { useAuth } from '../hooks/useAuth';
import { usePrevious, useRoutePath } from '../hooks';
import { useDispatch } from 'react-redux';
import { setBalance } from '../state/reducers/user';
import Lockr from 'lockr';
import useEffectSkipInitial from '../hooks/useEffectSkipInitial';
import * as Sentry from '@sentry/react';

interface KambiContext {
  sportsbookLoaded: boolean;
  setSportsbookLoaded: (loaded: boolean) => void;
  api: WidgetAPI | null;
  setApi: (api: WidgetAPI | null) => void;
  kambiUserLoggedIn: { loggedIn: boolean; retries: number };
  setKambiUserLoggedIn: (loggedIn: boolean) => void;
  showKambi: boolean;
  setRetailMode: (retail: boolean) => void;
  setRendered: (rendered: boolean) => void;
  setKambiMaintenance: (maintenance: boolean) => void;
}

const kambiContext = createContext<KambiContext>({
  sportsbookLoaded: false,
  setSportsbookLoaded: () => {},
  api: null,
  setApi: () => {},
  kambiUserLoggedIn: { loggedIn: false, retries: 0 },
  setKambiUserLoggedIn: () => {},
  showKambi: false,
  setRetailMode: () => {},
  setRendered: () => {},
  setKambiMaintenance: () => {},
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
  const { locale, cookies } = useConfig((prev, next) => {
    const routesEqual = prev.routes.length === next.routes.length;
    const localeEqual = prev.locale === next.locale;
    const cookiesEqual = prev.cookies.analytics === next.cookies.analytics;
    return routesEqual && localeEqual && cookiesEqual;
  });
  const apiLoadedIntervalRef = useRef<number>(0);
  const { user } = useAuth();
  const [sportsbookLoaded, setSportsbookLoaded] = useState(false);
  const [api, setApi] = useState<WidgetAPI | null>(null);
  const [retailMode, setRetailMode] = useState(false);
  const [showKambi, setShowKambi] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [kambiMaintenance, setKambiMaintenance] = useState(false);
  const [kambiUserLoggedIn, setKambiUserLoggedIn] = useState({
    loggedIn: false,
    retries: 0,
  });
  const { hash, key: locationKey } = useLocation();
  useEffect(() => {
    window['ga-disable-UA-45067452-1'] = !cookies.analytics;
    window['ga-disable-UA-45067452-4'] = !cookies.analytics;
  }, [cookies.analytics]);
  useEffect(() => {
    if (
      !!api &&
      !kambiMaintenance &&
      locale &&
      user.logged_in !== kambiUserLoggedIn.loggedIn &&
      kambiUserLoggedIn.retries < 5 &&
      !retailMode
    ) {
      if (user.logged_in) {
        setShowKambi(false);
        if (kambiUserLoggedIn.retries === 0) {
          kambiLogin(api, locale, user.id!.toString());
        } else {
          setTimeout(
            () => {
              kambiLogin(api, locale, user.id!.toString());
            },
            kambiUserLoggedIn.retries < 2 ? 4000 : 6000,
          );
        }
      } else {
        kambiLogout(api);
      }
    }
  }, [user.logged_in, kambiUserLoggedIn]);

  useEffect(() => {
    if (!api && !kambiMaintenance) {
      window.KambiWidget?.ready.then(wapi => {
        setApi(wapi);
      });
    }
  }, [sportsbookLoaded]);

  useEffect(() => {
    if (api || kambiMaintenance) {
      if (apiLoadedIntervalRef.current)
        clearInterval(apiLoadedIntervalRef.current);
    } else if (!apiLoadedIntervalRef.current && rendered) {
      apiLoadedIntervalRef.current = setInterval(() => {
        window.KambiWidget?.ready.then(wapi => {
          setApi(wapi);
          setSportsbookLoaded(true);
        });
      }, 1000);
    }
  }, [!!api]);
  useEffect(() => {
    const userSynched =
      kambiUserLoggedIn.loggedIn === user.logged_in ||
      kambiUserLoggedIn.retries > 4 ||
      retailMode;
    const newValue =
      ((sportsbookLoaded && userSynched) || kambiMaintenance) && rendered;
    if (showKambi !== newValue) {
      setShowKambi(newValue);
    }
  }, [
    sportsbookLoaded,
    kambiUserLoggedIn,
    user.logged_in,
    kambiMaintenance,
    rendered,
  ]);

  useEffectSkipInitial(() => {
    if (api && locationKey && rendered) {
      api.navigateClient(hash || 'home', 'sportsbook');
    }
  }, [hash, !!api]);
  useEffect(() => {
    if (showKambi) {
      showKambiSportsbook();
    } else {
      hideKambiSportsbook();
    }
    if (api) {
      api.set(showKambi ? api.CLIENT_SHOW : api.CLIENT_HIDE);
      api.set(showKambi ? api.BETSLIP_SHOW : api.BETSLIP_HIDE);
    }
  }, [api, showKambi]);

  const value: KambiContext = {
    sportsbookLoaded,
    setSportsbookLoaded,
    api,
    setApi,
    kambiUserLoggedIn,
    setKambiUserLoggedIn: (loggedIn: boolean) =>
      setKambiUserLoggedIn(prev => ({
        loggedIn,
        retries: prev.loggedIn === loggedIn ? ++prev.retries : 0,
      })),
    showKambi,
    setRetailMode,
    setRendered,
    setKambiMaintenance,
  };
  return <kambiContext.Provider value={value} children={children} />;
};

interface SetCustomerSettingsProps {
  getApiBalance: string;
  updateBalance: (balance: number) => void;
  setKambiLoaded: () => void;
  urlChangeRequested: (page: PagesName) => void;
  setKambiUserLoggedIn: (loggedIn: boolean) => void;
  setKambiMaintenance: () => void;
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
  setKambiUserLoggedIn,
  setKambiMaintenance,
  locale,
}: SetCustomerSettingsProps) => {
  const kambiErrorId = 'kambi-error-reload';
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
        case 'KambiMaintenance': {
          setKambiMaintenance();
          break;
        }
        case 'pageRendered': {
          const kambiErrorRetryCount = Lockr.get(kambiErrorId, null);
          if (kambiErrorRetryCount != null) {
            Lockr.rm(kambiErrorId);
          }
          setKambiLoaded();
          break;
        }
        case 'loginRequested': {
          urlChangeRequested(PagesName.LoginPage);
          break;
        }
        case 'loginRequestDone': {
          setKambiUserLoggedIn(event.data);
          break;
        }
        case 'sessionTimedOut': {
          setKambiUserLoggedIn(false);
          break;
        }
        case 'loadingError': {
          const kambiErrorRetryCount = Lockr.get(kambiErrorId, 0) + 1;
          if (kambiErrorRetryCount < 3) {
            Lockr.set(kambiErrorId, kambiErrorRetryCount);
            Sentry.captureMessage(`Kambi loading error`, {
              level: Sentry.Severity.Critical,
              extra: event.data,
            });
            window.location.reload();
          }
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
    enableMyBetsHarmonization: true,
  };
};

const insertKambiBootstrap = async (retail?: boolean): Promise<void> => {
  return new Promise(resolve => {
    if (!Config.kambi) return resolve();
    document.body.classList.add('body-background');
    const scriptElement = document.createElement('script');
    scriptElement.setAttribute('type', 'text/javascript');
    scriptElement.async = true;
    const bootstrapUrl = retail ? Config.kambi.retail : Config.kambi.online;
    scriptElement.setAttribute('src', `${bootstrapUrl}?cb=${Date.now()}`);
    document.head.appendChild(scriptElement);
    if (!window.KambiWidget) {
      const scriptElement = document.createElement('script');
      scriptElement.setAttribute('type', 'text/javascript');
      scriptElement.setAttribute(
        'src',
        `${Config.kambi?.api}?cb=${Date.now()}`,
      );
      scriptElement.async = true;
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
    currency: Config.kambi!.currency,
    market: Config.kambi!.market,
    getApiBalance: '/restapi/v1/user/balance',
    retail,
  };
};

const disposeKambi = async () =>
  window._kbc?.dispose({ clearLocalStorage: true });

const kambiId = 'KambiBC';

const KambiSportsbook = ({ retail }: { retail?: boolean }) => {
  const context = useContext(kambiContext);
  const { locale, domLoaded } = useConfig(
    (prev, next) =>
      prev.locale === next.locale && prev.domLoaded === next.domLoaded,
  );
  const prevLocale = usePrevious(locale);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const loginPagePath = useRoutePath(PagesName.LoginPage, true);
  const history = useHistory();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const kambiLock = useRef<boolean>(false);
  const desktopWidth = useDesktopWidth(1199);
  useEffect(() => {
    if (
      retail !== window._kc?.betslipBarcodeMode ||
      prevLocale !== locale ||
      !context.api
    ) {
      context.setRetailMode(!!retail);
      disposeKambi().then(() => {
        context.setApi(null);
        context.setSportsbookLoaded(false);
        kambiLock.current = false;
      });
    }
    context.setRendered(true);
    return () => {
      context.setRendered(false);
    };
  }, [locale]);

  useEffect(() => {
    if (!user.loading && containerRef.current && locale && domLoaded) {
      if (
        !context.sportsbookLoaded &&
        !context.api &&
        !document.getElementById(kambiId) &&
        !kambiLock.current
      ) {
        kambiLock.current = true;
        getSBParams(locale, user.id?.toString(), retail).then(kambiConfig => {
          setCustomerSettings({
            getApiBalance: kambiConfig?.getApiBalance,
            updateBalance: (balance: number) => dispatch(setBalance(balance)),
            setKambiLoaded: () => {
              context.setSportsbookLoaded(true);
              kambiLock.current = false;
            },
            setKambiMaintenance: () => {
              context.setKambiMaintenance(true);
              kambiLock.current = false;
            },
            urlChangeRequested: (page: PagesName) => {
              if (page === PagesName.LoginPage) {
                history.push(loginPagePath);
              }
            },
            setKambiUserLoggedIn: context.setKambiUserLoggedIn,
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
  }, [
    context.api,
    user.loading,
    locale,
    containerRef.current,
    context.sportsbookLoaded,
    domLoaded,
  ]);

  return (
    <>
      <div
        ref={containerRef}
        className={clsx(desktopWidth && Franchise.strive && 'mt-5')}
      />
      {!context.showKambi && (
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
