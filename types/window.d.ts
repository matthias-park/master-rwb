import KambiConfig, {
  CustomerSettings,
  WidgetAPI,
} from '../src/types/KambiConfig';

export declare global {
  interface Window {
    API_URL: string;
    DEFAULT_LOCALE: string;
    LOCALE?: string;
    BASIC_AUTH?: string;
    customerSettings?: CustomerSettings;
    _kc?: KambiConfig;
    _kbc?: { dispose: any };
    KambiWidget?: { ready: Promise<any> };
    KambiWapi?: WidgetAPI;
  }
}
