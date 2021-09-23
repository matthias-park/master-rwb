import React, { useContext } from 'react';
import {
  GoogleReCaptchaProvider,
  GoogleReCaptchaContext,
} from 'react-google-recaptcha-v3';
import { ConfigLoaded } from '../types/Config';
import { useConfig } from './useConfig';
import { isIE } from 'react-device-detect';
interface ProviderProps {
  children: any;
}
export const CaptchaProvider = ({ children }: ProviderProps) => {
  const { locale, configLoaded } = useConfig((prev, next) => {
    const localeEqual = prev.locale === next.locale;
    const configEqual = prev.configLoaded === next.configLoaded;
    return localeEqual && configEqual;
  });
  if (
    configLoaded !== ConfigLoaded.Loaded ||
    !window.__config__.googleRecaptchaKey ||
    isIE
  )
    return children;

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={window.__config__.googleRecaptchaKey}
      language={locale || undefined}
      scriptProps={{
        defer: true,
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};

export const useCaptcha = () => {
  const execute = useContext(GoogleReCaptchaContext).executeRecaptcha;
  if (window.__config__.googleRecaptchaKey && !isIE) return execute;
  return null;
};
