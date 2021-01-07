import React, { useEffect, useState, useRef } from 'react';
import { useConfig } from '../../hooks/useConfig';
import { getApi } from '../../utils/apiUtils';
import GetToken from '../../types/api/kambi/GetToken';
import Config from '../../types/Config';
import clsx from 'clsx';

const resizeObserverSupported = !!window.ResizeObserver;
interface Params {
  key: number;
  locale: string;
  playerId: number | string;
  ticket: string;
  getApiBalance: string;
  currency: string;
}
const getSBParams = async (config: Config) => {
  const playerId = config.user.id ? config.user.id : '';
  const data: GetToken | null = playerId
    ? await getApi<GetToken>('/railsapi/v1/kambi/get_token')
    : null;
  const ticket = data?.Data || '';
  return {
    key: Math.floor(Math.random() * (500 - 100) + 100),
    locale: config.locale,
    playerId,
    ticket,
    currency: 'EUR',
    getApiBalance: `${window.API_URL}/players/get_balance/true`,
  };
};

const SportsPage = () => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [iframeHeight, setIframeHeight] = useState('100vh');
  const config = useConfig();
  const [params, setParams] = useState<Params | null>(null);

  useEffect(() => {
    getSBParams(config).then(sbParams => setParams(sbParams));
    const SBMessage = (event: MessageEvent<any>) => {
      if (
        event.origin !== window.location.origin ||
        event.data.type !== 'kambiSB.heightChange' ||
        !resizeObserverSupported
      ) {
        return;
      }
      setIframeHeight(`${event.data.data}px`);
      console.log(event.data);
    };

    window.addEventListener('message', SBMessage);
    return () => {
      window.removeEventListener('message', SBMessage);
    };
  }, [config]);

  const handleIframeLoad = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        {
          type: 'kambiSB.params',
          data: params,
        },
        window.location.origin,
      );
    }
  };

  if (!params || config.user.loading) {
    return null;
  }

  return (
    <iframe
      key={params.key}
      ref={iframeRef}
      onLoad={handleIframeLoad}
      title="sportsbook"
      frameBorder="0"
      style={{ height: iframeHeight }}
      className={clsx('w-100', !resizeObserverSupported && 'vh-100')}
      src="/iframe/kambiSB.html"
    />
  );
};

export default SportsPage;
