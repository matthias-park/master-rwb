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
import { matchPath, useLocation } from 'react-router-dom';
import { hideKambiSportsbook, showKambiSportsbook } from '../utils/uiUtils';
import { useAuth } from '../hooks/useAuth';

interface KambiContext {
  sportsbookLoaded: boolean;
  setSportsbookLoaded: (loaded: boolean) => void;
  api: WidgetAPI | null;
  setApi: (api: WidgetAPI) => void;
  kambiUserLoggedIn: boolean;
}

const kambiContext = createContext<KambiContext>({
  sportsbookLoaded: false,
  setSportsbookLoaded: () => {},
  api: null,
  setApi: () => {},
  kambiUserLoggedIn: false,
});

const kambiLogin = (api: WidgetAPI, locale: string, userId: string) => {
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
  const { routes, locale } = useConfig((prev, next) => {
    const routesEqual = prev.routes.length === next.routes.length;
    const localeEqual = prev.locale === next.locale;
    return routesEqual && localeEqual;
  });
  const apiLoadedIntervalRef = useRef<number>(0);
  const { user } = useAuth();
  const [sportsbookLoaded, setSportsbookLoaded] = useState(false);
  const [api, setApi] = useState<WidgetAPI | null>(null);
  const [kambiUserLoggedIn, setKambiUserLoggedIn] = useState(false);
  const { hash, key: locationKey, pathname } = useLocation();
  const visibleSportsbook = useMemo(
    () =>
      routes.find(route =>
        matchPath(pathname, {
          path: route.path,
          exact: route.exact ?? true,
        }),
      )?.id === PagesName.SportsPage && sportsbookLoaded,
    [pathname, routes, sportsbookLoaded],
  );

  useEffect(() => {
    if (!!api && user.logged_in !== kambiUserLoggedIn) {
      setSportsbookLoaded(false);
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
        console.log(response);
      });
    } else if (visibleSportsbook) {
      apiLoadedIntervalRef.current = setInterval(() => {
        window.KambiWidget?.ready.then(wapi => {
          setApi(wapi);
          setSportsbookLoaded(true);
        });
      }, 500);
    }
  }, [!!api]);

  useEffect(() => {
    if (api && locationKey && hash.length) {
      api.navigateClient(hash, 'sportsbook');
    }
  }, [hash, !!api]);
  useEffect(() => {
    if (visibleSportsbook) {
      showKambiSportsbook();
    } else {
      hideKambiSportsbook();
    }
    if (api) {
      api.set(visibleSportsbook ? api.CLIENT_SHOW : api.CLIENT_HIDE);
      api.set(visibleSportsbook ? api.BETSLIP_SHOW : api.BETSLIP_HIDE);
    }
  }, [visibleSportsbook]);

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
  updateBalance: () => void;
}

interface KambiSportsbookProps {
  locale: string;
  playerId?: string;
  ticket: string;
  getApiBalance: string;
  currency: string;
  market: string;
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
};

const setCustomerSettings = ({
  getApiBalance,
  updateBalance,
}: SetCustomerSettingsProps) => {
  window.customerSettings = {
    getBalance: function (successFunc, failureFunc) {
      updateBalance();
      getApi<string>(getApiBalance, { responseText: true })
        .then(res => {
          successFunc(parseFloat(res));
        })
        .catch(e => {
          failureFunc(e);
        });
    },
    enableOddsFormatSelector: true,
  };
};

const insertKambiBootstrap = async (): Promise<void> => {
  return new Promise(resolve => {
    document.body.classList.add('body-background');
    const scriptElement = document.createElement('script');
    scriptElement.setAttribute('type', 'text/javascript');
    scriptElement.async = true;
    scriptElement.setAttribute(
      'src',
      `https://ctn-static.kambi.com/client/bnlbe/kambi-bootstrap.js?cb=${Date.now()}`,
    );
    document.head.appendChild(scriptElement);
    if (!window.KambiWidget) {
      const scriptElement = document.createElement('script');
      scriptElement.setAttribute('type', 'text/javascript');
      scriptElement.setAttribute(
        'src',
        `https://ctn-static.kambi.com/client/widget-api/kambi-widget-api.js?cb=${Date.now()}`,
      );
      scriptElement.async = true;
      scriptElement.addEventListener('load', () => resolve());
      document.head.appendChild(scriptElement);
    } else {
      resolve();
    }
  });
};

const getSBParams = async (locale: string, playerId?: string) => {
  const data = playerId
    ? await getApi<RailsApiResponse<string>>(
        '/railsapi/v1/kambi/get_token',
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
    getApiBalance: '/railsapi/v1/user/balance',
  };
};

const kambiId = 'KambiBC';

const KambiSportsbook = () => {
  const context = useContext(kambiContext);
  const { locale } = useConfig((prev, next) => prev.locale === next.locale);
  const { user, updateUser } = useAuth();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const desktopWidth = useDesktopWidth(1199);

  useEffect(() => {
    if (!context.api && !document.getElementById(kambiId)) {
      getSBParams(locale, user.id?.toString()).then(kambiConfig => {
        setCustomerSettings({
          getApiBalance: kambiConfig?.getApiBalance,
          updateBalance: () => updateUser(),
        });
        const kambiContainer = document.createElement('div');
        kambiContainer.id = 'KambiBC';
        kambiContainer.classList.add('kambiHidden');
        containerRef.current?.after(kambiContainer);
        updateWindowKambiConfig(kambiConfig);
        insertKambiBootstrap().then(() => {
          context.setSportsbookLoaded(true);
        });
      });
    } else {
      const kambiContainer = document.getElementById(kambiId);
      containerRef.current?.after(kambiContainer as Node);
    }
  }, []);

  return (
    <>
      <div ref={containerRef} className={clsx(desktopWidth && 'mt-5')} />
      {!context.sportsbookLoaded && (
        <div style={{ minHeight: 100 }} className="position-relative mt-5">
          <div className="position-absolute w-100 d-flex justify-content-center pt-4 pb-3">
            <Spinner animation="border" variant="black" className="mx-auto" />
          </div>
        </div>
      )}
    </>
  );
};
export default KambiSportsbook;
