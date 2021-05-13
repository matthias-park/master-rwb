import React, { ComponentType } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import { SWRConfig } from 'swr';
import { AuthProvider } from '../hooks/useAuth';
import { ConfigProvider, useConfig } from '../hooks/useConfig';
import { CaptchaProvider } from '../hooks/useGoogleRecaptcha';
import { GtmProvider } from '../hooks/useGTM';
import { I18nProvider } from '../hooks/useI18n';
import { ModalProvider } from '../hooks/useModal';
import { UIConfigProvider } from '../hooks/useUIConfig';
import { ConfigLoaded } from '../types/Config';
import { SwrFetcherConfig } from '../utils/apiUtils';
import { KambiProvider } from './KambiSportsbook';

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
  // | React.ReactNode
  ComponentType<any> | [ComponentType<any>, { [key: string]: any }] | false;

const ContextProviders = ({ children }: Props) => {
  const providers: Provider[] = [
    [SWRConfig, { value: SwrFetcherConfig }],
    ToastProvider,
    ConfigProvider,
    I18nProvider,
    GtmProvider,
    AuthProvider,
    HelmetProvider,
    BrowserRouterProvider,
    ModalProvider,
    UIConfigProvider,
    CaptchaProvider,
    !!window.__config__.kambi && KambiProvider,
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
