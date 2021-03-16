import React, { useEffect, useState, useRef } from 'react';
import { useToasts, AddToast } from 'react-toast-notifications';
import { useConfig } from '../hooks/useConfig';
import useDesktopWidth from '../hooks/useDesktopWidth';
import clsx from 'clsx';
import RailsApiResponse from '../types/api/RailsApiResponse';
import { getApi } from '../utils/apiUtils';
import Config from '../types/Config';
import { WidgetAPI } from '../types/KambiConfig';
import Spinner from 'react-bootstrap/Spinner';
import { KambiSbLocales } from '../constants';
import { useLocation } from 'react-router-dom';

interface SetCustomerSettingsProps {
  getApiBalance: string;
  updateBalance: () => void;
  addToast: AddToast;
  sbLoaded?: () => void;
}

interface KambiSportsbookProps {
  locale: string;
  playerId: string;
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
    playerId: params.playerId,
    ticket: params.ticket,
    oddsFormat: 'decimal',
    streamingAllowedForPlayer: 'false',
    racingMode: 'false',
  };
};
let sportsbookRendered = false;
const setCustomerSettings = ({
  getApiBalance,
  updateBalance,
  addToast,
  sbLoaded,
}: SetCustomerSettingsProps) => {
  window.customerSettings = {
    getBalance: function (successFunc, failureFunc, $) {
      $.ajax({
        url: getApiBalance,
        xhrFields: {
          withCredentials: true,
        },
        success: function (response) {
          successFunc(parseFloat(response));
        },
        error: function (xhr) {
          failureFunc(xhr);
        },
      });
    },
    notification: event => {
      switch (event.name) {
        case 'placedBet': {
          updateBalance();
          break;
        }
        case 'loginRequestDone': {
          if (!event.data) {
            addToast('KAMBI failed to authenticate user', {
              appearance: 'error',
              autoDismiss: true,
            });
          }
          break;
        }
        case 'pageRendered': {
          sportsbookRendered = true;
          sbLoaded?.();
          break;
        }
      }
      console.log(event);
    },
    enableOddsFormatSelector: true,
  };
};

const getSBParams = async (config: Config, error: () => void) => {
  const playerId = config.user.id ? config.user.id.toString() : '';
  const data = playerId
    ? await getApi<RailsApiResponse<string>>(
        '/railsapi/v1/kambi/get_token',
      ).catch((res: RailsApiResponse<null>) => {
        if (res.Fallback) {
          error();
        }
        return res;
      })
    : null;
  return {
    locale: KambiSbLocales[config.locale.toLocaleUpperCase()] || 'en_GB',
    playerId,
    ticket: data?.Data || '',
    currency: 'EUR',
    market: 'BE',
    getApiBalance: `${window.__config__.apiUrl}/players/get_balance/true`,
  };
};

const insertKambiBootstrap = async (): Promise<WidgetAPI | null> => {
  return new Promise(resolve => {
    if (!window.KambiWidget) {
      const scriptElement = document.createElement('script');
      scriptElement.setAttribute('type', 'text/javascript');
      scriptElement.setAttribute(
        'src',
        `https://ctn-static.kambi.com/client/widget-api/kambi-widget-api.js?cb=${Date.now()}`,
      );
      scriptElement.async = true;
      scriptElement.onload = resolve;
      document.head.appendChild(scriptElement);
    } else {
      resolve(null);
    }
  }).then(async () => {
    document.body.classList.add('body-background');
    const scriptElement = document.createElement('script');
    scriptElement.setAttribute('type', 'text/javascript');
    scriptElement.async = true;
    scriptElement.setAttribute(
      'src',
      `https://ctn-static.kambi.com/client/bnlbe/kambi-bootstrap.js?cb=${Date.now()}`,
    );
    document.head.appendChild(scriptElement);
    return window.KambiWidget?.ready.then(wapi => {
      window.KambiWapi = wapi;
      return wapi;
    });
  });
};
const kambiId = 'KambiBC';

const KambiSportsbook = () => {
  const { addToast } = useToasts();
  const config = useConfig();
  const { hash, key: locationKey } = useLocation();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [sbLoading, setSbLoading] = useState(!sportsbookRendered);
  const [apiLoaded, setApiLoaded] = useState(false);
  const desktopWidth = useDesktopWidth(1199);

  useEffect(() => {
    if (config.user.logged_in) {
      getSBParams(config, () => {
        addToast(`Failed to get user token`, {
          appearance: 'error',
          autoDismiss: true,
        });
      }).then(kambiConfig => {
        window.KambiWapi?.request(window.KambiWapi?.LOGIN, {
          punterId: kambiConfig.playerId,
          ticket: kambiConfig.ticket,
          market: kambiConfig.market,
          currency: kambiConfig.currency,
          locale: kambiConfig.locale,
        });
      });
    } else {
      window.KambiWapi?.request(window.KambiWapi?.LOGOUT);
    }
  }, [config.user.logged_in, apiLoaded]);

  useEffect(() => {
    if (locationKey && hash.length && window.KambiWapi) {
      window.KambiWapi.navigateClient(hash, 'sportsbook');
    }
  }, [hash, apiLoaded]);

  useEffect(() => {
    if (!window.KambiWapi && !document.getElementById(kambiId)) {
      getSBParams(config, () => {
        addToast(`Failed to get user token`, {
          appearance: 'error',
          autoDismiss: true,
        });
      }).then(kambiConfig => {
        setCustomerSettings({
          addToast,
          getApiBalance: kambiConfig?.getApiBalance,
          updateBalance: () => config.mutateUser(),
          sbLoaded: () => setSbLoading(false),
        });
        const kambiContainer = document.createElement('div');
        kambiContainer.id = 'KambiBC';
        kambiContainer.classList.add('kambiHidden');
        containerRef.current?.after(kambiContainer);
        updateWindowKambiConfig(kambiConfig);
        insertKambiBootstrap().then(() => setApiLoaded(true));
      });
    } else {
      const kambiContainer = document.getElementById(kambiId);
      containerRef.current?.after(kambiContainer as Node);
      if (window.KambiWapi) {
        window.KambiWapi.set(window.KambiWapi.CLIENT_SHOW);
        window.KambiWapi.set(window.KambiWapi.BETSLIP_SHOW);
      }
    }
    return () => {
      if (window.KambiWapi) {
        window.KambiWapi.set(window.KambiWapi.CLIENT_HIDE);
        window.KambiWapi.set(window.KambiWapi.BETSLIP_HIDE);
      }
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className={clsx(desktopWidth && 'mt-5')} />
      {sbLoading && (
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
