import { AddToast } from 'react-toast-notifications';
import { DefaultTheme } from 'styled-components';
import { ComponentSettings } from '../src/types/ComponentSettings';
import KambiConfig, { CustomerSettings } from '../src/types/KambiConfig';

export declare global {
  interface Window {
    __config__: {
      name: string;
      apiUrl: string;
      gtmId?: string;
      sentryDsn?: string;
      kambi?: {
        currency: string;
        market: string;
        online: string;
        retail?: string;
        api: string;
      };
      googleRecaptchaKey?: string;
      geoComplyKey?: string;
      dateFormat?: string;
      componentSettings?: ComponentSettings;
      themeSettings?: DefaultTheme;
    };
    toast?: AddToast;
    _wbUpdate?: boolean;
    PRERENDER_CACHE?: { [key: string]: any };
    customerSettings?: CustomerSettings;
    _kc?: KambiConfig;
    _kbc?: { dispose: any };
    KambiWidget?: { ready: Promise<any> };
    GeoComply?: { Client: any };
  }
}
