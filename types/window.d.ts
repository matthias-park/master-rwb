import { AddToast } from 'react-toast-notifications';
import KambiConfig, { CustomerSettings } from '../src/types/KambiConfig';

export declare global {
  interface Window {
    __config__: {
      name: string;
      apiUrl: string;
      gtmId?: string;
      sentryDsn?: string;
      kambi?: {
        bootstrap: string;
        api: string;
      };
      googleRecaptchaKey?: string;
    };
    toast?: AddToast;
    _wbUpdate?: boolean;
    PRERENDER_CACHE?: { [key: string]: any };
    customerSettings?: CustomerSettings;
    _kc?: KambiConfig;
    _kbc?: { dispose: any };
    KambiWidget?: { ready: Promise<any> };
  }
}
