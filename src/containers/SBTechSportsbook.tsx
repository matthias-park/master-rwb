import clsx from 'clsx';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import useApi from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import RailsApiResponse from '../types/api/RailsApiResponse';
import { postApi } from '../utils/apiUtils';
import LoadingSpinner from '../components/LoadingSpinner';
import { Config } from '../constants';

enum SbtEventTypes {
  SetDeviceType = 'SBT_SET_DEVIVCE_TYPE',
  status = 'SBT_STATUS',
  statusCallback = 'SBT_STATUS_CALLBACK',
  refreshSession = 'SBT_REFRESH_SESSION',
  refreshSessionCallback = 'SBT_REFRESH_SESSION_CALLBACK',
  loginCallback = 'SBT_LOGIN_CALLBACK',
  logoutCallback = 'SBT_LOGOUT_CALLBACK',
  loginRegistered = 'SBT_LOGIN_READY',
  logout = 'SBT_LOGOUT',
  betslipCallback = 'LOAD_BETSLIP_CALLBACK',
  betCountChange = 'SBT_SET_BETSLIP_COUNT',
  navigateCallback = 'SBT_NAVIGATE_CALLBACK',
  navigateHomeCallback = 'SBT_NAVIGATE_HOME_CALLBACK',
  locationChange = 'SBT_LOCATION',
}

interface sbState {
  loading: boolean;
  statusRequested: boolean;
  refreshSessionRequested: boolean;
  loginReady: boolean;
  height: string;
  betCount: number;
  currentLocation: string;
}

const SBTechSportsbook = () => {
  const { user, signout } = useAuth();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [iframeState, setIframeState] = useState<sbState>({
    loading: true,
    statusRequested: false,
    refreshSessionRequested: false,
    loginReady: false,
    height: '0',
    betCount: 0,
    currentLocation: 'sports',
  });

  const openBetslip = () => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        eventType: SbtEventTypes.betslipCallback,
      }),
      '*',
    );
  };
  const navigateTo = (route?: string) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        eventType: SbtEventTypes.navigateCallback,
        eventData: route,
      }),
      '*',
    );
  };

  const sbTokenUrl = useMemo(
    () =>
      user.logged_in
        ? [
            '/restapi/v1/casino/launch_url',
            {
              game_provider: 'Sportsbook::SBTech',
              casino_provider_id: 65,
              game_id: '1cb8e6a3-04b5-4820-b0d2-7eef11ccf1d0',
              source: 1,
              locale: null,
              demo: false,
            },
          ]
        : null,
    [user.logged_in],
  );
  const { data: token, error } = useApi<string>(sbTokenUrl, (url, body) =>
    postApi<RailsApiResponse<{ url }>>(url, body)
      .then(res => {
        if (!res.Data?.url) return '';
        const url = new URL(res.Data.url);
        const token = new URLSearchParams(url.search).get('stoken');
        return token || '';
      })
      .catch(() => ''),
  );
  const tokenLoading = !!sbTokenUrl && token == null && !error;

  useEffect(() => {
    console.log({ tokenLoading });
    if (!tokenLoading) {
      const balance = user.logged_in ? `${user.balance} ${user.currency}` : '';
      if (iframeState.refreshSessionRequested) {
        const response = {
          status: token ? 'success' : 'failure',
          message: '',
          balance,
        };
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({
            eventType: SbtEventTypes.refreshSessionCallback,
            eventData: response,
          }),
          '*',
        );
        console.log('sbSession', response);
        setIframeState(prev => ({ ...prev, refreshSessionRequested: false }));
      } else if (iframeState.statusRequested) {
        const sbtUser = {
          uid: user.id,
          token,
          status: token ? 'real' : 'anon',
          message: '',
          balance,
        };
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({
            eventType: SbtEventTypes.statusCallback,
            eventData: sbtUser,
          }),
          '*',
        );
        console.log('sbStatus', sbtUser);
        setIframeState(prev => ({ ...prev, statusRequested: false }));
      }
    }
  }, [
    tokenLoading,
    iframeState.refreshSessionRequested,
    iframeState.statusRequested,
  ]);

  useEffect(() => {
    if (token && user.logged_in && iframeState.loginReady) {
      console.log(token);
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({
          eventType: SbtEventTypes.loginCallback,
          eventData: {
            token,
            uid: user.id,
          },
        }),
        '*',
      );
    } else if (!user.logged_in) {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({
          eventType: SbtEventTypes.logoutCallback,
        }),
        '*',
      );
    }
  }, [token, user.logged_in, iframeState.loginReady]);

  useEffect(() => {
    if (window.__config__.sbTechUrl) {
      const onMessage = (e: MessageEvent<any>) => {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (!data.eventType || e.origin !== window.__config__.sbTechUrl) return;
        console.log(data);
        switch (data.eventType) {
          case SbtEventTypes.SetDeviceType: {
            if (data.eventData.height)
              setIframeState(prev => ({
                ...prev,
                height: data.eventData?.height?.toString() || '0',
              }));
            break;
          }
          case SbtEventTypes.status: {
            setIframeState(prev => ({ ...prev, statusRequested: true }));
            break;
          }
          case SbtEventTypes.refreshSession: {
            setIframeState(prev => ({
              ...prev,
              refreshSessionRequested: true,
            }));
            break;
          }
          case SbtEventTypes.loginRegistered: {
            setIframeState(prev => ({
              ...prev,
              loginReady: true,
            }));
            break;
          }
          case SbtEventTypes.logout: {
            signout();
            break;
          }
          case SbtEventTypes.betCountChange: {
            setIframeState(prev => ({
              ...prev,
              betCount: data.eventData || 0,
            }));
            break;
          }
          case SbtEventTypes.locationChange: {
            const location: string =
              data.eventData?.substring(1, data.eventData.length - 1) || '';
            if (location.length > 1) {
              setIframeState(prev => ({
                ...prev,
                currentLocation: location,
              }));
            }
            break;
          }
        }
      };
      window.addEventListener('message', onMessage);
      return () => {
        window.removeEventListener('message', onMessage);
      };
    }
  }, []);
  if (!window.__config__.sbTechUrl) return null;
  return (
    <>
      {iframeState.loading && (
        <div className="">
          <div className="position-relative mt-5 min-vh-70">
            <LoadingSpinner show className="d-block mx-auto" />
          </div>
        </div>
      )}
      <iframe
        title="sb"
        width="100%"
        ref={iframeRef}
        onLoad={() => setIframeState(prev => ({ ...prev, loading: false }))}
        height={iframeState.height}
        className={clsx('sb-iframe', iframeState.loading && 'd-none')}
        src={window.__config__.sbTechUrl}
      />
      <ul className="sb-bottom-nav">
        {[
          {
            text: 'Home',
            icon: 'home',
            path: 'sports',
            onClick: () => navigateTo('sports'),
          },
          {
            text: 'All sports',
            icon: 'all',
            path: 'all-branches',
            onClick: () => navigateTo('all-branches'),
          },
          {
            text: 'My bets',
            icon: 'bets',
            onClick: openBetslip,
          },
          {
            text: 'In-play',
            icon: 'in-play',
            path: 'live-betting',
            onClick: () => navigateTo('live-betting'),
          },
          {
            text: 'Starting-soon',
            icon: 'soon',
            path: 'todays-events',
            onClick: () => navigateTo('todays-events'),
          },
        ].map(item => (
          <li
            className={clsx(
              'sb-bottom-nav__item',
              iframeState.currentLocation === item.path && 'active',
            )}
            onClick={item.onClick}
          >
            <i
              className={clsx(
                `icon-${Config.name}-${item.icon}`,
                iframeState.currentLocation === item.path && 'active',
              )}
            />
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
};

export default SBTechSportsbook;
