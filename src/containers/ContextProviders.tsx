import loadable, { DefaultComponent } from '@loadable/component';
import React, { ComponentType } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import { SWRConfig } from 'swr';
import { AuthProvider } from '../hooks/useAuth';
import { ConfigProvider, useConfig } from '../hooks/useConfig';
import { I18nProvider } from '../hooks/useI18n';
import { UIConfigProvider } from '../hooks/useUIConfig';
import { ConfigLoaded } from '../types/Config';
import { SwrFetcherConfig } from '../utils/apiUtils';

interface Props {
  children: React.ReactNode;
}

const BrowserRouterProvider = ({ children }: Props) => {
  const { locale, configLoaded } = useConfig((prev, next) => {
    const localeEqual = !!prev.locale === !!next.locale;
    const configLoadedEqual = prev.configLoaded === next.configLoaded;
    return localeEqual && configLoadedEqual;
  });
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

const ContextProviders = ({ children }: Props) => {
  const providers: Provider[] = [
    [SWRConfig, { value: SwrFetcherConfig }],
    ToastProvider,
    ConfigProvider,
    I18nProvider,
    !!window.__config__.gtmId && LoadableGtmProvider,
    AuthProvider,
    HelmetProvider,
    BrowserRouterProvider,
    UIConfigProvider,
    !!window.__config__.googleRecaptchaKey && LoadableRecaptcha,
    !!window.__config__.kambi && LoadableKambiProvider,
    !!window.__config__.geoComplyKey && LoadableGeoComply,
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
