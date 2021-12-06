import { AddToast } from 'react-toast-notifications';
import { DefaultTheme } from 'styled-components';
import { ComponentSettings } from '../src/types/ComponentSettings';
import KambiConfig, { CustomerSettings } from '../src/types/KambiConfig';
import TGLabSbConfig, { TGLabSbPageType } from '../src/types/TGLabSbConfig';

export declare global {
  interface Window {
    //Webpack
    __config__: {
      name: FranchiseNames;
      apiUrl: string;
      gtmId?: string;
      sentryDsn?: string;
      theme: string;
      kambi?: {
        currency: string;
        market: string;
        online: string;
        retail?: string;
        api: string;
      };
      sbTechUrl?: string;
      zendesk?: string;
      smartyStreets?: string;
      tgLabSb?: {
        id: number;
        bundle: string;
        format: string;
      };
      googleRecaptchaKey?: string;
      geoComplyKey?: string;
      xtremepush?: string;
      dateFormat?: string;
      componentSettings?: ComponentSettings;
      themeSettings?: DefaultTheme;
      casino?: boolean;
    };
    toast?: AddToast;
    xtremepush?: any;
    _wbUpdate?: boolean;
    PRERENDER_CACHE?: { [key: string]: any };
    //Webpack end
    //Kambi sportsbook
    customerSettings?: CustomerSettings;
    _kc?: KambiConfig;
    _kbc?: { dispose: any };
    KambiWidget?: { ready: Promise<any> };
    //Kambi end
    //GeoComply
    GeoComply?: { Client: any };
    //GeoComply end
    //TGLab sportsbook
    __SB_INIT__?: TGLabSbConfig;
    betSlipLoaded?: () => void;
    ExternalBetSlipLogin?: () => void;
    betSlipLoginOnSuccess?: () => void;
    betSlipLoginOnError?: () => void;
    externalSBPageSwitch?: (
      pageType: TGLabSbPageType,
      changePath?: boolean,
    ) => void;
    externalSBReload?: () => void;
    externalLogOut?: () => void;
    betListCenterShow?: () => void;
    //TGLab end
  }
}
