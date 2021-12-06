import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { CustomWindowEvents } from '../constants';
import useApi from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import RailsApiResponse from '../types/api/RailsApiResponse';

interface sportsbookMessage {
  type: 'interaction';
}

const BetsonSportsbook = () => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const { user } = useAuth();
  const [sbLoaded, setSbLoaded] = useState(false);
  const { data, error } = useApi<RailsApiResponse<string | {}>>([
    '/restapi/v1/sportsbook/get_token',
    user.logged_in,
  ]);

  useEffect(() => {
    const hasUrl =
      !!data?.Data &&
      typeof data.Data === 'string' &&
      data.Data.includes('http');
    if (!hasUrl) {
      setSbLoaded(false);
    }
    const getIframeMessage = (event: MessageEvent<sportsbookMessage>) => {
      if (hasUrl) {
        const url = new URL(data!.Data as string);
        if (event.origin === url.origin && event.data.type === 'interaction') {
          window.dispatchEvent(new Event(CustomWindowEvents.ResetIdleTimer));
        }
      }
    };
    if (hasUrl) {
      window.addEventListener('message', getIframeMessage);
    }
    return () => {
      if (hasUrl) {
        window.removeEventListener('message', getIframeMessage);
      }
    };
  }, [data?.Data]);

  let content = error ? (
    <p>Failed to load sportsbook</p>
  ) : (
    <Spinner animation="border" variant="black" className="mx-auto" />
  );
  return (
    <>
      {typeof data?.Data === 'string' &&
        !!data?.Data &&
        (data.Data as string).includes('http') && (
          <iframe
            ref={iframeRef}
            title="sportsbook"
            src={data.Data}
            width="100%"
            onLoad={() => setSbLoaded(true)}
            onError={() => setSbLoaded(true)}
            height="100vh"
            className={clsx('mt-xl-5 sb-iframe vh-100', !sbLoaded && 'd-none')}
          />
        )}
      {(!data?.Data || !sbLoaded) && (
        <div className="pt-xl-5">
          <div className="position-relative mt-5 min-vh-70">
            <div className="position-absolute w-100 d-flex justify-content-center pt-4 pb-3">
              {content}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BetsonSportsbook;
