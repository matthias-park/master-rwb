import KambiConfig, {
  CustomerSettings,
  WidgetAPI,
} from '../src/types/KambiConfig';

export declare global {
  interface Window {
    __config__: {
      name: string;
      apiUrl: string;
      gtmId?: string;
      buildId: string;
      sentryDsn?: string;
    };
    PRERENDER_CACHE?: { [key: string]: any };
    customerSettings?: CustomerSettings;
    _kc?: KambiConfig;
    _kbc?: { dispose: any };
    KambiWidget?: { ready: Promise<any> };
    KambiWapi?: WidgetAPI;
  }
}
