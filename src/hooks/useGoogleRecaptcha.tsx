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
  const { locale, configLoaded, domLoaded } = useConfig((prev, next) => {
    const localeEqual = prev.locale === next.locale;
    const configEqual = prev.configLoaded === next.configLoaded;
    const domLoadedEqual = prev.domLoaded === next.domLoaded;
    return localeEqual && configEqual && domLoadedEqual;
  });
  if (
    configLoaded !== ConfigLoaded.Loaded ||
    !window.__config__.googleRecaptchaKey ||
    isIE ||
    !domLoaded
  )
    return children;

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={window.__config__.googleRecaptchaKey}
      language={locale || undefined}
      scriptProps={{
        async: true,
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
