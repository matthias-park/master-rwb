import loadable, { DefaultComponent } from '@loadable/component';
import React, { ComponentType } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { Config } from '../constants';
import { AuthProvider } from '../hooks/useAuth';
import { UIConfigProvider } from '../hooks/useUIConfig';
import { RootState } from '../state';
import { ConfigLoaded } from '../types/Config';
import { SwrFetcherConfig } from '../utils/apiUtils';

interface Props {
  children: React.ReactNode;
}

const BrowserRouterProvider = ({ children }: Props) => {
  const { locale, configLoaded } = useSelector(
    (state: RootState) => {
      const { locale, configLoaded } = state.config;
      return {
        locale,
        configLoaded,
      };
    },
    (prev, next) =>
      prev.locale === next.locale && prev.configLoaded === next.configLoaded,
  );
  return (
    <BrowserRouter
      key={`${locale}-${configLoaded}`}
      basename={
        locale && configLoaded === ConfigLoaded.Loaded
          ? `/${locale}`
          : undefined
      }
    >
      {children}
    </BrowserRouter>
  );
};

type Provider =
  | ComponentType<any>
  | [ComponentType<any>, { [key: string]: any }]
  | false;

const LoadableKambiProvider = loadable(
  () =>
    import('./KambiSportsbook')
      .then(component => component.KambiProvider)
      .catch(() => 'div') as Promise<DefaultComponent<unknown>>,
);
const LoadableGtmProvider = loadable(
  () =>
    import('../hooks/useGTM')
      .then(component => component.GtmProvider)
      .catch(() => 'div') as Promise<DefaultComponent<unknown>>,
);
const LoadableRecaptcha = loadable(
  () =>
    import('../hooks/useGoogleRecaptcha')
      .then(component => component.CaptchaProvider)
      .catch(() => 'div') as Promise<DefaultComponent<unknown>>,
);
const LoadableGeoComply = loadable(
  () =>
    import('../hooks/useGeoComply')
      .then(component => component.GeoComplyProvider)
      .catch(() => 'div') as Promise<DefaultComponent<unknown>>,
);
const LoadableCasinoConfig = loadable(
  () =>
    import('../hooks/useCasinoConfig')
      .then(component => component.CasinoConfigProvider)
      .catch(() => 'div') as Promise<DefaultComponent<unknown>>,
);
const LoadableRegisterContext = loadable(
  () =>
    import('../hooks/useCompleteRegistration')
      .then(component => component.CompleteRegistrationProvider)
      .catch(() => 'div') as Promise<DefaultComponent<unknown>>,
);

const ContextProviders = ({ children }: Props) => {
  const providers: Provider[] = [
    [SWRConfig, { value: SwrFetcherConfig }],
    !!Config.gtmId && LoadableGtmProvider,
    AuthProvider,
    HelmetProvider,
    BrowserRouterProvider,
    UIConfigProvider,
    !!Config.casino && LoadableCasinoConfig,
    !!Config.casino && LoadableRegisterContext,
    !!Config.googleRecaptchaKey && LoadableRecaptcha,
    !!Config.kambi && LoadableKambiProvider,
    !!Config.geoComplyKey && LoadableGeoComply,
  ];

  return (
    <>
      {providers.reverse().reduce((acc, curr) => {
        if (!curr) return acc;
        const [Provider, props] = Array.isArray(curr)
          ? [curr[0], curr[1]]
          : [curr, {}];
        return <Provider {...props}>{acc}</Provider>;
      }, children)}
    </>
  );
};

export default ContextProviders;
